import { PUZZLES_PER_DAY } from "./daily";
import type { MultiRoundState, QuizState, RoundResult, QuizRoundResult } from "../storage";

const MAX_ROUND_INDEX = PUZZLES_PER_DAY - 1;

export function sanitizeRoundIndex(
  currentRound: number,
  roundsCount: number,
  finished: boolean
): number {
  const safe = Math.min(Math.max(0, currentRound), MAX_ROUND_INDEX);
  if (finished) return safe;
  return Math.min(safe, roundsCount);
}

export function sanitizeMultiRoundState(state: MultiRoundState): MultiRoundState {
  let currentRound = typeof state.currentRound === "number" ? state.currentRound : 0;
  let rounds: RoundResult[] = Array.isArray(state.rounds) ? state.rounds : [];
  let finished = Boolean(state.finished);

  if (rounds.length > PUZZLES_PER_DAY) {
    rounds = rounds.slice(0, PUZZLES_PER_DAY);
  }

  if (rounds.length >= PUZZLES_PER_DAY) {
    finished = true;
  }

  currentRound = sanitizeRoundIndex(currentRound, rounds.length, finished);

  return {
    date: state.date ?? "",
    currentRound,
    rounds,
    finished,
  };
}

export function sanitizeQuizState(state: QuizState): QuizState {
  let currentRound = typeof state.currentRound === "number" ? state.currentRound : 0;
  let rounds: QuizRoundResult[] = Array.isArray(state.rounds) ? state.rounds : [];
  let finished = Boolean(state.finished);

  if (rounds.length > PUZZLES_PER_DAY) {
    rounds = rounds.slice(0, PUZZLES_PER_DAY);
  }

  if (rounds.length >= PUZZLES_PER_DAY) {
    finished = true;
  }

  currentRound = sanitizeRoundIndex(currentRound, rounds.length, finished);

  return {
    date: state.date ?? "",
    currentRound,
    rounds,
    finished,
  };
}
