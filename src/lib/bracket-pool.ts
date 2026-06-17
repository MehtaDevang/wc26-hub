import {
  decodeBracketPicks,
  getPredictedChampion,
  scoreBracketPicks,
  type BracketPicks,
} from "./bracket-picks";
import { getTeam } from "./data";
import type { KnockoutBracketData } from "./types";

const POOL_KEY = "wc26_bracket_pool";

export interface PoolEntry {
  id: string;
  name: string;
  /** URL-safe encoded picks string (same format as the predictor share link). */
  encoded: string;
  addedAt: number;
  isYou?: boolean;
}

export interface ScoredPoolEntry extends PoolEntry {
  correct: number;
  decided: number;
  pct: number;
  championName: string | null;
}

function safeParse(raw: string | null): PoolEntry[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (e): e is PoolEntry =>
        Boolean(e) &&
        typeof (e as PoolEntry).id === "string" &&
        typeof (e as PoolEntry).encoded === "string"
    );
  } catch {
    return [];
  }
}

export function getPoolEntries(): PoolEntry[] {
  if (typeof window === "undefined") return [];
  return safeParse(localStorage.getItem(POOL_KEY));
}

export function savePoolEntries(entries: PoolEntry[]): void {
  localStorage.setItem(POOL_KEY, JSON.stringify(entries.slice(0, 30)));
}

function makeId(): string {
  return `entry-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
}

/** Add or replace an entry. Entries are de-duplicated by case-insensitive name. */
export function upsertPoolEntry(
  entries: PoolEntry[],
  name: string,
  encoded: string,
  options: { isYou?: boolean } = {}
): PoolEntry[] {
  const trimmed = name.trim().slice(0, 40) || "Anonymous";
  const next = entries.filter(
    (e) =>
      e.name.toLowerCase() !== trimmed.toLowerCase() &&
      !(options.isYou && e.isYou)
  );
  next.push({
    id: makeId(),
    name: trimmed,
    encoded,
    addedAt: Date.now(),
    isYou: options.isYou,
  });
  return next;
}

export function removePoolEntry(entries: PoolEntry[], id: string): PoolEntry[] {
  return entries.filter((e) => e.id !== id);
}

/** Pull an encoded picks string out of a pasted share link or raw code. */
export function extractEncodedFromInput(input: string): string | null {
  const trimmed = input.trim();
  if (!trimmed) return null;

  const paramMatch = trimmed.match(/[?&]p=([^&\s]+)/);
  if (paramMatch) return paramMatch[1];

  // Otherwise assume the user pasted the raw code (URL-safe base64).
  if (/^[A-Za-z0-9_-]+$/.test(trimmed)) return trimmed;

  return null;
}

export function scorePoolEntry(
  entry: PoolEntry,
  data: KnockoutBracketData
): ScoredPoolEntry {
  const picks: BracketPicks = decodeBracketPicks(entry.encoded, data);
  const { correct, decided, pct } = scoreBracketPicks(picks, data);
  const champion = getPredictedChampion(data, picks);
  const championName = champion?.code
    ? getTeam(champion.code, champion.name, champion.logo).name
    : champion?.name ?? null;

  return { ...entry, correct, decided, pct, championName };
}

export function scoreAndRankPool(
  entries: PoolEntry[],
  data: KnockoutBracketData
): ScoredPoolEntry[] {
  return entries
    .map((e) => scorePoolEntry(e, data))
    .sort(
      (a, b) =>
        b.correct - a.correct ||
        b.pct - a.pct ||
        a.name.localeCompare(b.name)
    );
}

export function buildPoolShareUrl(name: string, encoded: string): string {
  const origin =
    typeof window !== "undefined" ? window.location.origin : "https://www.thegoalposts.in";
  const params = new URLSearchParams({ p: encoded, name: name.trim().slice(0, 40) });
  return `${origin}/bracket/pool?${params.toString()}`;
}
