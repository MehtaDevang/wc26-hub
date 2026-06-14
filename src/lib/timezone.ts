import type { Match } from "./types";

export const TIMEZONE_COOKIE = "wc26-timezone";

export const DEFAULT_TIMEZONE = "UTC";

/** Browser IANA timezone, or UTC on the server. */
export function detectBrowserTimezone(): string {
  if (typeof window === "undefined") return DEFAULT_TIMEZONE;
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || DEFAULT_TIMEZONE;
  } catch {
    return DEFAULT_TIMEZONE;
  }
}

export function isValidTimezone(timeZone: string): boolean {
  try {
    Intl.DateTimeFormat(undefined, { timeZone });
    return true;
  } catch {
    return false;
  }
}

export function resolveTimezone(value?: string | null): string {
  if (!value) return DEFAULT_TIMEZONE;
  const decoded = decodeURIComponent(value).trim();
  return isValidTimezone(decoded) ? decoded : DEFAULT_TIMEZONE;
}

/** Calendar date YYYY-MM-DD in the given IANA timezone. */
export function getDateKeyInTimezone(date: Date, timeZone: string): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}

export function dateKeyToEspn(dateKey: string): string {
  return dateKey.replace(/-/g, "");
}

export function todayDateKey(timeZone: string): string {
  return getDateKeyInTimezone(new Date(), timeZone);
}

/** Shift a YYYY-MM-DD calendar key by whole days (for ESPN fetch windows). */
export function shiftDateKey(dateKey: string, deltaDays: number): string {
  const [y, m, d] = dateKey.split("-").map(Number);
  const utc = new Date(Date.UTC(y, m - 1, d + deltaDays));
  return utc.toISOString().slice(0, 10);
}

/** Keep only matches whose kickoff falls on this calendar day in the user's timezone. */
export function filterMatchesByLocalDate(
  matches: Match[],
  dateKey: string,
  timeZone: string
): Match[] {
  return matches.filter((match) => {
    if (match.kickoffAt) {
      return formatKickoffDateKey(match.kickoffAt, timeZone) === dateKey;
    }
    return match.date === dateKey;
  });
}

/**
 * Today's scoreboard view: matches on the local calendar day, plus any match
 * still live from the previous day (common after midnight in the user's TZ).
 */
export function filterMatchesForScoreboardToday(
  matches: Match[],
  dateKey: string,
  timeZone: string
): Match[] {
  const onToday = filterMatchesByLocalDate(matches, dateKey, timeZone);
  const todayIds = new Set(onToday.map((m) => m.id));
  const liveCarryover = matches.filter(
    (m) => m.status === "live" && !todayIds.has(m.id)
  );
  return [...liveCarryover, ...onToday];
}

export function todayEspnDateInTimezone(timeZone: string): string {
  return dateKeyToEspn(todayDateKey(timeZone));
}

export function formatEspnDateInTimezone(date: Date, timeZone: string): string {
  return dateKeyToEspn(getDateKeyInTimezone(date, timeZone));
}

export function formatKickoffTime(iso: string, timeZone: string): string {
  try {
    return new Date(iso).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
      timeZone,
    });
  } catch {
    return "";
  }
}

export function formatKickoffDateKey(iso: string, timeZone: string): string {
  try {
    return getDateKeyInTimezone(new Date(iso), timeZone);
  } catch {
    return iso.slice(0, 10);
  }
}

export function formatKickoffDateLabel(
  isoOrDateKey: string,
  timeZone: string
): string {
  try {
    const date =
      isoOrDateKey.length === 10 && !isoOrDateKey.includes("T")
        ? new Date(`${isoOrDateKey}T12:00:00`)
        : new Date(isoOrDateKey);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
      timeZone,
    });
  } catch {
    return isoOrDateKey;
  }
}

export function formatTodayLabel(timeZone: string): string {
  return formatKickoffDateLabel(todayDateKey(timeZone), timeZone);
}

/** Short label for UI, e.g. "Jun 14, 7:30 PM · IST" */
export function formatTimezoneLabel(timeZone: string): string {
  try {
    const now = new Date();
    const short = now.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      timeZone,
    });
    const abbr =
      new Intl.DateTimeFormat("en-US", {
        timeZone,
        timeZoneName: "short",
      })
        .formatToParts(now)
        .find((p) => p.type === "timeZoneName")?.value ?? timeZone;
    return `${short} · ${abbr}`;
  } catch {
    return timeZone;
  }
}

export function applyTimezoneToMatch(match: Match, timeZone: string): Match {
  if (!match.kickoffAt) return match;
  return {
    ...match,
    date: formatKickoffDateKey(match.kickoffAt, timeZone),
    time: formatKickoffTime(match.kickoffAt, timeZone),
  };
}

export function applyTimezoneToMatches(
  matches: Match[],
  timeZone: string
): Match[] {
  return matches.map((m) => applyTimezoneToMatch(m, timeZone));
}

export async function getServerTimezone(): Promise<string> {
  const { cookies } = await import("next/headers");
  const cookieStore = await cookies();
  return resolveTimezone(cookieStore.get(TIMEZONE_COOKIE)?.value);
}
