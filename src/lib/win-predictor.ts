import { getFifaRank } from "./fifa-rankings";
import type { MatchEvent, MatchStats } from "./types";

export interface WinPrediction {
  homeWin: number;
  draw: number;
  awayWin: number;
  favorite: "home" | "away" | "draw";
  headline: string;
  detail: string;
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function normalizeTriplet(home: number, draw: number, away: number): [number, number, number] {
  const total = home + draw + away || 1;
  return [(home / total) * 100, (draw / total) * 100, (away / total) * 100];
}

function rankingPrior(homeCode: string, awayCode: string): [number, number, number] {
  const homeRank = getFifaRank(homeCode) ?? 40;
  const awayRank = getFifaRank(awayCode) ?? 40;
  const rankEdge = (awayRank - homeRank) / 20;
  const homeWin = 1 / (1 + Math.exp(-rankEdge * 1.15));
  const draw = clamp(0.28 - Math.abs(rankEdge) * 0.04, 0.14, 0.3);
  const awayWin = 1 - homeWin - draw;
  return normalizeTriplet(homeWin, draw, Math.max(awayWin, 0.05));
}

function parseMinute(minute?: number, displayClock?: string): number {
  if (minute != null && minute > 0) return clamp(minute, 0, 120);
  if (!displayClock) return 0;
  const match = displayClock.match(/(\d+)/);
  return match ? clamp(Number(match[1]), 0, 120) : 0;
}

function scoreStateProbs(
  homeScore: number,
  awayScore: number,
  minute: number
): [number, number, number] {
  const diff = homeScore - awayScore;
  const remaining = clamp((90 - minute) / 90, 0, 1);
  const urgency = 1 - remaining;

  if (minute >= 88) {
    if (diff > 0) return [94, 5, 1];
    if (diff < 0) return [1, 5, 94];
    return [12, 76, 12];
  }

  if (diff === 0) {
    const drawBase = 0.34 + urgency * 0.22;
    const swing = (1 - drawBase) / 2;
    return normalizeTriplet(swing, drawBase, swing);
  }

  const leader = diff > 0 ? "home" : "away";
  const margin = Math.abs(diff);
  const leadStrength = clamp(0.42 + margin * 0.18 + urgency * 0.28, 0.45, 0.9);
  const drawChance = clamp(0.3 - margin * 0.08 - urgency * 0.16, 0.06, 0.28);
  const trailing = 1 - leadStrength - drawChance;

  if (leader === "home") {
    return normalizeTriplet(leadStrength, drawChance, trailing);
  }
  return normalizeTriplet(trailing, drawChance, leadStrength);
}

function statsNudge(
  probs: [number, number, number],
  stats?: MatchStats
): [number, number, number] {
  if (!stats) return probs;

  let [home, draw, away] = probs;
  const possEdge = (stats.possession[0] - stats.possession[1]) / 100;
  const shotEdge = (stats.shotsOnTarget[0] - stats.shotsOnTarget[1]) / 10;
  const homeRed = stats.redCards?.[0] ?? 0;
  const awayRed = stats.redCards?.[1] ?? 0;

  home += possEdge * 4 + shotEdge * 3 - homeRed * 8 + awayRed * 6;
  away -= possEdge * 4 + shotEdge * 3 - awayRed * 8 + homeRed * 6;
  draw -= Math.abs(possEdge) * 1.5 + Math.abs(shotEdge);

  return normalizeTriplet(home, draw, away);
}

function redCardNudge(
  probs: [number, number, number],
  events: MatchEvent[] = []
): [number, number, number] {
  const homeReds = events.filter((e) => e.type === "red" && e.team === "home").length;
  const awayReds = events.filter((e) => e.type === "red" && e.team === "away").length;
  if (!homeReds && !awayReds) return probs;

  let [home, draw, away] = probs;
  home -= homeReds * 7;
  away -= awayReds * 7;
  if (homeReds > awayReds) away += homeReds * 4;
  if (awayReds > homeReds) home += awayReds * 4;

  return normalizeTriplet(home, draw, away);
}

function blend(
  a: [number, number, number],
  b: [number, number, number],
  weight: number
): [number, number, number] {
  const w = clamp(weight, 0, 1);
  return normalizeTriplet(
    a[0] * (1 - w) + b[0] * w,
    a[1] * (1 - w) + b[1] * w,
    a[2] * (1 - w) + b[2] * w
  );
}

function buildHeadline(
  homeName: string,
  awayName: string,
  probs: [number, number, number],
  status: "upcoming" | "live",
  homeScore: number,
  awayScore: number,
  minute: number
): { favorite: WinPrediction["favorite"]; headline: string; detail: string } {
  const [home, draw, away] = probs;
  const favorite: WinPrediction["favorite"] =
    home >= draw && home >= away ? "home" : away >= draw ? "away" : "draw";

  if (status === "upcoming") {
    if (favorite === "draw") {
      return {
        favorite,
        headline: "Too close to call",
        detail: `Rankings and form point to a tight game between ${homeName} and ${awayName}.`,
      };
    }
    const name = favorite === "home" ? homeName : awayName;
    const pct = Math.round(favorite === "home" ? home : away);
    return {
      favorite,
      headline: `${name} slight favorites`,
      detail: `Pre-match model gives ${name} a ${pct}% win chance based on FIFA rankings and historical draw rates.`,
    };
  }

  const clock = minute > 0 ? `${minute}'` : "live";
  if (favorite === "draw") {
    return {
      favorite,
      headline: "Draw the most likely result",
      detail: `At ${clock} with the score ${homeScore}–${awayScore}, both teams still have paths to victory.`,
    };
  }

  const name = favorite === "home" ? homeName : awayName;
  const pct = Math.round(favorite === "home" ? home : away);
  const diff = homeScore - awayScore;

  if (diff === 0) {
    return {
      favorite,
      headline: `${name} tipped to edge it`,
      detail: `Level at ${clock} - live stats and rankings give ${name} a ${pct}% win chance from here.`,
    };
  }

  const leader = diff > 0 ? homeName : awayName;
  if (favorite === (diff > 0 ? "home" : "away")) {
    return {
      favorite,
      headline: `${leader} favored to hold on`,
      detail: `${leader} lead ${Math.abs(homeScore)}–${Math.abs(awayScore)} at ${clock} with a ${pct}% win probability.`,
    };
  }

  return {
    favorite,
    headline: `${name} tipped for a comeback`,
    detail: `Despite the scoreline at ${clock}, the model likes ${name} (${pct}%) to turn it around.`,
  };
}

export function predictMatchOutcome(input: {
  homeCode: string;
  awayCode: string;
  homeName: string;
  awayName: string;
  status: "upcoming" | "live" | "finished";
  homeScore?: number;
  awayScore?: number;
  minute?: number;
  displayClock?: string;
  stats?: MatchStats;
  events?: MatchEvent[];
}): WinPrediction | null {
  if (input.status === "finished") return null;

  const prior = rankingPrior(input.homeCode, input.awayCode);
  const homeScore = input.homeScore ?? 0;
  const awayScore = input.awayScore ?? 0;
  const minute = parseMinute(input.minute, input.displayClock);

  let probs: [number, number, number];

  if (input.status === "upcoming") {
    probs = prior;
  } else {
    const live = scoreStateProbs(homeScore, awayScore, minute);
    const liveWeight = clamp(minute / 75, 0.35, 0.92);
    probs = blend(prior, live, liveWeight);
    probs = statsNudge(probs, input.stats);
    probs = redCardNudge(probs, input.events);
  }

  const copy = buildHeadline(
    input.homeName,
    input.awayName,
    probs,
    input.status,
    homeScore,
    awayScore,
    minute
  );

  return {
    homeWin: Math.round(probs[0]),
    draw: Math.round(probs[1]),
    awayWin: Math.round(probs[2]),
    favorite: copy.favorite,
    headline: copy.headline,
    detail: copy.detail,
  };
}

export function buildWinPredictionShareText(
  homeName: string,
  awayName: string,
  homeScore: number | undefined,
  awayScore: number | undefined,
  prediction: WinPrediction,
  status: "upcoming" | "live"
): string {
  const score =
    status === "live" && homeScore != null && awayScore != null
      ? ` (${homeScore}–${awayScore} LIVE)`
      : "";
  const leader =
    prediction.favorite === "home"
      ? `${homeName} ${prediction.homeWin}%`
      : prediction.favorite === "away"
        ? `${awayName} ${prediction.awayWin}%`
        : `Draw ${prediction.draw}%`;
  return `📊 Win predictor${score}: ${leader} - ${homeName} vs ${awayName} at World Cup 2026`;
}
