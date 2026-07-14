// Original editorial content for the World Cup history hub.
// Written summaries (not scraped data) covering the tournament's
// greatest matches and its defining players.

export interface GreatestMatch {
  id: string;
  year: number;
  stage: string;
  title: string;
  scoreline: string;
  teams: { home: string; homeFlag: string; away: string; awayFlag: string };
  venue: string;
  summary: string;
  why: string;
}

export const GREATEST_MATCHES: GreatestMatch[] = [
  {
    id: "maracanazo-1950",
    year: 1950,
    stage: "Deciding match",
    title: "The Maracanazo",
    scoreline: "Uruguay 2–1 Brazil",
    teams: { home: "Uruguay", homeFlag: "🇺🇾", away: "Brazil", awayFlag: "🇧🇷" },
    venue: "Maracanã, Rio de Janeiro",
    summary:
      "Brazil needed only a draw to be crowned champions in front of an official crowd of nearly 200,000 — the largest ever to watch a football match. After Friaça put the hosts ahead, Uruguay struck back through Juan Alberto Schiaffino and, with 11 minutes left, Alcides Ghiggia. The Maracanã fell silent.",
    why: "Widely regarded as the greatest upset in World Cup history and a national trauma still referenced in Brazil today.",
  },
  {
    id: "miracle-of-bern-1954",
    year: 1954,
    stage: "Final",
    title: "The Miracle of Bern",
    scoreline: "West Germany 3–2 Hungary",
    teams: { home: "West Germany", homeFlag: "🇩🇪", away: "Hungary", awayFlag: "🇭🇺" },
    venue: "Wankdorf Stadium, Bern",
    summary:
      "Hungary's 'Golden Team' — unbeaten for four years and 2–0 up inside eight minutes — were stunned as West Germany fought back to win with Helmut Rahn's late strike on a rain-soaked pitch.",
    why: "West Germany's first world title is credited with lifting a nation's spirits in the post-war era.",
  },
  {
    id: "game-of-the-century-1970",
    year: 1970,
    stage: "Semi-final",
    title: "The Game of the Century",
    scoreline: "Italy 4–3 West Germany",
    teams: { home: "Italy", homeFlag: "🇮🇹", away: "West Germany", awayFlag: "🇩🇪" },
    venue: "Estadio Azteca, Mexico City",
    summary:
      "Five of the seven goals arrived in extra time in the thin Mexico City air. Karl-Heinz Schnellinger forced extra time in the 90th minute, and the sides traded blows before Gianni Rivera settled a breathless classic.",
    why: "A plaque outside the Azteca commemorates it as the 'Partido del Siglo' — the Match of the Century.",
  },
  {
    id: "hand-of-god-1986",
    year: 1986,
    stage: "Quarter-final",
    title: "Hand of God & Goal of the Century",
    scoreline: "Argentina 2–1 England",
    teams: { home: "Argentina", homeFlag: "🇦🇷", away: "England", awayFlag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿" },
    venue: "Estadio Azteca, Mexico City",
    summary:
      "Within four minutes Diego Maradona produced the tournament's two most famous goals: first punching the ball past Peter Shilton, then slaloming past half the England team from inside his own half to score what a FIFA poll later named the Goal of the Century.",
    why: "No single player has ever defined a match — the sublime and the scandalous — quite like this.",
  },
  {
    id: "rossi-1982",
    year: 1982,
    stage: "Second group stage",
    title: "Rossi silences the Seleção",
    scoreline: "Italy 3–2 Brazil",
    teams: { home: "Italy", homeFlag: "🇮🇹", away: "Brazil", awayFlag: "🇧🇷" },
    venue: "Estadi de Sarrià, Barcelona",
    summary:
      "Needing only a draw, a Brazil side of Zico, Sócrates and Falcão were undone by a Paolo Rossi hat-trick. Italy rode the momentum all the way to the title.",
    why: "The day 'jogo bonito' met its match, and Rossi went from doubted to golden.",
  },
  {
    id: "mineirazo-2014",
    year: 2014,
    stage: "Semi-final",
    title: "The Mineirazo",
    scoreline: "Germany 7–1 Brazil",
    teams: { home: "Germany", homeFlag: "🇩🇪", away: "Brazil", awayFlag: "🇧🇷" },
    venue: "Estádio Mineirão, Belo Horizonte",
    summary:
      "Host nation Brazil conceded four goals in six first-half minutes as Germany produced the most shocking scoreline the latter stages have ever seen, on their way to a fourth world title.",
    why: "A result so seismic it entered the language — 64 years after the Maracanazo, another Brazilian collapse.",
  },
  {
    id: "greatest-final-2022",
    year: 2022,
    stage: "Final",
    title: "The greatest Final ever",
    scoreline: "Argentina 3–3 France (4–2 pens)",
    teams: { home: "Argentina", homeFlag: "🇦🇷", away: "France", awayFlag: "🇫🇷" },
    venue: "Lusail Stadium, Qatar",
    summary:
      "Lionel Messi and Kylian Mbappé traded goals in a final that swung from a comfortable Argentina lead to a Mbappé hat-trick and, ultimately, a penalty shootout. Messi finally lifted the trophy that had eluded him.",
    why: "Routinely voted the finest World Cup final of all time and the crowning moment of Messi's career.",
  },
  {
    id: "zidane-2006",
    year: 2006,
    stage: "Final",
    title: "Zidane's farewell",
    scoreline: "Italy 1–1 France (5–3 pens)",
    teams: { home: "Italy", homeFlag: "🇮🇹", away: "France", awayFlag: "🇫🇷" },
    venue: "Olympiastadion, Berlin",
    summary:
      "Zinedine Zidane chipped a Panenka penalty to open the scoring, but his glittering career ended with a red card for headbutting Marco Materazzi. Italy held their nerve in the shootout to win a fourth star.",
    why: "One of sport's most unforgettable exits — genius and downfall in a single night.",
  },
];

export interface Legend {
  id: string;
  name: string;
  country: string;
  flag: string;
  era: string;
  worldCups: string;
  honour: string;
  summary: string;
}

export const WC_LEGENDS: Legend[] = [
  {
    id: "pele",
    name: "Pelé",
    country: "Brazil",
    flag: "🇧🇷",
    era: "1958–1970",
    worldCups: "3 titles (1958, 1962, 1970)",
    honour: "Only player to win three World Cups",
    summary:
      "A 17-year-old sensation in 1958, Pelé scored a hat-trick in the semi-final and two in the final. He remains the youngest scorer in World Cup history and the only man with three winners' medals, capping his legacy with Brazil's iconic 1970 side.",
  },
  {
    id: "maradona",
    name: "Diego Maradona",
    country: "Argentina",
    flag: "🇦🇷",
    era: "1982–1994",
    worldCups: "1 title (1986)",
    honour: "1986 Golden Ball & Goal of the Century",
    summary:
      "Maradona almost single-handedly dragged Argentina to the 1986 title, scoring or assisting 10 of their 14 goals. His quarter-final against England — the 'Hand of God' and the greatest solo goal ever — defined an era.",
  },
  {
    id: "messi",
    name: "Lionel Messi",
    country: "Argentina",
    flag: "🇦🇷",
    era: "2006–2022",
    worldCups: "1 title (2022)",
    honour: "Two-time Golden Ball winner",
    summary:
      "After heartbreak in the 2014 final, Messi delivered in 2022 — scoring seven goals, winning the Golden Ball for a record second time, and finally lifting the trophy in the greatest final ever played.",
  },
  {
    id: "beckenbauer",
    name: "Franz Beckenbauer",
    country: "West Germany",
    flag: "🇩🇪",
    era: "1966–1974",
    worldCups: "1 as captain (1974), 1 as manager (1990)",
    honour: "Won the World Cup as captain and coach",
    summary:
      "'Der Kaiser' redefined the sweeper role and captained West Germany to glory on home soil in 1974. In 1990 he became one of only three men to win the World Cup as both a player and a head coach.",
  },
  {
    id: "cruyff",
    name: "Johan Cruyff",
    country: "Netherlands",
    flag: "🇳🇱",
    era: "1974",
    worldCups: "Runner-up (1974)",
    honour: "Face of Total Football",
    summary:
      "Cruyff never won the World Cup, but his mesmeric Netherlands side of 1974 changed how the game is played. The 'Cruyff Turn', unveiled at that tournament, is still taught to children everywhere.",
  },
  {
    id: "ronaldo",
    name: "Ronaldo Nazário",
    country: "Brazil",
    flag: "🇧🇷",
    era: "1998–2006",
    worldCups: "2 titles (1994 squad, 2002)",
    honour: "Held the all-time scoring record (15)",
    summary:
      "'O Fenômeno' answered the questions of the 1998 final with a redemptive 2002 campaign, scoring both goals in the final and finishing top scorer. His record of 15 World Cup goals stood until 2014.",
  },
  {
    id: "klose",
    name: "Miroslav Klose",
    country: "Germany",
    flag: "🇩🇪",
    era: "2002–2014",
    worldCups: "1 title (2014)",
    honour: "All-time top scorer (16 goals)",
    summary:
      "Consistency personified, Klose scored across four consecutive World Cups and broke Ronaldo's record in the 2014 semi-final rout of Brazil, before ending his international career as a world champion.",
  },
  {
    id: "zidane",
    name: "Zinedine Zidane",
    country: "France",
    flag: "🇫🇷",
    era: "1998–2006",
    worldCups: "1 title (1998)",
    honour: "Two goals in the 1998 final",
    summary:
      "Zidane headed France to their first world title in 1998 and dragged them back to the final in 2006, winning the Golden Ball even as his career ended in a red card. A midfielder of rare elegance and drama.",
  },
  {
    id: "fontaine",
    name: "Just Fontaine",
    country: "France",
    flag: "🇫🇷",
    era: "1958",
    worldCups: "Third place (1958)",
    honour: "13 goals in a single tournament",
    summary:
      "Fontaine's 13 goals at the 1958 World Cup remain a record for a single edition that has never been seriously threatened — an astonishing haul achieved in just six matches.",
  },
  {
    id: "garrincha",
    name: "Garrincha",
    country: "Brazil",
    flag: "🇧🇷",
    era: "1958–1962",
    worldCups: "2 titles (1958, 1962)",
    honour: "Carried Brazil to the 1962 title",
    summary:
      "The 'Little Bird' was Pelé's dazzling foil in 1958 and, with Pelé injured, the driving force of Brazil's 1962 triumph — a dribbler of impossible balance and joy.",
  },
];
