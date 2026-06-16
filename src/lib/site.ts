export const SITE_NAME = "The Goal Posts";
export const SITE_SHORT_NAME = "Goal Posts";

export const SITE_DESCRIPTION =
  "FIFA World Cup 2026 live scores today, fixtures, results, group standings, team & player stats, match highlights, head-to-head history, and World Cup records - updated throughout the tournament.";

export const SITE_TAGLINE =
  "Live scores, teams, players, stats & history for FIFA World Cup 2026";

export const SITE_KEYWORDS = [
  "FIFA World Cup 2026",
  "World Cup 2026",
  "World Cup live scores",
  "World Cup scores today",
  "football live scores",
  "soccer live scores",
  "World Cup fixtures",
  "World Cup schedule",
  "World Cup results",
  "World Cup standings",
  "World Cup group tables",
  "World Cup teams",
  "World Cup countries",
  "World Cup players",
  "World Cup stats",
  "World Cup history",
  "World Cup bracket",
  "World Cup highlights",
  "head to head football",
  "USA Mexico Canada World Cup",
  "The Goal Posts",
];

export const SITE_CONTACT_EMAIL = "hello@thegoalposts.in";
export const SITE_ADS_EMAIL = "ads@thegoalposts.in";

export const SITE_TWITTER_HANDLE = "thegoalposts_in";
export const SITE_TWITTER_URL = "https://x.com/thegoalposts_in";
export const SITE_TWITTER_FOLLOW_URL = `https://x.com/intent/follow?screen_name=${SITE_TWITTER_HANDLE}`;

/** Canonical production URL including www. Override with NEXT_PUBLIC_SITE_URL on deploy. */
export function getSiteUrl(): string {
  const url = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.thegoalposts.in";
  return url.replace(/\/$/, "");
}
