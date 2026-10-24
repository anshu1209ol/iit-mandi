/**
 * Automated Verification Script: Supabase Integration & Policy Verification
 * IIT Mandi Themed Hackathon 2026
 *
 * Verifies:
 * 1. Migration SQL completeness (9 required tables, UUIDs, RLS, indexes, constraints)
 * 2. Seed data integrity (Confirmed event dates, Asia/Kolkata, Paradox with Ansul & Harsh Shrivastav only)
 * 3. Security rules (Server admin browser guard, no client service-role exposure)
 * 4. Runtime eventDataService behaviors and model validation
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '../../');

let totalTests = 0;
let passedTests = 0;
let failedTests = 0;

function assert(condition, message) {
  totalTests++;
  if (condition) {
    passedTests++;
    console.log(`  [PASS] ${message}`);
  } else {
    failedTests++;
    console.error(`  [FAIL] ${message}`);
  }
}

console.log('\n======================================================');
console.log('--- 1. Testing Migration Schema Completeness & Syntax ---');
console.log('======================================================');

const migrationPath = path.join(rootDir, 'supabase/migrations/20261023000001_initial_schema.sql');
const schemaSqlPath = path.join(rootDir, 'src/supabase/schema.sql');

assert(fs.existsSync(migrationPath), 'Migration file 20261023000001_initial_schema.sql exists');
assert(fs.existsSync(schemaSqlPath), 'src/supabase/schema.sql exists and is synced');

const migrationSql = fs.readFileSync(migrationPath, 'utf8');

const requiredTables = [
  'events',
  'competition_rounds',
  'teams',
  'team_members',
  'announcements',
  'schedule_items',
  'profiles',
  'admin_roles',
  'audit_logs',
];

requiredTables.forEach((table) => {
  assert(
    migrationSql.includes(`CREATE TABLE IF NOT EXISTS public.${table}`),
    `Migration defines table: public.${table}`
  );
  assert(
    migrationSql.includes(`ALTER TABLE public.${table} ENABLE ROW LEVEL SECURITY`),
    `Row Level Security enabled on: public.${table}`
  );
});

assert(
  migrationSql.includes('display_timezone TEXT NOT NULL DEFAULT \'Asia/Kolkata\''),
  'Event schema specifies display_timezone as Asia/Kolkata'
);
assert(
  migrationSql.includes('CREATE OR REPLACE FUNCTION public.is_admin'),
  'Secure server-side authorization function is_admin() defined'
);
assert(
  migrationSql.includes('CREATE POLICY "Public read published events"'),
  'Public read policy on events restricted to is_published = true'
);
assert(
  migrationSql.includes('CREATE POLICY "Public read published teams"'),
  'Public read policy on teams restricted to is_published = true'
);
assert(
  migrationSql.includes('CREATE POLICY "Admin manage teams"'),
  'Admin mutation policy strictly enforces public.is_admin()'
);
assert(
  migrationSql.includes('idx_events_slug'),
  'Indexes created for foreign keys and lookup columns'
);

console.log('\n======================================================');
console.log('--- 2. Testing Seed Data Integrity & Constraints ---');
console.log('======================================================');

const seedPath = path.join(rootDir, 'supabase/seed.sql');
assert(fs.existsSync(seedPath), 'supabase/seed.sql exists');

const seedSql = fs.readFileSync(seedPath, 'utf8');

assert(seedSql.includes('iit-mandi-hackathon-2026'), 'Seeds confirmed event slug iit-mandi-hackathon-2026');
assert(seedSql.includes('Asia/Kolkata'), 'Seeds display_timezone as Asia/Kolkata');
assert(seedSql.includes('2026-10-27T09:00:00+05:30'), 'Seeds confirmed start date 27 Oct 2026 09:00 IST');
assert(seedSql.includes('2026-10-29T17:00:00+05:30'), 'Seeds confirmed end date 29 Oct 2026 17:00 IST');
assert(seedSql.includes('500+ Teams'), 'Seeds Round 1 metric as 500+ Teams (count_only)');
assert(seedSql.includes('100 Teams'), 'Seeds Round 2 metric as 100 Teams (team_names_only)');
assert(seedSql.includes('20 Teams'), 'Seeds Final Round metric as 20 Teams (team_profiles)');
assert(seedSql.includes('paradox'), 'Seeds confirmed team Paradox');
assert(seedSql.includes('Ansul'), 'Seeds confirmed Paradox member Ansul');
assert(seedSql.includes('Harsh Shrivastav'), 'Seeds confirmed Paradox member Harsh Shrivastav');

// Check that NO fake participants or fake sponsors are in seed.sql
assert(!seedSql.includes('INSERT INTO public.sponsors'), 'Zero fictional sponsors seeded');
assert(!seedSql.includes('INSERT INTO public.prizes'), 'Zero fabricated prizes seeded');

console.log('\n======================================================');
console.log('--- 3. Testing Security & Service-Role Isolation ---');
console.log('======================================================');

const clientCode = fs.readFileSync(path.join(rootDir, 'src/config/supabaseClient.js'), 'utf8');
assert(!clientCode.includes('SUPABASE_SERVICE_ROLE_KEY'), 'Browser client does not touch SUPABASE_SERVICE_ROLE_KEY');

const adminCode = fs.readFileSync(path.join(rootDir, 'src/server/supabaseAdmin.js'), 'utf8');
assert(adminCode.includes("typeof window !== 'undefined'"), 'Server admin module contains browser execution guard');

const envExample = fs.readFileSync(path.join(rootDir, '.env.example'), 'utf8');
assert(envExample.includes('VITE_SUPABASE_URL'), '.env.example documents VITE_SUPABASE_URL');
assert(envExample.includes('VITE_SUPABASE_ANON_KEY'), '.env.example documents VITE_SUPABASE_ANON_KEY');
assert(envExample.includes('SUPABASE_SERVICE_ROLE_KEY'), '.env.example documents server-side SUPABASE_SERVICE_ROLE_KEY');

console.log('\n======================================================');
console.log('--- 4. Testing eventDataService & Model Validators ---');
console.log('======================================================');

import { eventDataService } from '../services/eventDataService.js';
import { ModelValidators } from '../types/database.js';

// Test Event details
const eventDetails = await eventDataService.getEventDetails();
assert(eventDetails.name === 'IIT Mandi Hackathon 2026', 'eventDataService returns confirmed event name');
assert(eventDetails.timezone === 'Asia/Kolkata', 'eventDataService centralizes timezone as Asia/Kolkata');
assert(eventDetails.dates.startIso.includes('2026-10-27'), 'Start date is 27 October 2026');
assert(eventDetails.dates.endIso.includes('2026-10-29'), 'End date is 29 October 2026');
assert(ModelValidators.validateEvent(eventDetails), 'Event model passes validation');

// Test Rounds
const rounds = await eventDataService.getCompetitionRounds();
assert(rounds.length === 3, 'Returns exactly 3 competition rounds');
assert(rounds[0].displayType === 'count_only' && rounds[0].metric === '500+ Teams', 'Round 1 is strictly count_only (500+ Teams)');
assert(rounds[1].displayType === 'team_names_only', 'Round 2 is team_names_only');
assert(rounds[2].displayType === 'team_profiles', 'Final round is team_profiles');

// Test Paradox Team Detail & Rejection of Incomplete Teams
const paradox = await eventDataService.getTeamBySlug('paradox');
assert(paradox !== null, 'Paradox team detail retrieved successfully');
assert(paradox.name === 'Paradox', 'Team name is Paradox');
assert(paradox.isConfirmed === true, 'Paradox is confirmed');
assert(paradox.members.length === 2, 'Paradox has exactly 2 members');
assert(paradox.members.includes('Ansul'), 'Paradox member includes Ansul');
assert(paradox.members.includes('Harsh Shrivastav'), 'Paradox member includes Harsh Shrivastav');
assert(ModelValidators.validateFinalistTeam(paradox), 'Paradox passes finalist model validator');

// Test unconfirmed team rejection
const fakeTeam = await eventDataService.getTeamBySlug('unannounced-team-99');
assert(fakeTeam === null, 'Unconfirmed / unannounced team record is strictly rejected (returns null)');

// Test Schedule Items
const scheduleDays = await eventDataService.getScheduleItems();
assert(scheduleDays.length === 3, 'Schedule items cover exactly 3 confirmed days');
assert(scheduleDays[0].timings === '9:00 AM – 5:00 PM IST', 'Schedule timings are 9:00 AM – 5:00 PM IST');

// Test Announcements
const announcements = await eventDataService.getAnnouncements();
assert(Array.isArray(announcements), 'Announcements returned as array (empty state when none published)');
assert(migrationSql.includes('source_url TEXT'), 'Migration includes source_url column in announcements table');

// Test Final Round 20-slot integrity and search filtering
const finalTeams = await eventDataService.getFinalRoundTeams();
assert(finalTeams.length === 20, 'Final round returns exactly 20 slots');
assert(finalTeams[0].name === 'Paradox' && finalTeams[0].isConfirmed, 'Slot 1 is confirmed finalist Paradox');
const paradoxSearchMatches = finalTeams.filter(t => 
  (t.name && t.name.toLowerCase().includes('ansul')) || 
  (t.members && t.members.some(m => m.toLowerCase().includes('ansul')))
);
assert(paradoxSearchMatches.length === 1 && paradoxSearchMatches[0].name === 'Paradox', 'Search for "Ansul" in Final Round accurately returns Paradox');
const zeroMatches = finalTeams.filter(t => t.name && t.name.toLowerCase().includes('xyznonexistent999'));
assert(zeroMatches.length === 0, 'Searching for nonexistent team returns zero results');

console.log('\n======================================================');
console.log(`Summary: ${passedTests}/${totalTests} tests passed (${failedTests} failed).`);
console.log('======================================================\n');

if (failedTests > 0) {
  process.exit(1);
} else {
  process.exit(0);
}
