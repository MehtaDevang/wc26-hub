export const SITE_NAME = "The Goal Posts";

export const SITE_DESCRIPTION =
  "FIFA World Cup 2026 live scores, fixtures, group standings, match stats, highlights, World Cup history, and daily football puzzles on The Goal Posts.";

export const SITE_KEYWORDS = [
  "The Goal Posts",
  "World Cup 2026",
  "FIFA World Cup",
  "World Cup live scores",
  "World Cup fixtures",
  "World Cup standings",
  "World Cup schedule",
  "football live scores",
  "soccer scores",
  "football puzzles",
  "World Cup history",
  "USA Mexico Canada World Cup",
];

export const SITE_CONTACT_EMAIL = "hello@thegoalposts.in";
export const SITE_ADS_EMAIL = "ads@thegoalposts.in";

/** Canonical production URL including www. Override with NEXT_PUBLIC_SITE_URL on deploy. */
export function getSiteUrl(): string {
  const url = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.thegoalposts.in";
  return url.replace(/\/$/, "");
}
