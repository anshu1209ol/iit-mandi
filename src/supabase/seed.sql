-- ========================================================================
-- Supabase Database Seed: IIT Mandi Hackathon 2026
-- Confirmed event parameters and verified finalist team Paradox ONLY.
-- Strict rule: No fictional teams, participants, announcements, scores, or sponsors.
-- ========================================================================

-- 1. Confirmed Event Record
INSERT INTO public.events (
    id,
    slug,
    name,
    subheading,
    edition,
    display_timezone,
    start_date,
    end_date,
    daily_start_time,
    daily_end_time,
    timing_display,
    venue_name,
    campus,
    city,
    country,
    pin_code,
    contact_email,
    campus_desk,
    is_published,
    status
) VALUES (
    'e0000000-0000-0000-0000-000000000001'::uuid,
    'iit-mandi-hackathon-2026',
    'IIT Mandi Hackathon 2026',
    'Technology, Mountain Systems & Applied Engineering Summit',
    '2026 Edition',
    'Asia/Kolkata',
    '2026-10-27T09:00:00+05:30'::timestamptz,
    '2026-10-29T17:00:00+05:30'::timestamptz,
    '09:00 AM',
    '05:00 PM',
    '9:00 AM – 5:00 PM IST (Asia/Kolkata)',
    'Indian Institute of Technology Mandi',
    'Kamand Campus',
    'Mandi, Himachal Pradesh',
    'India',
    '175005',
    'hackathon@iitmandi.ac.in',
    'Kamand Campus, Mandi, HP - 175005',
    true,
    'scheduled'
) ON CONFLICT (slug) DO UPDATE SET
    start_date = EXCLUDED.start_date,
    end_date = EXCLUDED.end_date,
    updated_at = timezone('utc'::text, now());

-- 2. Three Confirmed Competition Rounds
INSERT INTO public.competition_rounds (
    id,
    event_id,
    round_number,
    name,
    short_name,
    display_type,
    target_count,
    metric_display,
    metric_label,
    description,
    deliverable,
    status,
    is_published
) VALUES
(
    'r0000000-0000-0000-0000-000000000001'::uuid,
    'e0000000-0000-0000-0000-000000000001'::uuid,
    1,
    'Round 1: Screening & Abstract Evaluation',
    'Round 1',
    'count_only',
    500,
    '500+ Teams',
    'Screening Submissions',
    'Initial nationwide technical screening evaluating problem statement alignment, architectural feasibility, and mountain ecosystem relevance.',
    'Technical proposal & architecture abstract',
    'upcoming',
    true
),
(
    'r0000000-0000-0000-0000-000000000002'::uuid,
    'e0000000-0000-0000-0000-000000000001'::uuid,
    2,
    'Round 2: Shortlisted Development Sprint',
    'Round 2',
    'team_names_only',
    100,
    '100 Teams',
    'Selected Teams',
    '100 shortlisted teams advance to prototype implementation, intermediate code checkpoints, and mentor review sessions.',
    'Functional codebase & intermediate milestone sync',
    'announced',
    true
),
(
    'r0000000-0000-0000-0000-000000000003'::uuid,
    'e0000000-0000-0000-0000-000000000001'::uuid,
    3,
    'Final Round: Jury Demonstrations & Evaluation',
    'Final Round',
    'team_profiles',
    20,
    '20 Teams',
    'Finalist Teams',
    'Top 20 finalist teams deliver live technical demonstrations and defend algorithmic and hardware solutions before the academic and industry jury.',
    'Live prototype demonstration & repository defense',
    'announced',
    true
) ON CONFLICT (event_id, round_number) DO UPDATE SET
    metric_display = EXCLUDED.metric_display,
    updated_at = timezone('utc'::text, now());

-- 3. Confirmed Three-Day Operating Schedule Items (9:00 AM - 5:00 PM IST)
INSERT INTO public.schedule_items (
    id,
    event_id,
    day_number,
    scheduled_date,
    start_time,
    end_time,
    title,
    phase,
    summary,
    location,
    is_published
) VALUES
(
    's0000000-0000-0000-0000-000000000001'::uuid,
    'e0000000-0000-0000-0000-000000000001'::uuid,
    1,
    '2026-10-27',
    '2026-10-27T09:00:00+05:30'::timestamptz,
    '2026-10-27T17:00:00+05:30'::timestamptz,
    'Day 1: Opening & Technical Commencement',
    'Phase 1',
    'First day of active hacking, workstation allocations, and initial architecture milestones.',
    'Kamand Campus',
    true
),
(
    's0000000-0000-0000-0000-000000000002'::uuid,
    'e0000000-0000-0000-0000-000000000001'::uuid,
    2,
    '2026-10-28',
    '2026-10-28T09:00:00+05:30'::timestamptz,
    '2026-10-28T17:00:00+05:30'::timestamptz,
    'Day 2: Core Engineering & Mid-Sprint Review',
    'Phase 2',
    'Intensive development sprint, model testing, and mentor synchronization checkpoints.',
    'Kamand Campus',
    true
),
(
    's0000000-0000-0000-0000-000000000003'::uuid,
    'e0000000-0000-0000-0000-000000000001'::uuid,
    3,
    '2026-10-29',
    '2026-10-29T09:00:00+05:30'::timestamptz,
    '2026-10-29T17:00:00+05:30'::timestamptz,
    'Day 3: Final Demonstrations & Concluding Defense',
    'Phase 3',
    'Live project demonstrations before jury panels, code defense, and closing deliberations.',
    'Kamand Campus',
    true
) ON CONFLICT DO NOTHING;

-- 4. Confirmed Finalist Team: Paradox (Slot #1) ONLY
INSERT INTO public.teams (
    id,
    event_id,
    round_id,
    round_number,
    slug,
    name,
    slot_number,
    is_confirmed,
    is_published,
    notes
) VALUES (
    't0000000-0000-0000-0000-000000000001'::uuid,
    'e0000000-0000-0000-0000-000000000001'::uuid,
    'r0000000-0000-0000-0000-000000000003'::uuid,
    3,
    'paradox',
    'Paradox',
    1,
    true,
    true,
    'Confirmed Finalist Team · Live Demonstration Track'
) ON CONFLICT (event_id, slug) DO UPDATE SET
    slot_number = 1,
    is_confirmed = true,
    updated_at = timezone('utc'::text, now());

-- 5. Confirmed Paradox Members: Ansul & Harsh Shrivastav ONLY
INSERT INTO public.team_members (
    id,
    team_id,
    full_name,
    role,
    is_lead
) VALUES
(
    'm0000000-0000-0000-0000-000000000001'::uuid,
    't0000000-0000-0000-0000-000000000001'::uuid,
    'Ansul',
    'Finalist Contributor',
    true
),
(
    'm0000000-0000-0000-0000-000000000002'::uuid,
    't0000000-0000-0000-0000-000000000001'::uuid,
    'Harsh Shrivastav',
    'Finalist Contributor',
    false
) ON CONFLICT (team_id, full_name) DO NOTHING;
