export type IconicMomentCategory =
  | "goal"
  | "shock"
  | "triumph"
  | "controversy"
  | "stadium"
  | "player";

export interface IconicMoment {
  id: string;
  year: number;
  title: string;
  description: string;
  details: string;
  category: IconicMomentCategory;
  teams: string;
  imageUrl: string;
  imageAlt: string;
  era: "wc26" | "classic";
}

/** Curated iconic World Cup moments - images matched to each event (ESPN CDN for WC26, Wikimedia for classics). */
export const ICONIC_MOMENTS: IconicMoment[] = [
  {
    id: "wc26-mexico-opener",
    year: 2026,
    title: "Mexico roars on opening night at the Azteca",
    description:
      "El Tri beat South Africa 2-0 in the first match of World Cup 2026, with Julián Quiñones and Raúl Jiménez scoring as Estadio Azteca erupted.",
    details:
      "The 2026 tournament kicked off in front of 87,000 fans at the legendary Estadio Azteca - the only stadium to host two World Cup finals. Quiñones opened the scoring before half-time and Jiménez sealed victory with a header, sending Mexico top of Group A on day one.",
    category: "stadium",
    teams: "MEX 2-0 RSA",
    imageUrl:
      "https://a.espncdn.com/photo/2026/0611/r1671535_1296x729_16-9.jpg",
    imageAlt: "Mexico celebrate at Estadio Azteca on World Cup 2026 opening night",
    era: "wc26",
  },
  {
    id: "wc26-mexico-fans-goal",
    year: 2026,
    title: "Fans celebrate the first goal of World Cup 2026",
    description:
      "Mexico supporters erupt as the tournament's opening goal lights up the Azteca - the first of 104 matches across North America.",
    details:
      "The first goal of a World Cup always carries extra weight - and in 2026 it belonged to Mexico. Fans had waited years for this joint-hosted tournament, and the Azteca atmosphere set the tone for a month of football across three nations.",
    category: "triumph",
    teams: "Mexico vs South Africa",
    imageUrl:
      "https://a.espncdn.com/media/motion/2026/0611/dm_260611_COM_SOC_News_Mexico_fans_celebrate_opening_goal_of_the_2026_FIFA_World_Cup_20260611_GLOBAL/dm_260611_COM_SOC_News_Mexico_fans_celebrate_opening_goal_of_the_2026_FIFA_World_Cup_20260611_GLOBAL.jpg",
    imageAlt: "Mexico fans celebrate the opening goal of FIFA World Cup 2026",
    era: "wc26",
  },
  {
    id: "wc26-irankunda",
    year: 2026,
    title: "Irankunda announces himself on the world stage",
    description:
      "Teenager Nestory Irankunda scored as Australia beat Türkiye - a star is born in the Socceroos' World Cup campaign.",
    details:
      "Born in Burundi and raised in Australia, Irankunda became one of the youngest scorers of the tournament. His pace and composure against Türkiye drew comparisons to the Socceroos' golden generation and marked Australia as a team to watch.",
    category: "player",
    teams: "AUS 2-0 TUR",
    imageUrl: "https://a.espncdn.com/photo/2026/0614/r1672839_1296x729_16-9.jpg",
    imageAlt: "Nestory Irankunda celebrates with Mohamed Toure after scoring for Australia",
    era: "wc26",
  },
  {
    id: "wc26-usa-paraguay",
    year: 2026,
    title: "USA open their campaign in front of a home crowd",
    description:
      "The USMNT delivered a statement win over Paraguay to kick off their World Cup on home soil.",
    details:
      "Playing in front of a raucous home crowd, the United States sent an early message to Group D rivals. A confident performance against Paraguay fuelled belief that 2026 could be the Americans' deepest World Cup run yet.",
    category: "triumph",
    teams: "USA vs Paraguay",
    imageUrl: "https://a.espncdn.com/photo/2026/0613/r1672211_1024x576_16-9.jpg",
    imageAlt: "USMNT players celebrate a goal against Paraguay at the LA Coliseum",
    era: "wc26",
  },
  {
    id: "wc26-vini-morocco",
    year: 2026,
    title: "Vinícius Jr rescues a point for Brazil",
    description:
      "Brazil came from behind to draw with Morocco as Vinícius Jr fired home a late equaliser in a Group C thriller.",
    details:
      "The Seleção were pushed hard by a fearless Morocco side before Vinícius Jr levelled the scores. Fans on Copacabana Beach erupted as Brazil avoided an opening stumble in the tournament.",
    category: "goal",
    teams: "BRA 1-1 MAR",
    imageUrl: "https://a.espncdn.com/photo/2026/0614/r1672661_1296x729_16-9.jpg",
    imageAlt: "Vinícius Jr celebrates for Brazil against Morocco at World Cup 2026",
    era: "wc26",
  },
  {
    id: "wc26-canada-home",
    year: 2026,
    title: "Canada's co-host dream comes alive",
    description:
      "For the first time as a World Cup co-host, Canada fed off a home crowd with a performance that captured the nation.",
    details:
      "Vancouver, Toronto, and the whole country rallied behind Les Rouges. A co-hosted World Cup gave Canadian football its biggest stage ever - and the team responded with the kind of fearless football fans had waited generations to see.",
    category: "triumph",
    teams: "CAN at WC26",
    imageUrl: "https://a.espncdn.com/photo/2026/0612/r1672075_1024x576_16-9.jpg",
    imageAlt: "Cyle Larin celebrates after scoring for Canada in their World Cup 2026 opener",
    era: "wc26",
  },
  {
    id: "wc26-korea-upset",
    year: 2026,
    title: "South Korea stun Czech Republic in Group A",
    description:
      "Oh Hyeon-gyu scored twice as Korea Republic beat a favoured Czech side to announce themselves in the tournament.",
    details:
      "The Taeguk Warriors produced one of the early surprises of World Cup 2026. A clinical performance capped by Oh Hyeon-gyu's brace sent Korea top of Group A and left the Czechs searching for answers.",
    category: "shock",
    teams: "KOR 2-1 CZE",
    imageUrl: "https://a.espncdn.com/photo/2026/0612/r1671748_608x342_16-9.jpg",
    imageAlt: "Oh Hyeon-gyu celebrates after scoring for South Korea against Czech Republic",
    era: "wc26",
  },
  {
    id: "wc26-stadiums",
    year: 2026,
    title: "16 stadiums across Mexico, USA & Canada",
    description:
      "From the Azteca to SoFi, MetLife to BC Place - the first 48-team World Cup spans three nations and iconic venues.",
    details:
      "World Cup 2026 is the largest edition ever: 48 teams, 104 matches, and 16 venues from Vancouver to Mexico City to Miami. SoFi Stadium, MetLife, and a renovated Azteca headline a list built for the modern global game.",
    category: "stadium",
    teams: "🇲🇽 🇺🇸 🇨🇦",
    imageUrl: "https://a.espncdn.com/photo/2025/1204/r1584809_2_1296x729_16-9.jpg",
    imageAlt: "FIFA World Cup 2026 stadiums across North America",
    era: "wc26",
  },
  {
    id: "classic-messi-2022",
    year: 2022,
    title: "Messi finally lifts the World Cup",
    description:
      "After a fairytale final against France, Lionel Messi completed football's greatest story in Qatar.",
    details:
      "Messi scored twice in a pulsating Lusail final before Gonzalo Montiel converted the decisive penalty. After four World Cups and a Copa América heartbreak in 2021, Argentina's captain finally held the trophy that had eluded him for nearly two decades.",
    category: "triumph",
    teams: "ARG 3-3 (4-2) FRA",
    imageUrl: "https://a.espncdn.com/photo/2022/1218/r1108357_1296x729_16-9.jpg",
    imageAlt: "Lionel Messi lifts the FIFA World Cup trophy in 2022",
    era: "classic",
  },
  {
    id: "classic-germany-7-1",
    year: 2014,
    title: "Germany dismantle Brazil 7-1 in Belo Horizonte",
    description:
      "The Mineirão witnessed the most shocking scoreline in World Cup history as Germany stunned the hosts in the semi-final.",
    details:
      "Germany led 5-0 inside 29 minutes in Belo Horizonte - a result that traumatised Brazilian football. Miroslav Klose became the tournament's all-time top scorer and the Seleção's humiliation on home soil remains the benchmark for World Cup shocks.",
    category: "shock",
    teams: "GER 7-1 BRA",
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/5/56/Brazil_vs_Germany%2C_in_Belo_Horizonte_12.jpg/1280px-Brazil_vs_Germany%2C_in_Belo_Horizonte_12.jpg",
    imageAlt: "Germany celebrate during their 7-1 semi-final win over Brazil in Belo Horizonte, 2014",
    era: "classic",
  },
  {
    id: "classic-iniesta-2010",
    year: 2010,
    title: "Iniesta breaks Dutch hearts in extra time",
    description:
      "Andrés Iniesta's 116th-minute strike gave Spain their first World Cup title in Johannesburg.",
    details:
      "A tense, physical final against the Netherlands looked destined for penalties until Iniesta controlled a pass from Cesc Fàbregas and fired past Maarten Stekelenburg. Spain's tiki-taka generation finally conquered the world in Soccer City.",
    category: "goal",
    teams: "ESP 1-0 NED",
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/0/06/FIFA_World_Cup_2010_Spain_with_cup.jpg/1280px-FIFA_World_Cup_2010_Spain_with_cup.jpg",
    imageAlt: "Spain lift the trophy after Andrés Iniesta's extra-time winner in the 2010 final",
    era: "classic",
  },
  {
    id: "classic-zidane-2006",
    year: 2006,
    title: "Zidane's headbutt in the Berlin final",
    description:
      "France's captain was sent off in his last ever match for headbutting Marco Materazzi - Italy won on penalties.",
    details:
      "Zidane had put France ahead from the penalty spot before Materazzi equalised. In extra time, Zidane headbutted Materazzi and was shown a red card - his final act as a player. Italy held their nerve in the shootout to win their fourth star.",
    category: "controversy",
    teams: "ITA 1-1 (5-3) FRA",
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/9/92/Zinedine_zidane_wcf_2006.jpg/1280px-Zinedine_zidane_wcf_2006.jpg",
    imageAlt: "Zinedine Zidane during the 2006 FIFA World Cup final in Berlin",
    era: "classic",
  },
  {
    id: "classic-maradona-1986",
    year: 1986,
    title: "Maradona's Hand of God & Goal of the Century",
    description:
      "In 45 minutes against England, Diego Maradona scored the most infamous and the most brilliant goals ever seen.",
    details:
      "Four minutes apart in the 1986 quarter-final, Maradona punched the ball past Peter Shilton - the 'Hand of God' - then slalomed from halfway, beating five England players for the 'Goal of the Century'. Argentina won 2-1 and went on to lift the trophy.",
    category: "goal",
    teams: "ARG 2-1 ENG",
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Maradona_scoring_england_1986.jpg/1280px-Maradona_scoring_england_1986.jpg",
    imageAlt: "Diego Maradona scores the Goal of the Century against England in 1986",
    era: "classic",
  },
  {
    id: "classic-pele-1970",
    year: 1970,
    title: "Pelé's Brazil - the greatest team ever",
    description:
      "Brazil's 4-1 dismantling of Italy in the Azteca final remains the benchmark for beautiful World Cup football.",
    details:
      "Pelé, Jairzinho, Carlos Alberto and company produced the most celebrated team performance in World Cup history. Carlos Alberto's fourth goal - a flowing move involving every outfield player - is still taught in coaching manuals worldwide.",
    category: "triumph",
    teams: "BRA 4-1 ITA",
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/8/85/Pele_celebrating_1970.jpg/1280px-Pele_celebrating_1970.jpg",
    imageAlt: "Pelé celebrates during Brazil's 1970 World Cup final win over Italy",
    era: "classic",
  },
  {
    id: "classic-hurst-1966",
    year: 1966,
    title: "Geoff Hurst's hat-trick wins it for England",
    description:
      "The only World Cup final hat-trick in history - and the debate over 'Was it over the line?' lives on.",
    details:
      "Hurst scored three at Wembley as England beat West Germany 4-2 after extra time - still the nation's only World Cup triumph. His second goal, which bounced off the crossbar, sparked decades of debate over whether it crossed the line.",
    category: "goal",
    teams: "ENG 4-2 FRG",
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8c/Geoff_Hurst_%282%29.jpg/1280px-Geoff_Hurst_%282%29.jpg",
    imageAlt: "Geoff Hurst - scorer of the only World Cup final hat-trick in 1966",
    era: "classic",
  },
  {
    id: "classic-mbappe-2022-final",
    year: 2022,
    title: "Mbappé's hat-trick in the greatest final ever",
    description:
      "Kylian Mbappé became only the second man to score a World Cup final hat-trick - and still finished on the losing side.",
    details:
      "Argentina led 3-0 before Mbappé dragged France back with two goals in 97 seconds, then completed his hat-trick in the shootout decider. Lionel Messi still lifted the trophy, but Mbappé's performance was the stuff of legend.",
    category: "goal",
    teams: "ARG 3-3 (4-2) FRA",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/6/6b/2022_wc_final_05.jpg",
    imageAlt: "Kylian Mbappé during the 2022 World Cup final against Argentina",
    era: "classic",
  },
  {
    id: "classic-gotze-2014",
    year: 2014,
    title: "Mario Götze's extra-time winner in the Maracanã",
    description:
      "Germany's substitute volley broke Argentine hearts in the 113th minute of the 2014 final.",
    details:
      "After 120 exhausting minutes in Rio, André Schürrle's cross found Götze's chest and the Bayern forward steered home the only goal. Germany won their fourth star and became the first European team to triumph in the Americas.",
    category: "goal",
    teams: "GER 1-0 ARG",
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/5/56/Mario_G%C3%B6tze_GOL_-_The_2014_FIFA_World_Cup_Final_-_140713-9112-jikatu_%2814463413827%29.jpg/1280px-Mario_G%C3%B6tze_GOL_-_The_2014_FIFA_World_Cup_Final_-_140713-9112-jikatu_%2814463413827%29.jpg",
    imageAlt: "Mario Götze scores the winning goal in the 2014 World Cup final",
    era: "classic",
  },
  {
    id: "classic-bergkamp-1998",
    year: 1998,
    title: "Bergkamp's touch of genius vs Argentina",
    description:
      "Three touches, one immortal goal - Dennis Bergkamp froze the Netherlands into a World Cup semi-final.",
    details:
      "With seconds left in normal time, Bergkamp controlled a 50-yard pass on his right foot, shifted inside, and lashed into the roof of the net. Argentina were out, and Dutch football had a moment for the ages.",
    category: "goal",
    teams: "NED 2-1 ARG",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/1/1c/Bergkampscore3.jpg",
    imageAlt: "Dennis Bergkamp scores his iconic last-minute goal against Argentina in 1998",
    era: "classic",
  },
  {
    id: "classic-baggio-1994",
    year: 1994,
    title: "Baggio blazes over - Italy's broken dream",
    description:
      "Roberto Baggio's penalty miss handed Brazil the 1994 title and created the tournament's most haunting image.",
    details:
      "After carrying Italy through the knockout stage almost single-handedly, Baggio skied the decisive spot-kick in Pasadena. Brazil celebrated a fourth crown; Baggio stood alone, ponytail drooping, in one of football's most famous photographs.",
    category: "controversy",
    teams: "BRA 0-0 (3-2) ITA",
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/4/4e/%D8%B1%D9%88%D8%A8%D8%B1%D8%AA%D9%88_%D8%A8%D8%A7%D8%AC%D9%88_%28cropped%29.jpg",
    imageAlt: "Roberto Baggio at the 1994 FIFA World Cup in the United States",
    era: "classic",
  },
  {
    id: "classic-ronaldo-2002",
    year: 2002,
    title: "Ronaldo's redemption in Yokohama",
    description:
      "After the nightmare of 1998, R9 scored twice in the final to restore Brazil to the top of the world.",
    details:
      "Ronaldo had missed the 1998 final through a convulsion hours before kick-off. Four years later in Japan, he tore Germany apart with two clinical finishes - eight goals in the tournament and a story of resilience for the ages.",
    category: "player",
    teams: "BRA 2-0 GER",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/d/d5/Ronaldo_2002_cropped.jpg",
    imageAlt: "Ronaldo celebrates after scoring in the 2002 World Cup final",
    era: "classic",
  },
  {
    id: "classic-suarez-2010",
    year: 2010,
    title: "Suárez's handball on the line",
    description:
      "Luis Suárez stopped Ghana's certain winner with his hand - and Asamoah Gyan missed the resulting penalty.",
    details:
      "In the last seconds of extra time in Johannesburg, Dominic Adiyah's header was heading in until Suárez parried it on the line and was sent off. Gyan hit the bar from the penalty; Uruguay won the shootout and reached the semi-finals.",
    category: "controversy",
    teams: "URU 1-1 (4-2) GHA",
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/1/12/FIFA_World_Cup_2010_Uruguay_France.jpg/1280px-FIFA_World_Cup_2010_Uruguay_France.jpg",
    imageAlt: "Uruguay at the 2010 FIFA World Cup - the tournament of Suárez's infamous handball",
    era: "classic",
  },
  {
    id: "classic-croatia-2018",
    year: 2018,
    title: "Croatia's impossible run to the Moscow final",
    description:
      "A nation of four million played three extra-times and still reached the World Cup final.",
    details:
      "Luka Modrić, Mandžukić, and a squad forged in hardship captivated Russia 2018. Croatia beat Denmark, Russia, and England in knockout football that went the distance before France ended the fairytale in the final.",
    category: "triumph",
    teams: "CRO reaches 2018 Final",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/e/ee/Modri%C4%87_World_Cup_2018.jpg",
    imageAlt: "Luka Modrić leads Croatia's run to the 2018 World Cup final",
    era: "classic",
  },
  {
    id: "classic-maracanazo-1950",
    year: 1950,
    title: "The Maracanazo - Uruguay silence Brazil",
    description:
      "Brazil needed only a draw in the Maracanã; Alcides Ghiggia's winner delivered the ultimate World Cup shock.",
    details:
      "Nearly 200,000 Brazilians expected to crown a champion at the Maracanã. Instead Ghiggia scored with 11 minutes left, Uruguay lifted the trophy, and Brazil's white shirts were retired in national mourning - still the country's deepest football trauma.",
    category: "shock",
    teams: "URU 2-1 BRA",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/d/de/Gol_ghiggia_vs_brasil.jpg",
    imageAlt: "Alcides Ghiggia scores the winning goal in the 1950 Maracanazo",
    era: "classic",
  },
  {
    id: "classic-mandela-2010",
    year: 2010,
    title: "Mandela and the vuvuzela World Cup",
    description:
      "Africa's first World Cup opened with Nelson Mandela's spirit and a continent united behind the tournament.",
    details:
      "The buzz of vuvuzelas, Siphiwe Tshabalala's opening goal for South Africa, and a nation still healing through sport - the 2010 World Cup was as much about Mandela's dream as it was about Iniesta's late winner for Spain.",
    category: "stadium",
    teams: "RSA 2010",
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c0/First_game_of_the_2010_FIFA_World_Cup%2C_South_Africa_vs_Mexico.jpg/1280px-First_game_of_the_2010_FIFA_World_Cup%2C_South_Africa_vs_Mexico.jpg",
    imageAlt: "Soccer City hosts the opening match of the 2010 FIFA World Cup in South Africa",
    era: "classic",
  },
];

export const CATEGORY_LABELS: Record<IconicMomentCategory, string> = {
  goal: "Iconic Goal",
  shock: "Shock Result",
  triumph: "Triumph",
  controversy: "Controversy",
  stadium: "Stadium",
  player: "Star Player",
};

export function getIconicMoments(limit?: number, era?: "wc26" | "classic" | "all"): IconicMoment[] {
  let list = ICONIC_MOMENTS;
  if (era === "wc26") list = list.filter((m) => m.era === "wc26");
  if (era === "classic") list = list.filter((m) => m.era === "classic");
  return limit ? list.slice(0, limit) : list;
}

export function getWc26Moments(): IconicMoment[] {
  return ICONIC_MOMENTS.filter((m) => m.era === "wc26");
}

export function getClassicMoments(): IconicMoment[] {
  return ICONIC_MOMENTS.filter((m) => m.era === "classic");
}
