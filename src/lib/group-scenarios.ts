import type { GroupStandings, Match, StandingsRow } from "./types";
import { TEAMS } from "./data";
import { resolveTeamCode } from "./team-lookup";

export interface TeamScenarioInput {
  teamCode: string;
  standings: GroupStandings[];
  matches: Match[];
}

export interface RankOutcome {
  rank: number;
  points: number;
  goalDiff: number;
  goalsFor: number;
  label: string;
  qualifies: "yes" | "maybe" | "no";
}

export interface TeamScenarioResult {
  teamCode: string;
  teamName: string;
  group: string;
  current: StandingsRow;
  remainingMatches: Match[];
  played: number;
  remaining: number;
  maxPoints: number;
  minPoints: number;
  outcomes: RankOutcome[];
  summary: string[];
  thirdPlaceNote?: string;
}

function parseGoalDiff(value: string): number {
  const n = parseInt(value.replace(/[^\d-]/g, ""), 10);
  return Number.isFinite(n) ? n : 0;
}

function sortRows(rows: StandingsRow[]): StandingsRow[] {
  return [...rows].sort((a, b) => {
    if (b.points !== a.points) return b.points - a.points;
    const gdA = parseGoalDiff(a.goalDiff);
    const gdB = parseGoalDiff(b.goalDiff);
    if (gdB !== gdA) return gdB - gdA;
    return a.team.localeCompare(b.team);
  });
}

function findTeamGroup(
  teamCode: string,
  standings: GroupStandings[]
): { group: GroupStandings; row: StandingsRow } | null {
  const upper = teamCode.toUpperCase();
  for (const group of standings) {
    const row = group.rows.find((r) => r.teamCode?.toUpperCase() === upper);
    if (row) return { group, row };
  }
  return null;
}

function teamInMatch(match: Match, teamCode: string): boolean {
  const upper = teamCode.toUpperCase();
  return match.home.toUpperCase() === upper || match.away.toUpperCase() === upper;
}

function isGroupStage(match: Match): boolean {
  return match.group !== "?" && !match.stageLabel?.toLowerCase().includes("round of");
}

function simulatePoints(
  base: StandingsRow,
  wins: number,
  draws: number,
  losses: number
): { points: number; played: number } {
  return {
    points: base.points + wins * 3 + draws,
    played: base.played + wins + draws + losses,
  };
}

function buildOutcomeLabel(wins: number, draws: number, losses: number): string {
  const parts: string[] = [];
  if (wins) parts.push(`${wins}W`);
  if (draws) parts.push(`${draws}D`);
  if (losses) parts.push(`${losses}L`);
  return parts.join(" · ") || "No change";
}

function estimateRank(
  teamRow: StandingsRow,
  extra: { wins: number; draws: number; losses: number },
  groupRows: StandingsRow[],
  groupMatches: Match[]
): number {
  const simulated = {
    ...teamRow,
    ...simulatePoints(teamRow, extra.wins, extra.draws, extra.losses),
    played: teamRow.played + extra.wins + extra.draws + extra.losses,
  };

  // Pessimistic view: rivals win every match still on their schedule.
  const others = groupRows
    .filter((r) => r.teamCode !== teamRow.teamCode)
    .map((row) => {
      const code = row.teamCode ?? "";
      const remaining = groupMatches.filter(
        (m) => m.status !== "finished" && teamInMatch(m, code)
      ).length;
      return {
        ...row,
        points: row.points + remaining * 3,
        played: row.played + remaining,
      };
    });

  const table = sortRows([simulated, ...others]);
  const idx = table.findIndex((r) => r.teamCode === teamRow.teamCode);
  return idx >= 0 ? idx + 1 : 4;
}

function qualifyStatus(rank: number): RankOutcome["qualifies"] {
  if (rank <= 2) return "yes";
  if (rank === 3) return "maybe";
  return "no";
}

function rankLabel(rank: number): string {
  const suffix = rank === 1 ? "st" : rank === 2 ? "nd" : rank === 3 ? "rd" : "th";
  return `${rank}${suffix}`;
}

function knockoutNote(rank: number): string {
  if (rank <= 2) return " - in the top-two knockout spots";
  if (rank === 3) return " - third-place / best-third contention";
  return " - outside the top two";
}

export function analyzeTeamScenario(input: TeamScenarioInput): TeamScenarioResult | null {
  const found = findTeamGroup(input.teamCode, input.standings);
  if (!found) return null;

  const { group, row } = found;
  const groupLetter = group.group.replace(/Group\s+/i, "").trim();

  const groupMatches = input.matches.filter(
    (m) => m.group.toUpperCase() === groupLetter && isGroupStage(m)
  );

  const remainingMatches = groupMatches.filter(
    (m) => teamInMatch(m, input.teamCode) && m.status !== "finished"
  );

  const remaining = remainingMatches.length;
  const maxPoints = row.points + remaining * 3;
  const minPoints = row.points;

  const scenarios: Array<{ wins: number; draws: number; losses: number }> = [];
  for (let wins = remaining; wins >= 0; wins--) {
    for (let draws = remaining - wins; draws >= 0; draws--) {
      const losses = remaining - wins - draws;
      scenarios.push({ wins, draws, losses });
    }
  }

  const outcomes: RankOutcome[] = scenarios.map((scenario) => {
    const rank = estimateRank(row, scenario, group.rows, groupMatches);
    const pts = simulatePoints(row, scenario.wins, scenario.draws, scenario.losses);
    return {
      rank,
      points: pts.points,
      goalDiff: parseGoalDiff(row.goalDiff),
      goalsFor: 0,
      label: buildOutcomeLabel(scenario.wins, scenario.draws, scenario.losses),
      qualifies: qualifyStatus(rank),
    };
  });

  outcomes.sort((a, b) => b.points - a.points || a.rank - b.rank);

  const summary: string[] = [];
  const best = outcomes[0];
  const worst = outcomes[outcomes.length - 1];

  if (remaining === 0) {
    if (row.rank <= 2) {
      summary.push(`Finished ${row.rank}${row.rank === 1 ? "st" : "nd"} in ${group.group} - qualified for the knockout stage.`);
    } else if (row.rank === 3) {
      summary.push(`Finished 3rd in ${group.group} - may qualify as one of the eight best third-place teams (depends on other groups).`);
    } else {
      summary.push(`Finished ${row.rank}th in ${group.group} - eliminated from the knockout stage.`);
    }
  } else {
    summary.push(
      `${remaining} group match${remaining === 1 ? "" : "es"} left - between ${minPoints} and ${maxPoints} points possible.`
    );

    summary.push(
      `Best case (${best.label}): ${best.points} pts - could finish ${rankLabel(best.rank)}${knockoutNote(best.rank)}.`
    );

    if (worst.points < best.points) {
      summary.push(
        `Worst case (${worst.label}): ${worst.points} pts - could finish ${rankLabel(worst.rank)}${knockoutNote(worst.rank)}.`
      );
    }
  }

  let thirdPlaceNote: string | undefined;
  if (row.rank === 3 || outcomes.some((o) => o.rank === 3)) {
    thirdPlaceNote =
      "Eight of the twelve third-place teams advance in 2026. Usually ~4–7 points and strong goal difference are needed - compare across all groups on the standings page.";
  }

  return {
    teamCode: input.teamCode.toUpperCase(),
    teamName: row.team,
    group: group.group,
    current: row,
    remainingMatches,
    played: row.played,
    remaining,
    maxPoints,
    minPoints,
    outcomes: outcomes.slice(0, 8),
    summary,
    thirdPlaceNote,
  };
}

export function getAllTeamsFromStandings(standings: GroupStandings[]): Array<{ code: string; name: string; group: string }> {
  const teams: Array<{ code: string; name: string; group: string }> = [];
  for (const group of standings) {
    for (const row of group.rows) {
      const code = row.teamCode ?? resolveTeamCode(row.team);
      if (!code) continue;
      teams.push({ code, name: row.team, group: group.group });
    }
  }

  if (teams.length > 0) {
    return teams.sort((a, b) => a.name.localeCompare(b.name));
  }

  return Object.values(TEAMS)
    .map((team) => ({ code: team.code, name: team.name, group: "TBD" }))
    .sort((a, b) => a.name.localeCompare(b.name));
}
