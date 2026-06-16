import { NextResponse } from "next/server";
import { resolveTeamCode } from "./team-lookup";
import { isValidTimezone } from "./timezone";

/** Headers applied to all JSON API responses */
export const API_SECURITY_HEADERS: Record<string, string> = {
  "X-Content-Type-Options": "nosniff",
  "X-Robots-Tag": "noindex, nofollow",
  "Cache-Control": "public, max-age=0, s-maxage=60, stale-while-revalidate=300",
};

export function withApiSecurityHeaders(response: NextResponse): NextResponse {
  for (const [key, value] of Object.entries(API_SECURITY_HEADERS)) {
    response.headers.set(key, value);
  }
  return response;
}

export function apiJsonResponse(body: unknown, init?: ResponseInit): NextResponse {
  return withApiSecurityHeaders(NextResponse.json(body, init));
}

const MATCH_ID_PATTERN = /^\d{6,15}$/;
const DATE_PATTERN = /^(?:\d{4}-\d{2}-\d{2}|\d{8})$/;
const MATCH_RANGES = new Set(["group-stage", "full", "recent"]);

export function isValidMatchId(id: string): boolean {
  return MATCH_ID_PATTERN.test(id);
}

export function isValidNewsId(id: string): boolean {
  return MATCH_ID_PATTERN.test(id);
}

export function isValidTeamCode(code: string): boolean {
  const trimmed = code.trim();
  if (!trimmed || trimmed.length > 32) return false;
  return !!resolveTeamCode(trimmed);
}

export function isValidGroupLetter(letter: string): boolean {
  return /^[A-L]$/i.test(letter.trim());
}

export function isValidPlayerId(id: string): boolean {
  const trimmed = id.trim();
  if (!trimmed || trimmed.length > 64) return false;
  return /^\d{4,15}$/.test(trimmed) || /^[a-z0-9]+(?:-[a-z0-9]+)*$/i.test(trimmed);
}

export function parseMatchesQuery(
  date: string | null,
  range: string | null,
  timeZone: string | null = null
):
  | { ok: true; date?: string | null; range?: string | null; timeZone?: string | null }
  | { ok: false; error: string } {
  if (date && date !== "today" && !DATE_PATTERN.test(date)) {
    return { ok: false, error: "Invalid date format. Use YYYY-MM-DD." };
  }

  if (range && !MATCH_RANGES.has(range)) {
    return { ok: false, error: "Invalid range. Use group-stage, full, or recent." };
  }

  if (date && range) {
    return { ok: false, error: "Provide either date or range, not both." };
  }

  if (timeZone && !isValidTimezone(timeZone)) {
    return { ok: false, error: "Invalid timezone." };
  }

  return { ok: true, date, range, timeZone };
}

export function apiErrorResponse(
  fallback: string,
  status = 500,
  error?: unknown
): NextResponse {
  const message =
    process.env.NODE_ENV === "development" && error instanceof Error
      ? error.message
      : fallback;

  return withApiSecurityHeaders(NextResponse.json({ error: message }, { status }));
}

type RateBucket = { count: number; resetAt: number };

const rateBuckets = new Map<string, RateBucket>();

const RATE_LIMIT = 120;
const RATE_WINDOW_MS = 60_000;

export function isRateLimited(key: string): boolean {
  const now = Date.now();

  // Prune expired buckets periodically to limit memory growth
  if (rateBuckets.size > 500) {
    for (const [k, bucket] of rateBuckets) {
      if (now >= bucket.resetAt) rateBuckets.delete(k);
    }
  }

  const bucket = rateBuckets.get(key);

  if (!bucket || now >= bucket.resetAt) {
    rateBuckets.set(key, { count: 1, resetAt: now + RATE_WINDOW_MS });
    return false;
  }

  bucket.count += 1;
  if (bucket.count > RATE_LIMIT) return true;
  return false;
}

export function getClientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]?.trim() ?? "unknown";
  return request.headers.get("x-real-ip") ?? "unknown";
}
