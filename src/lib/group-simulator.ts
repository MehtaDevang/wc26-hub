import type { GroupStandings, Match, StandingsRow } from "./types";

/** A hypothetical (or actual) result for a remaining group fixture. */
export interface SimulatedResult {
  homeScore: number;
  awayScore: number;
}

export type SimulatedResults = Record<string, SimulatedResult>;

export interface SimulatedRow {
  teamCode: string;
  teamName: string;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDiff: number;
  points: number;
  rank: number;
  /** Whether this row's totals include at least one user-set hypothetical result. */
  projected: boolean;
  qualification: "qualified" | "third" | "out";
}

function parseGoalDiff(value: string): number {
  const n = parseInt(value.replace(/[^\d-]/g, ""), 10);
  return Number.isFinite(n) ? n : 0;
}

interface Accumulator {
  teamCode: string;
  teamName: string;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goalDiff: number;
  /** Goals for relative to a baseline (used only as a secondary tiebreak). */
  goalsForDelta: number;
  points: number;
  projected: boolean;
}

function isGroupStageMatch(match: Match, groupLetter: string): boolean {
  return (
    match.group.toUpperCase() === groupLetter.toUpperCase() &&
    !match.stageLabel?.toLowerCase().includes("round of")
  );
}

/** All group-stage fixtures for a given group letter, chronologically. */
export function getGroupStageMatches(
  groupLetter: string,
  matches: Match[]
): Match[] {
  return matches
    .filter((m) => isGroupStageMatch(m, groupLetter))
    .sort((a, b) => (a.kickoffAt ?? "").localeCompare(b.kickoffAt ?? ""));
}

/** Remaining (not finished) group-stage fixtures for a given group letter. */
export function getRemainingGroupMatches(
  groupLetter: string,
  matches: Match[]
): Match[] {
  return getGroupStageMatches(groupLetter, matches).filter(
    (m) => m.status !== "finished"
  );
}

/**
 * Recompute a group table given the current standings plus a set of
 * hypothetical results for remaining fixtures. Goal difference is tracked
 * exactly from the deltas; goals-for is tracked relative to current totals
 * and only used as a secondary tiebreak.
 */
export function simulateGroup(
  group: GroupStandings,
  groupMatches: Match[],
  results: SimulatedResults
): SimulatedRow[] {
  const groupLetter = group.group.replace(/Group\s+/i, "").trim();

  const accById = new Map<string, Accumulator>();
  for (const row of group.rows) {
    const code = row.teamCode?.toUpperCase();
    if (!code) continue;
    accById.set(code, {
      teamCode: code,
      teamName: row.team,
      played: row.played,
      won: row.won,
      drawn: row.drawn,
      lost: row.lost,
      goalDiff: parseGoalDiff(row.goalDiff),
      goalsForDelta: 0,
      points: row.points,
      projected: false,
    });
  }

  const remaining = groupMatches.filter(
    (m) => isGroupStageMatch(m, groupLetter) && m.status !== "finished"
  );

  for (const match of remaining) {
    const result = results[match.id];
    if (!result) continue;

    const home = accById.get(match.home.toUpperCase());
    const away = accById.get(match.away.toUpperCase());
    if (!home || !away) continue;

    const { homeScore, awayScore } = result;

    home.played += 1;
    away.played += 1;
    home.goalDiff += homeScore - awayScore;
    away.goalDiff += awayScore - homeScore;
    home.goalsForDelta += homeScore;
    away.goalsForDelta += awayScore;
    home.projected = true;
    away.projected = true;

    if (homeScore > awayScore) {
      home.won += 1;
      home.points += 3;
      away.lost += 1;
    } else if (awayScore > homeScore) {
      away.won += 1;
      away.points += 3;
      home.lost += 1;
    } else {
      home.drawn += 1;
      away.drawn += 1;
      home.points += 1;
      away.points += 1;
    }
  }

  const sorted = [...accById.values()].sort(
    (a, b) =>
      b.points - a.points ||
      b.goalDiff - a.goalDiff ||
      b.goalsForDelta - a.goalsForDelta ||
      a.teamName.localeCompare(b.teamName)
  );

  return sorted.map((acc, index) => {
    const rank = index + 1;
    return {
      teamCode: acc.teamCode,
      teamName: acc.teamName,
      played: acc.played,
      won: acc.won,
      drawn: acc.drawn,
      lost: acc.lost,
      goalsFor: acc.goalsForDelta,
      goalsAgainst: 0,
      goalDiff: acc.goalDiff,
      points: acc.points,
      rank,
      projected: acc.projected,
      qualification: rank <= 2 ? "qualified" : rank === 3 ? "third" : "out",
    };
  });
}

/** True when every remaining fixture in the group has a user-set result. */
export function isGroupFullySimulated(
  remaining: Match[],
  results: SimulatedResults
): boolean {
  return remaining.length > 0 && remaining.every((m) => Boolean(results[m.id]));
}

export function getGroupLetters(standings: GroupStandings[]): string[] {
  return standings
    .map((g) => g.group.replace(/Group\s+/i, "").trim())
    .filter(Boolean)
    .sort();
}
