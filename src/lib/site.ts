export const SITE_NAME = "WC26 Hub";

export const SITE_DESCRIPTION =
  "Live FIFA World Cup 2026 scores, match details, fixtures, group standings, World Cup history, and daily football puzzles.";

export const SITE_KEYWORDS = [
  "World Cup 2026",
  "FIFA World Cup",
  "live scores",
  "fixtures",
  "standings",
  "football puzzles",
  "WC26",
  "USA Mexico Canada",
];

/** Production URL; override with NEXT_PUBLIC_SITE_URL when deploying. */
export function getSiteUrl(): string {
  const url = process.env.NEXT_PUBLIC_SITE_URL ?? "https://wc26hub.com";
  return url.replace(/\/$/, "");
}
