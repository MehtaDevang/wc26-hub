import { PUZZLES_PER_DAY, getTodayKey } from "./puzzles/daily";
import { sanitizeMultiRoundState, sanitizeQuizState } from "./puzzles/session";

export { getTodayKey };

const GUESS_KEY = "wc26_guess";
const SCRAMBLE_KEY = "wc26_scramble";
const QUIZ_KEY = "wc26_quiz";
const PREMIUM_KEY = "wc26_premium";

export interface RoundResult {
  guesses: string[];
  won: boolean;
  gaveUp: boolean;
}

export interface MultiRoundState {
  date: string;
  currentRound: number;
  rounds: RoundResult[];
  finished: boolean;
}

export interface QuizRoundResult {
  selected: number;
  correct: boolean;
}

export interface QuizState {
  date: string;
  currentRound: number;
  rounds: QuizRoundResult[];
  finished: boolean;
}

function read<T>(key: string): T | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(key);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

function write<T>(key: string, value: T): void {
  localStorage.setItem(key, JSON.stringify(value));
}

function readAndSanitizeMultiRound(key: string): MultiRoundState | null {
  const raw = read<MultiRoundState>(key);
  if (!raw) return null;
  const clean = sanitizeMultiRoundState(raw);
  if (JSON.stringify(clean) !== JSON.stringify(raw)) {
    write(key, clean);
  }
  return clean;
}

function readAndSanitizeQuiz(): QuizState | null {
  const raw = read<QuizState>(QUIZ_KEY);
  if (!raw) return null;
  const clean = sanitizeQuizState(raw);
  if (JSON.stringify(clean) !== JSON.stringify(raw)) {
    write(QUIZ_KEY, clean);
  }
  return clean;
}

export function getGuessState(): MultiRoundState | null {
  return readAndSanitizeMultiRound(GUESS_KEY);
}

export function saveGuessState(state: MultiRoundState): void {
  write(GUESS_KEY, sanitizeMultiRoundState(state));
}

export function getScrambleState(): MultiRoundState | null {
  return readAndSanitizeMultiRound(SCRAMBLE_KEY);
}

export function saveScrambleState(state: MultiRoundState): void {
  write(SCRAMBLE_KEY, sanitizeMultiRoundState(state));
}

export function getQuizState(): QuizState | null {
  return readAndSanitizeQuiz();
}

export function saveQuizState(state: QuizState): void {
  write(QUIZ_KEY, sanitizeQuizState(state));
}

export function isPremium(): boolean {
  if (typeof window === "undefined") return false;
  return localStorage.getItem(PREMIUM_KEY) === "true";
}

export function setPremium(value: boolean): void {
  localStorage.setItem(PREMIUM_KEY, value ? "true" : "false");
}

export function emptyMultiRoundState(date: string): MultiRoundState {
  return { date, currentRound: 0, rounds: [], finished: false };
}

export function emptyQuizState(date: string): QuizState {
  return { date, currentRound: 0, rounds: [], finished: false };
}

export function countWins(rounds: RoundResult[]): number {
  return rounds.filter((r) => r.won).length;
}

export function getPuzzleStatus(id: "guess-player" | "scramble" | "quiz", today: string): "done" | "lost" | "pending" {
  if (typeof window === "undefined") return "pending";

  if (id === "quiz") {
    const s = getQuizState();
    if (!s || s.date !== today) return "pending";
    if (!s.finished) return "pending";
    const wins = s.rounds.filter((r) => r.correct).length;
    return wins >= 3 ? "done" : "lost";
  }

  const s = id === "guess-player" ? getGuessState() : getScrambleState();
  if (!s || s.date !== today) return "pending";
  if (!s.finished) return "pending";
  const wins = countWins(s.rounds);
  return wins >= 3 ? "done" : "lost";
}

export { PUZZLES_PER_DAY };
