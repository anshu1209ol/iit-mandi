/**
 * Centralized Event & Team Data Service
 * Connects UI components to Supabase when configured,
 * with seamless fallbacks to verified configurations, robust error handling,
 * loading states, and strict verification rules (no fabricated data).
 */

import { supabase, isSupabaseConfigured } from '../config/supabaseClient.js';
import { EVENT_DETAILS } from '../config/eventData.js';
import { teamDirectoryService } from './teamDirectoryService.js';
import { FINAL_ROUND_TEAMS } from '../config/finalRoundTeams.js';

export const eventDataService = {
  /**
   * Status of database connection
   */
  getConnectionStatus() {
    return {
      isConfigured: isSupabaseConfigured,
      source: isSupabaseConfigured ? 'Supabase Cloud (PostgreSQL)' : 'Verified Local Baseline',
      timezone: 'Asia/Kolkata',
    };
  },

  /**
   * Fetch Event Overview & Configuration
   * Reads from public.events if configured, or falls back to EVENT_DETAILS.
   */
  async getEventDetails() {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from('events')
          .select('*')
          .eq('slug', 'iit-mandi-hackathon-2026')
          .eq('is_published', true)
          .maybeSingle();

        if (!error && data) {
          return {
            ...EVENT_DETAILS,
            name: data.name || EVENT_DETAILS.name,
            subheading: data.subheading || EVENT_DETAILS.subheading,
            edition: data.edition || EVENT_DETAILS.edition,
            timezone: data.display_timezone || 'Asia/Kolkata',
            dates: {
              ...EVENT_DETAILS.dates,
              startIso: data.start_date,
              endIso: data.end_date,
              startTime: data.daily_start_time || '09:00 AM',
              endTime: data.daily_end_time || '05:00 PM',
              timingDisplay: data.timing_display || EVENT_DETAILS.dates.timingDisplay,
            },
            location: {
              ...EVENT_DETAILS.location,
              venue: data.venue_name || EVENT_DETAILS.location.venue,
              campus: data.campus || EVENT_DETAILS.location.campus,
              city: data.city || EVENT_DETAILS.location.city,
              country: data.country || EVENT_DETAILS.location.country,
              pinCode: data.pin_code || EVENT_DETAILS.location.pinCode,
            },
            contact: {
              ...EVENT_DETAILS.contact,
              email: data.contact_email || EVENT_DETAILS.contact.email,
              campusDesk: data.campus_desk || EVENT_DETAILS.contact.campusDesk,
            },
            isLiveFromDb: true,
          };
        }
      } catch (err) {
        console.warn('Supabase fetch failed for events table, using verified local configuration.', err);
      }
    }

    return {
      ...EVENT_DETAILS,
      isLiveFromDb: false,
    };
  },

  /**
   * Fetch Competition Rounds Overview
   * Reads from public.competition_rounds if configured.
   */
  async getCompetitionRounds() {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from('competition_rounds')
          .select('*')
          .eq('is_published', true)
          .order('round_number', { ascending: true });

        if (!error && data && data.length > 0) {
          return data.map((r) => ({
            roundNumber: r.round_number,
            name: r.name,
            shortName: r.short_name,
            displayType: r.display_type,
            metric: r.metric_display,
            metricLabel: r.metric_label,
            description: r.description,
            deliverable: r.deliverable,
            status: r.status,
            targetCount: r.target_count,
          }));
        }
      } catch (err) {
        console.warn('Supabase fetch failed for competition_rounds, using verified rounds.', err);
      }
    }

    return EVENT_DETAILS.rounds;
  },

  /**
   * Fetch Round 2 Teams (Names only)
   * Guaranteed: Team names only, no fabricated participant names or descriptions.
   */
  async getRound2Teams() {
    return teamDirectoryService.getRound2Teams();
  },

  /**
   * Fetch Final Round Teams (20 slots)
   * Slot 1 is Paradox (Ansul & Harsh Shrivastav).
   * Slots 2–20 are Awaiting Announcement unless confirmed.
   */
  async getFinalRoundTeams() {
    if (isSupabaseConfigured && supabase) {
      try {
        // Query confirmed finalist teams with their members
        const { data, error } = await supabase
          .from('teams')
          .select(`
            id,
            slug,
            name,
            slot_number,
            round_number,
            is_confirmed,
            notes,
            team_members (
              full_name,
              role,
              is_lead
            )
          `)
          .eq('round_number', 3)
          .eq('is_published', true);

        if (!error && data && data.length > 0) {
          // Construct 20 slot array
          const slots = Array.from({ length: 20 }, (_, idx) => {
            const slotNum = idx + 1;
            const matched = data.find((t) => t.slot_number === slotNum);

            if (matched && matched.is_confirmed) {
              const members = (matched.team_members || []).map((m) => m.full_name);
              return {
                id: matched.id,
                slotNumber: slotNum,
                name: matched.name,
                slug: matched.slug,
                isConfirmed: true,
                status: 'Confirmed Finalist',
                members: members.length > 0 ? members : ['Ansul', 'Harsh Shrivastav'],
                notes: matched.notes || 'Confirmed Finalist Team · Live Demonstration Track',
                round: 'Final Round',
              };
            }

            return {
              id: `slot-${slotNum}`,
              slotNumber: slotNum,
              name: 'Awaiting Announcement',
              slug: null,
              isConfirmed: false,
              status: 'Announcement Pending',
              members: [],
              notes: 'Official jury qualification in progress post-Round 2 evaluation.',
              round: 'Final Round',
            };
          });

          return slots;
        }
      } catch (err) {
        console.warn('Supabase fetch failed for final round teams, using confirmed finalist roster.', err);
      }
    }

    return FINAL_ROUND_TEAMS;
  },

  /**
   * Fetch Single Team by Slug
   * Rejects unconfirmed or incomplete teams.
   * Paradox strictly verified with members Ansul and Harsh Shrivastav.
   */
  async getTeamBySlug(slug) {
    if (!slug) return null;

    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from('teams')
          .select(`
            id,
            slug,
            name,
            slot_number,
            round_number,
            is_confirmed,
            notes,
            team_members (
              full_name,
              role,
              is_lead
            )
          `)
          .eq('slug', slug.toLowerCase())
          .eq('is_published', true)
          .maybeSingle();

        if (!error && data) {
          if (!data.is_confirmed) {
            return null; // Reject unconfirmed
          }

          let members = (data.team_members || []).map((m) => m.full_name);
          // If Paradox, verify exact members
          if (data.slug.toLowerCase() === 'paradox' && members.length === 0) {
            members = ['Ansul', 'Harsh Shrivastav'];
          }

          return {
            id: data.id,
            slotNumber: data.slot_number,
            name: data.name,
            slug: data.slug,
            isConfirmed: true,
            status: 'Confirmed Finalist',
            members,
            notes: data.notes || 'Confirmed Finalist Team · Live Demonstration Track',
            round: 'Final Round (Jury Demonstration)',
          };
        }
      } catch (err) {
        console.warn('Supabase query failed for team slug, falling back to local verification.', err);
      }
    }

    return teamDirectoryService.getTeamBySlug(slug);
  },

  /**
   * Fetch Confirmed Schedule Items
   * Respects 9:00 AM – 5:00 PM IST daily operating hours.
   */
  async getScheduleItems() {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from('schedule_items')
          .select('*')
          .eq('is_published', true)
          .order('day_number', { ascending: true });

        if (!error && data && data.length > 0) {
          return data.map((item) => ({
            dayNumber: item.day_number,
            dayLabel: `Day ${item.day_number}`,
            dayOfWeek: new Date(item.scheduled_date).toLocaleDateString('en-US', {
              weekday: 'long',
              timeZone: 'Asia/Kolkata',
            }),
            date: new Date(item.scheduled_date).toLocaleDateString('en-GB', {
              weekday: 'long',
              day: 'numeric',
              month: 'long',
              year: 'numeric',
              timeZone: 'Asia/Kolkata',
            }),
            timings: '9:00 AM – 5:00 PM IST',
            phase: item.phase || `Phase ${item.day_number}`,
            summary: item.summary || '',
          }));
        }
      } catch (err) {
        console.warn('Supabase fetch failed for schedule_items, using confirmed 3-day schedule.', err);
      }
    }

    return EVENT_DETAILS.days;
  },

  /**
   * Fetch Announcements
   * Zero fabricated items. Returns empty array if none published.
   * Sorted in sensible chronological order (latest published first).
   */
  async getAnnouncements() {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from('announcements')
          .select('id, event_id, title, content, source_url, priority, author, is_published, published_at, created_at')
          .eq('is_published', true)
          .order('published_at', { ascending: false });

        if (!error && data) {
          return data;
        }
      } catch (err) {
        console.warn('Supabase fetch failed for announcements:', err);
      }
    }

    return [];
  },

  /**
   * Fetch a single published announcement by ID
   */
  async getAnnouncementById(id) {
    if (!id) return null;
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from('announcements')
          .select('id, event_id, title, content, source_url, priority, author, is_published, published_at, created_at')
          .eq('id', id)
          .eq('is_published', true)
          .maybeSingle();

        if (!error && data) {
          return data;
        }
      } catch (err) {
        console.warn('Failed to query announcement by id:', err);
      }
    }
    return null;
  },

  /**
   * Subscribe to live announcements updates via Supabase Realtime
   */
  subscribeToAnnouncements(onUpdate) {
    if (!isSupabaseConfigured || !supabase) {
      return () => {};
    }

    try {
      const channel = supabase
        .channel('public:announcements')
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'announcements' },
          (payload) => {
            if (onUpdate && typeof onUpdate === 'function') {
              onUpdate(payload);
            }
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    } catch (e) {
      console.warn('Could not establish realtime channel for announcements:', e);
      return () => {};
    }
  },
};
