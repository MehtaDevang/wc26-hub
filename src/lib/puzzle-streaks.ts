import { getPuzzleStatus } from "./storage";
import { PUZZLE_CATALOG } from "./puzzles/catalog";

const STREAK_KEY = "wc26_puzzle_streak";

export interface PuzzleStreakState {
  currentStreak: number;
  bestStreak: number;
  totalPerfectDays: number;
  lastPerfectDate: string | null;
  history: Record<string, boolean>;
}

function emptyState(): PuzzleStreakState {
  return {
    currentStreak: 0,
    bestStreak: 0,
    totalPerfectDays: 0,
    lastPerfectDate: null,
    history: {},
  };
}

function read(): PuzzleStreakState {
  if (typeof window === "undefined") return emptyState();
  try {
    const raw = localStorage.getItem(STREAK_KEY);
    if (!raw) return emptyState();
    return { ...emptyState(), ...(JSON.parse(raw) as PuzzleStreakState) };
  } catch {
    return emptyState();
  }
}

function write(state: PuzzleStreakState): void {
  localStorage.setItem(STREAK_KEY, JSON.stringify(state));
}

function dateKeyOffset(dateKey: string, days: number): string {
  const [y, m, d] = dateKey.split("-").map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d));
  dt.setUTCDate(dt.getUTCDate() + days);
  return dt.toISOString().slice(0, 10);
}

function isPerfectDay(today: string): boolean {
  return PUZZLE_CATALOG.every((p) => getPuzzleStatus(p.id, today) === "done");
}

export function getPuzzleStreakState(): PuzzleStreakState {
  return read();
}

export function refreshPuzzleStreak(today: string): PuzzleStreakState {
  if (!today) return read();

  const state = read();
  const perfect = isPerfectDay(today);

  if (perfect && state.lastPerfectDate !== today) {
    const yesterday = dateKeyOffset(today, -1);
    const continued = state.lastPerfectDate === yesterday;
    const currentStreak = continued ? state.currentStreak + 1 : 1;
    const next: PuzzleStreakState = {
      ...state,
      currentStreak,
      bestStreak: Math.max(state.bestStreak, currentStreak),
      totalPerfectDays: state.totalPerfectDays + 1,
      lastPerfectDate: today,
      history: { ...state.history, [today]: true },
    };
    write(next);
    return next;
  }

  if (!perfect && state.lastPerfectDate && state.lastPerfectDate < today) {
    const yesterday = dateKeyOffset(today, -1);
    if (state.lastPerfectDate < yesterday) {
      const next = { ...state, currentStreak: 0 };
      write(next);
      return next;
    }
  }

  return state;
}

export function recordPuzzleSessionEnd(today: string): PuzzleStreakState {
  return refreshPuzzleStreak(today);
}

export function buildStreakShareText(streak: PuzzleStreakState): string {
  if (streak.currentStreak > 0) {
    return `🔥 ${streak.currentStreak}-day puzzle streak on The Goal Posts! Can you beat my run?`;
  }
  return `I completed today's World Cup puzzles on The Goal Posts — join me!`;
}
