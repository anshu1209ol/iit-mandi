/**
 * Database Models & Type Definitions
 * IIT Mandi Themed Hackathon 2026
 *
 * Provides typed runtime models and JSDoc contracts for Supabase entities.
 */

/**
 * @typedef {Object} EventModel
 * @property {string} id - UUID primary key
 * @property {string} slug - Unique URL slug
 * @property {string} name - Event title
 * @property {string} subheading - Event subtitle
 * @property {string} edition - Edition string (e.g. '2026 Edition')
 * @property {string} display_timezone - Timezone identifier ('Asia/Kolkata')
 * @property {string} start_date - ISO timestamptz with offset
 * @property {string} end_date - ISO timestamptz with offset
 * @property {string} daily_start_time - Operating opening ('09:00 AM')
 * @property {string} daily_end_time - Operating close ('05:00 PM')
 * @property {string} timing_display - Human display timing
 * @property {string} venue_name - Venue title
 * @property {string} campus - Campus location ('Kamand Campus')
 * @property {string} city - City and state
 * @property {string} country - Country
 * @property {string} [pin_code] - Postal code
 * @property {string} contact_email - Official contact desk
 * @property {string} [campus_desk] - Physical desk location
 * @property {boolean} is_published - Public visibility flag
 * @property {'draft'|'scheduled'|'ongoing'|'concluded'} status - Lifecycle status
 * @property {string} created_at - Timestamp
 * @property {string} updated_at - Timestamp
 */

/**
 * @typedef {Object} CompetitionRoundModel
 * @property {string} id - UUID primary key
 * @property {string} event_id - Foreign key to events
 * @property {1|2|3} round_number - Round stage
 * @property {string} name - Official round name
 * @property {string} short_name - Short label
 * @property {'count_only'|'team_names_only'|'team_profiles'} display_type - Display constraint
 * @property {number} target_count - Numerical target
 * @property {string} metric_display - Formatted metric (e.g. '500+ Teams')
 * @property {string} metric_label - Metric description
 * @property {string} description - Round description
 * @property {string} [deliverable] - Expected milestone deliverable
 * @property {'upcoming'|'in_progress'|'completed'|'announced'} status - Round state
 * @property {boolean} is_published - Public visibility flag
 * @property {string} created_at - Timestamp
 * @property {string} updated_at - Timestamp
 */

/**
 * @typedef {Object} TeamMemberModel
 * @property {string} id - UUID primary key
 * @property {string} team_id - Foreign key to teams
 * @property {string} full_name - Contributor full name
 * @property {string} role - Team role
 * @property {boolean} is_lead - Whether primary lead
 * @property {string} [email] - Private contact email
 * @property {string} created_at - Timestamp
 * @property {string} updated_at - Timestamp
 */

/**
 * @typedef {Object} TeamModel
 * @property {string} id - UUID primary key
 * @property {string} event_id - Foreign key to events
 * @property {string} [round_id] - Foreign key to competition_rounds
 * @property {1|2|3} round_number - Current stage
 * @property {string} slug - Unique team slug
 * @property {string} name - Official team name
 * @property {number} [slot_number] - Finalist slot (1-20)
 * @property {boolean} is_confirmed - Confirmed by jury/organizer
 * @property {boolean} is_published - Public visibility flag
 * @property {string} [institution] - University/affiliation
 * @property {string} [notes] - Evaluator notes
 * @property {TeamMemberModel[]} [members] - Joined team members
 * @property {string} created_at - Timestamp
 * @property {string} updated_at - Timestamp
 */

/**
 * @typedef {Object} AnnouncementModel
 * @property {string} id - UUID primary key
 * @property {string} event_id - Foreign key to events
 * @property {string} title - Broadcast headline
 * @property {string} content - Full markdown or plain content
 * @property {string} [source_url] - Source reference or external publication link
 * @property {'low'|'normal'|'urgent'} priority - Severity level
 * @property {string} author - Author signature
 * @property {boolean} is_published - Published status
 * @property {string} published_at - Publication timestamp
 * @property {string} created_at - Timestamp
 * @property {string} updated_at - Timestamp
 */

/**
 * @typedef {Object} ScheduleItemModel
 * @property {string} id - UUID primary key
 * @property {string} event_id - Foreign key to events
 * @property {1|2|3} day_number - Day sequence (1-3)
 * @property {string} scheduled_date - YYYY-MM-DD
 * @property {string} start_time - TIMESTAMPTZ ISO string
 * @property {string} end_time - TIMESTAMPTZ ISO string
 * @property {string} title - Daily title
 * @property {string} [phase] - Phase designation
 * @property {string} [summary] - Summary text
 * @property {string} [location] - Campus location
 * @property {boolean} is_published - Published status
 * @property {string} created_at - Timestamp
 * @property {string} updated_at - Timestamp
 */

/**
 * @typedef {Object} ProfileModel
 * @property {string} id - UUID matching auth.users
 * @property {string} full_name - Display name
 * @property {string} email - Unique email
 * @property {string} [avatar_url] - Optional image URL
 * @property {string} created_at - Timestamp
 * @property {string} updated_at - Timestamp
 */

/**
 * @typedef {Object} AdminRoleModel
 * @property {string} id - UUID primary key
 * @property {string} user_id - UUID matching auth.users
 * @property {'super_admin'|'organizer'|'evaluator'} role - Role level
 * @property {string} [event_id] - Scoped event ID
 * @property {string} created_at - Timestamp
 */

/**
 * @typedef {Object} AuditLogModel
 * @property {string} id - UUID primary key
 * @property {string} [actor_id] - User who executed mutation
 * @property {string} action - Action identifier (CREATE, UPDATE, DELETE, etc.)
 * @property {string} entity_type - Table name or domain object
 * @property {string} entity_id - Target UUID
 * @property {Object} [old_data] - State before mutation
 * @property {Object} [new_data] - State after mutation
 * @property {string} [ip_address] - Request IP
 * @property {string} created_at - Timestamp
 */

/**
 * Runtime Validator Helpers
 */
export const ModelValidators = {
  isValidUuid(id) {
    if (!id || typeof id !== 'string') return false;
    return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id);
  },

  isValidRoundNumber(n) {
    return Number.isInteger(n) && n >= 1 && n <= 3;
  },

  isValidSlotNumber(n) {
    return Number.isInteger(n) && n >= 1 && n <= 20;
  },

  isValidTimezone(tz) {
    return tz === 'Asia/Kolkata';
  },

  validateEvent(event) {
    if (!event || typeof event !== 'object') return false;
    const name = event.name;
    const slug = event.slug;
    const tz = event.display_timezone || event.timezone;
    const startDate = event.start_date || (event.dates && event.dates.startIso);
    const endDate = event.end_date || (event.dates && event.dates.endIso);
    return Boolean(
      name &&
      slug &&
      startDate &&
      endDate &&
      tz === 'Asia/Kolkata'
    );
  },

  validateFinalistTeam(team) {
    if (!team || typeof team !== 'object') return false;
    const isConfirmed = team.is_confirmed ?? team.isConfirmed;
    if (!team.name || !team.slug || !isConfirmed) return false;
    // Strict requirement: Paradox members must be Ansul and Harsh Shrivastav
    if (team.slug.toLowerCase() === 'paradox') {
      const memberNames = (team.members || []).map((m) =>
        typeof m === 'string' ? m : (m.full_name || m.name)
      );
      const hasAnsul = memberNames.some((n) => n && n.toLowerCase().includes('ansul'));
      const hasHarsh = memberNames.some((n) => n && n.toLowerCase().includes('harsh'));
      return hasAnsul && hasHarsh && memberNames.length === 2;
    }
    return true;
  },
};
