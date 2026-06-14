export interface Team {
  code: string;
  name: string;
  flag: string;
  logo?: string;
}

export interface Match {
  id: string;
  group: string;
  home: string;
  away: string;
  homeName: string;
  awayName: string;
  homeLogo?: string;
  awayLogo?: string;
  date: string;
  time: string;
  venue: string;
  venueCity?: string;
  venueCountry?: string;
  homeScore?: number;
  awayScore?: number;
  minute?: number;
  displayClock?: string;
  attendance?: number;
  status: "upcoming" | "live" | "finished";
  homeRecord?: string;
  awayRecord?: string;
}

export interface Highlight {
  id: string;
  matchId: string;
  title: string;
  description: string;
  type: "goal" | "save" | "celebration" | "moment";
  minute: string;
  teams: string;
  emoji: string;
}

export interface PlayerProfile {
  id: string;
  name: string;
  team: string;
  number: number;
  position: string;
  age: number;
  club: string;
  nationality: string;
  flag: string;
  worldCupGoals: number;
  caps: number;
  bio: string;
  espnId?: string;
}

export interface MatchEvent {
  id: string;
  minute: number;
  extraTime?: number;
  type: "goal" | "yellow" | "red" | "sub" | "chance" | "whistle" | "save" | "penalty";
  team: "home" | "away" | "neutral";
  playerId?: string;
  playerName: string;
  description: string;
  assist?: string;
}

export interface MatchStats {
  possession: [number, number];
  shots: [number, number];
  shotsOnTarget: [number, number];
  corners: [number, number];
  fouls: [number, number];
  yellowCards?: [number, number];
  redCards?: [number, number];
  saves?: [number, number];
  passes?: [number, number];
  passAccuracy?: [number, number];
  offsides?: [number, number];
  tackles?: [number, number];
  interceptions?: [number, number];
}

export interface MatchVideo {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  videoUrl?: string;
  duration?: number;
  webUrl?: string;
}

export interface MatchPhoto {
  id: string;
  url: string;
  caption?: string;
  credit?: string;
}

export interface LineupPlayer {
  id: string;
  name: string;
  number: number;
  position: string;
  starter: boolean;
  espnId?: string;
}

export interface TeamLineup {
  teamCode: string;
  teamName: string;
  formation: string;
  starters: LineupPlayer[];
  substitutes: LineupPlayer[];
}

export interface VenueInfo {
  name: string;
  city: string;
  country: string;
  capacity: number;
}

export interface WeatherInfo {
  temperature?: number;
  condition: string;
  icon: string;
  humidity?: number;
  windSpeed?: number;
}

export interface StandingsRow {
  rank: number;
  team: string;
  teamCode?: string;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goalDiff: string;
  points: number;
  form?: string;
}

export interface GroupStandings {
  group: string;
  rows: StandingsRow[];
}

export type TeamMatchResult = "W" | "D" | "L" | "upcoming" | "live";

export interface TeamJourneyMatch {
  matchId: string;
  date: string;
  time: string;
  opponent: string;
  opponentCode: string;
  opponentLogo?: string;
  isHome: boolean;
  goalsFor?: number;
  goalsAgainst?: number;
  result: TeamMatchResult;
  venue: string;
  venueCity?: string;
  group: string;
  stage: string;
  displayClock?: string;
}

export interface TeamJourney {
  teamCode: string;
  teamName: string;
  flag: string;
  logo?: string;
  group: string;
  rank?: number;
  standing?: StandingsRow;
  matches: TeamJourneyMatch[];
  stats: {
    played: number;
    won: number;
    drawn: number;
    lost: number;
    goalsFor: number;
    goalsAgainst: number;
    goalDiff: number;
    points: number;
  };
  form: string;
  nextMatch?: TeamJourneyMatch;
}

export interface MatchLeader {
  category: string;
  playerName: string;
  team: string;
  value: string;
}

export interface HeadToHeadMatch {
  date: string;
  score: string;
  opponent: string;
  result: string;
  competition: string;
}

export interface BroadcastInfo {
  network: string;
  type: string;
}

export interface TeamRecord {
  summary: string;
  points?: string;
}

export interface MatchDetail {
  matchId: string;
  summary: string;
  attendance?: string;
  referee?: string;
  events: MatchEvent[];
  players: Record<string, PlayerProfile>;
  stats?: MatchStats;
  homeLineup?: TeamLineup;
  awayLineup?: TeamLineup;
  homeManager?: string;
  awayManager?: string;
  homeRecord?: TeamRecord;
  awayRecord?: TeamRecord;
  venue?: VenueInfo;
  weather?: WeatherInfo;
  videos?: MatchVideo[];
  photos?: MatchPhoto[];
  groupStandings?: GroupStandings;
  leaders?: MatchLeader[];
  headToHead?: HeadToHeadMatch[];
  broadcasts?: BroadcastInfo[];
  commentary?: Array<{ minute: string; text: string }>;
}

export interface GuessPlayer {
  name: string;
  nationality: string;
  position: string;
  club: string;
  worldCups: number;
  goals: number;
  hint: string;
  aliases: string[];
  flag?: string;
  age?: number;
  caps?: number;
  league?: string;
  nickname?: string;
  extraHints?: string[];
}
