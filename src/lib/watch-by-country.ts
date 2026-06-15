import type { BroadcastInfo } from "./types";

export interface WatchBroadcaster {
  name: string;
  type: "TV" | "Streaming";
  url: string;
  language?: string;
}

export interface WatchCountry {
  id: string;
  name: string;
  flag: string;
  broadcasters: WatchBroadcaster[];
  rightsNote?: string;
}

/**
 * Official / rights-holder URLs for World Cup 2026.
 * Sourced from FIFA host-market announcements, FIFA broadcast partner listings,
 * and territory rights reports (June 2026). Verify locally before kickoff.
 */
const NETWORK_URLS: Record<string, string> = {
  FOX: "https://www.foxsports.com/live",
  Fox: "https://www.foxsports.com/live",
  "Fox Sports": "https://www.foxsports.com/live",
  "FOX Sports": "https://www.foxsports.com/live",
  FS1: "https://www.foxsports.com/live/fs1",
  Telemundo: "https://www.telemundo.com/deportes",
  "Telemundo Deportes": "https://www.telemundo.com/deportes",
  Universo: "https://www.telemundo.com/universo",
  Peacock: "https://www.peacocktv.com/sports/world-cup",
  BBC: "https://www.bbc.co.uk/sport/football/world-cup",
  "BBC One": "https://www.bbc.co.uk/sport/football/world-cup",
  ITV: "https://www.itv.com/watch/sport",
  ITV1: "https://www.itv.com/watch/sport",
  CTV: "https://www.ctv.ca/shows/fifa-world-cup",
  TSN: "https://www.tsn.ca/soccer/fifa-world-cup",
  RDS: "https://www.rds.ca/soccer/coupe-du-monde",
  Televisa: "https://www.lasestrellas.tv/",
  "Las Estrellas": "https://www.lasestrellas.tv/",
  "TV Azteca": "https://www.tvazteca.com/aztecadeportes",
  TUDN: "https://www.tudn.com/futbol/mundial",
  ViX: "https://vix.com/es-es/deportes",
  "beIN Sports": "https://www.beinsports.com/",
  "beIN SPORTS": "https://www.beinsports.com/",
  TOD: "https://www.tod.tv/",
  ARD: "https://www.sportschau.de/fussball/wm/",
  ZDF: "https://www.zdf.de/sport/fussball-wm",
  MagentaTV: "https://www.magentatv.de/sport/fussball-wm-2026",
  "Magenta Sport": "https://www.magentatv.de/sport/fussball-wm-2026",
  M6: "https://www.6play.fr/m6",
  "M6+": "https://www.6play.fr/m6",
  SBS: "https://www.sbs.com.au/ondemand/sport",
  "SBS On Demand": "https://www.sbs.com.au/ondemand/sport",
  ZEE5: "https://www.zee5.com/",
  "Unite8 Sports": "https://unite8sports.in/",
  "DD Sports": "https://www.ddsports.gov.in/",
  Globo: "https://ge.globo.com/futebol/copa-do-mundo/",
  CazéTV: "https://www.youtube.com/@CazeTV",
  SBT: "https://www.sbt.com.br/esportes",
  RTVE: "https://www.rtve.es/deportes/mundial-futbol/",
  DAZN: "https://www.dazn.com/",
  "TyC Sports": "https://play.tycsports.com/",
  Telefe: "https://telefe.com/",
  JTBC: "https://worldcup.jtbc.co.kr/",
  "NAVER Sports": "https://sports.news.naver.com/wfootball/worldcup/index",
  CHZZK: "https://chzzk.naver.com/",
  NHK: "https://www3.nhk.or.jp/nhkworld/en/sports/",
  "Nippon TV": "https://www.ntv.co.jp/worldcup2026/",
  "Fuji TV": "https://www.fujitv.co.jp/sports/",
  SuperSport: "https://www.supersport.com/football/fifa-world-cup",
  SABC: "https://www.sabc.co.za/sabc/sport/",
  RAI: "https://www.raiplay.it/dirette/raisport",
  NOS: "https://nossport.nl/wk",
  "Sport TV": "https://www.sporttv.pt/",
  LiveMode: "https://livemode.com/",
};

export const WATCH_COUNTRIES: WatchCountry[] = [
  {
    id: "usa",
    name: "United States",
    flag: "🇺🇸",
    broadcasters: [
      { name: "FOX / FS1", type: "TV", url: NETWORK_URLS.FOX, language: "English" },
      { name: "Telemundo / Universo", type: "TV", url: NETWORK_URLS.Telemundo, language: "Spanish" },
      { name: "Peacock", type: "Streaming", url: NETWORK_URLS.Peacock, language: "Spanish" },
    ],
    rightsNote:
      "FOX Sports holds English-language rights; Telemundo holds Spanish-language rights. Peacock streams Telemundo/Universo coverage.",
  },
  {
    id: "mexico",
    name: "Mexico",
    flag: "🇲🇽",
    broadcasters: [
      { name: "Televisa (Las Estrellas)", type: "TV", url: NETWORK_URLS.Televisa },
      { name: "TUDN", type: "TV", url: NETWORK_URLS.TUDN },
      { name: "TV Azteca", type: "TV", url: NETWORK_URLS["TV Azteca"] },
      { name: "ViX", type: "Streaming", url: NETWORK_URLS.ViX, language: "Spanish" },
    ],
    rightsNote: "TelevisaUnivision and TV Azteca share Mexican rights; ViX carries TUDN streaming.",
  },
  {
    id: "canada",
    name: "Canada",
    flag: "🇨🇦",
    broadcasters: [
      { name: "CTV", type: "TV", url: NETWORK_URLS.CTV, language: "English" },
      { name: "TSN", type: "TV", url: NETWORK_URLS.TSN, language: "English" },
      { name: "RDS", type: "TV", url: NETWORK_URLS.RDS, language: "French" },
    ],
    rightsNote: "Bell Media (CTV, TSN, RDS) holds Canadian broadcast rights.",
  },
  {
    id: "uk",
    name: "United Kingdom",
    flag: "🇬🇧",
    broadcasters: [
      { name: "BBC", type: "TV", url: NETWORK_URLS.BBC },
      { name: "ITV", type: "TV", url: NETWORK_URLS.ITV },
    ],
    rightsNote: "BBC and ITV share UK rights — each broadcasts a selection of matches free-to-air.",
  },
  {
    id: "india",
    name: "India",
    flag: "🇮🇳",
    broadcasters: [
      { name: "ZEE5", type: "Streaming", url: NETWORK_URLS.ZEE5, language: "Hindi / English" },
      { name: "Unite8 Sports", type: "TV", url: NETWORK_URLS["Unite8 Sports"], language: "Hindi / English" },
      { name: "DD Sports", type: "TV", url: NETWORK_URLS["DD Sports"], language: "Free (select matches)" },
    ],
    rightsNote:
      "Zee holds exclusive India rights (2026–2034). All 104 matches stream on ZEE5; Unite8 Sports 1 & 2 carry the TV feed. DD Sports airs select matches free-to-air (e.g. opening match, knockouts).",
  },
  {
    id: "australia",
    name: "Australia",
    flag: "🇦🇺",
    broadcasters: [
      { name: "SBS", type: "TV", url: NETWORK_URLS.SBS },
      { name: "SBS On Demand", type: "Streaming", url: NETWORK_URLS["SBS On Demand"] },
    ],
    rightsNote: "SBS holds exclusive rights — all 104 matches live and free on TV and SBS On Demand.",
  },
  {
    id: "germany",
    name: "Germany",
    flag: "🇩🇪",
    broadcasters: [
      { name: "ARD", type: "TV", url: NETWORK_URLS.ARD },
      { name: "ZDF", type: "TV", url: NETWORK_URLS.ZDF },
      { name: "MagentaTV", type: "Streaming", url: NETWORK_URLS.MagentaTV },
    ],
    rightsNote:
      "Deutsche Telekom (MagentaTV) holds all 104 matches. ARD and ZDF sublicense selected games free-to-air, including Germany fixtures and the final.",
  },
  {
    id: "france",
    name: "France",
    flag: "🇫🇷",
    broadcasters: [
      { name: "M6 / W9", type: "TV", url: NETWORK_URLS.M6 },
      { name: "M6+", type: "Streaming", url: NETWORK_URLS["M6+"] },
      { name: "beIN Sports", type: "TV", url: "https://www.beinsports.com/france/" },
    ],
    rightsNote:
      "M6 is the free-to-air broadcaster (54 matches, including France games and the final). beIN Sports shows all 104 matches.",
  },
  {
    id: "spain",
    name: "Spain",
    flag: "🇪🇸",
    broadcasters: [
      { name: "RTVE", type: "TV", url: NETWORK_URLS.RTVE },
      { name: "DAZN", type: "Streaming", url: "https://www.dazn.com/es-ES/competition/Competition:1c3z0u01x9kng014jksnv64m1k" },
    ],
    rightsNote: "RTVE carries selected free-to-air matches; DAZN (Mediapro) holds broader tournament rights.",
  },
  {
    id: "brazil",
    name: "Brazil",
    flag: "🇧🇷",
    broadcasters: [
      { name: "Globo", type: "TV", url: NETWORK_URLS.Globo },
      { name: "CazéTV", type: "Streaming", url: NETWORK_URLS.CazéTV },
      { name: "SBT", type: "TV", url: NETWORK_URLS.SBT },
    ],
    rightsNote: "Grupo Globo leads coverage; CazéTV and SBT also hold FIFA rights in Brazil.",
  },
  {
    id: "argentina",
    name: "Argentina",
    flag: "🇦🇷",
    broadcasters: [
      { name: "TV Pública", type: "TV", url: "https://www.tvpublica.com.ar/" },
      { name: "Telefe", type: "TV", url: NETWORK_URLS.Telefe },
      { name: "TyC Sports", type: "TV", url: NETWORK_URLS["TyC Sports"] },
    ],
    rightsNote: "TyC Sports and Telefe/TV Pública share Argentine rights.",
  },
  {
    id: "japan",
    name: "Japan",
    flag: "🇯🇵",
    broadcasters: [
      { name: "DAZN Japan", type: "Streaming", url: "https://www.dazn.com/ja-JP/competition/Competition:1c3z0u01x9kng014jksnv64m1k" },
      { name: "NHK", type: "TV", url: NETWORK_URLS.NHK },
      { name: "Fuji TV", type: "TV", url: NETWORK_URLS["Fuji TV"] },
      { name: "Nippon TV", type: "TV", url: NETWORK_URLS["Nippon TV"] },
    ],
    rightsNote: "Rights split across DAZN, NHK, Nippon TV, and Fuji TV.",
  },
  {
    id: "south-korea",
    name: "South Korea",
    flag: "🇰🇷",
    broadcasters: [
      { name: "JTBC", type: "TV", url: NETWORK_URLS.JTBC },
      { name: "NAVER Sports", type: "Streaming", url: NETWORK_URLS["NAVER Sports"] },
      { name: "CHZZK", type: "Streaming", url: NETWORK_URLS.CHZZK },
    ],
    rightsNote: "JTBC is the primary TV broadcaster; NAVER Sports and CHZZK provide digital coverage.",
  },
  {
    id: "saudi-arabia",
    name: "Saudi Arabia",
    flag: "🇸🇦",
    broadcasters: [
      { name: "beIN Sports", type: "TV", url: "https://www.beinsports.com/ar-mena/" },
      { name: "TOD", type: "Streaming", url: NETWORK_URLS.TOD },
    ],
    rightsNote: "beIN Sports holds MENA rights; TOD is the official streaming platform.",
  },
  {
    id: "uae",
    name: "UAE & MENA",
    flag: "🇦🇪",
    broadcasters: [
      { name: "beIN Sports", type: "TV", url: "https://www.beinsports.com/ar-mena/" },
      { name: "TOD", type: "Streaming", url: NETWORK_URLS.TOD },
    ],
    rightsNote: "beIN Sports is the pan-MENA rights holder; stream via TOD.",
  },
  {
    id: "south-africa",
    name: "South Africa",
    flag: "🇿🇦",
    broadcasters: [
      { name: "SABC", type: "TV", url: NETWORK_URLS.SABC },
      { name: "SuperSport", type: "TV", url: NETWORK_URLS.SuperSport },
    ],
    rightsNote: "SABC and SuperSport share South African coverage.",
  },
  {
    id: "nigeria",
    name: "Nigeria",
    flag: "🇳🇬",
    broadcasters: [
      { name: "SuperSport", type: "TV", url: NETWORK_URLS.SuperSport },
      { name: "New World TV", type: "TV", url: "https://www.newworldtv.com/" },
    ],
    rightsNote: "SuperSport and New World TV hold sub-Saharan Africa rights packages.",
  },
  {
    id: "italy",
    name: "Italy",
    flag: "🇮🇹",
    broadcasters: [
      { name: "RAI", type: "TV", url: NETWORK_URLS.RAI },
      { name: "DAZN Italy", type: "Streaming", url: "https://www.dazn.com/it-IT/competition/Competition:1c3z0u01x9kng014jksnv64m1k" },
    ],
    rightsNote: "RAI shows selected matches free-to-air; DAZN holds premium tournament rights.",
  },
  {
    id: "netherlands",
    name: "Netherlands",
    flag: "🇳🇱",
    broadcasters: [
      { name: "NOS", type: "TV", url: NETWORK_URLS.NOS },
    ],
    rightsNote: "NOS is the official Dutch broadcaster for World Cup 2026.",
  },
  {
    id: "portugal",
    name: "Portugal",
    flag: "🇵🇹",
    broadcasters: [
      { name: "Sport TV", type: "TV", url: NETWORK_URLS["Sport TV"] },
      { name: "LiveMode", type: "Streaming", url: NETWORK_URLS.LiveMode },
    ],
    rightsNote: "Sport TV and LiveMode hold Portuguese rights.",
  },
];

export function getWatchCountry(id: string): WatchCountry | undefined {
  return WATCH_COUNTRIES.find((c) => c.id === id.toLowerCase());
}

export function getAllWatchCountryIds(): string[] {
  return WATCH_COUNTRIES.map((c) => c.id);
}

export function resolveNetworkUrl(network: string): string | undefined {
  if (NETWORK_URLS[network]) return NETWORK_URLS[network];

  const lower = network.toLowerCase();
  for (const [key, url] of Object.entries(NETWORK_URLS)) {
    if (key.toLowerCase() === lower) return url;
  }

  for (const [key, url] of Object.entries(NETWORK_URLS)) {
    if (lower.includes(key.toLowerCase()) || key.toLowerCase().includes(lower)) {
      return url;
    }
  }

  return undefined;
}

export function espnBroadcastToWatchBroadcaster(b: BroadcastInfo): WatchBroadcaster {
  const url =
    resolveNetworkUrl(b.network) ??
    `https://www.google.com/search?q=${encodeURIComponent(`${b.network} World Cup 2026 watch`)}`;
  const isStreaming = /peacock|stream|app|ott|plus|cinema|dazn|optus|abema|viaplay|zee5|m6\+|magenta|tod|vix|chzzk|naver/i.test(
    b.network
  );
  return {
    name: b.network,
    type: isStreaming || b.type?.toLowerCase().includes("stream") ? "Streaming" : "TV",
    url,
  };
}

/**
 * Broadcast options for a match in a given country.
 * USA merges live ESPN per-match listings when available.
 */
export function getMatchBroadcastsForCountry(
  countryId: string,
  espnBroadcasts: BroadcastInfo[] = []
): WatchBroadcaster[] {
  const country = getWatchCountry(countryId);
  if (!country) return [];

  if (countryId === "usa" && espnBroadcasts.length > 0) {
    return espnBroadcasts.map(espnBroadcastToWatchBroadcaster);
  }

  return country.broadcasters;
}

/** Map IANA timezone prefixes to a default watch country */
export function guessWatchCountryFromTimezone(timeZone: string): string {
  if (
    timeZone.startsWith("America/New_York") ||
    timeZone.startsWith("America/Chicago") ||
    timeZone.startsWith("America/Denver") ||
    timeZone.startsWith("America/Los_Angeles") ||
    timeZone.startsWith("America/Phoenix") ||
    timeZone.startsWith("US/")
  ) {
    return "usa";
  }
  if (timeZone.startsWith("America/Mexico")) return "mexico";
  if (
    timeZone.startsWith("America/Toronto") ||
    timeZone.startsWith("America/Vancouver") ||
    timeZone.startsWith("America/Edmonton") ||
    timeZone.startsWith("America/Winnipeg")
  ) {
    return "canada";
  }
  if (timeZone.startsWith("Europe/London")) return "uk";
  if (timeZone.startsWith("Asia/Kolkata") || timeZone.startsWith("Asia/Calcutta")) return "india";
  if (timeZone.startsWith("Australia/")) return "australia";
  if (timeZone.startsWith("Europe/Berlin")) return "germany";
  if (timeZone.startsWith("Europe/Paris")) return "france";
  if (timeZone.startsWith("Europe/Madrid")) return "spain";
  if (timeZone.startsWith("America/Sao_Paulo")) return "brazil";
  if (timeZone.startsWith("America/Buenos_Aires")) return "argentina";
  if (timeZone.startsWith("Asia/Tokyo")) return "japan";
  if (timeZone.startsWith("Asia/Seoul")) return "south-korea";
  if (timeZone.startsWith("Asia/Dubai") || timeZone.startsWith("Asia/Riyadh")) return "uae";
  if (timeZone.startsWith("Africa/Johannesburg")) return "south-africa";
  if (timeZone.startsWith("Africa/Lagos")) return "nigeria";
  if (timeZone.startsWith("Europe/Rome")) return "italy";
  if (timeZone.startsWith("Europe/Amsterdam")) return "netherlands";
  if (timeZone.startsWith("Europe/Lisbon")) return "portugal";
  return "usa";
}
