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
  kickoffAt: string;
  venue: string;
  venueCity?: string;
  venueCountry?: string;
  homeScore?: number;
  awayScore?: number;
  /** Set from ESPN when the side won (includes penalty shootouts). */
  homeWon?: boolean;
  awayWon?: boolean;
  minute?: number;
  displayClock?: string;
  attendance?: number;
  status: "upcoming" | "live" | "finished";
  homeRecord?: string;
  awayRecord?: string;
  stageLabel?: string;
  /** ESPN season slug, e.g. round-of-32, round-of-16, quarterfinals */
  roundSlug?: string;
}

export interface NewsArticle {
  id: string;
  headline: string;
  /** Short editorial summary - not the full source article */
  summary: string;
  imageUrl?: string;
  imageAlt?: string;
  publishedAt: string;
  type: "story" | "video" | "other";
  sourceUrl?: string;
  /** True for original Goal Posts editorial (not aggregated) */
  isOriginal?: boolean;
}

export interface NewsArticleDetail extends NewsArticle {
  byline?: string;
  /** Full original story paragraphs - present only for our own articles */
  body?: string[];
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
  imageUrl?: string;
  imageAlt?: string;
  imageType?: "player" | "stadium" | "team" | "moment";
  playerName?: string;
  videoUrl?: string;
  webUrl?: string;
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
  period?: number;
  type: "goal" | "yellow" | "red" | "sub" | "chance" | "whistle" | "save" | "penalty";
  team: "home" | "away" | "neutral";
  playerId?: string;
  playerName: string;
  description: string;
  assist?: string;
  subIn?: string;
  subOut?: string;
  isOwnGoal?: boolean;
  milestone?: "kickoff" | "halftime" | "second-half" | "fulltime";
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

export type BracketRoundId =
  | "round-of-32"
  | "round-of-16"
  | "quarter-final"
  | "semi-final"
  | "third-place"
  | "final";

export interface BracketTeam {
  name: string;
  code?: string;
  logo?: string;
  score?: number;
  winner?: boolean;
  /** ESPN-style feeder label before a winner is known */
  feederLabel?: string;
  placeholder?: boolean;
  /** Resolved from live standings before group stage ends */
  projected?: boolean;
}

export interface BracketMatch {
  id?: string;
  round: BracketRoundId;
  slot: number;
  /** FIFA-style match number within the round (e.g. R32 #7) */
  matchNumber?: number;
  label: string;
  home: BracketTeam;
  away: BracketTeam;
  status: "upcoming" | "live" | "finished" | "tbd";
  kickoffAt?: string;
  date?: string;
  time?: string;
}

export interface BracketRound {
  id: BracketRoundId;
  label: string;
  shortLabel: string;
  matches: BracketMatch[];
}

export interface KnockoutBracketData {
  rounds: BracketRound[];
  activeRound?: BracketRoundId;
  finishedMatches: number;
  totalMatches: number;
  updatedAt: string;
}

export type TeamMatchResult = "W" | "D" | "L" | "upcoming" | "live";

export interface TeamJourneyMatch {
  matchId: string;
  date: string;
  time: string;
  kickoffAt?: string;
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

export interface GroupPageData {
  letter: string;
  label: string;
  standings: GroupStandings;
  matches: Match[];
}

export interface PlayerGoal {
  matchId: string;
  minute: number;
  opponent: string;
  opponentCode: string;
  assist?: string;
  description: string;
}

export interface PlayerAppearance {
  matchId: string;
  opponent: string;
  opponentCode: string;
  started: boolean;
  date: string;
}

export interface PlayerRecentMatch {
  eventId: string;
  date: string;
  opponent: string;
  score: string;
  result: string;
  competition: string;
  goals: number;
  assists: number;
}

export interface PlayerSeasonStat {
  name: string;
  displayValue: string;
}

/** Computed factual badge shown on player pages (derived from real data). */
export interface PlayerFactBadge {
  label: string;
  highlight?: boolean;
}

/** Rich player content: auto-generated facts plus optional curated editorial. */
export interface PlayerRichProfile {
  /** Short factual overview paragraphs (no invented claims). */
  overview: string[];
  /** Data-derived badges, e.g. youngest in squad. */
  badges: PlayerFactBadge[];
  /** Curated play-style summary (marquee players only). */
  playStyle?: string;
  /** Curated career journey bullets (marquee players only). */
  journey?: string[];
  /** Curated stable facts (marquee players only). */
  highlights?: string[];
  /** Notable records or honours (marquee players only). */
  records?: string[];
  /** True when hand-written editorial is attached. */
  hasEditorial?: boolean;
}

export interface PlayerWorldCupProfile {
  id: string;
  espnId?: string;
  slug: string;
  name: string;
  teamCode: string;
  teamName: string;
  number: number;
  position: string;
  flag: string;
  headshot?: string;
  age: number;
  club: string;
  clubLogo?: string;
  nationality: string;
  caps: number;
  bio: string;
  displayHeight?: string;
  displayWeight?: string;
  dateOfBirth?: string;
  birthPlace?: string;
  worldCupGoals: number;
  goals: PlayerGoal[];
  yellowCards: number;
  redCards: number;
  matchesPlayed: number;
  appearances: PlayerAppearance[];
  recentMatches: PlayerRecentMatch[];
  seasonStats: PlayerSeasonStat[];
  richProfile?: PlayerRichProfile;
}

export interface PlayerListItem {
  id: string;
  slug: string;
  name: string;
  teamCode: string;
  teamName: string;
  flag: string;
  goals: number;
  position: string;
  number: number;
  headshot?: string;
  /** Curated featured profile (career, play style, records). */
  isFeatured?: boolean;
}

export interface PlayerCountrySection {
  teamCode: string;
  teamName: string;
  flag: string;
  logo?: string;
  players: PlayerListItem[];
}

export interface MatchLeader {
  category: string;
  playerName: string;
  team: string;
  value: string;
}

export interface HeadToHeadMatch {
  id?: string;
  date: string;
  score: string;
  homeTeam: string;
  awayTeam: string;
  homeScore: number;
  awayScore: number;
  competition: string;
  round?: string;
  isWorldCup?: boolean;
  /** W/D/L from the current fixture home team's perspective */
  resultForHome: "W" | "D" | "L";
  /** Kept for older UI - opponent relative to fixture home team */
  opponent: string;
  result: string;
}

export interface HeadToHeadRecord {
  totalMeetings: number;
  homeWins: number;
  awayWins: number;
  draws: number;
  homeGoals: number;
  awayGoals: number;
  worldCupMeetings: number;
  worldCupHomeWins: number;
  worldCupAwayWins: number;
  worldCupDraws: number;
  summary: string;
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
  headToHeadRecord?: HeadToHeadRecord;
  rivalryName?: string;
  rivalryNote?: string;
  rivalryFunFact?: string;
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
