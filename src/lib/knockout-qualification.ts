import type { GroupStandings, Match, StandingsRow } from "./types";

const GROUP_LETTERS = "ABCDEFGHIJKL".split("");
const KNOCKOUT_SLOTS = 32;
const BEST_THIRD_COUNT = 8;

export type QualificationStatus =
  | "qualified-top2"
  | "third-advancing"
  | "third-eliminated"
  | "third-pending"
  | "alive"
  | "eliminated";

export interface QualifiedTeam {
  teamCode: string;
  teamName: string;
  group: string;
  rank: number;
  points: number;
  played: number;
  goalDiff: number;
  goalsFor: number;
  status: QualificationStatus;
  /** Rank among all third-placed teams (1 = best). */
  thirdPlaceRank?: number;
  groupComplete: boolean;
}

export interface GroupQualificationView {
  group: string;
  letter: string;
  complete: boolean;
  teams: QualifiedTeam[];
}

export interface KnockoutQualificationSnapshot {
  groupsTotal: number;
  groupsComplete: number;
  autoQualifiedCount: number;
  thirdAdvancingCount: number;
  spotsFilled: number;
  spotsRemaining: number;
  autoQualified: QualifiedTeam[];
  thirdPlaceRanking: QualifiedTeam[];
  knockoutField: QualifiedTeam[];
  byGroup: GroupQualificationView[];
  updatedAt: string;
}

function parseGoalDiff(value: string): number {
  const n = parseInt(value.replace(/[^\d-]/g, ""), 10);
  return Number.isFinite(n) ? n : 0;
}

function groupLetter(group: GroupStandings): string {
  return group.group.replace(/Group\s+/i, "").trim().toUpperCase();
}

function isGroupStageMatch(match: Match): boolean {
  const stage = match.stageLabel?.toLowerCase() ?? "";
  return !stage.includes("round of");
}

export function isGroupComplete(letter: string, matches: Match[]): boolean {
  const groupMatches = matches.filter(
    (m) => m.group.toUpperCase() === letter && isGroupStageMatch(m)
  );
  return groupMatches.length > 0 && groupMatches.every((m) => m.status === "finished");
}

function teamGoalsFor(teamCode: string, letter: string, matches: Match[]): number {
  const code = teamCode.toUpperCase();
  let goals = 0;
  for (const m of matches) {
    if (m.group.toUpperCase() !== letter || m.status !== "finished" || !isGroupStageMatch(m)) {
      continue;
    }
    if (m.home.toUpperCase() === code) goals += m.homeScore ?? 0;
    if (m.away.toUpperCase() === code) goals += m.awayScore ?? 0;
  }
  return goals;
}

function rowToTeam(
  row: StandingsRow,
  letter: string,
  matches: Match[],
  complete: boolean
): QualifiedTeam {
  const teamCode = (row.teamCode ?? row.team).toUpperCase();
  const goalDiff = parseGoalDiff(row.goalDiff);
  const goalsFor = teamGoalsFor(teamCode, letter, matches);

  let status: QualificationStatus;
  if (row.rank <= 2) {
    status = "qualified-top2";
  } else if (row.rank === 3) {
    status = complete ? "third-pending" : "third-pending";
  } else if (complete) {
    status = "eliminated";
  } else {
    status = "alive";
  }

  return {
    teamCode,
    teamName: row.team,
    group: letter,
    rank: row.rank,
    points: row.points,
    played: row.played,
    goalDiff,
    goalsFor,
    status,
    groupComplete: complete,
  };
}

function compareThirdPlace(a: QualifiedTeam, b: QualifiedTeam): number {
  return (
    b.points - a.points ||
    b.goalDiff - a.goalDiff ||
    b.goalsFor - a.goalsFor ||
    a.teamName.localeCompare(b.teamName)
  );
}

export function buildKnockoutQualification(
  standings: GroupStandings[],
  matches: Match[]
): KnockoutQualificationSnapshot {
  const byGroup: GroupQualificationView[] = [];
  const allThird: QualifiedTeam[] = [];

  for (const letter of GROUP_LETTERS) {
    const group = standings.find((g) => groupLetter(g) === letter);
    const complete = isGroupComplete(letter, matches);
    if (!group) {
      byGroup.push({ group: `Group ${letter}`, letter, complete: false, teams: [] });
      continue;
    }

    const teams = group.rows.map((row) => rowToTeam(row, letter, matches, complete));
    const third = teams.find((t) => t.rank === 3);
    if (third) allThird.push(third);

    byGroup.push({
      group: group.group,
      letter,
      complete,
      teams,
    });
  }

  const thirdPlaceRanking = [...allThird].sort(compareThirdPlace);
  thirdPlaceRanking.forEach((team, index) => {
    team.thirdPlaceRank = index + 1;
    if (team.groupComplete) {
      team.status = index < BEST_THIRD_COUNT ? "third-advancing" : "third-eliminated";
    }
  });

  const thirdByCode = new Map(thirdPlaceRanking.map((t) => [t.teamCode, t]));

  const autoQualified: QualifiedTeam[] = [];
  for (const view of byGroup) {
    for (const team of view.teams) {
      if (team.rank <= 2) autoQualified.push({ ...team });
      if (team.rank === 3) {
        const ranked = thirdByCode.get(team.teamCode);
        if (ranked) {
          team.status = ranked.status;
          team.thirdPlaceRank = ranked.thirdPlaceRank;
        }
      }
      if (team.rank === 4 && view.complete) {
        team.status = "eliminated";
      }
    }
  }

  const knockoutField: QualifiedTeam[] = [
    ...autoQualified,
    ...thirdPlaceRanking.slice(0, BEST_THIRD_COUNT),
  ].slice(0, KNOCKOUT_SLOTS);

  const groupsComplete = byGroup.filter((g) => g.complete).length;
  const thirdAdvancingCount = thirdPlaceRanking.filter(
    (t) => t.status === "third-advancing"
  ).length;

  const spotsFilled = knockoutField.length;

  return {
    groupsTotal: GROUP_LETTERS.length,
    groupsComplete,
    autoQualifiedCount: autoQualified.length,
    thirdAdvancingCount,
    spotsFilled,
    spotsRemaining: Math.max(0, KNOCKOUT_SLOTS - spotsFilled),
    autoQualified,
    thirdPlaceRanking,
    knockoutField,
    byGroup,
    updatedAt: new Date().toISOString(),
  };
}

export function statusLabel(status: QualificationStatus, groupComplete: boolean): string {
  switch (status) {
    case "qualified-top2":
      return groupComplete ? "Qualified" : "Top two";
    case "third-advancing":
      return "Best 3rd — in";
    case "third-eliminated":
      return "Best 3rd — out";
    case "third-pending":
      return "3rd place";
    case "alive":
      return "In contention";
    case "eliminated":
      return "Eliminated";
    default:
      return "";
  }
}
