const ESPN_BASE = "https://site.api.espn.com/apis/site/v2/sports/soccer/fifa.world";

export async function fetchEspnScoreboard(options?: {
  dates?: string;
}): Promise<EspnScoreboard> {
  const params = new URLSearchParams();
  if (options?.dates) params.set("dates", options.dates);

  const url = `${ESPN_BASE}/scoreboard${params.toString() ? `?${params}` : ""}`;
  const res = await fetch(url, {
    next: { revalidate: 60 },
    signal: AbortSignal.timeout(8_000),
  });
  if (!res.ok) throw new Error(`ESPN scoreboard failed: ${res.status}`);
  return res.json();
}

export async function fetchEspnSummary(eventId: string): Promise<EspnSummary> {
  const url = `${ESPN_BASE}/summary?event=${eventId}`;
  const res = await fetch(url, {
    next: { revalidate: 30 },
    signal: AbortSignal.timeout(8_000),
  });
  if (!res.ok) throw new Error(`ESPN summary failed: ${res.status}`);
  return res.json();
}

export function todayEspnDate(): string {
  const d = new Date();
  return d.toISOString().slice(0, 10).replace(/-/g, "");
}

export function formatEspnDate(date: Date): string {
  return date.toISOString().slice(0, 10).replace(/-/g, "");
}

// Minimal ESPN types
export interface EspnScoreboard {
  events?: EspnEvent[];
  day?: { date: string };
}

export interface EspnEvent {
  id: string;
  date: string;
  name: string;
  competitions: EspnCompetition[];
}

export interface EspnCompetition {
  id: string;
  date: string;
  attendance?: number;
  status: {
    clock?: number;
    displayClock?: string;
    type: {
      id: string;
      name: string;
      state: string;
      completed: boolean;
      description: string;
      detail?: string;
      shortDetail?: string;
    };
  };
  venue?: {
    id?: string;
    fullName?: string;
    shortName?: string;
    address?: { city?: string; country?: string; state?: string };
    capacity?: number;
    images?: Array<{ url?: string; href?: string }>;
  };
  altGameNote?: string;
  competitors: EspnCompetitor[];
}

export interface EspnCompetitor {
  id: string;
  homeAway: "home" | "away";
  score?: string;
  winner?: boolean;
  record?: Array<{ type: string; summary: string; displayValue?: string }>;
  groups?: { abbreviation?: string };
  team: {
    id: string;
    abbreviation: string;
    displayName: string;
    shortDisplayName?: string;
    logo?: string;
  };
}

export interface EspnSummary {
  header?: {
    competitions?: Array<{
      competitors: EspnCompetitor[];
      status: EspnCompetition["status"];
      venue?: EspnCompetition["venue"];
      attendance?: number;
      notes?: Array<{ type: string; headline: string }>;
      broadcasts?: EspnBroadcast[];
    }>;
  };
  gameInfo?: {
    venue?: EspnCompetition["venue"];
    attendance?: number;
    officials?: Array<{ displayName: string; position?: { displayName: string } }>;
  };
  boxscore?: {
    teams?: Array<{
      team: { abbreviation: string; displayName: string };
      statistics: Array<{ name: string; displayValue: string }>;
      homeAway?: string;
    }>;
  };
  keyEvents?: EspnKeyEvent[];
  commentary?: Array<{ sequence: number; time?: { displayValue?: string }; text: string }>;
  article?: {
    headline?: string;
    description?: string;
    images?: Array<{ id?: number; url?: string; caption?: string; name?: string; credit?: string }>;
  };
  videos?: EspnVideo[];
  news?: {
    articles?: Array<{
      headline?: string;
      images?: Array<{ url?: string; caption?: string; credit?: string; id?: number }>;
      links?: { web?: { href?: string } };
    }>;
  };
  rosters?: EspnRoster[];
  standings?: {
    groups?: Array<{
      header?: string;
      standings?: {
        entries?: EspnStandingsEntry[];
      };
    }>;
  };
  leaders?: EspnLeaderGroup[];
  headToHeadGames?: EspnH2H[];
  broadcasts?: EspnBroadcast[];
}

export interface EspnBroadcast {
  type?: { shortName?: string; longName?: string };
  media?: { name?: string; shortName?: string; callLetters?: string };
  market?: { type?: string };
}

export interface EspnVideo {
  id: number | string;
  headline?: string;
  description?: string;
  thumbnail?: string;
  duration?: number;
  links?: {
    web?: { href?: string };
    source?: { href?: string };
    mobile?: { source?: { href?: string } };
  };
}

export interface EspnRoster {
  homeAway: "home" | "away";
  formation?: string;
  team: { abbreviation: string; displayName: string; logo?: string };
  roster?: Array<{
    starter?: boolean;
    jersey?: string;
    athlete?: {
      id?: string;
      displayName?: string;
      shortName?: string;
      headshot?: { href?: string };
    };
    position?: { abbreviation?: string; displayName?: string };
  }>;
}

export interface EspnStandingsEntry {
  team: string;
  id?: string;
  stats: Array<{ abbreviation: string; displayValue: string; name: string }>;
}

export interface EspnLeaderGroup {
  team: { displayName: string; abbreviation: string };
  leaders: Array<{
    name: string;
    displayName: string;
    leaders: Array<{
      displayValue: string;
      athlete: { displayName: string };
    }>;
  }>;
}

export interface EspnH2H {
  team: { displayName: string; abbreviation: string };
  events?: Array<{
    gameDate?: string;
    score?: string;
    gameResult?: string;
    competitionName?: string;
    opponent?: { displayName: string };
  }>;
}

export interface EspnKeyEvent {
  id: string;
  type: { id: string; text: string; type: string };
  text?: string;
  shortText?: string;
  period?: { number: number };
  clock?: { value: number; displayValue: string };
  scoringPlay?: boolean;
  team?: { id: string; displayName: string; abbreviation?: string };
  athlete?: {
    id: string;
    displayName: string;
    shortName?: string;
    jersey?: string;
    position?: { abbreviation?: string; displayName?: string };
  };
}
