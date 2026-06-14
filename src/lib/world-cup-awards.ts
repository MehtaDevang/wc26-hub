export interface AwardWinner {
  name: string;
  country: string;
  flag: string;
  detail?: string;
}

export interface EditionAwards {
  goldenBall?: AwardWinner;
  silverBall?: AwardWinner;
  bronzeBall?: AwardWinner;
  goldenBoot: AwardWinner;
  goldenGlove?: AwardWinner;
  bestYoungPlayer?: AwardWinner;
  fairPlay?: { team: string; flag: string };
  prizePool?: string;
  winnerPrize?: string;
}

/** Award winners by World Cup year */
export const EDITION_AWARDS: Record<number, EditionAwards> = {
  2022: {
    goldenBall: { name: "Lionel Messi", country: "Argentina", flag: "🇦🇷" },
    silverBall: { name: "Kylian Mbappé", country: "France", flag: "🇫🇷" },
    bronzeBall: { name: "Luka Modrić", country: "Croatia", flag: "🇭🇷" },
    goldenBoot: { name: "Kylian Mbappé", country: "France", flag: "🇫🇷", detail: "8 goals" },
    goldenGlove: { name: "Emiliano Martínez", country: "Argentina", flag: "🇦🇷" },
    bestYoungPlayer: { name: "Enzo Fernández", country: "Argentina", flag: "🇦🇷" },
    fairPlay: { team: "England", flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿" },
    prizePool: "$440M",
    winnerPrize: "$42M",
  },
  2018: {
    goldenBall: { name: "Luka Modrić", country: "Croatia", flag: "🇭🇷" },
    silverBall: { name: "Eden Hazard", country: "Belgium", flag: "🇧🇪" },
    bronzeBall: { name: "Antoine Griezmann", country: "France", flag: "🇫🇷" },
    goldenBoot: { name: "Harry Kane", country: "England", flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", detail: "6 goals" },
    goldenGlove: { name: "Thibaut Courtois", country: "Belgium", flag: "🇧🇪" },
    bestYoungPlayer: { name: "Kylian Mbappé", country: "France", flag: "🇫🇷" },
    fairPlay: { team: "Spain", flag: "🇪🇸" },
    prizePool: "$400M",
    winnerPrize: "$38M",
  },
  2014: {
    goldenBall: { name: "Lionel Messi", country: "Argentina", flag: "🇦🇷" },
    silverBall: { name: "Thomas Müller", country: "Germany", flag: "🇩🇪" },
    bronzeBall: { name: "Neymar Jr", country: "Brazil", flag: "🇧🇷" },
    goldenBoot: { name: "James Rodríguez", country: "Colombia", flag: "🇨🇴", detail: "6 goals" },
    goldenGlove: { name: "Manuel Neuer", country: "Germany", flag: "🇩🇪" },
    bestYoungPlayer: { name: "Paul Pogba", country: "France", flag: "🇫🇷" },
    fairPlay: { team: "Colombia", flag: "🇨🇴" },
    prizePool: "$358M",
    winnerPrize: "$35M",
  },
  2010: {
    goldenBall: { name: "Diego Forlán", country: "Uruguay", flag: "🇺🇾" },
    silverBall: { name: "Wesley Sneijder", country: "Netherlands", flag: "🇳🇱" },
    bronzeBall: { name: "David Villa", country: "Spain", flag: "🇪🇸" },
    goldenBoot: { name: "Diego Forlán", country: "Uruguay", flag: "🇺🇾", detail: "5 goals (shared)" },
    goldenGlove: { name: "Iker Casillas", country: "Spain", flag: "🇪🇸" },
    bestYoungPlayer: { name: "Thomas Müller", country: "Germany", flag: "🇩🇪" },
    fairPlay: { team: "Spain", flag: "🇪🇸" },
    prizePool: "$420M",
    winnerPrize: "$30M",
  },
  2006: {
    goldenBall: { name: "Zinedine Zidane", country: "France", flag: "🇫🇷" },
    silverBall: { name: "Fabio Cannavaro", country: "Italy", flag: "🇮🇹" },
    bronzeBall: { name: "Andrea Pirlo", country: "Italy", flag: "🇮🇹" },
    goldenBoot: { name: "Miroslav Klose", country: "Germany", flag: "🇩🇪", detail: "5 goals" },
    goldenGlove: { name: "Gianluigi Buffon", country: "Italy", flag: "🇮🇹" },
    bestYoungPlayer: { name: "Lukas Podolski", country: "Germany", flag: "🇩🇪" },
    fairPlay: { team: "Brazil", flag: "🇧🇷" },
    prizePool: "$266M",
    winnerPrize: "$20M",
  },
  2002: {
    goldenBall: { name: "Oliver Kahn", country: "Germany", flag: "🇩🇪" },
    silverBall: { name: "Ronaldo", country: "Brazil", flag: "🇧🇷" },
    bronzeBall: { name: "Hong Myung-bo", country: "South Korea", flag: "🇰🇷" },
    goldenBoot: { name: "Ronaldo", country: "Brazil", flag: "🇧🇷", detail: "8 goals" },
    goldenGlove: { name: "Oliver Kahn", country: "Germany", flag: "🇩🇪" },
    bestYoungPlayer: { name: "Landon Donovan", country: "USA", flag: "🇺🇸" },
    fairPlay: { team: "Belgium", flag: "🇧🇪" },
    prizePool: "$190M",
    winnerPrize: "$15M",
  },
  1998: {
    goldenBall: { name: "Ronaldo", country: "Brazil", flag: "🇧🇷" },
    goldenBoot: { name: "Davor Šuker", country: "Croatia", flag: "🇭🇷", detail: "6 goals" },
    goldenGlove: { name: "Fabien Barthez", country: "France", flag: "🇫🇷" },
    fairPlay: { team: "England", flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿" },
    prizePool: "$103M",
    winnerPrize: "$6M",
  },
  1994: {
    goldenBall: { name: "Romário", country: "Brazil", flag: "🇧🇷" },
    goldenBoot: { name: "Oleg Salenko", country: "Russia", flag: "🇷🇺", detail: "6 goals (shared)" },
    goldenGlove: { name: "Michel Preud'homme", country: "Belgium", flag: "🇧🇪" },
    fairPlay: { team: "Brazil", flag: "🇧🇷" },
    prizePool: "$71M",
    winnerPrize: "$4M",
  },
  1990: {
    goldenBall: { name: "Salvatore Schillaci", country: "Italy", flag: "🇮🇹" },
    goldenBoot: { name: "Salvatore Schillaci", country: "Italy", flag: "🇮🇹", detail: "6 goals" },
    goldenGlove: { name: "Luis Goycochea", country: "Argentina", flag: "🇦🇷" },
    fairPlay: { team: "England", flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿" },
  },
  1986: {
    goldenBall: { name: "Diego Maradona", country: "Argentina", flag: "🇦🇷" },
    goldenBoot: { name: "Gary Lineker", country: "England", flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", detail: "6 goals" },
    fairPlay: { team: "Brazil", flag: "🇧🇷" },
  },
  1982: {
    goldenBall: { name: "Paolo Rossi", country: "Italy", flag: "🇮🇹" },
    goldenBoot: { name: "Paolo Rossi", country: "Italy", flag: "🇮🇹", detail: "6 goals" },
    goldenGlove: { name: "Dino Zoff", country: "Italy", flag: "🇮🇹", detail: "Best keeper (era)" },
    fairPlay: { team: "Brazil", flag: "🇧🇷" },
  },
  1978: {
    goldenBall: { name: "Mario Kempes", country: "Argentina", flag: "🇦🇷" },
    goldenBoot: { name: "Mario Kempes", country: "Argentina", flag: "🇦🇷", detail: "6 goals" },
    fairPlay: { team: "Argentina", flag: "🇦🇷" },
  },
  1974: {
    goldenBall: { name: "Johan Cruyff", country: "Netherlands", flag: "🇳🇱" },
    goldenBoot: { name: "Grzegorz Lato", country: "Poland", flag: "🇵🇱", detail: "7 goals" },
    fairPlay: { team: "West Germany", flag: "🇩🇪" },
  },
  1970: {
    goldenBall: { name: "Pelé", country: "Brazil", flag: "🇧🇷" },
    goldenBoot: { name: "Gerd Müller", country: "West Germany", flag: "🇩🇪", detail: "10 goals" },
    fairPlay: { team: "Peru", flag: "🇵🇪" },
  },
  1966: {
    goldenBoot: { name: "Eusébio", country: "Portugal", flag: "🇵🇹", detail: "9 goals" },
  },
  1962: {
    goldenBoot: { name: "Flórián Albert", country: "Hungary", flag: "🇭🇺", detail: "4 goals (shared)" },
  },
  1958: {
    goldenBoot: { name: "Just Fontaine", country: "France", flag: "🇫🇷", detail: "13 goals" },
  },
  1954: {
    goldenBoot: { name: "Sándor Kocsis", country: "Hungary", flag: "🇭🇺", detail: "11 goals" },
  },
  1950: {
    goldenBoot: { name: "Ademir", country: "Brazil", flag: "🇧🇷", detail: "9 goals" },
  },
  1938: {
    goldenBoot: { name: "Leônidas", country: "Brazil", flag: "🇧🇷", detail: "7 goals" },
  },
  1934: {
    goldenBoot: { name: "Oldřich Nejedlý", country: "Czechoslovakia", flag: "🇨🇿", detail: "5 goals" },
  },
  1930: {
    goldenBoot: { name: "Guillermo Stábile", country: "Argentina", flag: "🇦🇷", detail: "8 goals" },
  },
};

export function getEditionAwards(year: number): EditionAwards | undefined {
  return EDITION_AWARDS[year];
}

export const AWARD_LEGEND = [
  { key: "goldenBall", label: "Golden Ball", icon: "⚽", since: 1982 },
  { key: "silverBall", label: "Silver Ball", icon: "🥈", since: 2010 },
  { key: "bronzeBall", label: "Bronze Ball", icon: "🥉", since: 2010 },
  { key: "goldenBoot", label: "Golden Boot", icon: "👟", since: 1982 },
  { key: "goldenGlove", label: "Golden Glove", icon: "🧤", since: 1994 },
  { key: "bestYoungPlayer", label: "Best Young Player", icon: "⭐", since: 2006 },
  { key: "fairPlay", label: "Fair Play Trophy", icon: "🤝", since: 1970 },
] as const;
