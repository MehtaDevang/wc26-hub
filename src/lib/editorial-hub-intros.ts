/** Human-written context blocks on data-heavy hub pages (AdSense / SEO value-add). */

export interface HubIntro {
  title: string;
  paragraphs: string[];
  links?: { href: string; label: string }[];
}

export const FIXTURES_HUB_INTRO: HubIntro = {
  title: "World Cup 2026 knockout fixtures & results",
  paragraphs: [
    "The group stage is complete — 32 teams remain in the knockout bracket. This page lists every Round of 32, Round of 16, quarter-final, semi-final, third-place play-off, and final match with kick-off times in your local timezone.",
    "Use the knockout filter to focus on elimination games, jump by date to today’s slate, or follow only the teams you’ve starred on My World Cup. Scores and statuses refresh from live match data throughout the day.",
    "For the full tournament tree, live bracket updates, and Golden Boot standings, see our knockout bracket and stat leaders pages.",
  ],
  links: [
    { href: "/bracket", label: "Live knockout bracket" },
    { href: "/leaders", label: "Golden Boot & stat leaders" },
    { href: "/standings", label: "Final group tables (archive)" },
  ],
};

export const STANDINGS_HUB_INTRO: HubIntro = {
  title: "Final World Cup 2026 group-stage tables",
  paragraphs: [
    "Forty-eight teams played three matches each across twelve groups (A through L). These tables show the final group-stage standings — points, goal difference, and who advanced to the Round of 32.",
    "Twenty-four teams qualified as group winners and runners-up. The remaining eight knockout spots went to the best third-placed teams, ranked on points, goal difference, and goals scored.",
    "The knockout phase is underway. Follow live scores and the path to the Final on the main bracket, or browse upcoming elimination fixtures.",
  ],
  links: [
    { href: "/bracket", label: "Live knockout bracket" },
    { href: "/fixtures", label: "Knockout fixtures" },
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
