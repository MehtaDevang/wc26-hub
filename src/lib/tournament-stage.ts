import type { BracketMatch, BracketTeam, KnockoutBracketData } from "./types";

/**
 * High-level phase of the tournament used to re-orient the homepage around the
 * final four. Everything before the semi-finals stays as the regular
 * group/knockout dashboard (`pre`).
 */
export type FinaleStage = "pre" | "semi" | "final" | "champions";

export interface FinaleState {
  stage: FinaleStage;
  /** Human label for the current stage, e.g. "Semi-Finals". */
  stageLabel: string;
  /** The two semi-final fixtures (may contain placeholders early). */
  semiFinals: BracketMatch[];
  finalMatch: BracketMatch | null;
  thirdPlaceMatch: BracketMatch | null;
  /** Resolved teams still alive going into / during the semis. */
  semifinalists: BracketTeam[];
  /** Resolved teams in the Final (empty until the semis are decided). */
  finalists: BracketTeam[];
  champion: BracketTeam | null;
}

const EMPTY_STATE: FinaleState = {
  stage: "pre",
  stageLabel: "",
  semiFinals: [],
  finalMatch: null,
  thirdPlaceMatch: null,
  semifinalists: [],
  finalists: [],
  champion: null,
};

function resolvedTeams(match: BracketMatch | undefined | null): BracketTeam[] {
  if (!match) return [];
  return [match.home, match.away].filter(
    (team): team is BracketTeam => Boolean(team?.code) && !team?.placeholder
  );
}

function championOf(finalMatch: BracketMatch | null): BracketTeam | null {
  if (!finalMatch || finalMatch.status !== "finished") return null;
  if (finalMatch.home.winner && finalMatch.home.code) return finalMatch.home;
  if (finalMatch.away.winner && finalMatch.away.code) return finalMatch.away;
  return null;
}

/**
 * Derive the finale state from the live knockout bracket. Auto-advances
 * semi -> final -> champions and safely returns `pre` when data is missing so
 * the homepage falls back to its normal layout.
 */
export function getFinaleState(bracket: KnockoutBracketData | null): FinaleState {
  if (!bracket) return EMPTY_STATE;

  const semiFinals = bracket.rounds.find((r) => r.id === "semi-final")?.matches ?? [];
  const finalMatch = bracket.rounds.find((r) => r.id === "final")?.matches[0] ?? null;
  const thirdPlaceMatch =
    bracket.rounds.find((r) => r.id === "third-place")?.matches[0] ?? null;

  const semifinalists = semiFinals.flatMap(resolvedTeams);
  const finalists = resolvedTeams(finalMatch);
  const champion = championOf(finalMatch);

  let stage: FinaleStage = "pre";
  if (champion) {
    stage = "champions";
  } else if (bracket.activeRound === "final" || bracket.activeRound === "third-place") {
    stage = "final";
  } else if (bracket.activeRound === "semi-final") {
    stage = "semi";
  }

  const stageLabel =
    stage === "champions"
      ? "Champions"
      : stage === "final"
        ? "The Final"
        : stage === "semi"
          ? "Semi-Finals"
          : "";

  return {
    stage,
    stageLabel,
    semiFinals,
    finalMatch,
    thirdPlaceMatch,
    semifinalists,
    finalists,
    champion,
  };
}
