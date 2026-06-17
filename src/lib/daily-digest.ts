import type { Match } from "./types";
import type { TournamentLeaderEntry, TournamentLeaders } from "./espn/tournament-stats";
import {
  formatKickoffDateKey,
  shiftDateKey,
  todayDateKey,
} from "./timezone";

export interface DigestMatch {
  match: Match;
  line: string;
}

export interface DailyDigest {
  todayKey: string;
  yesterdayKey: string;
  yesterdayResults: DigestMatch[];
  todayFixtures: DigestMatch[];
  liveNow: DigestMatch[];
  goldenBoot: TournamentLeaderEntry | null;
  hasContent: boolean;
}

/** Factual recap line for a finished match - scores only, no narrative. */
function resultLine(match: Match): string {
  const h = match.homeScore ?? 0;
  const a = match.awayScore ?? 0;
  if (h > a) return `${match.homeName} beat ${match.awayName} ${h}–${a}`;
  if (a > h) return `${match.awayName} beat ${match.homeName} ${a}–${h}`;
  return `${match.homeName} and ${match.awayName} drew ${h}–${a}`;
}

function liveLine(match: Match): string {
  const h = match.homeScore ?? 0;
  const a = match.awayScore ?? 0;
  const clock = match.minute ? ` · ${match.minute}'` : "";
  return `${match.homeName} ${h}–${a} ${match.awayName}${clock}`;
}

function previewLine(match: Match): string {
  const time = match.time ? ` · ${match.time}` : "";
  return `${match.homeName} vs ${match.awayName}${time}`;
}

export function buildDailyDigest(
  matches: Match[],
  leaders: TournamentLeaders | null,
  timeZone: string,
  now: Date = new Date()
): DailyDigest {
  const todayKey = todayDateKey(timeZone);
  const yesterdayKey = shiftDateKey(todayKey, -1);

  const keyFor = (m: Match) =>
    m.kickoffAt ? formatKickoffDateKey(m.kickoffAt, timeZone) : "";

  const byKickoff = (a: DigestMatch, b: DigestMatch) =>
    (a.match.kickoffAt ?? "").localeCompare(b.match.kickoffAt ?? "");

  const yesterdayResults = matches
    .filter((m) => keyFor(m) === yesterdayKey && m.status === "finished")
    .map((match) => ({ match, line: resultLine(match) }))
    .sort(byKickoff);

  const todayMatches = matches.filter((m) => keyFor(m) === todayKey);

  const liveNow = todayMatches
    .filter((m) => m.status === "live")
    .map((match) => ({ match, line: liveLine(match) }))
    .sort(byKickoff);

  const todayFixtures = todayMatches
    .filter((m) => m.status !== "live")
    .map((match) => ({
      match,
      line: match.status === "finished" ? resultLine(match) : previewLine(match),
    }))
    .sort(byKickoff);

  const goldenBoot = leaders?.scorers.find((p) => p.goals > 0) ?? null;

  return {
    todayKey,
    yesterdayKey,
    yesterdayResults,
    todayFixtures,
    liveNow,
    goldenBoot,
    hasContent:
      yesterdayResults.length + todayFixtures.length + liveNow.length > 0,
  };
}
