/**
 * Centralized Event Status & Timezone Utility
 * Strictly calculated in Asia/Kolkata (IST: UTC+05:30)
 *
 * Event Dates:
 * - Day 1: Tuesday, 27 October 2026 (09:00 - 17:00 IST)
 * - Day 2: Wednesday, 28 October 2026 (09:00 - 17:00 IST)
 * - Day 3: Thursday, 29 October 2026 (09:00 - 17:00 IST)
 */

export const EVENT_WINDOWS = [
  {
    dayNumber: 1,
    dayLabel: "Day 1",
    dayOfWeek: "Tuesday",
    dateDisplay: "Tuesday, 27 October 2026",
    shortDate: "27 Oct 2026",
    startIso: "2026-10-27T09:00:00+05:30",
    endIso: "2026-10-27T17:00:00+05:30",
    startMs: new Date("2026-10-27T09:00:00+05:30").getTime(),
    endMs: new Date("2026-10-27T17:00:00+05:30").getTime(),
  },
  {
    dayNumber: 2,
    dayLabel: "Day 2",
    dayOfWeek: "Wednesday",
    dateDisplay: "Wednesday, 28 October 2026",
    shortDate: "28 Oct 2026",
    startIso: "2026-10-28T09:00:00+05:30",
    endIso: "2026-10-28T17:00:00+05:30",
    startMs: new Date("2026-10-28T09:00:00+05:30").getTime(),
    endMs: new Date("2026-10-28T17:00:00+05:30").getTime(),
  },
  {
    dayNumber: 3,
    dayLabel: "Day 3",
    dayOfWeek: "Thursday",
    dateDisplay: "Thursday, 29 October 2026",
    shortDate: "29 Oct 2026",
    startIso: "2026-10-29T09:00:00+05:30",
    endIso: "2026-10-29T17:00:00+05:30",
    startMs: new Date("2026-10-29T09:00:00+05:30").getTime(),
    endMs: new Date("2026-10-29T17:00:00+05:30").getTime(),
  },
];

export const OVERALL_EVENT = {
  startMs: EVENT_WINDOWS[0].startMs,
  endMs: EVENT_WINDOWS[2].endMs,
  startIso: EVENT_WINDOWS[0].startIso,
  endIso: EVENT_WINDOWS[2].endIso,
};

/**
 * Calculates accurate event status relative to Asia/Kolkata
 * Supports mock timestamps for deterministic testing of before, during, and after states.
 */
export function getEventStatus(nowMs = Date.now()) {
  const { startMs, endMs } = OVERALL_EVENT;

  // Case 1: Before Event Starts
  if (nowMs < startMs) {
    const diff = startMs - nowMs;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    return {
      state: 'UPCOMING',
      label: 'Upcoming',
      badgeVariant: 'cyan',
      description: 'Commences Tuesday, 27 October 2026 at 09:00 AM IST',
      currentDay: null,
      isActiveSession: false,
      countdown: { days, hours, minutes, seconds },
    };
  }

  // Case 2: After Overall Event Concludes
  if (nowMs > endMs) {
    return {
      state: 'CONCLUDED',
      label: 'Event Concluded',
      badgeVariant: 'default',
      description: 'Concluded Thursday, 29 October 2026 at 05:00 PM IST',
      currentDay: null,
      isActiveSession: false,
      countdown: { days: 0, hours: 0, minutes: 0, seconds: 0 },
    };
  }

  // Case 3: Event is In Progress (Live between 27 Oct 09:00 and 29 Oct 17:00 IST)
  let activeDay = null;
  let isActiveSession = false;

  for (const win of EVENT_WINDOWS) {
    if (nowMs >= win.startMs && nowMs <= win.endMs) {
      activeDay = win;
      isActiveSession = true;
      break;
    }
    // Overnight break between Day 1 end and Day 2 start, etc.
    if (nowMs > win.endMs && nowMs < (EVENT_WINDOWS[win.dayNumber]?.startMs || win.endMs)) {
      activeDay = {
        ...win,
        isOvernightBreak: true,
      };
      isActiveSession = false;
      break;
    }
  }

  return {
    state: 'LIVE',
    label: isActiveSession ? 'In Progress (Active Hours)' : 'Daily Break (Resuming 09:00 AM IST)',
    badgeVariant: 'emerald',
    description: isActiveSession
      ? `Active Operating Session: ${activeDay ? activeDay.dateDisplay : ''}`
      : 'Operating hours (9:00 AM – 5:00 PM IST) for today have paused. Resuming tomorrow morning.',
    currentDay: activeDay,
    isActiveSession,
    countdown: { days: 0, hours: 0, minutes: 0, seconds: 0 },
  };
}
