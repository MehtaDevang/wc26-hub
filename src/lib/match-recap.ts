import type { Match, MatchDetail, MatchEvent, MatchStats } from "./types";
import { buildMatchInsights } from "./match-insights";
import { buildMatchRecap } from "./match-narrative";
import { formatTimelineMinute } from "./match-timeline";

export interface RecapGoal {
  id: string;
  minute: string;
  playerName: string;
  team: "home" | "away";
  teamName: string;
  assist?: string;
  isOwnGoal?: boolean;
  scoreAfter: string;
}

export interface RecapStatRow {
  label: string;
  home: number | string;
  away: number | string;
  isPercent?: boolean;
}

export interface MatchRecapData {
  headline: string;
  subheadline: string;
  resultLabel: string;
  winner: "home" | "away" | "draw";
  margin: number;
  paragraphs: string[];
  goals: RecapGoal[];
  stats: RecapStatRow[];
  insights: string[];
  cards: { homeYellow: number; awayYellow: number; homeRed: number; awayRed: number };
}

function cleanPlayerName(name: string): string {
  return name.replace(/\s+Goal\b.*$/i, "").replace(/\s+Own Goal\b.*$/i, "").trim();
}

function buildGoals(
  events: MatchEvent[],
  homeName: string,
  awayName: string
): RecapGoal[] {
  let homeGoals = 0;
  let awayGoals = 0;

  return events
    .filter((e) => e.type === "goal" || e.type === "penalty")
    .map((event) => {
      if (event.team === "home") {
        if (event.isOwnGoal) awayGoals += 1;
        else homeGoals += 1;
      } else if (event.team === "away") {
        if (event.isOwnGoal) homeGoals += 1;
        else awayGoals += 1;
      }

      return {
        id: event.id,
        minute: formatTimelineMinute(event),
        playerName: cleanPlayerName(event.playerName),
        team: event.team === "away" ? "away" : "home",
        teamName: event.team === "away" ? awayName : homeName,
        assist: event.assist,
        isOwnGoal: event.isOwnGoal,
        scoreAfter: `${homeGoals}–${awayGoals}`,
      };
    });
}

function buildStatRows(stats?: MatchStats): RecapStatRow[] {
  if (!stats) return [];

  const rows: RecapStatRow[] = [
    { label: "Possession", home: stats.possession[0], away: stats.possession[1], isPercent: true },
    { label: "Shots", home: stats.shots[0], away: stats.shots[1] },
    { label: "On target", home: stats.shotsOnTarget[0], away: stats.shotsOnTarget[1] },
    { label: "Corners", home: stats.corners[0], away: stats.corners[1] },
  ];

  if (stats.saves) {
    rows.push({ label: "Saves", home: stats.saves[0], away: stats.saves[1] });
  }

  return rows;
}

function buildHeadline(match: Match): { headline: string; subheadline: string; resultLabel: string } {
  const hs = match.homeScore ?? 0;
  const as = match.awayScore ?? 0;
  const group =
    match.group !== "?" ? `Group ${match.group}` : match.stageLabel ?? "Knockout stage";
  const scoreline = `${match.homeName} ${hs}–${as} ${match.awayName}`;

  if (hs === as) {
    return {
      headline: "Points shared after an even battle",
      subheadline: `${scoreline} - ${group}`,
      resultLabel: "Full-time draw",
    };
  }

  const winner = hs > as ? match.homeName : match.awayName;
  const margin = Math.abs(hs - as);

  if (margin >= 3) {
    return {
      headline: `${winner} win in commanding fashion`,
      subheadline: `${scoreline} - ${group}`,
      resultLabel: `${margin}-goal victory`,
    };
  }

  return {
    headline: `${winner} take all three points`,
    subheadline: `${scoreline} - ${group}`,
    resultLabel: margin === 1 ? "Narrow win" : `${margin}-goal win`,
  };
}

export function buildMatchRecapData(match: Match, detail: MatchDetail): MatchRecapData {
  const hs = match.homeScore ?? 0;
  const as = match.awayScore ?? 0;
  const { headline, subheadline, resultLabel } = buildHeadline(match);

  const winner: MatchRecapData["winner"] =
    hs === as ? "draw" : hs > as ? "home" : "away";

  const paragraphs = buildMatchRecap(match, detail).filter(
    (line) => !line.startsWith("Scorers:")
  );
  const insights = buildMatchInsights({
    match,
    stats: detail.stats,
    events: detail.events,
    homeName: match.homeName,
    awayName: match.awayName,
    homeLineup: detail.homeLineup,
    awayLineup: detail.awayLineup,
    venue: detail.venue,
    attendance: detail.attendance,
    referee: detail.referee,
  });

  const yellowHome =
    detail.stats?.yellowCards?.[0] ??
    detail.events.filter((e) => e.type === "yellow" && e.team === "home").length;
  const yellowAway =
    detail.stats?.yellowCards?.[1] ??
    detail.events.filter((e) => e.type === "yellow" && e.team === "away").length;
  const redHome =
    detail.stats?.redCards?.[0] ??
    detail.events.filter((e) => e.type === "red" && e.team === "home").length;
  const redAway =
    detail.stats?.redCards?.[1] ??
    detail.events.filter((e) => e.type === "red" && e.team === "away").length;

  return {
    headline,
    subheadline,
    resultLabel,
    winner,
    margin: Math.abs(hs - as),
    paragraphs,
    goals: buildGoals(detail.events, match.homeName, match.awayName),
    stats: buildStatRows(detail.stats),
    insights,
    cards: {
      homeYellow: yellowHome,
      awayYellow: yellowAway,
      homeRed: redHome,
      awayRed: redAway,
    },
  };
}
