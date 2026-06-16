import type { Match } from "./types";

/** Chronological next kickoffs that have not started yet. */
export function pickNextUpcomingMatches(
  matches: Match[],
  limit = 2,
  nowMs: number = Date.now()
): Match[] {
  return matches
    .filter(
      (match) =>
        match.status === "upcoming" &&
        match.kickoffAt &&
        new Date(match.kickoffAt).getTime() > nowMs
    )
    .sort(
      (a, b) =>
        new Date(a.kickoffAt).getTime() - new Date(b.kickoffAt).getTime()
    )
    .slice(0, limit);
}

/** Merge match lists by id (first occurrence wins). */
export function mergeMatchesById(...lists: Match[][]): Match[] {
  const byId = new Map<string, Match>();
  for (const list of lists) {
    for (const match of list) {
      if (!byId.has(match.id)) byId.set(match.id, match);
    }
  }
  return [...byId.values()];
}
