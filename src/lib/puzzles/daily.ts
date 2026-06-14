export const PUZZLES_PER_DAY = 5;

/** Local calendar date YYYY-MM-DD (browser local timezone). */
export function getTodayKey(date = new Date()): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function resolveDateKey(dateOrKey: Date | string): string {
  return typeof dateOrKey === "string" ? dateOrKey : getTodayKey(dateOrKey);
}

export function parseLocalDate(dateKey: string): Date {
  const [y, m, d] = dateKey.split("-").map(Number);
  return new Date(y, m - 1, d, 12, 0, 0);
}

export function getDayIndex(date = new Date()): number {
  const start = new Date(date.getFullYear(), 0, 0);
  return Math.floor((date.getTime() - start.getTime()) / 86400000);
}

function dateSeed(key: string, salt = 0): number {
  const s = `${key}:${salt}`;
  let h = 0;
  for (let i = 0; i < s.length; i++) {
    h = ((h << 5) - h + s.charCodeAt(i)) | 0;
  }
  return Math.abs(h);
}

/** Deterministic daily shuffle — new set every calendar day. */
export function pickDailySet<T>(
  items: T[],
  count: number = PUZZLES_PER_DAY,
  dateOrKey: Date | string = new Date(),
  seed = 0
): T[] {
  if (items.length === 0) return [];

  const key = resolveDateKey(dateOrKey);
  const indices = items.map((_, i) => i);
  let h = dateSeed(key, seed);

  for (let i = indices.length - 1; i > 0; i--) {
    h = (h * 1103515245 + 12345) & 0x7fffffff;
    const j = h % (i + 1);
    [indices[i], indices[j]] = [indices[j], indices[i]];
  }

  return indices.slice(0, Math.min(count, items.length)).map((i) => items[i]);
}

export function pickDaily<T>(items: T[], date = new Date(), offset = 0): T {
  const set = pickDailySet(items, items.length, date, offset);
  return set[offset % set.length];
}

/** Milliseconds until local midnight — next puzzle reset. */
export function getMsUntilNextPuzzleReset(now = new Date()): number {
  const next = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
  return next.getTime() - now.getTime();
}

/** Milliseconds until midnight in an IANA timezone. */
export function getMsUntilNextPuzzleResetInTimezone(
  timeZone: string,
  now = new Date()
): number {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone,
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
    hour12: false,
  }).formatToParts(now);

  const hour = Number(parts.find((p) => p.type === "hour")?.value ?? 0);
  const minute = Number(parts.find((p) => p.type === "minute")?.value ?? 0);
  const second = Number(parts.find((p) => p.type === "second")?.value ?? 0);
  const msElapsed = ((hour * 60 + minute) * 60 + second) * 1000;
  return 86400000 - msElapsed;
}

export function formatResetCountdown(ms: number): string {
  const h = Math.floor(ms / 3600000);
  const m = Math.floor((ms % 3600000) / 60000);
  if (h > 0) return `${h}h ${m}m`;
  return `${m}m`;
}

export function formatTodayDisplay(dateKey: string): string {
  const date = parseLocalDate(dateKey);
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}
