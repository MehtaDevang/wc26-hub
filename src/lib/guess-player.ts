import type { GuessPlayer } from "./types";
import { pickDailySet } from "./puzzles/daily";

const NATIONALITY_FLAGS: Record<string, string> = {
  Argentina: "🇦🇷", Portugal: "🇵🇹", France: "🇫🇷", Brazil: "🇧🇷", Croatia: "🇭🇷",
  England: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", Egypt: "🇪🇬", Netherlands: "🇳🇱", Spain: "🇪🇸", Norway: "🇳🇴",
  Morocco: "🇲🇦", Belgium: "🇧🇪", Germany: "🇩🇪", Italy: "🇮🇹", Poland: "🇵🇱",
  Colombia: "🇨🇴", Uruguay: "🇺🇾", Senegal: "🇸🇳", USA: "🇺🇸", Canada: "🇨🇦",
  Mexico: "🇲🇽", "South Korea": "🇰🇷",
};

const NATIONALITY_CONTINENT: Record<string, string> = {
  Argentina: "South America", Brazil: "South America", Colombia: "South America", Uruguay: "South America",
  Portugal: "Europe", France: "Europe", Croatia: "Europe", England: "Europe", Netherlands: "Europe",
  Spain: "Europe", Norway: "Europe", Belgium: "Europe", Germany: "Europe", Italy: "Europe", Poland: "Europe",
  Egypt: "Africa", Morocco: "Africa", Senegal: "Africa",
  USA: "North America", Canada: "North America", Mexico: "North America",
  "South Korea": "Asia",
};

const CLUB_LEAGUE: Record<string, string> = {
  "Inter Miami": "MLS", "Al Nassr": "Saudi Pro League", "Real Madrid": "La Liga", Santos: "Brasileirão",
  "Bayern Munich": "Bundesliga", Liverpool: "Premier League", Barcelona: "La Liga",
  "Manchester City": "Premier League", "Inter Milan": "Serie A", PSG: "Ligue 1",
  "Atlético Madrid": "La Liga", Arsenal: "Premier League", Tottenham: "Premier League",
  "AC Milan": "Serie A", Salernitana: "Serie A",
};

export const GUESS_PLAYERS: GuessPlayer[] = [
  { name: "Lionel Messi", nationality: "Argentina", position: "Forward", club: "Inter Miami", league: "MLS", worldCups: 6, goals: 13, age: 39, caps: 190, nickname: "La Pulga", hint: "Won the World Cup in 2022. 8 Ballon d'Ors.", extraHints: ["Won Copa América in 2021 and 2024.", "Spent most of his career at Barcelona."], aliases: ["messi", "leo messi", "lionel andres messi"], flag: "🇦🇷" },
  { name: "Cristiano Ronaldo", nationality: "Portugal", position: "Forward", club: "Al Nassr", league: "Saudi Pro League", worldCups: 6, goals: 136, age: 41, caps: 220, nickname: "CR7", hint: "All-time international top scorer. 5 Champions League titles.", extraHints: ["Euro 2016 champion with Portugal.", "Famous for his 'Siu' celebration."], aliases: ["ronaldo", "cr7", "cristiano ronaldo"], flag: "🇵🇹" },
  { name: "Kylian Mbappé", nationality: "France", position: "Forward", club: "Real Madrid", league: "La Liga", worldCups: 3, goals: 12, age: 27, caps: 90, hint: "Scored a hat-trick in the 2022 World Cup final.", extraHints: ["Golden Boot at Russia 2018.", "Born in Bondy, Paris suburbs."], aliases: ["mbappe", "mbappé", "kylian mbappe"], flag: "🇫🇷" },
  { name: "Neymar Jr", nationality: "Brazil", position: "Forward", club: "Santos", league: "Brasileirão", worldCups: 3, goals: 8, age: 34, caps: 128, hint: "Brazil's all-time top scorer until 2023.", extraHints: ["Joined PSG for a world-record fee in 2017.", "Won Olympic gold in Rio 2016."], aliases: ["neymar", "neymar jr", "neymar junior"], flag: "🇧🇷" },
  { name: "Luka Modrić", nationality: "Croatia", position: "Midfielder", club: "Real Madrid", league: "La Liga", worldCups: 4, goals: 2, age: 40, caps: 190, hint: "Won the 2018 Ballon d'Or. Led Croatia to the 2018 final.", extraHints: ["Croatia's most capped player.", "Famous for his outside-of-the-boot passes."], aliases: ["modric", "modrić", "luka modric"], flag: "🇭🇷" },
  { name: "Harry Kane", nationality: "England", position: "Forward", club: "Bayern Munich", league: "Bundesliga", worldCups: 3, goals: 8, age: 32, caps: 110, hint: "England captain. Golden Boot winner at Russia 2018.", extraHints: ["England's all-time top scorer.", "Left Tottenham after 19 years at the club."], aliases: ["kane", "harry kane"], flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿" },
  { name: "Mohamed Salah", nationality: "Egypt", position: "Forward", club: "Liverpool", league: "Premier League", worldCups: 2, goals: 2, age: 34, caps: 110, nickname: "The Egyptian King", hint: "The Egyptian King. Premier League Golden Boot winner.", extraHints: ["Scored 32 Premier League goals in 2017-18.", "Left-footed winger who cuts inside from the right."], aliases: ["salah", "mo salah", "mohamed salah"], flag: "🇪🇬" },
  { name: "Virgil van Dijk", nationality: "Netherlands", position: "Defender", club: "Liverpool", league: "Premier League", worldCups: 2, goals: 1, age: 34, caps: 80, hint: "Dutch captain. Runner-up for 2019 Ballon d'Or.", extraHints: ["Towering centre-back at 1.93m.", "Scored the winner in the 2019 Champions League final."], aliases: ["van dijk", "virgil van dijk", "vvd"], flag: "🇳🇱" },
  { name: "Jude Bellingham", nationality: "England", position: "Midfielder", club: "Real Madrid", league: "La Liga", worldCups: 2, goals: 3, age: 22, caps: 40, hint: "England's youngest World Cup goalscorer in 2022.", extraHints: ["Broke Real Madrid's scoring record for a midfielder in debut season.", "Former Birmingham City teenager."], aliases: ["bellingham", "jude bellingham"], flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿" },
  { name: "Lamine Yamal", nationality: "Spain", position: "Forward", club: "Barcelona", league: "La Liga", worldCups: 1, goals: 0, age: 18, caps: 15, hint: "Youngest ever Euro champion. Born in 2007.", extraHints: ["Youngest goalscorer in European Championship history.", "Plays predominantly on the right wing."], aliases: ["yamal", "lamine yamal"], flag: "🇪🇸" },
  { name: "Erling Haaland", nationality: "Norway", position: "Forward", club: "Manchester City", league: "Premier League", worldCups: 0, goals: 0, age: 25, caps: 40, hint: "Norwegian striker. 36 Premier League goals in 2022-23.", extraHints: ["Son of former Norway defender Alf-Inge Haaland.", "Famous for his zen meditation goal celebration."], aliases: ["haaland", "erling haaland"], flag: "🇳🇴" },
  { name: "Vinícius Jr", nationality: "Brazil", position: "Forward", club: "Real Madrid", league: "La Liga", worldCups: 2, goals: 1, age: 25, caps: 35, nickname: "Vini Jr", hint: "Brazil's #7. Famous for dribbling and pace.", extraHints: ["Champions League final hero in 2022 and 2024.", "Grew up in São Gonçalo, Rio de Janeiro."], aliases: ["vinicius", "vini jr", "vinícius jr", "vinicius jr"], flag: "🇧🇷" },
  { name: "Lautaro Martínez", nationality: "Argentina", position: "Forward", club: "Inter Milan", league: "Serie A", worldCups: 2, goals: 5, age: 28, caps: 70, nickname: "El Toro", hint: "Scored in the 2022 World Cup final.", extraHints: ["Serie A top scorer multiple seasons with Inter.", "Celebrates with a bull-horns gesture."], aliases: ["lautaro", "lautaro martinez", "lautaro martínez"], flag: "🇦🇷" },
  { name: "Pedri", nationality: "Spain", position: "Midfielder", club: "Barcelona", league: "La Liga", worldCups: 1, goals: 0, age: 23, caps: 25, hint: "Spanish wonderkid. Young Player of Euro 2020.", extraHints: ["Wears the iconic Barcelona #8 shirt.", "Compared to Andrés Iniesta for his passing range."], aliases: ["pedri", "pedro gonzalez"], flag: "🇪🇸" },
  { name: "Achraf Hakimi", nationality: "Morocco", position: "Defender", club: "PSG", league: "Ligue 1", worldCups: 2, goals: 1, age: 26, caps: 80, hint: "Moroccan right-back. 2022 World Cup semifinalist.", extraHints: ["Born in Madrid, played for Real Madrid's academy.", "One of the fastest full-backs in world football."], aliases: ["hakimi", "achraf hakimi"], flag: "🇲🇦" },
  { name: "Kevin De Bruyne", nationality: "Belgium", position: "Midfielder", club: "Manchester City", league: "Premier League", worldCups: 3, goals: 5, age: 34, caps: 110, nickname: "KDB", hint: "Belgian playmaker. Known for assists and long-range strikes.", extraHints: ["Most Premier League assists in a single season (20).", "Started his career at Genk in Belgium."], aliases: ["de bruyne", "kevin de bruyne", "kdb"], flag: "🇧🇪" },
  { name: "Antoine Griezmann", nationality: "France", position: "Forward", club: "Atlético Madrid", league: "La Liga", worldCups: 3, goals: 5, age: 35, caps: 140, hint: "France's all-time top scorer until 2023. 2018 World Cup winner.", extraHints: ["Famous 'Hotline Bling' celebration dance.", "Played for both Real Sociedad and Atlético Madrid."], aliases: ["griezmann", "antoine griezmann"], flag: "🇫🇷" },
  { name: "Rodri", nationality: "Spain", position: "Midfielder", club: "Manchester City", league: "Premier League", worldCups: 2, goals: 1, age: 29, caps: 50, hint: "Spanish holding midfielder. Won Euro 2024 and the Ballon d'Or in 2024.", extraHints: ["Scored the winner in the 2023 Champions League final.", "Former Villarreal and Atlético Madrid player."], aliases: ["rodri", "rodrigo hernandez"], flag: "🇪🇸" },
  { name: "Bukayo Saka", nationality: "England", position: "Forward", club: "Arsenal", league: "Premier League", worldCups: 2, goals: 3, age: 24, caps: 45, hint: "England winger. Missed the decisive penalty in Euro 2020 final.", extraHints: ["Arsenal academy graduate and fan favourite.", "Plays on both wings for club and country."], aliases: ["saka", "bukayo saka"], flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿" },
  { name: "Alisson", nationality: "Brazil", position: "Goalkeeper", club: "Liverpool", league: "Premier League", worldCups: 2, goals: 0, age: 33, caps: 70, hint: "Brazil #1 keeper. Won the 2019 Copa América.", extraHints: ["Scored a dramatic header in a Champions League match.", "Former Roma goalkeeper before Liverpool move."], aliases: ["alisson", "alisson becker"], flag: "🇧🇷" },
  { name: "Gianluigi Donnarumma", nationality: "Italy", position: "Goalkeeper", club: "PSG", league: "Ligue 1", worldCups: 1, goals: 0, age: 27, caps: 70, hint: "Saved three penalties in the Euro 2020 final shootout.", extraHints: ["AC Milan academy product who debuted at 16.", "Won the Golden Glove at Euro 2020."], aliases: ["donnarumma", "gianluigi donnarumma"], flag: "🇮🇹" },
  { name: "Son Heung-min", nationality: "South Korea", position: "Forward", club: "Tottenham", league: "Premier League", worldCups: 3, goals: 3, age: 33, caps: 120, hint: "South Korea captain. First Asian player to win the Premier League Golden Boot.", extraHints: ["Completed mandatory military service in 2020.", "Famous for his two-footed finishing ability."], aliases: ["son", "heung-min son", "son heung min"], flag: "🇰🇷" },
  { name: "Alphonso Davies", nationality: "Canada", position: "Defender", club: "Bayern Munich", league: "Bundesliga", worldCups: 1, goals: 0, age: 25, caps: 50, hint: "Canadian left-back born in a refugee camp in Ghana.", extraHints: ["Fled Liberia as a child refugee.", "One of the fastest players in the Bundesliga."], aliases: ["davies", "alphonso davies"], flag: "🇨🇦" },
  { name: "Christian Pulisic", nationality: "USA", position: "Forward", club: "AC Milan", league: "Serie A", worldCups: 2, goals: 2, age: 27, caps: 70, nickname: "Captain America", hint: "American winger nicknamed 'Captain America'.", extraHints: ["Chelsea academy graduate before Milan move.", "Scored the goal that sent USA to Qatar 2022."], aliases: ["pulisic", "christian pulisic"], flag: "🇺🇸" },
  { name: "Guillermo Ochoa", nationality: "Mexico", position: "Goalkeeper", club: "Salernitana", league: "Serie A", worldCups: 5, goals: 0, age: 39, caps: 150, nickname: "Memo", hint: "Mexican keeper famous for heroics against Brazil at Brazil 2014.", extraHints: ["Famous dyed hair at multiple World Cups.", "Mexico's most capped goalkeeper."], aliases: ["ochoa", "memo ochoa", "guillermo ochoa"], flag: "🇲🇽" },
  { name: "Luis Díaz", nationality: "Colombia", position: "Forward", club: "Liverpool", league: "Premier League", worldCups: 1, goals: 0, age: 28, caps: 55, hint: "Colombian winger from Barrancas. Father was kidnapped in 2022.", extraHints: ["Father freed after a high-profile kidnapping saga.", "Former Porto star before Liverpool transfer."], aliases: ["diaz", "luis diaz", "luis díaz"], flag: "🇨🇴" },
  { name: "Federico Valverde", nationality: "Uruguay", position: "Midfielder", club: "Real Madrid", league: "La Liga", worldCups: 2, goals: 0, age: 26, caps: 65, hint: "Uruguayan engine. Famous for his long-range thunderbolts.", extraHints: ["Can play as a right-back in emergencies.", "Former Peñarol youngster from Montevideo."], aliases: ["valverde", "federico valverde"], flag: "🇺🇾" },
  { name: "Robert Lewandowski", nationality: "Poland", position: "Forward", club: "Barcelona", league: "La Liga", worldCups: 2, goals: 2, age: 37, caps: 150, nickname: "Lewa", hint: "Poland's all-time top scorer. Won the 2020 Ballon d'Or.", extraHints: ["Scored 5 goals in 9 minutes for Bayern vs Wolfsburg.", "Former Dortmund striker before Bayern dominance."], aliases: ["lewandowski", "robert lewandowski", "lewa"], flag: "🇵🇱" },
  { name: "Sadio Mané", nationality: "Senegal", position: "Forward", club: "Al Nassr", league: "Saudi Pro League", worldCups: 2, goals: 0, age: 34, caps: 110, hint: "Senegalese forward. Won the 2021 Africa Cup of Nations.", extraHints: ["Formed a deadly Liverpool trio with Salah and Firmino.", "Built a hospital in his hometown of Bambali."], aliases: ["mane", "mané", "sadio mane"], flag: "🇸🇳" },
  { name: "Manuel Neuer", nationality: "Germany", position: "Goalkeeper", club: "Bayern Munich", league: "Bundesliga", worldCups: 4, goals: 0, age: 39, caps: 120, hint: "Revolutionary sweeper-keeper. 2014 World Cup winner.", extraHints: ["Pioneered the modern 'sweeper-keeper' role.", "Germany captain for over a decade."], aliases: ["neuer", "manuel neuer"], flag: "🇩🇪" },
];

export type ClueTier = "easy" | "medium" | "hard";

export interface PlayerClue {
  label: string;
  text: string;
  tier: ClueTier;
}

export const MAX_GUESSES_PER_ROUND = 6;
export const STARTING_CLUES = 3;

function getNameMeta(name: string) {
  const parts = name.split(" ").filter(Boolean);
  const firstName = parts[0] ?? "";
  const lastName = parts[parts.length - 1] ?? firstName;
  return {
    firstInitial: firstName[0]?.toUpperCase() ?? "?",
    lastInitial: lastName[0]?.toUpperCase() ?? "?",
    wordCount: parts.length,
    letterCount: name.replace(/[^a-zA-ZÀ-ÿ]/g, "").length,
  };
}

export function getPlayerFlag(player: GuessPlayer): string {
  return player.flag ?? NATIONALITY_FLAGS[player.nationality] ?? "⚽";
}

export function getDailyPlayers(date = new Date()): GuessPlayer[] {
  return pickDailySet(GUESS_PLAYERS, 5, date, 0);
}

export function normalizeGuess(input: string): string {
  return input
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();
}

export function checkGuess(guess: string, player: GuessPlayer): boolean {
  const normalized = normalizeGuess(guess);
  const names = [player.name, ...player.aliases].map(normalizeGuess);
  return names.some(
    (name) => normalized === name || name.includes(normalized) || normalized.includes(name)
  );
}

export function getPlayerClues(player: GuessPlayer): PlayerClue[] {
  const meta = getNameMeta(player.name);
  const continent = NATIONALITY_CONTINENT[player.nationality] ?? "international football";
  const league = player.league ?? CLUB_LEAGUE[player.club];
  const clues: PlayerClue[] = [
    { label: "Region", tier: "easy", text: `Plays for a ${continent} nation` },
    { label: "Nation", tier: "easy", text: `International team: ${player.nationality}` },
    { label: "Role", tier: "easy", text: `Position: ${player.position}` },
  ];

  if (player.age) {
    clues.push({ label: "Age", tier: "medium", text: `Currently ${player.age} years old` });
  }
  if (league) {
    clues.push({ label: "League", tier: "medium", text: `Club competes in ${league}` });
  }
  clues.push({ label: "Club", tier: "medium", text: `Plays for ${player.club}` });

  if (player.caps) {
    clues.push({ label: "Caps", tier: "hard", text: `Earned ${player.caps}+ international caps` });
  }
  clues.push({ label: "World Cups", tier: "hard", text: `Featured in ${player.worldCups} World Cup tournament${player.worldCups === 1 ? "" : "s"}` });
  clues.push({ label: "Goals", tier: "hard", text: `${player.goals} career international goal${player.goals === 1 ? "" : "s"}` });

  if (player.nickname) {
    clues.push({ label: "Nickname", tier: "hard", text: `Often called "${player.nickname}"` });
  }

  clues.push({
    label: "Name hint",
    tier: "hard",
    text: `${meta.wordCount}-word name · starts with "${meta.firstInitial}" · ${meta.letterCount} letters`,
  });
  clues.push({ label: "Trivia I", tier: "hard", text: player.hint });

  for (const [i, extra] of (player.extraHints ?? []).entries()) {
    clues.push({ label: `Trivia ${i + 2}`, tier: "hard", text: extra });
  }

  return clues;
}

export function getVisibleClues(
  wrongGuesses: number,
  player: GuessPlayer
): { revealed: PlayerClue[]; locked: PlayerClue[]; total: number; revealedCount: number } {
  const all = getPlayerClues(player);
  const revealedCount = Math.min(all.length, STARTING_CLUES + wrongGuesses);
  return {
    revealed: all.slice(0, revealedCount),
    locked: all.slice(revealedCount),
    total: all.length,
    revealedCount,
  };
}

export const CLUE_TIER_STYLES: Record<ClueTier, { badge: string; border: string }> = {
  easy: { badge: "text-emerald-600 bg-emerald-50", border: "border-emerald-100" },
  medium: { badge: "text-blue-600 bg-blue-50", border: "border-blue-100" },
  hard: { badge: "text-violet-600 bg-violet-50", border: "border-violet-100" },
};
