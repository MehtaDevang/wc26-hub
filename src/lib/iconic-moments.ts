export type IconicMomentCategory =
  | "goal"
  | "shock"
  | "triumph"
  | "controversy"
  | "stadium"
  | "player";

export interface IconicMoment {
  id: string;
  year: number;
  title: string;
  description: string;
  category: IconicMomentCategory;
  teams: string;
  imageUrl: string;
  imageAlt: string;
  era: "wc26" | "classic";
}

/** Curated iconic World Cup moments — ESPN CDN images verified from live API responses. */
export const ICONIC_MOMENTS: IconicMoment[] = [
  {
    id: "wc26-mexico-opener",
    year: 2026,
    title: "Mexico roars on opening night at the Azteca",
    description:
      "El Tri beat South Africa 2-0 in the first match of World Cup 2026, with Julián Quiñones and Raúl Jiménez scoring as Estadio Azteca erupted.",
    category: "stadium",
    teams: "MEX 2-0 RSA",
    imageUrl:
      "https://a.espncdn.com/photo/2026/0611/r1671535_1296x729_16-9.jpg",
    imageAlt: "Mexico celebrate at Estadio Azteca on World Cup 2026 opening night",
    era: "wc26",
  },
  {
    id: "wc26-mexico-fans-goal",
    year: 2026,
    title: "Fans celebrate the first goal of World Cup 2026",
    description:
      "Mexico supporters erupt as the tournament's opening goal lights up the Azteca — the first of 104 matches across North America.",
    category: "triumph",
    teams: "Mexico vs South Africa",
    imageUrl:
      "https://a.espncdn.com/media/motion/2026/0611/dm_260611_COM_SOC_News_Mexico_fans_celebrate_opening_goal_of_the_2026_FIFA_World_Cup_20260611_GLOBAL/dm_260611_COM_SOC_News_Mexico_fans_celebrate_opening_goal_of_the_2026_FIFA_World_Cup_20260611_GLOBAL.jpg",
    imageAlt: "Mexico fans celebrate the opening goal of FIFA World Cup 2026",
    era: "wc26",
  },
  {
    id: "wc26-irankunda",
    year: 2026,
    title: "Irankunda announces himself on the world stage",
    description:
      "Teenager Nestory Irankunda scored as Australia beat Türkiye — a star is born in the Socceroos' World Cup campaign.",
    category: "player",
    teams: "AUS 2-0 TUR",
    imageUrl: "https://a.espncdn.com/photo/2026/0614/r1672812_1296x729_16-9.jpg",
    imageAlt: "Nestory Irankunda celebrates for Australia at World Cup 2026",
    era: "wc26",
  },
  {
    id: "wc26-usa-paraguay",
    year: 2026,
    title: "USA open their campaign in front of a home crowd",
    description:
      "The USMNT delivered a statement win over Paraguay to kick off their World Cup on home soil.",
    category: "triumph",
    teams: "USA vs Paraguay",
    imageUrl: "https://a.espncdn.com/photo/2026/0613/r1672570_1296x729_16-9.jpg",
    imageAlt: "USA celebrate at FIFA World Cup 2026",
    era: "wc26",
  },
  {
    id: "wc26-stadiums",
    year: 2026,
    title: "16 stadiums across Mexico, USA & Canada",
    description:
      "From the Azteca to SoFi, MetLife to BC Place — the first 48-team World Cup spans three nations and iconic venues.",
    category: "stadium",
    teams: "🇲🇽 🇺🇸 🇨🇦",
    imageUrl: "https://a.espncdn.com/photo/2025/1204/r1584809_2_1296x729_16-9.jpg",
    imageAlt: "FIFA World Cup 2026 stadiums across North America",
    era: "wc26",
  },
  {
    id: "classic-messi-2022",
    year: 2022,
    title: "Messi finally lifts the World Cup",
    description:
      "After a fairytale final against France, Lionel Messi completed football's greatest story in Qatar.",
    category: "triumph",
    teams: "ARG 3-3 (4-2) FRA",
    imageUrl: "https://a.espncdn.com/photo/2022/1218/r1108357_1296x729_16-9.jpg",
    imageAlt: "Lionel Messi lifts the FIFA World Cup trophy in 2022",
    era: "classic",
  },
  {
    id: "classic-germany-7-1",
    year: 2014,
    title: "Germany dismantle Brazil 7-1 in Belo Horizonte",
    description:
      "The Mineirão witnessed the most shocking scoreline in World Cup history as Germany stunned the hosts in the semi-final.",
    category: "shock",
    teams: "GER 7-1 BRA",
    imageUrl: "https://a.espncdn.com/photo/2026/0612/r1671909_1296x729_16-9.jpg",
    imageAlt: "World Cup stars Yamal and Mbappé — modern giants built on iconic shocks",
    era: "classic",
  },
  {
    id: "classic-iniesta-2010",
    year: 2010,
    title: "Iniesta breaks Dutch hearts in extra time",
    description:
      "Andrés Iniesta's 116th-minute strike gave Spain their first World Cup title in Johannesburg.",
    category: "goal",
    teams: "ESP 1-0 NED",
    imageUrl: "https://a.espncdn.com/photo/2026/0614/r1672876_1296x729_16-9.jpg",
    imageAlt: "World Cup drama — a late winner decides everything",
    era: "classic",
  },
  {
    id: "classic-zidane-2006",
    year: 2006,
    title: "Zidane's headbutt in the Berlin final",
    description:
      "France's captain was sent off in his last ever match for headbutting Marco Materazzi — Italy won on penalties.",
    category: "controversy",
    teams: "ITA 1-1 (5-3) FRA",
    imageUrl: "https://a.espncdn.com/photo/2026/0614/r1672773_1296x729_16-9.jpg",
    imageAlt: "World Cup final drama under the global spotlight",
    era: "classic",
  },
  {
    id: "classic-maradona-1986",
    year: 1986,
    title: "Maradona's Hand of God & Goal of the Century",
    description:
      "In 45 minutes against England, Diego Maradona scored the most infamous and the most brilliant goals ever seen.",
    category: "goal",
    teams: "ARG 2-1 ENG",
    imageUrl: "https://a.espncdn.com/photo/2026/0614/r1672862_1296x729_16-9.jpg",
    imageAlt: "Argentina's World Cup legacy — from Maradona to Messi",
    era: "classic",
  },
  {
    id: "classic-pele-1970",
    year: 1970,
    title: "Pelé's Brazil — the greatest team ever",
    description:
      "Brazil's 4-1 dismantling of Italy in the Azteca final remains the benchmark for beautiful World Cup football.",
    category: "triumph",
    teams: "BRA 4-1 ITA",
    imageUrl: "https://a.espncdn.com/photo/2026/0611/r1671535_1296x729_16-9.jpg",
    imageAlt: "Estadio Azteca — stage of World Cup legends since 1970",
    era: "classic",
  },
  {
    id: "classic-hurst-1966",
    year: 1966,
    title: "Geoff Hurst's hat-trick wins it for England",
    description:
      "The only World Cup final hat-trick in history — and the debate over 'Was it over the line?' lives on.",
    category: "goal",
    teams: "ENG 4-2 FRG",
    imageUrl: "https://a.espncdn.com/photo/2026/0614/r1672874_594x334_16-9.jpg",
    imageAlt: "England at the World Cup — Wembley dreams and dramatic finales",
    era: "classic",
  },
];

export const CATEGORY_LABELS: Record<IconicMomentCategory, string> = {
  goal: "Iconic Goal",
  shock: "Shock Result",
  triumph: "Triumph",
  controversy: "Controversy",
  stadium: "Stadium",
  player: "Star Player",
};

export function getIconicMoments(limit?: number): IconicMoment[] {
  return limit ? ICONIC_MOMENTS.slice(0, limit) : ICONIC_MOMENTS;
}

export function getWc26Moments(): IconicMoment[] {
  return ICONIC_MOMENTS.filter((m) => m.era === "wc26");
}

export function getClassicMoments(): IconicMoment[] {
  return ICONIC_MOMENTS.filter((m) => m.era === "classic");
}
