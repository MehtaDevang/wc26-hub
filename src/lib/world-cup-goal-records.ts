export interface PlayerGoalRecord {
  rank: number;
  name: string;
  flag: string;
  country: string;
  goals: number;
  matches?: number;
  tournaments: string;
  note?: string;
}

export interface TeamGoalRecord {
  rank: number;
  team: string;
  flag: string;
  goals: number;
  matches?: number;
  goalsPerGame?: number;
  note?: string;
}

export interface TournamentScorerRecord {
  rank: number;
  name: string;
  flag: string;
  country: string;
  goals: number;
  year: number;
  matches: number;
  note?: string;
}

export interface MatchGoalRecord {
  score: string;
  winner: string;
  winnerFlag: string;
  loser: string;
  loserFlag: string;
  totalGoals: number;
  year: number;
  stage: string;
  highlight?: string;
}

export interface SingleMatchPlayerRecord {
  name: string;
  flag: string;
  goals: number;
  score: string;
  opponent: string;
  opponentFlag: string;
  year: number;
  stage?: string;
  note?: string;
}

export interface TournamentEditionGoals {
  year: number;
  host: string;
  hostFlag: string;
  totalGoals: number;
  matches: number;
  avgGoals: number;
  note?: string;
}

export const GOAL_RECORDS_SUMMARY = {
  allTimeLeader: { name: "Miroslav Klose", flag: "🇩🇪", goals: 16 },
  singleTournamentLeader: { name: "Just Fontaine", flag: "🇫🇷", goals: 13, year: 1958 },
  singleMatchPlayer: { name: "Oleg Salenko", flag: "🇷🇺", goals: 5, year: 1994 },
  topScoringNation: { team: "Brazil", flag: "🇧🇷", goals: 237 },
  highestScoringMatch: { score: "Austria 7–5 Switzerland", totalGoals: 12, year: 1954 },
  throughEdition: 2022,
};

/** All-time World Cup goals by player (1930–2022). */
export const ALL_TIME_PLAYER_GOALS: PlayerGoalRecord[] = [
  { rank: 1, name: "Miroslav Klose", flag: "🇩🇪", country: "Germany", goals: 16, matches: 24, tournaments: "2002–2014" },
  { rank: 2, name: "Ronaldo", flag: "🇧🇷", country: "Brazil", goals: 15, matches: 19, tournaments: "1998–2006" },
  { rank: 3, name: "Gerd Müller", flag: "🇩🇪", country: "Germany", goals: 14, matches: 13, tournaments: "1970–1974" },
  { rank: 4, name: "Just Fontaine", flag: "🇫🇷", country: "France", goals: 13, matches: 6, tournaments: "1958", note: "All 13 in one tournament" },
  { rank: 4, name: "Lionel Messi", flag: "🇦🇷", country: "Argentina", goals: 13, matches: 26, tournaments: "2006–2022" },
  { rank: 6, name: "Pelé", flag: "🇧🇷", country: "Brazil", goals: 12, matches: 14, tournaments: "1958–1970" },
  { rank: 6, name: "Kylian Mbappé", flag: "🇫🇷", country: "France", goals: 12, matches: 14, tournaments: "2018–2022" },
  { rank: 8, name: "Sándor Kocsis", flag: "🇭🇺", country: "Hungary", goals: 11, matches: 5, tournaments: "1954" },
  { rank: 8, name: "Jürgen Klinsmann", flag: "🇩🇪", country: "Germany", goals: 11, matches: 17, tournaments: "1990–1998" },
  { rank: 10, name: "Helmut Rahn", flag: "🇩🇪", country: "Germany", goals: 10, matches: 10, tournaments: "1954–1958" },
  { rank: 10, name: "Gary Lineker", flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", country: "England", goals: 10, matches: 12, tournaments: "1986–1990" },
  { rank: 10, name: "Gabriel Batistuta", flag: "🇦🇷", country: "Argentina", goals: 10, matches: 12, tournaments: "1994–2002" },
  { rank: 10, name: "Teófilo Cubillas", flag: "🇵🇪", country: "Peru", goals: 10, matches: 13, tournaments: "1970–1982" },
  { rank: 10, name: "Thomas Müller", flag: "🇩🇪", country: "Germany", goals: 10, matches: 19, tournaments: "2010–2022" },
  { rank: 10, name: "Grzegorz Lato", flag: "🇵🇱", country: "Poland", goals: 10, matches: 20, tournaments: "1974–1982" },
  { rank: 16, name: "Cristiano Ronaldo", flag: "🇵🇹", country: "Portugal", goals: 8, matches: 22, tournaments: "2006–2022" },
  { rank: 16, name: "Neymar", flag: "🇧🇷", country: "Brazil", goals: 8, matches: 15, tournaments: "2014–2022" },
  { rank: 16, name: "Harry Kane", flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", country: "England", goals: 8, matches: 11, tournaments: "2018–2022", note: "Golden Boot 2018" },
];

/** Most goals by a player in a single World Cup tournament. */
export const SINGLE_TOURNAMENT_PLAYER_GOALS: TournamentScorerRecord[] = [
  { rank: 1, name: "Just Fontaine", flag: "🇫🇷", country: "France", goals: 13, year: 1958, matches: 6, note: "Record unlikely to be broken" },
  { rank: 2, name: "Sándor Kocsis", flag: "🇭🇺", country: "Hungary", goals: 11, year: 1954, matches: 5 },
  { rank: 3, name: "Gerd Müller", flag: "🇩🇪", country: "Germany", goals: 10, year: 1970, matches: 6 },
  { rank: 4, name: "Eusébio", flag: "🇵🇹", country: "Portugal", goals: 9, year: 1966, matches: 6 },
  { rank: 4, name: "Christian Vieri", flag: "🇮🇹", country: "Italy", goals: 9, year: 2002, matches: 7 },
  { rank: 6, name: "Ronaldo", flag: "🇧🇷", country: "Brazil", goals: 8, year: 2002, matches: 7, note: "Golden Boot" },
  { rank: 6, name: "Kylian Mbappé", flag: "🇫🇷", country: "France", goals: 8, year: 2022, matches: 7, note: "Golden Boot" },
  { rank: 8, name: "Oleg Salenko", flag: "🇷🇺", country: "Russia", goals: 6, year: 1994, matches: 3, note: "Shared Golden Boot; 5 in one match" },
  { rank: 8, name: "James Rodríguez", flag: "🇨🇴", country: "Colombia", goals: 6, year: 2014, matches: 5, note: "Golden Boot" },
  { rank: 8, name: "Harry Kane", flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", country: "England", goals: 6, year: 2018, matches: 6, note: "Golden Boot" },
  { rank: 11, name: "Miroslav Klose", flag: "🇩🇪", country: "Germany", goals: 5, year: 2006, matches: 7, note: "Golden Boot (home)" },
];

/** All-time World Cup goals scored by nation (1930–2022). */
export const ALL_TIME_TEAM_GOALS: TeamGoalRecord[] = [
  { rank: 1, team: "Brazil", flag: "🇧🇷", goals: 237, matches: 114, goalsPerGame: 2.08 },
  { rank: 2, team: "Germany", flag: "🇩🇪", goals: 232, matches: 112, goalsPerGame: 2.07 },
  { rank: 3, team: "Argentina", flag: "🇦🇷", goals: 152, matches: 88, goalsPerGame: 1.73 },
  { rank: 4, team: "France", flag: "🇫🇷", goals: 136, matches: 73, goalsPerGame: 1.86 },
  { rank: 5, team: "Italy", flag: "🇮🇹", goals: 128, matches: 83, goalsPerGame: 1.54 },
  { rank: 6, team: "Spain", flag: "🇪🇸", goals: 108, matches: 67, goalsPerGame: 1.61 },
  { rank: 7, team: "England", flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", goals: 104, matches: 74, goalsPerGame: 1.41 },
  { rank: 8, team: "Netherlands", flag: "🇳🇱", goals: 96, matches: 55, goalsPerGame: 1.75 },
  { rank: 9, team: "Uruguay", flag: "🇺🇾", goals: 89, matches: 59, goalsPerGame: 1.51 },
  { rank: 10, team: "Hungary", flag: "🇭🇺", goals: 87, matches: 38, goalsPerGame: 2.29, note: "Highest goals-per-game among top 10" },
];

/** Most goals by a nation in one World Cup tournament. */
export const SINGLE_TOURNAMENT_TEAM_GOALS: TeamGoalRecord[] = [
  { rank: 1, team: "Germany", flag: "🇩🇪", goals: 18, note: "2014 — incl. 7–1 vs Brazil" },
  { rank: 2, team: "Hungary", flag: "🇭🇺", goals: 17, note: "1954 — 9–0 and 8–3 in group stage" },
  { rank: 3, team: "Brazil", flag: "🇧🇷", goals: 16, note: "2002 — champions" },
  { rank: 3, team: "France", flag: "🇫🇷", goals: 16, note: "2018 — champions" },
  { rank: 5, team: "Brazil", flag: "🇧🇷", goals: 15, note: "1958 — Pelé's first title" },
];

/** Highest-scoring individual World Cup matches. */
export const HIGHEST_SCORING_MATCHES: MatchGoalRecord[] = [
  {
    score: "7–5",
    winner: "Austria",
    winnerFlag: "🇦🇹",
    loser: "Switzerland",
    loserFlag: "🇨🇭",
    totalGoals: 12,
    year: 1954,
    stage: "Quarter-final",
    highlight: "Highest-scoring World Cup match ever",
  },
  {
    score: "10–1",
    winner: "Hungary",
    winnerFlag: "🇭🇺",
    loser: "El Salvador",
    loserFlag: "🇸🇻",
    totalGoals: 11,
    year: 1982,
    stage: "Group stage",
    highlight: "Most goals by one team in a match",
  },
  {
    score: "9–0",
    winner: "Yugoslavia",
    winnerFlag: "🇷🇸",
    loser: "Zaire",
    loserFlag: "🇨🇩",
    totalGoals: 9,
    year: 1974,
    stage: "Group stage",
  },
  {
    score: "9–0",
    winner: "Hungary",
    winnerFlag: "🇭🇺",
    loser: "South Korea",
    loserFlag: "🇰🇷",
    totalGoals: 9,
    year: 1954,
    stage: "Group stage",
  },
  {
    score: "7–1",
    winner: "Germany",
    winnerFlag: "🇩🇪",
    loser: "Brazil",
    loserFlag: "🇧🇷",
    totalGoals: 8,
    year: 2014,
    stage: "Semi-final",
    highlight: "Klose broke all-time scoring record",
  },
  {
    score: "6–1",
    winner: "Russia",
    winnerFlag: "🇷🇺",
    loser: "Cameroon",
    loserFlag: "🇨🇲",
    totalGoals: 7,
    year: 1994,
    stage: "Group stage",
    highlight: "Salenko scored 5",
  },
];

/** Most goals by one player in a single World Cup match. */
export const SINGLE_MATCH_PLAYER_GOALS: SingleMatchPlayerRecord[] = [
  {
    name: "Oleg Salenko",
    flag: "🇷🇺",
    goals: 5,
    score: "6–1",
    opponent: "Cameroon",
    opponentFlag: "🇨🇲",
    year: 1994,
    note: "Only player to score 5 in a World Cup match",
  },
  {
    name: "Ernst Wilimowski",
    flag: "🇵🇱",
    goals: 4,
    score: "5–6 (aet)",
    opponent: "Brazil",
    opponentFlag: "🇧🇷",
    year: 1938,
    note: "Poland lost in extra time",
  },
  {
    name: "Sándor Kocsis",
    flag: "🇭🇺",
    goals: 4,
    score: "9–0",
    opponent: "South Korea",
    opponentFlag: "🇰🇷",
    year: 1954,
  },
  {
    name: "Just Fontaine",
    flag: "🇫🇷",
    goals: 4,
    score: "6–3",
    opponent: "West Germany",
    opponentFlag: "🇩🇪",
    year: 1958,
    stage: "Semi-final",
  },
  {
    name: "Emilio Butragueño",
    flag: "🇪🇸",
    goals: 4,
    score: "5–1",
    opponent: "Denmark",
    opponentFlag: "🇩🇰",
    year: 1986,
    note: "Round of 16",
  },
  {
    name: "Eusébio",
    flag: "🇵🇹",
    goals: 4,
    score: "5–3",
    opponent: "North Korea",
    opponentFlag: "🇰🇵",
    year: 1966,
    note: "Quarter-final comeback",
  },
];

/** Total goals across entire World Cup editions. */
export const HIGHEST_SCORING_TOURNAMENTS: TournamentEditionGoals[] = [
  { year: 1998, host: "France", hostFlag: "🇫🇷", totalGoals: 171, matches: 64, avgGoals: 2.67 },
  { year: 2014, host: "Brazil", hostFlag: "🇧🇷", totalGoals: 171, matches: 64, avgGoals: 2.67 },
  { year: 2018, host: "Russia", hostFlag: "🇷🇺", totalGoals: 169, matches: 64, avgGoals: 2.64 },
  { year: 2002, host: "South Korea & Japan", hostFlag: "🇰🇷", totalGoals: 161, matches: 64, avgGoals: 2.52 },
  { year: 1954, host: "Switzerland", hostFlag: "🇨🇭", totalGoals: 140, matches: 26, avgGoals: 5.38, note: "Highest average goals per game" },
];

export type GoalRecordCategory =
  | "all-time-players"
  | "single-tournament-players"
  | "all-time-teams"
  | "single-tournament-teams"
  | "single-match"
  | "tournaments";

export const GOAL_RECORD_CATEGORIES: Array<{ id: GoalRecordCategory; label: string }> = [
  { id: "all-time-players", label: "All-time players" },
  { id: "single-tournament-players", label: "Per tournament" },
  { id: "all-time-teams", label: "All-time teams" },
  { id: "single-tournament-teams", label: "Team in one WC" },
  { id: "single-match", label: "Per match" },
  { id: "tournaments", label: "Editions" },
];
