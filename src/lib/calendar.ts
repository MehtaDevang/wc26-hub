import type { Match } from "./types";
import { getSiteUrl } from "./site";

const MATCH_DURATION_MS = 2 * 60 * 60 * 1000;

function escapeICS(text: string): string {
  return text.replace(/\\/g, "\\\\").replace(/;/g, "\\;").replace(/,/g, "\\,").replace(/\n/g, "\\n");
}

function toICSUtc(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getUTCFullYear()}${pad(d.getUTCMonth() + 1)}${pad(d.getUTCDate())}T${pad(d.getUTCHours())}${pad(d.getUTCMinutes())}${pad(d.getUTCSeconds())}Z`;
}

function matchTimes(match: Match): { start: Date; end: Date } | null {
  if (!match.kickoffAt) return null;
  const start = new Date(match.kickoffAt);
  if (Number.isNaN(start.getTime())) return null;
  return { start, end: new Date(start.getTime() + MATCH_DURATION_MS) };
}

function matchTitle(match: Match): string {
  const stage = match.group !== "?" ? `Group ${match.group}` : match.stageLabel ?? "World Cup 2026";
  return `${match.homeName} vs ${match.awayName} — FIFA World Cup 2026 (${stage})`;
}

function matchLocation(match: Match): string {
  const parts = [match.venue, match.venueCity, match.venueCountry].filter(Boolean);
  return parts.join(", ");
}

function matchDescription(match: Match): string {
  const siteUrl = getSiteUrl();
  return `Watch ${match.homeName} vs ${match.awayName} at the FIFA World Cup 2026.\\n\\nMatch page: ${siteUrl}/match/${match.id}`;
}

export function buildMatchICS(match: Match): string | null {
  const times = matchTimes(match);
  if (!times) return null;

  const uid = `wc26-match-${match.id}@thegoalposts.in`;
  const now = toICSUtc(new Date().toISOString());

  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//The Goal Posts//WC26//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:${uid}`,
    `DTSTAMP:${now}`,
    `DTSTART:${toICSUtc(times.start.toISOString())}`,
    `DTEND:${toICSUtc(times.end.toISOString())}`,
    `SUMMARY:${escapeICS(matchTitle(match))}`,
    `DESCRIPTION:${escapeICS(matchDescription(match))}`,
    `LOCATION:${escapeICS(matchLocation(match))}`,
    `URL:${getSiteUrl()}/match/${match.id}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");
}

export function buildTournamentICS(matches: Match[]): string {
  const upcoming = matches.filter((m) => m.kickoffAt && m.status !== "finished");
  const now = toICSUtc(new Date().toISOString());

  const events = upcoming
    .map((match) => {
      const times = matchTimes(match);
      if (!times) return null;
      return [
        "BEGIN:VEVENT",
        `UID:wc26-match-${match.id}@thegoalposts.in`,
        `DTSTAMP:${now}`,
        `DTSTART:${toICSUtc(times.start.toISOString())}`,
        `DTEND:${toICSUtc(times.end.toISOString())}`,
        `SUMMARY:${escapeICS(matchTitle(match))}`,
        `DESCRIPTION:${escapeICS(matchDescription(match))}`,
        `LOCATION:${escapeICS(matchLocation(match))}`,
        `URL:${getSiteUrl()}/match/${match.id}`,
        "END:VEVENT",
      ].join("\r\n");
    })
    .filter(Boolean)
    .join("\r\n");

  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//The Goal Posts//WC26//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    events,
    "END:VCALENDAR",
  ].join("\r\n");
}

export function buildTeamICS(matches: Match[], teamCode: string): string {
  const code = teamCode.toUpperCase();
  const filtered = matches.filter(
    (m) => (m.home === code || m.away === code) && m.kickoffAt && m.status !== "finished"
  );
  return buildTournamentICS(filtered);
}

export function buildGoogleCalendarUrl(match: Match): string | null {
  const times = matchTimes(match);
  if (!times) return null;

  const fmt = (d: Date) => toICSUtc(d.toISOString()).replace(/[-:]/g, "").replace(/\.\d{3}Z$/, "Z");
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: matchTitle(match),
    dates: `${fmt(times.start)}/${fmt(times.end)}`,
    details: `${match.homeName} vs ${match.awayName}\n${getSiteUrl()}/match/${match.id}`,
    location: matchLocation(match),
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

export function downloadICS(content: string, filename: string): void {
  const blob = new Blob([content], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
