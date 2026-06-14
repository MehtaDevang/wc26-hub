export const SITE_NAME = "The Goal Posts";

export const SITE_DESCRIPTION =
  "Live football scores, World Cup match details, fixtures, standings, history, and daily puzzles from The Goal Posts.";

export const SITE_KEYWORDS = [
  "The Goal Posts",
  "World Cup 2026",
  "FIFA World Cup",
  "live scores",
  "fixtures",
  "standings",
  "football puzzles",
  "soccer",
  "USA Mexico Canada",
];

export const SITE_CONTACT_EMAIL = "hello@thegoalposts.com";
export const SITE_ADS_EMAIL = "ads@thegoalposts.com";

/** Production URL; override with NEXT_PUBLIC_SITE_URL when deploying. */
export function getSiteUrl(): string {
  const url = process.env.NEXT_PUBLIC_SITE_URL ?? "https://thegoalposts.com";
  return url.replace(/\/$/, "");
}
