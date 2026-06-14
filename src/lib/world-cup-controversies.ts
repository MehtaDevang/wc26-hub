export type ControversyCategory =
  | "on-field"
  | "off-field"
  | "hosting"
  | "governance"
  | "wc26";

export interface WorldCupControversy {
  id: string;
  title: string;
  edition: string;
  year: number;
  category: ControversyCategory;
  summary: string;
  facts: string[];
  outcome?: string;
}

export const CONTROVERSY_CATEGORIES: Record<
  ControversyCategory,
  { label: string; color: string }
> = {
  wc26: { label: "WC26", color: "bg-[var(--wc-usa-light)] text-[var(--wc-usa)]" },
  "on-field": { label: "On-field", color: "bg-red-50 text-red-700" },
  "off-field": { label: "Off-field", color: "bg-amber-50 text-amber-800" },
  hosting: { label: "Hosting", color: "bg-emerald-50 text-emerald-800" },
  governance: { label: "Governance", color: "bg-violet-50 text-violet-700" },
};

export const WORLD_CUP_CONTROVERSIES: WorldCupControversy[] = [
  {
    id: "wc26-expansion",
    title: "48-team expansion",
    edition: "2026",
    year: 2026,
    category: "wc26",
    summary:
      "FIFA expanded the World Cup from 32 to 48 teams, changing the format to 12 groups of four with the top two plus eight best third-place teams advancing.",
    facts: [
      "Approved in 2017; critics argued it dilutes quality and adds more low-stakes group games.",
      "Expands slots for smaller confederations but increases the tournament from 64 to 104 matches.",
      "Some coaches and former players warned the format could encourage defensive play in group stage.",
    ],
    outcome: "Format confirmed for 2026; first 48-team World Cup.",
  },
  {
    id: "wc26-tri-host",
    title: "First tri-nation World Cup",
    edition: "2026",
    year: 2026,
    category: "wc26",
    summary:
      "Mexico, the United States, and Canada will co-host, requiring fans and teams to travel across North America.",
    facts: [
      "16 host cities span three countries — the widest geographic spread in World Cup history.",
      "Environmental groups raised concerns about carbon emissions from long-haul fan and team travel.",
      "Visa requirements and border crossings add logistical complexity for supporters.",
    ],
  },
  {
    id: "wc26-turf",
    title: "Artificial turf debate",
    edition: "2026",
    year: 2026,
    category: "wc26",
    summary:
      "Several proposed 2026 venues use or have used artificial turf, reviving a debate from Canada 2015 (Women's World Cup).",
    facts: [
      "Some NFL stadiums in the US host schedule use synthetic surfaces.",
      "Players' unions historically opposed turf at major tournaments citing injury risk.",
      "FIFA has permitted hybrid and artificial surfaces when certified; grass overlays have been used before.",
    ],
  },
  {
    id: "wc26-ticket-pricing",
    title: "Ticket pricing backlash",
    edition: "2026",
    year: 2026,
    category: "wc26",
    summary:
      "FIFA's initial 2026 ticket categories drew criticism after some group-stage prices were set far above prior tournaments.",
    facts: [
      "Category 1 seats for marquee matches were listed at levels many fans called unaffordable.",
      "Supporters' groups argued pricing excludes ordinary fans who sustain the sport.",
      "FIFA later adjusted some categories and added more lower-price inventory after public pressure.",
    ],
    outcome: "Pricing structure revised in phases after fan backlash.",
  },
  {
    id: "qatar-labor",
    title: "Qatar migrant worker conditions",
    edition: "2022",
    year: 2022,
    category: "hosting",
    summary:
      "Human-rights groups documented deaths and poor conditions among migrant workers building World Cup infrastructure.",
    facts: [
      "Amnesty International and others reported unpaid wages, unsafe sites, and restrictive kafala labor rules.",
      "Qatar introduced labor reforms including a minimum wage and heat-protection rules during construction.",
      "FIFA and Qatar disputed fatality figures; independent estimates varied widely.",
    ],
    outcome: "Qatar abolished kafala in 2020; reforms continued through 2022.",
  },
  {
    id: "qatar-winter-schedule",
    title: "Mid-season winter World Cup",
    edition: "2022",
    year: 2022,
    category: "hosting",
    summary:
      "Qatar's extreme summer heat forced the tournament into November–December, disrupting domestic leagues worldwide.",
    facts: [
      "First men's World Cup held outside the traditional June–July window.",
      "European leagues took extended winter breaks; players reported compressed seasons and injury concerns.",
      "Alcohol sales were restricted in stadiums, another break from prior tournaments.",
    ],
  },
  {
    id: "fifa-corruption-2015",
    title: "FIFA corruption scandal",
    edition: "2018 / 2022 bidding",
    year: 2015,
    category: "governance",
    summary:
      "US and Swiss investigations led to indictments of FIFA officials over bribery linked to World Cup hosting votes.",
    facts: [
      "DOJ charged officials with racketeering; Sepp Blatter resigned as FIFA president in 2015.",
      "Russia 2018 and Qatar 2022 awards faced renewed scrutiny though tournaments proceeded.",
      "FIFA introduced governance reforms and expanded the ethics committee.",
    ],
    outcome: "Multiple officials banned or convicted; FIFA restructuring announced.",
  },
  {
    id: "russia-2018-hosting",
    title: "Russia 2018 hosting concerns",
    edition: "2018",
    year: 2018,
    category: "hosting",
    summary:
      "Russia's annexation of Crimea (2014) and doping scandal raised political and sporting integrity questions before kickoff.",
    facts: [
      "Several governments boycotted ministerial visits; UK officials called for fan caution.",
      "Russian athletics remained banned from Olympics over state-sponsored doping; football sanctions were debated.",
      "Tournament proceeded without major security incidents; on-field use of VAR debuted.",
    ],
  },
  {
    id: "brazil-7-1",
    title: "Brazil's Mineirão humiliation",
    edition: "2014",
    year: 2014,
    category: "on-field",
    summary:
      "Germany beat hosts Brazil 7–1 in the semifinal at Belo Horizonte — the biggest margin in a World Cup semifinal.",
    facts: [
      "Brazil played without Neymar (injury) and captain Thiago Silva (suspension).",
      "Germany led 5–0 within 29 minutes; the result shocked the host nation.",
      "Brazilian media called it a national tragedy; Germany went on to win the final.",
    ],
  },
  {
    id: "suarez-bite",
    title: "Suárez bite incident",
    edition: "2014",
    year: 2014,
    category: "on-field",
    summary:
      "Uruguay's Luis Suárez bit Italy defender Giorgio Chiellini's shoulder during a group match.",
    facts: [
      "Suárez had two prior biting incidents at club level (2010, 2013).",
      "FIFA banned him for nine international matches and four months from all football activity.",
      "Uruguay still advanced; Suárez missed the rest of the tournament.",
    ],
    outcome: "9-match ban; Suárez apologized and transferred to Barcelona shortly after.",
  },
  {
    id: "lampard-ghost-goal",
    title: "Lampard's disallowed goal",
    edition: "2010",
    year: 2010,
    category: "on-field",
    summary:
      "Frank Lampard's shot clearly crossed the line against Germany in the round of 16, but no goal was awarded.",
    facts: [
      "England trailed 2–1; replays showed the ball was well over the line.",
      "Germany went on to win 4–1; the incident became a catalyst for goal-line technology.",
      "FIFA approved goal-line tech for 2014 and later expanded VAR.",
    ],
    outcome: "Directly influenced adoption of goal-line technology at future tournaments.",
  },
  {
    id: "suarez-handball-ghana",
    title: "Suárez handball vs Ghana",
    edition: "2010",
    year: 2010,
    category: "on-field",
    summary:
      "Suárez deliberately handled a goal-bound shot on the line in the quarterfinal; Asamoah Gyan missed the resulting penalty.",
    facts: [
      "Suárez received a red card but celebrated on the sideline as Ghana failed to convert.",
      "Uruguay won the shootout and reached the semifinals; Ghana became the last African hope.",
      "Debate split between gamesmanship within the rules vs. unfair denial of a certain goal.",
    ],
  },
  {
    id: "zidane-headbutt",
    title: "Zidane's headbutt final",
    edition: "2006",
    year: 2006,
    category: "on-field",
    summary:
      "France captain Zinedine Zidane headbutted Marco Materazzi in extra time of the final and was sent off.",
    facts: [
      "Materazzi later admitted provoking Zidane with personal insults.",
      "France played the penalty shootout a man down and lost to Italy.",
      "Zidane still won the Golden Ball; the moment ended his career on a red card.",
    ],
    outcome: "Italy won on penalties; Zidane retired.",
  },
  {
    id: "hand-of-god",
    title: "The Hand of God",
    edition: "1986",
    year: 1986,
    category: "on-field",
    summary:
      "Diego Maradona punched the ball past England keeper Peter Shilton for Argentina's opening goal in the quarterfinal.",
    facts: [
      "Maradona later called it 'a little with the head of Maradona and a little with the hand of God.'",
      "Same match produced his legitimate 'Goal of the Century' four minutes later.",
      "Tunisian referee Ali Bin Nasser did not see the handball; VAR did not exist.",
    ],
    outcome: "Argentina won 2–1 and went on to win the tournament.",
  },
  {
    id: "schumacher-battiston",
    title: "Schumacher–Battiston collision",
    edition: "1982",
    year: 1982,
    category: "on-field",
    summary:
      "West Germany keeper Harald Schumacher flattened France's Patrick Battiston in a semi-final challenge and was not penalized.",
    facts: [
      "Battiston lost teeth, suffered a vertebrae injury, and briefly lost consciousness.",
      "Dutch referee Charles Corver awarded only a goal kick; no card was shown.",
      "Widely regarded as one of the most dangerous challenges in World Cup history.",
    ],
    outcome: "West Germany won on penalties after a 3–3 draw.",
  },
  {
    id: "jules-rimet-stolen",
    title: "Jules Rimet Trophy stolen",
    edition: "Historical",
    year: 1983,
    category: "governance",
    summary:
      "The original Jules Rimet Trophy — awarded from 1930 to 1970 — was stolen from the Brazilian FA headquarters and never recovered.",
    facts: [
      "Brazil had been awarded permanent possession after winning a third title in 1970.",
      "The trophy was first stolen in England in 1966 before being recovered by a dog named Pickles.",
      "Only a replica remains on display; the current FIFA World Cup Trophy replaced it in 1974.",
    ],
  },
  {
    id: "1978-doubtful-final",
    title: "Argentina 1978 final doubts",
    edition: "1978",
    year: 1978,
    category: "off-field",
    summary:
      "Argentina's first World Cup win came amid military dictatorship and persistent rumors about Peru's 6–0 loss to Argentina.",
    facts: [
      "The junta used the tournament for propaganda; some players later described political pressure.",
      "Peru needed a large-margin loss for Argentina to reach the final on goal difference — Peru lost 6–0.",
      "No proof of match-fixing was ever confirmed; FIFA investigations found insufficient evidence.",
    ],
  },
  {
    id: "mussolini-1934",
    title: "Italy 1934 under fascism",
    edition: "1934",
    year: 1934,
    category: "off-field",
    summary:
      "Mussolini's Italy hosted and won the second World Cup amid allegations of biased refereeing and political influence.",
    facts: [
      "Fascist propaganda heavily promoted the tournament; il Duce met players and attended the final.",
      "Historians documented questionable referee appointments favoring Italy in key matches.",
      "Italy retained the title in 1938 in France, becoming the first repeat champions.",
    ],
  },
];

export const CONTROVERSY_SUMMARY = {
  total: WORLD_CUP_CONTROVERSIES.length,
  wc26: WORLD_CUP_CONTROVERSIES.filter((c) => c.category === "wc26").length,
  editions: new Set(WORLD_CUP_CONTROVERSIES.map((c) => c.edition)).size,
};
