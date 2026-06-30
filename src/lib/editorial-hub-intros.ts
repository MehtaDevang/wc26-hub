/** Human-written context blocks on data-heavy hub pages (AdSense / SEO value-add). */

export interface HubIntro {
  title: string;
  paragraphs: string[];
  links?: { href: string; label: string }[];
}

export const FIXTURES_HUB_INTRO: HubIntro = {
  title: "How to use the World Cup 2026 fixture list",
  paragraphs: [
    "This page lists every FIFA World Cup 2026 match from the opening group games through the final across the United States, Mexico, and Canada. Kick-off times follow your local timezone so you can plan around work, travel, and watch parties.",
    "The tournament uses twelve groups of four teams (48 nations). The top two in each group advance, plus the eight best third-placed sides, for a 32-team knockout stage. Use the date filter to jump to today, browse by group, or add the full schedule to your calendar.",
    "Scores and statuses refresh from live match data throughout the day. For tables and qualification math, see our group standings and Road to the Round of 32 tracker.",
  ],
  links: [
    { href: "/standings", label: "Live group tables" },
    { href: "/knockout", label: "Qualification tracker" },
    { href: "/history", label: "World Cup history" },
  ],
};

export const STANDINGS_HUB_INTRO: HubIntro = {
  title: "Understanding the World Cup 2026 group stage",
  paragraphs: [
    "Forty-eight teams are split into twelve groups (A through L). Each team plays three group matches. Three points for a win, one for a draw, with goal difference and goals scored breaking ties before fair play and lots.",
    "Twenty-four teams qualify automatically as group winners and runners-up. The remaining eight knockout spots go to the best third-placed teams, ranked on points, goal difference, and goals scored across all twelve groups.",
    "Tables on this page update after every final whistle. Tap a team for fixtures and squad stats, or open the qualification simulator to model what-if results for remaining games.",
  ],
  links: [
    { href: "/knockout", label: "Best third-placed tracker" },
    { href: "/scenarios", label: "What-if simulator" },
    { href: "/groups", label: "All groups A–L" },
  ],
};

export const TEAMS_HUB_INTRO: HubIntro = {
  title: "All 48 World Cup 2026 nations",
  paragraphs: [
    "Every qualified country is listed below by FIFA world ranking. Select a team to see its group, live results, upcoming fixtures, squad list, and tournament journey from the opening match to the knockout stage.",
    "Each team page includes a short qualification story: how they reached the finals, past World Cup pedigree, and what fans should watch for this summer. Marquee players with curated profiles cover career background and playing style.",
    "Hosting duties are shared by the USA, Mexico, and Canada. For travel, stadiums, and city guides around each venue, explore our host nation and city hub.",
  ],
  links: [
    { href: "/hosts", label: "Host nations guide" },
    { href: "/cities", label: "City travel guides" },
    { href: "/rivalries", label: "Historic rivalries" },
  ],
};
