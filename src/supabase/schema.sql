-- ========================================================================
-- Supabase Schema: IIT Mandi Hackathon 2026
-- Timezone: Asia/Kolkata (Stored as UTC TIMESTAMPTZ with Asia/Kolkata display)
-- Event Dates: 27–29 October 2026, 9:00 AM – 5:00 PM IST
-- ========================================================================

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ------------------------------------------------------------------------
-- 1. Helper Function: Check Admin Role (SECURITY DEFINER, no frontend trust)
-- ------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.is_admin(required_role text DEFAULT NULL)
RETURNS boolean AS $$
BEGIN
  IF auth.uid() IS NULL THEN
    RETURN false;
  END IF;

  RETURN EXISTS (
    SELECT 1 FROM public.admin_roles
    WHERE user_id = auth.uid()
      AND (required_role IS NULL OR role = required_role OR role = 'super_admin')
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ------------------------------------------------------------------------
-- 2. Events Table
-- ------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    subheading TEXT,
    edition TEXT NOT NULL,
    display_timezone TEXT NOT NULL DEFAULT 'Asia/Kolkata',
    start_date TIMESTAMPTZ NOT NULL,
    end_date TIMESTAMPTZ NOT NULL,
    daily_start_time TEXT NOT NULL DEFAULT '09:00 AM',
    daily_end_time TEXT NOT NULL DEFAULT '05:00 PM',
    timing_display TEXT NOT NULL DEFAULT '9:00 AM – 5:00 PM IST (Asia/Kolkata)',
    venue_name TEXT NOT NULL,
    campus TEXT NOT NULL,
    city TEXT NOT NULL,
    country TEXT NOT NULL DEFAULT 'India',
    pin_code TEXT DEFAULT '175005',
    contact_email TEXT NOT NULL,
    campus_desk TEXT,
    is_published BOOLEAN DEFAULT true NOT NULL,
    status TEXT NOT NULL DEFAULT 'scheduled' CHECK (status IN ('draft', 'scheduled', 'ongoing', 'concluded')),
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ------------------------------------------------------------------------
-- 3. Competition Rounds Table (3 Rounds Architecture)
-- ------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.competition_rounds (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
    round_number INTEGER NOT NULL CHECK (round_number BETWEEN 1 AND 3),
    name TEXT NOT NULL,
    short_name TEXT NOT NULL,
    display_type TEXT NOT NULL CHECK (display_type IN ('count_only', 'team_names_only', 'team_profiles')),
    target_count INTEGER,
    metric_display TEXT NOT NULL,
    metric_label TEXT NOT NULL,
    description TEXT NOT NULL,
    deliverable TEXT,
    status TEXT NOT NULL DEFAULT 'upcoming' CHECK (status IN ('upcoming', 'in_progress', 'completed', 'announced')),
    is_published BOOLEAN DEFAULT true NOT NULL,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE (event_id, round_number)
);

-- ------------------------------------------------------------------------
-- 4. Teams Table (Round 2 and Final Round)
-- ------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.teams (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
    round_id UUID REFERENCES public.competition_rounds(id) ON DELETE SET NULL,
    round_number INTEGER NOT NULL CHECK (round_number BETWEEN 1 AND 3),
    slug TEXT NOT NULL,
    name TEXT NOT NULL,
    slot_number INTEGER CHECK (slot_number BETWEEN 1 AND 20),
    is_confirmed BOOLEAN DEFAULT false NOT NULL,
    is_published BOOLEAN DEFAULT true NOT NULL,
    institution TEXT,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE (event_id, slug),
    UNIQUE (event_id, round_number, slot_number)
);

-- ------------------------------------------------------------------------
-- 5. Team Members Table (Strict: Paradox members are Ansul and Harsh Shrivastav)
-- ------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.team_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    team_id UUID NOT NULL REFERENCES public.teams(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    role TEXT DEFAULT 'Finalist Contributor',
    is_lead BOOLEAN DEFAULT false NOT NULL,
    email TEXT,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE (team_id, full_name)
);

-- ------------------------------------------------------------------------
-- 6. Announcements Table
-- ------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.announcements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    source_url TEXT,
    priority TEXT DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'urgent')),
    author TEXT DEFAULT 'Organizing Committee',
    is_published BOOLEAN DEFAULT true NOT NULL,
    published_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ------------------------------------------------------------------------
-- 7. Schedule Items Table (Confirmed 3-Day Operating Schedule)
-- ------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.schedule_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
    day_number INTEGER NOT NULL CHECK (day_number BETWEEN 1 AND 3),
    scheduled_date DATE NOT NULL,
    start_time TIMESTAMPTZ NOT NULL,
    end_time TIMESTAMPTZ NOT NULL,
    title TEXT NOT NULL,
    phase TEXT,
    summary TEXT,
    location TEXT,
    is_published BOOLEAN DEFAULT true NOT NULL,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ------------------------------------------------------------------------
-- 8. User Profiles Table (Linked to Supabase Auth)
-- ------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    avatar_url TEXT,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ------------------------------------------------------------------------
-- 9. Admin Roles Table (Role-based access control)
-- ------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.admin_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    role TEXT NOT NULL CHECK (role IN ('super_admin', 'organizer', 'evaluator')),
    event_id UUID REFERENCES public.events(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE (user_id, role, event_id)
);

-- ------------------------------------------------------------------------
-- 10. Audit Logs Table (Tamper-evident trail)
-- ------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    actor_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    action TEXT NOT NULL,
    entity_type TEXT NOT NULL,
    entity_id TEXT NOT NULL,
    old_data JSONB,
    new_data JSONB,
    ip_address TEXT,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ------------------------------------------------------------------------
-- 11. Registrations Table (Participant Intake)
-- ------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.registrations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id UUID REFERENCES public.events(id) ON DELETE CASCADE,
    team_name TEXT NOT NULL,
    lead_name TEXT NOT NULL,
    lead_email TEXT NOT NULL,
    institution TEXT NOT NULL,
    team_size INTEGER NOT NULL CHECK (team_size BETWEEN 1 AND 4),
    track_id TEXT NOT NULL,
    abstract TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'submitted' CHECK (status IN ('submitted', 'under_review', 'shortlisted', 'declined')),
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ------------------------------------------------------------------------
-- 12. Indexes for Performance and Foreign Key Lookups
-- ------------------------------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_events_slug ON public.events(slug);
CREATE INDEX IF NOT EXISTS idx_events_status_pub ON public.events(status, is_published);

CREATE INDEX IF NOT EXISTS idx_rounds_event_id ON public.competition_rounds(event_id);
CREATE INDEX IF NOT EXISTS idx_rounds_number ON public.competition_rounds(round_number);

CREATE INDEX IF NOT EXISTS idx_teams_event_round ON public.teams(event_id, round_number);
CREATE INDEX IF NOT EXISTS idx_teams_slug ON public.teams(slug);
CREATE INDEX IF NOT EXISTS idx_teams_slot ON public.teams(slot_number);
CREATE INDEX IF NOT EXISTS idx_teams_confirmed ON public.teams(is_confirmed);

CREATE INDEX IF NOT EXISTS idx_team_members_team_id ON public.team_members(team_id);

CREATE INDEX IF NOT EXISTS idx_announcements_event_id ON public.announcements(event_id);
CREATE INDEX IF NOT EXISTS idx_announcements_pub ON public.announcements(is_published, published_at DESC);

CREATE INDEX IF NOT EXISTS idx_schedule_event_day ON public.schedule_items(event_id, day_number);

CREATE INDEX IF NOT EXISTS idx_admin_roles_user ON public.admin_roles(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created ON public.audit_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_registrations_event ON public.registrations(event_id);

-- ------------------------------------------------------------------------
-- 13. Enable Row Level Security (RLS) on All Tables
-- ------------------------------------------------------------------------
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.competition_rounds ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.schedule_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.registrations ENABLE ROW LEVEL SECURITY;

-- ------------------------------------------------------------------------
-- 14. Row Level Security Policies
-- ------------------------------------------------------------------------

-- A. Public Reads: Published content only
CREATE POLICY "Public read published events"
ON public.events FOR SELECT
TO public
USING (is_published = true);

CREATE POLICY "Public read published competition rounds"
ON public.competition_rounds FOR SELECT
TO public
USING (is_published = true);

CREATE POLICY "Public read published teams"
ON public.teams FOR SELECT
TO public
USING (is_published = true);

CREATE POLICY "Public read team members of published teams"
ON public.team_members FOR SELECT
TO public
USING (
  EXISTS (
    SELECT 1 FROM public.teams t
    WHERE t.id = team_members.team_id AND t.is_published = true
  )
);

CREATE POLICY "Public read published announcements"
ON public.announcements FOR SELECT
TO public
USING (is_published = true);

CREATE POLICY "Public read published schedule items"
ON public.schedule_items FOR SELECT
TO public
USING (is_published = true);

-- B. User Profile & Self Access
CREATE POLICY "User read self or admin read profiles"
ON public.profiles FOR SELECT
TO authenticated
USING (auth.uid() = id OR public.is_admin());

CREATE POLICY "User update self profile"
ON public.profiles FOR UPDATE
TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- C. Registrations (Intake: Public INSERT allowed, Public SELECT strictly disallowed)
CREATE POLICY "Public insert registration"
ON public.registrations FOR INSERT
TO public
WITH CHECK (true);

CREATE POLICY "Admin read registrations"
ON public.registrations FOR SELECT
TO authenticated
USING (public.is_admin());

CREATE POLICY "Admin update registrations"
ON public.registrations FOR UPDATE
TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());

-- D. Admin Management Policies (Requires active admin_role or super_admin)
CREATE POLICY "Admin manage events"
ON public.events FOR ALL
TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());

CREATE POLICY "Admin manage competition rounds"
ON public.competition_rounds FOR ALL
TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());

CREATE POLICY "Admin manage teams"
ON public.teams FOR ALL
TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());

CREATE POLICY "Admin manage team members"
ON public.team_members FOR ALL
TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());

CREATE POLICY "Admin manage announcements"
ON public.announcements FOR ALL
TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());

CREATE POLICY "Admin manage schedule items"
ON public.schedule_items FOR ALL
TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());

CREATE POLICY "Super admin manage admin roles"
ON public.admin_roles FOR ALL
TO authenticated
USING (public.is_admin('super_admin'))
WITH CHECK (public.is_admin('super_admin'));

CREATE POLICY "Super admin read audit logs"
ON public.audit_logs FOR SELECT
TO authenticated
USING (public.is_admin('super_admin'));

CREATE POLICY "Service or admin insert audit logs"
ON public.audit_logs FOR INSERT
TO authenticated
WITH CHECK (true);
