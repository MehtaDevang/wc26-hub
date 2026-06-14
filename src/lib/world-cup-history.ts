export interface WorldCupEdition {
  year: number;
  host: string;
  hostFlag: string;
  winner: string;
  winnerFlag: string;
  runnerUp: string;
  runnerUpFlag: string;
  finalScore: string;
  thirdPlace?: string;
  thirdFlag?: string;
  teams: number;
  matches: number;
  goals: number;
  avgGoals: number;
  attendance?: string;
  topScorer: { name: string; goals: number; country: string; flag: string };
  goldenBall?: string;
  goldenGlove?: string;
  bestYoungPlayer?: string;
  finalVenue: string;
  finalDate: string;
  motto?: string;
  ball?: string;
  highlight: string;
}

export interface WorldCupRecord {
  category: string;
  holder: string;
  flag?: string;
  value: string;
  detail?: string;
}

export interface AwardInfo {
  name: string;
  description: string;
  icon: string;
  firstAwarded: number;
}

export interface PrizePayout {
  edition: string;
  winner: string;
  totalPrize: string;
  winnerShare: string;
  note?: string;
}

export const HISTORY_SUMMARY = {
  editions: 22,
  totalMatches: 964,
  totalGoals: 2720,
  uniqueWinners: 8,
  mostTitles: { team: "Brazil", flag: "🇧🇷", count: 5 },
  highestScoringFinal: { edition: "1958", score: "Brazil 5–2 Sweden" },
  biggestWin: { edition: "1982", match: "Hungary 10–1 El Salvador" },
  firstEdition: 1930,
  latestEdition: 2022,
};

export const TROPHY_INFO = {
  name: "FIFA World Cup Trophy",
  designer: "Silvio Gazzaniga",
  introduced: 1974,
  material: "18-carat gold",
  weight: "6.1 kg (13.5 lb)",
  height: "36.8 cm",
  description:
    "The current trophy replaced the Jules Rimet Cup in 1974. Winners receive a gold-plated replica; the original stays with FIFA. Brazil kept the Jules Rimet Trophy permanently after winning it for a third time in 1970.",
  previousTrophy: {
    name: "Jules Rimet Trophy",
    years: "1930–1970",
    note: "Awarded permanently to Brazil after their third title in 1970. The original was stolen in 1983 and never recovered.",
  },
};

export const AWARDS: AwardInfo[] = [
  {
    name: "Golden Ball",
    description: "Best player of the tournament",
    icon: "⚽",
    firstAwarded: 1982,
  },
  {
    name: "Golden Boot",
    description: "Top goalscorer of the tournament",
    icon: "👟",
    firstAwarded: 1982,
  },
  {
    name: "Golden Glove",
    description: "Best goalkeeper (formerly Yashin Award)",
    icon: "🧤",
    firstAwarded: 1994,
  },
  {
    name: "Best Young Player",
    description: "Best player aged 21 or under",
    icon: "⭐",
    firstAwarded: 2006,
  },
  {
    name: "FIFA Fair Play Trophy",
    description: "Team with the best disciplinary record",
    icon: "🤝",
    firstAwarded: 1970,
  },
];

export const PRIZE_HISTORY: PrizePayout[] = [
  { edition: "2022 Qatar", winner: "Argentina", totalPrize: "$440M", winnerShare: "$42M" },
  { edition: "2018 Russia", winner: "France", totalPrize: "$400M", winnerShare: "$38M" },
  { edition: "2014 Brazil", winner: "Germany", totalPrize: "$358M", winnerShare: "$35M" },
  { edition: "2010 South Africa", winner: "Spain", totalPrize: "$420M", winnerShare: "$30M" },
  { edition: "2006 Germany", winner: "Italy", totalPrize: "$266M", winnerShare: "$20M" },
  { edition: "1998 France", winner: "France", totalPrize: "$103M", winnerShare: "$6M", note: "Prize pool grew significantly from 2002 onward" },
];

export const WORLD_CUP_EDITIONS: WorldCupEdition[] = [
  {
    year: 2022, host: "Qatar", hostFlag: "🇶🇦", winner: "Argentina", winnerFlag: "🇦🇷",
    runnerUp: "France", runnerUpFlag: "🇫🇷", finalScore: "3–3 (4–2 pens)",
    thirdPlace: "Croatia", thirdFlag: "🇭🇷", teams: 32, matches: 64, goals: 172, avgGoals: 2.69,
    attendance: "3.4M", topScorer: { name: "Kylian Mbappé", goals: 8, country: "France", flag: "🇫🇷" },
    goldenBall: "Lionel Messi", goldenGlove: "Emiliano Martínez", bestYoungPlayer: "Enzo Fernández",
    finalVenue: "Lusail Stadium", finalDate: "Dec 18, 2022",
    motto: "Now is All", ball: "Al Rihla",
    highlight: "Messi's crowning glory — Argentina's third star after a penalty shootout epic.",
  },
  {
    year: 2018, host: "Russia", hostFlag: "🇷🇺", winner: "France", winnerFlag: "🇫🇷",
    runnerUp: "Croatia", runnerUpFlag: "🇭🇷", finalScore: "4–2",
    thirdPlace: "Belgium", thirdFlag: "🇧🇪", teams: 32, matches: 64, goals: 169, avgGoals: 2.64,
    attendance: "3.0M", topScorer: { name: "Harry Kane", goals: 6, country: "England", flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿" },
    goldenBall: "Luka Modrić", goldenGlove: "Thibaut Courtois", bestYoungPlayer: "Kylian Mbappé",
    finalVenue: "Luzhniki Stadium, Moscow", finalDate: "Jul 15, 2018",
    ball: "Telstar 18",
    highlight: "France's second title — Mbappé announced himself on the world stage.",
  },
  {
    year: 2014, host: "Brazil", hostFlag: "🇧🇷", winner: "Germany", winnerFlag: "🇩🇪",
    runnerUp: "Argentina", runnerUpFlag: "🇦🇷", finalScore: "1–0 (AET)",
    thirdPlace: "Netherlands", thirdFlag: "🇳🇱", teams: 32, matches: 64, goals: 171, avgGoals: 2.67,
    attendance: "3.4M", topScorer: { name: "James Rodríguez", goals: 6, country: "Colombia", flag: "🇨🇴" },
    goldenBall: "Lionel Messi", goldenGlove: "Manuel Neuer", bestYoungPlayer: "Paul Pogba",
    finalVenue: "Maracanã, Rio", finalDate: "Jul 13, 2014",
    ball: "Brazuca",
    highlight: "Germany's 7–1 semifinal demolition of hosts Brazil shocked the world.",
  },
  {
    year: 2010, host: "South Africa", hostFlag: "🇿🇦", winner: "Spain", winnerFlag: "🇪🇸",
    runnerUp: "Netherlands", runnerUpFlag: "🇳🇱", finalScore: "1–0 (AET)",
    thirdPlace: "Germany", thirdFlag: "🇩🇪", teams: 32, matches: 64, goals: 145, avgGoals: 2.27,
    attendance: "3.2M", topScorer: { name: "Diego Forlán", goals: 5, country: "Uruguay", flag: "🇺🇾" },
    goldenBall: "Diego Forlán", goldenGlove: "Iker Casillas", bestYoungPlayer: "Thomas Müller",
    finalVenue: "Soccer City, Johannesburg", finalDate: "Jul 11, 2010",
    ball: "Jabulani",
    highlight: "First World Cup in Africa — Spain's tiki-taka conquered the world.",
  },
  {
    year: 2006, host: "Germany", hostFlag: "🇩🇪", winner: "Italy", winnerFlag: "🇮🇹",
    runnerUp: "France", runnerUpFlag: "🇫🇷", finalScore: "1–1 (5–3 pens)",
    thirdPlace: "Germany", thirdFlag: "🇩🇪", teams: 32, matches: 64, goals: 147, avgGoals: 2.30,
    attendance: "3.4M", topScorer: { name: "Miroslav Klose", goals: 5, country: "Germany", flag: "🇩🇪" },
    goldenBall: "Zinedine Zidane", goldenGlove: "Gianluigi Buffon", bestYoungPlayer: "Lukas Podolski",
    finalVenue: "Olympiastadion, Berlin", finalDate: "Jul 9, 2006",
    ball: "Teamgeist",
    highlight: "Zidane's headbutt and Italy's penalty shootout redemption.",
  },
  {
    year: 2002, host: "South Korea & Japan", hostFlag: "🇰🇷🇯🇵", winner: "Brazil", winnerFlag: "🇧🇷",
    runnerUp: "Germany", runnerUpFlag: "🇩🇪", finalScore: "2–0",
    thirdPlace: "Turkey", thirdFlag: "🇹🇷", teams: 32, matches: 64, goals: 161, avgGoals: 2.52,
    attendance: "2.7M", topScorer: { name: "Ronaldo", goals: 8, country: "Brazil", flag: "🇧🇷" },
    goldenBall: "Oliver Kahn", goldenGlove: "Oliver Kahn", bestYoungPlayer: "Landon Donovan",
    finalVenue: "International Stadium, Yokohama", finalDate: "Jun 30, 2002",
    ball: "Fevernova",
    highlight: "Ronaldo's redemption — Brazil's fifth star in the first Asian World Cup.",
  },
  {
    year: 1998, host: "France", hostFlag: "🇫🇷", winner: "France", winnerFlag: "🇫🇷",
    runnerUp: "Brazil", runnerUpFlag: "🇧🇷", finalScore: "3–0",
    thirdPlace: "Croatia", thirdFlag: "🇭🇷", teams: 32, matches: 64, goals: 171, avgGoals: 2.67,
    attendance: "2.8M", topScorer: { name: "Davor Šuker", goals: 6, country: "Croatia", flag: "🇭🇷" },
    goldenBall: "Ronaldo", goldenGlove: "Fabien Barthez",
    finalVenue: "Stade de France, Paris", finalDate: "Jul 12, 1998",
    ball: "Tricolore",
    highlight: "Zidane's double header — France's first World Cup on home soil.",
  },
  {
    year: 1994, host: "USA", hostFlag: "🇺🇸", winner: "Brazil", winnerFlag: "🇧🇷",
    runnerUp: "Italy", runnerUpFlag: "🇮🇹", finalScore: "0–0 (3–2 pens)",
    thirdPlace: "Sweden", thirdFlag: "🇸🇪", teams: 24, matches: 52, goals: 141, avgGoals: 2.71,
    attendance: "3.6M", topScorer: { name: "Oleg Salenko", goals: 6, country: "Russia", flag: "🇷🇺" },
    goldenBall: "Romário", goldenGlove: "Michel Preud'homme",
    finalVenue: "Rose Bowl, Pasadena", finalDate: "Jul 17, 1994",
    ball: "Questra",
    highlight: "Record attendance — Baggio's penalty miss hands Brazil a fourth title.",
  },
  {
    year: 1990, host: "Italy", hostFlag: "🇮🇹", winner: "West Germany", winnerFlag: "🇩🇪",
    runnerUp: "Argentina", runnerUpFlag: "🇦🇷", finalScore: "1–0",
    thirdPlace: "Italy", thirdFlag: "🇮🇹", teams: 24, matches: 52, goals: 115, avgGoals: 2.21,
    attendance: "2.5M", topScorer: { name: "Salvatore Schillaci", goals: 6, country: "Italy", flag: "🇮🇹" },
    goldenBall: "Salvatore Schillaci", goldenGlove: "Luis Goycochea",
    finalVenue: "Stadio Olimpico, Rome", finalDate: "Jul 8, 1990",
    ball: "Etrusco Unico",
    highlight: "A defensive tournament — West Germany's third title before reunification.",
  },
  {
    year: 1986, host: "Mexico", hostFlag: "🇲🇽", winner: "Argentina", winnerFlag: "🇦🇷",
    runnerUp: "West Germany", runnerUpFlag: "🇩🇪", finalScore: "3–2",
    thirdPlace: "France", thirdFlag: "🇫🇷", teams: 24, matches: 52, goals: 132, avgGoals: 2.54,
    attendance: "2.4M", topScorer: { name: "Gary Lineker", goals: 6, country: "England", flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿" },
    goldenBall: "Diego Maradona", goldenGlove: "Jean-Pierre Papin",
    finalVenue: "Estadio Azteca, Mexico City", finalDate: "Jun 29, 1986",
    ball: "Azteca",
    highlight: "Maradona's 'Hand of God' and 'Goal of the Century' — Argentina's second star.",
  },
  {
    year: 1982, host: "Spain", hostFlag: "🇪🇸", winner: "Italy", winnerFlag: "🇮🇹",
    runnerUp: "West Germany", runnerUpFlag: "🇩🇪", finalScore: "3–1",
    thirdPlace: "Poland", thirdFlag: "🇵🇱", teams: 24, matches: 52, goals: 146, avgGoals: 2.81,
    attendance: "2.1M", topScorer: { name: "Paolo Rossi", goals: 6, country: "Italy", flag: "🇮🇹" },
    goldenBall: "Paolo Rossi", goldenGlove: "Dino Zoff",
    finalVenue: "Santiago Bernabéu, Madrid", finalDate: "Jul 11, 1982",
    ball: "Tango España",
    highlight: "Expanded to 24 teams — Paolo Rossi's hat-trick vs Brazil in the second group stage.",
  },
  {
    year: 1978, host: "Argentina", hostFlag: "🇦🇷", winner: "Argentina", winnerFlag: "🇦🇷",
    runnerUp: "Netherlands", runnerUpFlag: "🇳🇱", finalScore: "3–1 (AET)",
    thirdPlace: "Brazil", thirdFlag: "🇧🇷", teams: 16, matches: 38, goals: 102, avgGoals: 2.68,
    attendance: "1.6M", topScorer: { name: "Mario Kempes", goals: 6, country: "Argentina", flag: "🇦🇷" },
    goldenBall: "Mario Kempes",
    finalVenue: "Estadio Monumental, Buenos Aires", finalDate: "Jun 25, 1978",
    ball: "Tango",
    highlight: "Kempes inspired Argentina's first World Cup on home soil.",
  },
  {
    year: 1974, host: "West Germany", hostFlag: "🇩🇪", winner: "West Germany", winnerFlag: "🇩🇪",
    runnerUp: "Netherlands", runnerUpFlag: "🇳🇱", finalScore: "2–1",
    thirdPlace: "Poland", thirdFlag: "🇵🇱", teams: 16, matches: 38, goals: 97, avgGoals: 2.55,
    attendance: "1.8M", topScorer: { name: "Grzegorz Lato", goals: 7, country: "Poland", flag: "🇵🇱" },
    goldenBall: "Johan Cruyff",
    finalVenue: "Olympiastadion, Munich", finalDate: "Jul 7, 1974",
    ball: "Telstar Durlast",
    highlight: "Total Football meets German efficiency — the new FIFA trophy debuted.",
  },
  {
    year: 1970, host: "Mexico", hostFlag: "🇲🇽", winner: "Brazil", winnerFlag: "🇧🇷",
    runnerUp: "Italy", runnerUpFlag: "🇮🇹", finalScore: "4–1",
    thirdPlace: "West Germany", thirdFlag: "🇩🇪", teams: 16, matches: 32, goals: 95, avgGoals: 2.97,
    attendance: "1.6M", topScorer: { name: "Gerd Müller", goals: 10, country: "West Germany", flag: "🇩🇪" },
    goldenBall: "Pelé",
    finalVenue: "Estadio Azteca, Mexico City", finalDate: "Jun 21, 1970",
    ball: "Telstar",
    highlight: "Pelé's third title — Brazil kept the Jules Rimet Trophy forever.",
  },
  {
    year: 1966, host: "England", hostFlag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", winner: "England", winnerFlag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿",
    runnerUp: "West Germany", runnerUpFlag: "🇩🇪", finalScore: "4–2 (AET)",
    thirdPlace: "Portugal", thirdFlag: "🇵🇹", teams: 16, matches: 32, goals: 89, avgGoals: 2.78,
    attendance: "1.6M", topScorer: { name: "Eusébio", goals: 9, country: "Portugal", flag: "🇵🇹" },
    finalVenue: "Wembley Stadium, London", finalDate: "Jul 30, 1966",
    ball: "Challenge 4-Star",
    highlight: "'They think it's all over' — Geoff Hurst's hat-trick and England's only World Cup.",
  },
  {
    year: 1962, host: "Chile", hostFlag: "🇨🇱", winner: "Brazil", winnerFlag: "🇧🇷",
    runnerUp: "Czechoslovakia", runnerUpFlag: "🇨🇿", finalScore: "3–1",
    thirdPlace: "Chile", thirdFlag: "🇨🇱", teams: 16, matches: 32, goals: 89, avgGoals: 2.78,
    attendance: "900K", topScorer: { name: "Flórián Albert", goals: 4, country: "Hungary", flag: "🇭🇺" },
    finalVenue: "Estadio Nacional, Santiago", finalDate: "Jun 17, 1962",
    ball: "Crack",
    highlight: "Garrincha shone as Pelé got injured — Brazil defended their crown.",
  },
  {
    year: 1958, host: "Sweden", hostFlag: "🇸🇪", winner: "Brazil", winnerFlag: "🇧🇷",
    runnerUp: "Sweden", runnerUpFlag: "🇸🇪", finalScore: "5–2",
    thirdPlace: "France", thirdFlag: "🇫🇷", teams: 16, matches: 35, goals: 126, avgGoals: 3.60,
    attendance: "820K", topScorer: { name: "Just Fontaine", goals: 13, country: "France", flag: "🇫🇷" },
    finalVenue: "Råsunda Stadium, Stockholm", finalDate: "Jun 29, 1958",
    ball: "Top Star",
    highlight: "17-year-old Pelé announced himself — Fontaine's record 13 goals still stands.",
  },
  {
    year: 1954, host: "Switzerland", hostFlag: "🇨🇭", winner: "West Germany", winnerFlag: "🇩🇪",
    runnerUp: "Hungary", runnerUpFlag: "🇭🇺", finalScore: "3–2",
    thirdPlace: "Austria", thirdFlag: "🇦🇹", teams: 16, matches: 26, goals: 140, avgGoals: 5.38,
    attendance: "770K", topScorer: { name: "Sándor Kocsis", goals: 11, country: "Hungary", flag: "🇭🇺" },
    finalVenue: "Wankdorf Stadium, Bern", finalDate: "Jul 4, 1954",
    ball: "Swiss World Champion",
    highlight: "The 'Miracle of Bern' — West Germany stunned unbeaten Hungary.",
  },
  {
    year: 1950, host: "Brazil", hostFlag: "🇧🇷", winner: "Uruguay", winnerFlag: "🇺🇾",
    runnerUp: "Brazil", runnerUpFlag: "🇧🇷", finalScore: "2–1",
    thirdPlace: "Sweden", thirdFlag: "🇸🇪", teams: 13, matches: 22, goals: 88, avgGoals: 4.00,
    attendance: "1.0M", topScorer: { name: "Ademir", goals: 9, country: "Brazil", flag: "🇧🇷" },
    finalVenue: "Maracanã, Rio", finalDate: "Jul 16, 1950",
    ball: "Superball",
    highlight: "Maracanazo — Uruguay silenced 200,000 Brazilians in the decisive final group match.",
  },
  {
    year: 1938, host: "France", hostFlag: "🇫🇷", winner: "Italy", winnerFlag: "🇮🇹",
    runnerUp: "Hungary", runnerUpFlag: "🇭🇺", finalScore: "4–2",
    thirdPlace: "Brazil", thirdFlag: "🇧🇷", teams: 15, matches: 18, goals: 84, avgGoals: 4.67,
    attendance: "380K", topScorer: { name: "Leônidas", goals: 7, country: "Brazil", flag: "🇧🇷" },
    finalVenue: "Stade Olympique de Colombes, Paris", finalDate: "Jun 19, 1938",
    ball: "Allen",
    highlight: "Italy retained the title on the eve of World War II.",
  },
  {
    year: 1934, host: "Italy", hostFlag: "🇮🇹", winner: "Italy", winnerFlag: "🇮🇹",
    runnerUp: "Czechoslovakia", runnerUpFlag: "🇨🇿", finalScore: "2–1 (AET)",
    thirdPlace: "Germany", thirdFlag: "🇩🇪", teams: 16, matches: 17, goals: 70, avgGoals: 4.12,
    attendance: "360K", topScorer: { name: "Oldřich Nejedlý", goals: 5, country: "Czechoslovakia", flag: "🇨🇿" },
    finalVenue: "Stadio Nazionale PNF, Rome", finalDate: "Jun 10, 1934",
    ball: "Federale 102",
    highlight: "Mussolini's Italy won the first European-hosted World Cup.",
  },
  {
    year: 1930, host: "Uruguay", hostFlag: "🇺🇾", winner: "Uruguay", winnerFlag: "🇺🇾",
    runnerUp: "Argentina", runnerUpFlag: "🇦🇷", finalScore: "4–2",
    thirdPlace: "USA", thirdFlag: "🇺🇸", teams: 13, matches: 18, goals: 70, avgGoals: 3.89,
    attendance: "590K", topScorer: { name: "Guillermo Stábile", goals: 8, country: "Argentina", flag: "🇦🇷" },
    finalVenue: "Estadio Centenario, Montevideo", finalDate: "Jul 30, 1930",
    ball: "Tiento",
    highlight: "The inaugural World Cup — Uruguay triumphed in front of 93,000 fans.",
  },
];

export const WORLD_CUP_RECORDS: WorldCupRecord[] = [
  { category: "Most World Cup titles", holder: "Brazil", flag: "🇧🇷", value: "5", detail: "1958, 1962, 1970, 1994, 2002" },
  { category: "Most final appearances", holder: "Germany", flag: "🇩🇪", value: "8", detail: "Won 4, lost 4" },
  { category: "Most goals (all-time)", holder: "Miroslav Klose", flag: "🇩🇪", value: "16", detail: "2002–2014" },
  { category: "Most goals in one tournament", holder: "Just Fontaine", flag: "🇫🇷", value: "13", detail: "Sweden 1958" },
  { category: "Most World Cup appearances (player)", holder: "Lionel Messi", flag: "🇦🇷", value: "26 matches", detail: "2006–2022" },
  { category: "Most World Cup appearances (nation)", holder: "Brazil", flag: "🇧🇷", value: "22", detail: "Every edition" },
  { category: "Biggest win in history", holder: "Hungary", flag: "🇭🇺", value: "10–1", detail: "vs El Salvador, Spain 1982" },
  { category: "Highest-scoring final", holder: "Brazil", flag: "🇧🇷", value: "5–2", detail: "vs Sweden, 1958" },
  { category: "Most goals in a tournament", holder: "France 1998", flag: "🇫🇷", value: "171 goals", detail: "64 matches" },
  { category: "Highest avg goals per game", holder: "Switzerland 1954", flag: "🇨🇭", value: "5.38", detail: "26 matches, 140 goals" },
  { category: "Most attended edition", holder: "USA 1994", flag: "🇺🇸", value: "3.6M", detail: "Average 69,000 per game" },
  { category: "Youngest goalscorer", holder: "Pelé", flag: "🇧🇷", value: "17y 239d", detail: "Sweden 1958" },
  { category: "Oldest goalscorer", holder: "Roger Milla", flag: "🇨🇲", value: "42y 39d", detail: "USA 1994" },
  { category: "Fastest goal", holder: "Hakan Şükür", flag: "🇹🇷", value: "11 seconds", detail: "vs South Korea, 2002" },
  { category: "Most clean sheets (keeper)", holder: "Peter Shilton", flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", value: "10", detail: "1982–1990" },
  { category: "Only back-to-back winners", holder: "Italy & Brazil", flag: "🇮🇹🇧🇷", value: "2 each", detail: "Italy 1934–38, Brazil 1958–62" },
];

export const TITLE_WINNERS = [
  { team: "Brazil", flag: "🇧🇷", titles: 5, years: [1958, 1962, 1970, 1994, 2002] },
  { team: "Germany", flag: "🇩🇪", titles: 4, years: [1954, 1974, 1990, 2014] },
  { team: "Italy", flag: "🇮🇹", titles: 4, years: [1934, 1938, 1982, 2006] },
  { team: "Argentina", flag: "🇦🇷", titles: 3, years: [1978, 1986, 2022] },
  { team: "France", flag: "🇫🇷", titles: 2, years: [1998, 2018] },
  { team: "Uruguay", flag: "🇺🇾", titles: 2, years: [1930, 1950] },
  { team: "England", flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", titles: 1, years: [1966] },
  { team: "Spain", flag: "🇪🇸", titles: 1, years: [2010] },
];

export function getEdition(year: number): WorldCupEdition | undefined {
  return WORLD_CUP_EDITIONS.find((e) => e.year === year);
}
