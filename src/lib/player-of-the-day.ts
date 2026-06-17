import type { TournamentLeaderEntry, TournamentLeaders } from "./espn/tournament-stats";

export interface PlayerOfTheDay {
  player: TournamentLeaderEntry;
  reason: string;
  /** Stable daily label so it reads as a rotating spotlight, not a random pick. */
  dayKey: string;
}

/** UTC day-of-year, used as a deterministic daily seed. */
function dayOfYear(date: Date): number {
  const start = Date.UTC(date.getUTCFullYear(), 0, 0);
  const now = Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate());
  return Math.floor((now - start) / 86_400_000);
}

/**
 * Build a purely factual one-liner from real ESPN stat fields only.
 * No invented narrative - just the player's tournament numbers.
 */
function buildReason(player: TournamentLeaderEntry, isTopScorer: boolean): string {
  const apps = player.appearances;
  const appsText = apps > 0 ? ` in ${apps} ${apps === 1 ? "match" : "matches"}` : "";

  if (isTopScorer && player.goals > 0) {
    const assistPart = player.assists > 0 ? ` and ${player.assists} assist${player.assists === 1 ? "" : "s"}` : "";
    return `Leading the Golden Boot race with ${player.goals} goal${player.goals === 1 ? "" : "s"}${assistPart}.`;
  }

  if (player.goals > 0) {
    const assistPart = player.assists > 0 ? `, ${player.assists} assist${player.assists === 1 ? "" : "s"}` : "";
    return `${player.goals} goal${player.goals === 1 ? "" : "s"}${assistPart}${appsText} for ${player.teamName}.`;
  }

  if (player.assists > 0) {
    return `${player.assists} assist${player.assists === 1 ? "" : "s"}${appsText} for ${player.teamName}.`;
  }

  const role = player.position ? `${player.position} for ${player.teamName}` : player.teamName;
  return apps > 0 ? `${role} - ${apps} World Cup ${apps === 1 ? "appearance" : "appearances"}.` : `${role}.`;
}

/**
 * Pick a "player of the day" deterministically from the current leaders.
 * Real players, real stats; the daily seed just rotates the spotlight across
 * the top performers so the card changes day to day.
 */
export function pickPlayerOfTheDay(
  leaders: TournamentLeaders | null,
  date: Date = new Date()
): PlayerOfTheDay | null {
  if (!leaders) return null;

  const topScorerId = leaders.scorers[0]?.id;

  // Candidate pool: top scorers, then top assisters as backup.
  const pool: TournamentLeaderEntry[] = [];
  const seen = new Set<string>();
  const add = (entry?: TournamentLeaderEntry) => {
    if (!entry || seen.has(entry.id)) return;
    seen.add(entry.id);
    pool.push(entry);
  };

  leaders.scorers.filter((p) => p.goals > 0).slice(0, 8).forEach(add);
  leaders.assists.filter((p) => p.assists > 0).slice(0, 4).forEach(add);
  if (pool.length === 0) {
    leaders.appearances.slice(0, 6).forEach(add);
  }

  if (pool.length === 0) return null;

  const seed = dayOfYear(date);
  const player = pool[seed % pool.length];

  return {
    player,
    reason: buildReason(player, player.id === topScorerId),
    dayKey: `${date.getUTCFullYear()}-${seed}`,
  };
}
