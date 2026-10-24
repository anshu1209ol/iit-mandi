import { INITIAL_ROUND2_TEAMS } from '../config/round2Teams.js';
import { FINAL_ROUND_TEAMS } from '../config/finalRoundTeams.js';
import { supabase, isSupabaseConfigured } from '../config/supabaseClient.js';

const STORAGE_KEY_ROUND2 = 'iit_mandi_hackathon_round2_teams';

export const teamDirectoryService = {
  /**
   * Fetch Round 2 Teams (Names only)
   * Priority: Supabase -> LocalStorage -> INITIAL_ROUND2_TEAMS
   */
  async getRound2Teams() {
    // 1. Try Supabase if configured
    if (isSupabaseConfigured && supabase) {
      try {
        // Try unified teams table first
        const { data: unifiedData, error: uErr } = await supabase
          .from('teams')
          .select('name')
          .eq('round_number', 2)
          .eq('is_published', true)
          .order('name', { ascending: true });

        if (!uErr && unifiedData && unifiedData.length > 0) {
          return unifiedData.map((item) => item.name);
        }

        // Check fallback round2_teams table
        const { data, error } = await supabase
          .from('round2_teams')
          .select('team_name')
          .order('id', { ascending: true });

        if (!error && data && data.length > 0) {
          return data.map((item) => item.team_name);
        }
      } catch (err) {
        console.warn('Supabase fetch failed for round2_teams, falling back to local store.', err);
      }
    }

    // 2. Try LocalStorage
    try {
      const stored = localStorage.getItem(STORAGE_KEY_ROUND2);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn('LocalStorage read error:', e);
    }

    // 3. Fallback to confirmed 100 teams
    return INITIAL_ROUND2_TEAMS;
  },

  /**
   * Import Round 2 Teams from CSV text or line-delimited string
   * Validates records: accepts team names only, rejects empty lines
   */
  async importRound2Teams(rawContent) {
    if (!rawContent || typeof rawContent !== 'string') {
      throw new Error('Please provide valid CSV or plain text content.');
    }

    // Split by newline
    const lines = rawContent.split(/\r?\n/);
    const cleanedNames = [];

    for (let line of lines) {
      let trimmed = line.trim();
      if (!trimmed) continue;

      // Handle CSV comma separation (take first column if CSV)
      if (trimmed.includes(',')) {
        trimmed = trimmed.split(',')[0].replace(/^["']|["']$/g, '').trim();
      } else {
        trimmed = trimmed.replace(/^["']|["']$/g, '').trim();
      }

      // Skip common CSV headers
      const lower = trimmed.toLowerCase();
      if (lower === 'team name' || lower === 'team_name' || lower === 'team') {
        continue;
      }

      if (trimmed.length > 0 && !cleanedNames.includes(trimmed)) {
        cleanedNames.push(trimmed);
      }
    }

    if (cleanedNames.length === 0) {
      throw new Error('No valid team names found in the provided content.');
    }

    // Persist locally
    try {
      localStorage.setItem(STORAGE_KEY_ROUND2, JSON.stringify(cleanedNames));
    } catch (err) {
      console.error('Failed to write to localStorage:', err);
    }

    // Sync to Supabase if configured
    if (isSupabaseConfigured && supabase) {
      try {
        const round2Rows = cleanedNames.map((name) => ({
          team_name: name,
        }));
        await supabase.from('round2_teams').delete().neq('id', 0);
        await supabase.from('round2_teams').insert(round2Rows);

        // Also sync to unified teams table if event exists
        const { data: eventData } = await supabase
          .from('events')
          .select('id')
          .eq('slug', 'iit-mandi-hackathon-2026')
          .maybeSingle();

        if (eventData?.id) {
          await supabase
            .from('teams')
            .delete()
            .eq('event_id', eventData.id)
            .eq('round_number', 2);

          const teamRows = cleanedNames.map((name, i) => ({
            event_id: eventData.id,
            round_number: 2,
            slug: `r2-${i + 1}-${name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
            name,
            is_confirmed: true,
            is_published: true,
          }));

          await supabase.from('teams').insert(teamRows);
        }
      } catch (err) {
        console.warn('Failed to sync imported teams to Supabase:', err);
      }
    }

    return {
      success: true,
      count: cleanedNames.length,
      teams: cleanedNames,
    };
  },

  /**
   * Reset Round 2 teams back to the initial 100 organizer teams
   */
  resetRound2Teams() {
    try {
      localStorage.removeItem(STORAGE_KEY_ROUND2);
    } catch (e) {}
    return INITIAL_ROUND2_TEAMS;
  },

  /**
   * Fetch Final Round Teams (20 teams)
   */
  getFinalRoundTeams() {
    return FINAL_ROUND_TEAMS;
  },

  /**
   * Get confirmed team detail by slug
   * Rejects incomplete or unconfirmed team records
   */
  getTeamBySlug(slug) {
    if (!slug) return null;
    const team = FINAL_ROUND_TEAMS.find(
      (t) => t.slug && t.slug.toLowerCase() === slug.toLowerCase()
    );

    // Strict requirement: "Do not publish incomplete team records."
    if (!team || !team.isConfirmed) {
      return null;
    }

    return team;
  },
};
