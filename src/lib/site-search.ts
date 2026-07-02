import { TEAMS } from "./data";

export interface SearchItem {
  id: string;
  label: string;
  href: string;
  group: string;
  keywords?: string;
  icon?: string;
}

export const QUICK_NAV: SearchItem[] = [
  { id: "home", label: "Live scores today", href: "/", group: "Today", keywords: "home dashboard scores" },
  { id: "daily", label: "Today at the World Cup", href: "/daily", group: "Today", keywords: "daily digest results today fixtures recap yesterday" },
  { id: "my", label: "My World Cup", href: "/my", group: "Today", keywords: "my teams follow dashboard" },
  { id: "fixtures", label: "All fixtures & results", href: "/fixtures", group: "Today", keywords: "schedule calendar matches" },
  { id: "standings", label: "Group tables", href: "/standings", group: "Today", keywords: "standings points table" },
  { id: "knockout", label: "Road to Round of 32", href: "/knockout", group: "Today", keywords: "knockout qualification best third place round of 32 advance" },
  { id: "bracket", label: "Knockout bracket", href: "/bracket", group: "Today", keywords: "knockout elimination" },
  { id: "leaders", label: "Stat leaders - Golden Boot", href: "/leaders", group: "Stats", keywords: "top scorers assists" },
  { id: "news", label: "World Cup news & exclusives", href: "/news", group: "Today", keywords: "news headlines exclusive stories articles" },
  { id: "teams", label: "All 48 teams", href: "/teams", group: "Teams", keywords: "countries nations squads" },
  { id: "players", label: "Player stats", href: "/players", group: "Teams", keywords: "squad roster" },
  { id: "watch", label: "Where to watch", href: "/watch", group: "Watch", keywords: "tv stream broadcast" },
  { id: "scenarios", label: "Qualification scenarios & group simulator", href: "/scenarios", group: "Tools", keywords: "qualify advance points what if simulate" },
  { id: "bracket-pool", label: "Bracket pool vs friends", href: "/bracket/pool", group: "Tools", keywords: "pool leaderboard friends compete challenge office" },
  { id: "pool", label: "Office pool kit", href: "/pool", group: "Tools", keywords: "office pool printable" },
  { id: "history", label: "FIFA World Cup history", href: "/history", group: "Explore", keywords: "winners records finals hosts" },
  { id: "history-finals", label: "All World Cup finals", href: "/history#finals", group: "Explore", keywords: "final scores champions" },
  { id: "history-hosts", label: "World Cup host nations", href: "/history#hosts", group: "Explore", keywords: "hosts venues countries" },
  { id: "history-goals", label: "All-time goal records", href: "/history#goals", group: "Explore", keywords: "scorers klose fontaine" },
  { id: "rivalries", label: "Rivalries", href: "/rivalries", group: "Explore", keywords: "derby h2h" },
  { id: "stadiums", label: "Stadiums", href: "/stadiums", group: "Explore", keywords: "venues arenas" },
  { id: "cities", label: "Host city guides", href: "/cities", group: "Explore", keywords: "travel host cities" },
  { id: "puzzles", label: "Daily puzzles", href: "/puzzles", group: "Fun", keywords: "quiz guess scramble" },
  { id: "wallpapers", label: "Iconic moments wallpapers", href: "/wallpapers", group: "Fun", keywords: "wallpaper wallpapers hd download phone laptop desktop background iconic moments maradona messi" },
  { id: "install", label: "Get the app", href: "/install", group: "Explore", keywords: "install app pwa add to home screen download mobile android iphone" },
];

export function buildTeamSearchItems(): SearchItem[] {
  return Object.values(TEAMS).map((team) => ({
    id: `team-${team.code}`,
    label: team.name,
    href: `/teams/${team.code}`,
    group: "Teams",
    keywords: `${team.code} ${team.name} squad fixtures`,
    icon: team.flag,
  }));
}

export function filterSearchItems(query: string, items: SearchItem[]): SearchItem[] {
  const q = query.trim().toLowerCase();
  if (!q) return items.slice(0, 12);

  return items
    .map((item) => {
      const haystack = `${item.label} ${item.group} ${item.keywords ?? ""} ${item.href}`.toLowerCase();
      const words = q.split(/\s+/).filter(Boolean);
      const score = words.reduce((s, w) => (haystack.includes(w) ? s + 1 : s), 0);
      const prefix = item.label.toLowerCase().startsWith(q) ? 2 : 0;
      return { item, score: score + prefix };
    })
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score || a.item.label.localeCompare(b.item.label))
    .map((x) => x.item)
    .slice(0, 14);
}

export function buildStaticSearchIndex(): SearchItem[] {
  return [...QUICK_NAV, ...buildTeamSearchItems()];
}
