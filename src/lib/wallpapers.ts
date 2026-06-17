import { getClassicMoments } from "./iconic-moments";

/**
 * Original, poster-style wallpapers celebrating the most famous World Cup
 * moments of all time. These are NOT photographs - they are typographic
 * artwork generated on the fly (see /wallpapers/[slug]/[format]), so they are
 * fully original works and carry no third-party image rights. Every factual
 * detail (scoreline, venue, year) maps to a documented match in
 * `iconic-moments.ts`.
 */
export interface WallpaperTheme {
  from: string;
  to: string;
  accent: string;
  /** Text color that reads on the gradient. */
  ink: string;
}

export interface Wallpaper {
  slug: string;
  /** Links back to the long-form moment in iconic-moments.ts. */
  momentId: string;
  year: number;
  headline: string;
  match: string;
  venue: string;
  caption: string;
  theme: WallpaperTheme;
}

export const WALLPAPER_FORMATS = {
  thumb: { width: 640, height: 853, label: "Preview" },
  phone: { width: 1170, height: 2532, label: "Phone" },
  desktop: { width: 2560, height: 1440, label: "Laptop" },
} as const;

export type WallpaperFormat = keyof typeof WALLPAPER_FORMATS;

export function isWallpaperFormat(value: string): value is WallpaperFormat {
  return value in WALLPAPER_FORMATS;
}

export const WALLPAPERS: Wallpaper[] = [
  {
    slug: "hand-of-god",
    momentId: "classic-maradona-1986",
    year: 1986,
    headline: "Hand of God",
    match: "Argentina 2–1 England · Quarter-final",
    venue: "Estadio Azteca · Mexico City",
    caption: "Maradona's two goals in four minutes - the infamous and the immortal.",
    theme: { from: "#74ACDF", to: "#143C73", accent: "#F6B40E", ink: "#ffffff" },
  },
  {
    slug: "messi-2022",
    momentId: "classic-messi-2022",
    year: 2022,
    headline: "The Last Dance",
    match: "Argentina 3–3 France (4–2 pens) · Final",
    venue: "Lusail Stadium · Qatar",
    caption: "Lionel Messi completes football's greatest story at his fifth World Cup.",
    theme: { from: "#75AADB", to: "#0B2E6B", accent: "#F6B40E", ink: "#ffffff" },
  },
  {
    slug: "mbappe-2022",
    momentId: "classic-mbappe-2022-final",
    year: 2022,
    headline: "Mbappé's Hat-Trick",
    match: "Argentina 3–3 France (4–2 pens) · Final",
    venue: "Lusail Stadium · Qatar",
    caption: "Only the second man to score a World Cup final hat-trick - and still on the losing side.",
    theme: { from: "#1E3A8A", to: "#0A1633", accent: "#EF4135", ink: "#ffffff" },
  },
  {
    slug: "mineirazo",
    momentId: "classic-germany-7-1",
    year: 2014,
    headline: "Mineirazo",
    match: "Germany 7–1 Brazil · Semi-final",
    venue: "Estádio Mineirão · Belo Horizonte",
    caption: "The most shocking scoreline in World Cup history, on Brazilian soil.",
    theme: { from: "#1F2937", to: "#0B0F19", accent: "#FFCE00", ink: "#ffffff" },
  },
  {
    slug: "iniesta-2010",
    momentId: "classic-iniesta-2010",
    year: 2010,
    headline: "Iniesta's Moment",
    match: "Spain 1–0 Netherlands (a.e.t.) · Final",
    venue: "Soccer City · Johannesburg",
    caption: "A 116th-minute strike crowns Spain world champions for the first time.",
    theme: { from: "#C60B1E", to: "#5E0510", accent: "#FFC400", ink: "#ffffff" },
  },
  {
    slug: "the-headbutt",
    momentId: "classic-zidane-2006",
    year: 2006,
    headline: "The Headbutt",
    match: "Italy 1–1 France (5–3 pens) · Final",
    venue: "Olympiastadion · Berlin",
    caption: "Zidane's last act as a player - and Italy's fourth star on penalties.",
    theme: { from: "#1C2541", to: "#0B132B", accent: "#C8102E", ink: "#ffffff" },
  },
  {
    slug: "beautiful-brazil",
    momentId: "classic-pele-1970",
    year: 1970,
    headline: "Beautiful Brazil",
    match: "Brazil 4–1 Italy · Final",
    venue: "Estadio Azteca · Mexico City",
    caption: "Pelé, Jairzinho and Carlos Alberto - the benchmark for the beautiful game.",
    theme: { from: "#009C3B", to: "#024F20", accent: "#FFDF00", ink: "#ffffff" },
  },
  {
    slug: "hurst-hat-trick",
    momentId: "classic-hurst-1966",
    year: 1966,
    headline: "Hurst's Hat-Trick",
    match: "England 4–2 West Germany (a.e.t.) · Final",
    venue: "Wembley · London",
    caption: "The only hat-trick in a World Cup final - and 'was it over the line?'",
    theme: { from: "#1E3A8A", to: "#3B0D11", accent: "#ffffff", ink: "#ffffff" },
  },
  {
    slug: "gotze-winner",
    momentId: "classic-gotze-2014",
    year: 2014,
    headline: "Götze's Winner",
    match: "Germany 1–0 Argentina (a.e.t.) · Final",
    venue: "Maracanã · Rio de Janeiro",
    caption: "A 113th-minute volley wins Germany their fourth World Cup.",
    theme: { from: "#111827", to: "#000000", accent: "#D52B1E", ink: "#ffffff" },
  },
  {
    slug: "maracanazo",
    momentId: "classic-maracanazo-1950",
    year: 1950,
    headline: "Maracanazo",
    match: "Uruguay 2–1 Brazil · Deciding match",
    venue: "Maracanã · Rio de Janeiro",
    caption: "Ghiggia's late winner silences 200,000 - the ultimate World Cup shock.",
    theme: { from: "#4F9BE8", to: "#0E2C54", accent: "#FFCD00", ink: "#ffffff" },
  },
  {
    slug: "touch-of-genius",
    momentId: "classic-bergkamp-1998",
    year: 1998,
    headline: "Touch of Genius",
    match: "Netherlands 2–1 Argentina · Quarter-final",
    venue: "Stade Vélodrome · Marseille",
    caption: "Three touches, one immortal goal from Dennis Bergkamp.",
    theme: { from: "#FF6A00", to: "#7A3200", accent: "#21468B", ink: "#ffffff" },
  },
  {
    slug: "ronaldo-redemption",
    momentId: "classic-ronaldo-2002",
    year: 2002,
    headline: "R9's Redemption",
    match: "Brazil 2–0 Germany · Final",
    venue: "International Stadium · Yokohama",
    caption: "Four years after heartbreak, Ronaldo's two goals restore Brazil to the summit.",
    theme: { from: "#009C3B", to: "#013D19", accent: "#FFDF00", ink: "#ffffff" },
  },
  {
    slug: "baggios-miss",
    momentId: "classic-baggio-1994",
    year: 1994,
    headline: "Baggio's Miss",
    match: "Brazil 0–0 Italy (3–2 pens) · Final",
    venue: "Rose Bowl · Pasadena",
    caption: "The decisive penalty skied - football's most haunting image.",
    theme: { from: "#0C4DA2", to: "#072A5C", accent: "#ffffff", ink: "#ffffff" },
  },
  {
    slug: "croatia-fairytale",
    momentId: "classic-croatia-2018",
    year: 2018,
    headline: "Croatia's Fairytale",
    match: "Croatia reach the Final · Russia 2018",
    venue: "Luzhniki Stadium · Moscow",
    caption: "A nation of four million plays three extra-times to reach the final.",
    theme: { from: "#C8102E", to: "#5C0915", accent: "#ffffff", ink: "#ffffff" },
  },
  {
    slug: "the-save",
    momentId: "classic-suarez-2010",
    year: 2010,
    headline: "The Save",
    match: "Uruguay 1–1 Ghana (4–2 pens) · Quarter-final",
    venue: "Soccer City · Johannesburg",
    caption: "Suárez's handball on the line - and Gyan's penalty off the bar.",
    theme: { from: "#2A3F6B", to: "#0E1830", accent: "#5CA8E8", ink: "#ffffff" },
  },
  {
    slug: "africas-world-cup",
    momentId: "classic-mandela-2010",
    year: 2010,
    headline: "Africa's World Cup",
    match: "Africa's first World Cup · South Africa 2010",
    venue: "Soccer City · Johannesburg",
    caption: "Vuvuzelas, Tshabalala's opener and Mandela's dream realised.",
    theme: { from: "#007A4D", to: "#00251A", accent: "#FFB81C", ink: "#ffffff" },
  },
  {
    slug: "goal-of-the-century",
    momentId: "classic-maradona-1986",
    year: 1986,
    headline: "Goal of the Century",
    match: "Argentina 2–1 England · Quarter-final",
    venue: "Estadio Azteca · Mexico City",
    caption: "Maradona slaloms past five England players from the halfway line.",
    theme: { from: "#58A6E0", to: "#0E3C73", accent: "#ffffff", ink: "#ffffff" },
  },
  {
    slug: "total-football",
    momentId: "classic-maracanazo-1950",
    year: 1974,
    headline: "Total Football",
    match: "Netherlands reach the Final · West Germany '74",
    venue: "Olympiastadion · Munich",
    caption: "Cruyff's Holland redefine the game with fluid, position-less football.",
    theme: { from: "#FF6A00", to: "#7A3200", accent: "#0B2E6B", ink: "#ffffff" },
  },
  {
    slug: "millas-dance",
    momentId: "classic-maracanazo-1950",
    year: 1990,
    headline: "Milla's Dance",
    match: "Cameroon reach the Quarter-finals · Italia '90",
    venue: "Italy 1990",
    caption: "Roger Milla's corner-flag dance lights up the first African World Cup run.",
    theme: { from: "#1B8A3A", to: "#0A4019", accent: "#FCD116", ink: "#ffffff" },
  },
  {
    slug: "miracle-of-bern",
    momentId: "classic-maracanazo-1950",
    year: 1954,
    headline: "Miracle of Bern",
    match: "West Germany 3–2 Hungary · Final",
    venue: "Wankdorf Stadium · Bern",
    caption: "West Germany stun the unbeatable Mighty Magyars to win their first title.",
    theme: { from: "#1F2937", to: "#0B0F19", accent: "#FFCE00", ink: "#ffffff" },
  },
  {
    slug: "zidane-1998",
    momentId: "classic-zidane-2006",
    year: 1998,
    headline: "Zidane's Final",
    match: "France 3–0 Brazil · Final",
    venue: "Stade de France · Saint-Denis",
    caption: "Two Zidane headers crown France world champions on home soil.",
    theme: { from: "#21407F", to: "#0A1633", accent: "#EF4135", ink: "#ffffff" },
  },
  {
    slug: "van-persie-2014",
    momentId: "classic-germany-7-1",
    year: 2014,
    headline: "The Flying Dutchman",
    match: "Netherlands 5–1 Spain · Group stage",
    venue: "Arena Fonte Nova · Salvador",
    caption: "Robin van Persie's diving header sparks a thrashing of the champions.",
    theme: { from: "#FF7A1A", to: "#7A3300", accent: "#21468B", ink: "#ffffff" },
  },
  {
    slug: "james-2014",
    momentId: "classic-germany-7-1",
    year: 2014,
    headline: "James' Volley",
    match: "Colombia 2–0 Uruguay · Round of 16",
    venue: "Maracanã · Rio de Janeiro",
    caption: "James Rodríguez's chest-and-volley wins the tournament's best goal.",
    theme: { from: "#FCD116", to: "#8A6D00", accent: "#003893", ink: "#ffffff" },
  },
  {
    slug: "ronaldinho-2002",
    momentId: "classic-ronaldo-2002",
    year: 2002,
    headline: "Ronaldinho's Lob",
    match: "Brazil 2–1 England · Quarter-final",
    venue: "Shizuoka Stadium · Japan",
    caption: "A 40-yard free-kick floats over David Seaman and into legend.",
    theme: { from: "#009C3B", to: "#013D19", accent: "#FFDF00", ink: "#ffffff" },
  },
  {
    slug: "klose-record",
    momentId: "classic-germany-7-1",
    year: 2014,
    headline: "Klose's 16",
    match: "World Cup all-time top scorer",
    venue: "16 goals · 2002–2014",
    caption: "Miroslav Klose overtakes Ronaldo as the World Cup's greatest goalscorer.",
    theme: { from: "#1F2937", to: "#0B0F19", accent: "#FFCE00", ink: "#ffffff" },
  },
  {
    slug: "fontaine-1958",
    momentId: "classic-maracanazo-1950",
    year: 1958,
    headline: "Fontaine's 13",
    match: "Most goals in a single World Cup",
    venue: "Sweden 1958",
    caption: "Just Fontaine's 13 goals in one tournament - a record that still stands.",
    theme: { from: "#0C4DA2", to: "#08306B", accent: "#EF4135", ink: "#ffffff" },
  },
  {
    slug: "eusebio-1966",
    momentId: "classic-hurst-1966",
    year: 1966,
    headline: "Eusébio's Comeback",
    match: "Portugal 5–3 North Korea · Quarter-final",
    venue: "Goodison Park · Liverpool",
    caption: "Eusébio scores four to drag Portugal back from 0–3 down.",
    theme: { from: "#007A33", to: "#5C0915", accent: "#FFD24D", ink: "#ffffff" },
  },
  {
    slug: "rossi-1982",
    momentId: "classic-maracanazo-1950",
    year: 1982,
    headline: "Rossi's Hat-Trick",
    match: "Italy 3–2 Brazil · Second group stage",
    venue: "Estadio Sarriá · Barcelona",
    caption: "Paolo Rossi knocks out the favourites and fires Italy to the title.",
    theme: { from: "#0C4DA2", to: "#08306B", accent: "#ffffff", ink: "#ffffff" },
  },
  {
    slug: "gazzas-tears",
    momentId: "classic-croatia-2018",
    year: 1990,
    headline: "Gazza's Tears",
    match: "England 1–1 West Germany (3–4 pens) · Semi-final",
    venue: "Stadio delle Alpi · Turin",
    caption: "Paul Gascoigne weeps as a booking threatens to cost him the final.",
    theme: { from: "#1E3A8A", to: "#3B0D11", accent: "#C8102E", ink: "#ffffff" },
  },
  {
    slug: "senegal-2002",
    momentId: "classic-ronaldo-2002",
    year: 2002,
    headline: "Senegal Shock France",
    match: "Senegal 1–0 France · Opening match",
    venue: "Seoul World Cup Stadium",
    caption: "World Cup debutants Senegal stun the reigning champions on day one.",
    theme: { from: "#007A4D", to: "#00251A", accent: "#FCD116", ink: "#ffffff" },
  },
];

export function getWallpaper(slug: string): Wallpaper | undefined {
  return WALLPAPERS.find((w) => w.slug === slug);
}

/**
 * Real-photo "moments" sourced from the editorial iconic-moments dataset.
 * These are third-party photographs shown for viewing with attribution - they
 * are NOT re-hosted as free downloads. Credit + a link to the source are always
 * surfaced so users can view the original.
 */
export interface PhotoWallpaper {
  id: string;
  title: string;
  teams: string;
  year: number;
  imageUrl: string;
  imageAlt: string;
  description: string;
  creditLabel: string;
  creditHref: string;
  /** High-resolution source used by the on-domain download proxy. */
  downloadUrl: string;
}

/**
 * Bump a Wikimedia Commons thumbnail to a higher resolution for HD downloads.
 * `.../1280px-File.jpg` -> `.../2200px-File.jpg`. Non-thumb originals are
 * returned unchanged (already full resolution).
 */
export function toHiResWikimedia(url: string): string {
  return url.replace(/\/\d{2,4}px-/, "/2200px-");
}

export function getPhotoWallpapers(): PhotoWallpaper[] {
  // Only Wikimedia Commons media (intended for reuse with attribution) is
  // offered as a download; all-rights-reserved sources are excluded.
  return getClassicMoments()
    .filter((m) => m.imageUrl.includes("wikimedia.org"))
    .map((m) => ({
      id: m.id,
      title: m.title,
      teams: m.teams,
      year: m.year,
      imageUrl: m.imageUrl,
      imageAlt: m.imageAlt,
      description: m.description,
      creditLabel: "Wikimedia Commons",
      creditHref: m.imageUrl,
      downloadUrl: toHiResWikimedia(m.imageUrl),
    }));
}

export function getPhotoWallpaper(id: string): PhotoWallpaper | undefined {
  return getPhotoWallpapers().find((p) => p.id === id);
}
