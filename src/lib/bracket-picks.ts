import type { BracketMatch, BracketRoundId, KnockoutBracketData } from "./types";

export const BRACKET_PICKS_KEY = "wc26_bracket_picks";

/** `home` | `away` winner for a bracket slot */
export type BracketPickSide = "home" | "away";

export type BracketPicks = Record<string, BracketPickSide>;

const PREDICT_ROUNDS: BracketRoundId[] = [
  "round-of-32",
  "round-of-16",
  "quarter-final",
  "semi-final",
  "third-place",
  "final",
];

export function bracketMatchKey(round: BracketRoundId, slot: number): string {
  return `${round}:${slot}`;
}

export function getOrderedBracketMatchKeys(data: KnockoutBracketData): string[] {
  const keys: string[] = [];
  for (const roundId of PREDICT_ROUNDS) {
    const round = data.rounds.find((r) => r.id === roundId);
    if (!round) continue;
    for (let slot = 0; slot < round.matches.length; slot++) {
      keys.push(bracketMatchKey(roundId, slot));
    }
  }
  return keys;
}

export function encodeBracketPicks(
  picks: BracketPicks,
  data: KnockoutBracketData
): string {
  const encoded = getOrderedBracketMatchKeys(data)
    .map((key) => {
      const side = picks[key];
      if (side === "home") return "H";
      if (side === "away") return "A";
      return "-";
    })
    .join("");

  if (typeof btoa === "undefined") return encoded;
  return btoa(encoded).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

export function decodeBracketPicks(
  encoded: string,
  data: KnockoutBracketData
): BracketPicks {
  const keys = getOrderedBracketMatchKeys(data);
  let raw = encoded;

  try {
    const padded = encoded.replace(/-/g, "+").replace(/_/g, "/");
    const pad = padded.length % 4 === 0 ? "" : "=".repeat(4 - (padded.length % 4));
    raw = typeof atob !== "undefined" ? atob(padded + pad) : encoded;
  } catch {
    raw = encoded;
  }

  const picks: BracketPicks = {};
  for (let i = 0; i < keys.length && i < raw.length; i++) {
    const char = raw[i];
    if (char === "H") picks[keys[i]] = "home";
    if (char === "A") picks[keys[i]] = "away";
  }
  return picks;
}

export function getBracketPicks(): BracketPicks {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(BRACKET_PICKS_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as unknown;
    if (!parsed || typeof parsed !== "object") return {};
    return parsed as BracketPicks;
  } catch {
    return {};
  }
}

export function saveBracketPicks(picks: BracketPicks): void {
  localStorage.setItem(BRACKET_PICKS_KEY, JSON.stringify(picks));
}

export function clearBracketPicks(): void {
  localStorage.removeItem(BRACKET_PICKS_KEY);
}

export function scoreBracketPicks(
  picks: BracketPicks,
  data: KnockoutBracketData
): { correct: number; decided: number; pct: number } {
  let correct = 0;
  let decided = 0;

  for (const round of data.rounds) {
    for (const match of round.matches) {
      const key = bracketMatchKey(round.id, match.slot);
      const pick = picks[key];
      if (!pick || match.status !== "finished") continue;

      const winner = match.home.winner ? "home" : match.away.winner ? "away" : null;
      if (!winner) continue;

      decided += 1;
      if (pick === winner) correct += 1;
    }
  }

  return {
    correct,
    decided,
    pct: decided > 0 ? Math.round((correct / decided) * 100) : 0,
  };
}

function pickTeam(match: BracketMatch, side: BracketPickSide) {
  return side === "home" ? match.home : match.away;
}

function feederRefFromLabel(label: string): { round: BracketRoundId; num: number; loser: boolean } | null {
  const patterns: [RegExp, BracketRoundId][] = [
    [/round of 32 (\d+) winner/i, "round-of-32"],
    [/round of 16 (\d+) winner/i, "round-of-16"],
    [/quarter-final (\d+) winner/i, "quarter-final"],
    [/semi-final (\d+) winner/i, "semi-final"],
  ];

  for (const [pattern, round] of patterns) {
    const match = label.match(pattern);
    if (match) return { round, num: parseInt(match[1], 10), loser: false };
  }

  const loser = label.match(/semi-final (\d+) loser/i);
  if (loser) return { round: "semi-final", num: parseInt(loser[1], 10), loser: true };

  return null;
}

function resolveFromPick(
  label: string,
  picks: BracketPicks,
  data: KnockoutBracketData
) {
  const ref = feederRefFromLabel(label);
  if (!ref) return null;

  const round = data.rounds.find((r) => r.id === ref.round);
  const source = round?.matches.find((m) => m.matchNumber === ref.num);
  if (!source) return null;

  const key = bracketMatchKey(ref.round, source.slot);
  const side = picks[key];
  if (!side) return null;

  const team = pickTeam(source, side);
  if (ref.loser) {
    const winner = pickTeam(source, side);
    if (winner.code === source.home.code) return { ...source.away, placeholder: false, projected: true };
    if (winner.code === source.away.code) return { ...source.home, placeholder: false, projected: true };
    return null;
  }

  return { ...team, placeholder: false, projected: true };
}

export function applyBracketPicks(
  data: KnockoutBracketData,
  picks: BracketPicks
): KnockoutBracketData {
  const rounds = data.rounds.map((round) => ({
    ...round,
    matches: round.matches.map((match) => ({ ...match, home: { ...match.home }, away: { ...match.away } })),
  }));

  const cloned: KnockoutBracketData = { ...data, rounds };

  for (const roundId of PREDICT_ROUNDS) {
    const round = cloned.rounds.find((r) => r.id === roundId);
    if (!round) continue;

    for (const match of round.matches) {
      const key = bracketMatchKey(roundId, match.slot);
      const side = picks[key];
      if (side) {
        const winner = pickTeam(match, side);
        match.home = { ...match.home, winner: side === "home" };
        match.away = { ...match.away, winner: side === "away" };
        if (winner.code) {
          match.status = match.status === "tbd" ? "upcoming" : match.status;
        }
      }

      for (const side of ["home", "away"] as const) {
        const team = match[side];
        if (team.code && !team.placeholder) continue;
        const label = team.feederLabel ?? team.name;
        const resolved = resolveFromPick(label, picks, cloned);
        if (resolved?.code) {
          match[side] = { ...resolved, score: team.score, winner: team.winner };
        }
      }
    }
  }

  return cloned;
}

export function countBracketPicks(picks: BracketPicks, data: KnockoutBracketData): number {
  const keys = getOrderedBracketMatchKeys(data);
  return keys.filter((key) => picks[key]).length;
}

export function getPredictedChampion(
  data: KnockoutBracketData,
  picks: BracketPicks
): BracketMatch["home"] | null {
  const applied = applyBracketPicks(data, picks);
  const finalRound = applied.rounds.find((r) => r.id === "final");
  const finalMatch = finalRound?.matches[0];
  if (!finalMatch) return null;

  const key = bracketMatchKey("final", 0);
  const side = picks[key];
  if (!side) return null;
  return pickTeam(finalMatch, side);
}
