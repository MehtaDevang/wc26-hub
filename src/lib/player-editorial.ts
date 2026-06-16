import { slugifyPlayerName } from "./slug";

/**
 * Hand-written player editorial for marquee World Cup 2026 stars.
 * Keyed by `${teamCode}:${slug}` (slug from ESPN display name).
 *
 * Content uses only stable, widely documented facts (honours, origins,
 * career path, playing role). No em-dashes. Expand over time.
 */

export interface PlayerEditorial {
  playStyle: string;
  journey: string[];
  highlights: string[];
  records?: string[];
}

const EDITORIAL: Record<string, PlayerEditorial> = {
  "ARG:lionel-messi": {
    playStyle:
      "Left-footed playmaker who drifts inside from the right, picks the final pass, and still decides games with free kicks and close control.",
    journey: [
      "Rose through La Masia at Barcelona and became the club's all-time leading scorer.",
      "Moved to Paris Saint-Germain in 2021 and joined Inter Miami in MLS in 2023.",
      "Captained Argentina to Copa America 2021 and 2024 titles and the 2022 World Cup in Qatar.",
    ],
    highlights: [
      "Argentina captain and record appearance holder for his country.",
      "Won the Golden Ball at the 2014 and 2022 World Cups.",
      "Eight-time Ballon d'Or winner (2009-2023).",
    ],
    records: ["Most goals in Argentina national team history", "Most assists in World Cup history"],
  },
  "ARG:julian-alvarez": {
    playStyle:
      "Mobile forward who presses relentlessly, links play, and arrives in the box with timing from wide or central areas.",
    journey: [
      "Breakthrough at River Plate in Argentina before joining Manchester City in 2022.",
      "Part of Argentina's 2022 World Cup-winning squad in Qatar.",
      "Won multiple Premier League titles and the 2023 Champions League with City.",
    ],
    highlights: [
      "Scored twice in Argentina's 2022 World Cup semi-final win over Croatia.",
      "Known for high-energy pressing as well as finishing.",
    ],
  },
  "ARG:emiliano-martinez": {
    playStyle:
      "Commanding goalkeeper who dominates his area, communicates constantly, and has a strong record in penalty shootouts.",
    journey: [
      "Developed at Arsenal before establishing himself as Aston Villa's first-choice keeper.",
      "Became Argentina's No. 1 during the 2021 Copa America run.",
      "Saved penalties in the 2022 World Cup final shootout against France.",
    ],
    highlights: [
      "Golden Glove winner at the 2022 World Cup.",
      "Famous for mind games and focus during shootouts.",
    ],
  },
  "FRA:kylian-mbappe": {
    playStyle:
      "Explosive forward who attacks space behind defences, cuts in from the left, and finishes at speed.",
    journey: [
      "Breakthrough at AS Monaco before a world-record transfer to Paris Saint-Germain in 2017.",
      "Starred at the 2018 World Cup as France won the title in Russia.",
      "Joined Real Madrid in 2024 after leaving PSG.",
    ],
    highlights: [
      "Scored a hat-trick in the 2022 World Cup final.",
      "France's all-time leading men's scorer.",
      "Youngest French player to reach 50 international goals.",
    ],
  },
  "FRA:antoine-griezmann": {
    playStyle:
      "Intelligent second striker who drops deep, connects midfield to attack, and reads the game one pass ahead.",
    journey: [
      "Made his name at Real Sociedad before starring for Atletico Madrid and Barcelona.",
      "Returned to Atletico and became a creative hub for club and country.",
      "Key figure in France's 2018 World Cup triumph.",
    ],
    highlights: [
      "France's all-time record appearance holder for the men's team.",
      "Golden Boot winner at Euro 2016.",
    ],
  },
  "FRA:ousmane-dembele": {
    playStyle:
      "Direct winger who takes on defenders 1v1, switches play quickly, and thrives in transition.",
    journey: [
      "Breakthrough at Borussia Dortmund before a big move to Barcelona in 2017.",
      "Won the 2018 World Cup with France as a young squad member.",
      "Joined Paris Saint-Germain in 2023.",
    ],
    highlights: [
      "One of the fastest wide players in top-level football.",
      "Versatile across both flanks.",
    ],
  },
  "BRA:vinicius-junior": {
    playStyle:
      "Left winger who isolates full-backs, drives into the box, and draws fouls in dangerous areas.",
    journey: [
      "Signed by Real Madrid from Flamengo as a teenager in 2018.",
      "Became a Champions League match-winner and La Liga star by the mid-2020s.",
      "Central to Brazil's attack heading into World Cup 2026.",
    ],
    highlights: [
      "Scored in Real Madrid's 2022 and 2024 Champions League final wins.",
      "Named in the FIFA FIFPro World XI.",
    ],
  },
  "BRA:rodrygo": {
    playStyle:
      "Two-footed forward who can play wide or centrally, with sharp movement and composure in big games.",
    journey: [
      "Joined Real Madrid from Santos in 2019.",
      "Scored crucial Champions League knockout goals as a teenager.",
      "Established as a Brazil regular before World Cup 2026.",
    ],
    highlights: [
      "Scored twice in Real Madrid's 2022 Champions League semi-final comeback against Manchester City.",
    ],
  },
  "BRA:alisson": {
    playStyle:
      "Modern sweeper-keeper who plays with his feet, commands the box, and stays calm under pressure.",
    journey: [
      "Rose at Internacional in Brazil before moves to Portugal and then Liverpool.",
      "Became Brazil's first-choice goalkeeper in the late 2010s.",
      "Won the Premier League and Champions League with Liverpool.",
    ],
    highlights: [
      "Named The Best FIFA Men's Goalkeeper multiple times.",
      "Known for distribution and shot-stopping in equal measure.",
    ],
  },
  "ENG:harry-kane": {
    playStyle:
      "Complete centre-forward who links play, drops deep, and is one of the most reliable goalscorers in Europe.",
    journey: [
      "Tottenham Hotspur academy product and the club's all-time leading scorer.",
      "Captained England to a first major men's final since 1966 at Euro 2020.",
      "Joined Bayern Munich in 2023.",
    ],
    highlights: [
      "England men's all-time leading scorer.",
      "World Cup Golden Boot winner in 2018 with six goals.",
      "Three-time Premier League Golden Boot winner.",
    ],
  },
  "ENG:jude-bellingham": {
    playStyle:
      "Box-to-box midfielder who drives forward, presses aggressively, and scores important goals from late runs.",
    journey: [
      "Breakthrough at Birmingham City before joining Borussia Dortmund as a teenager.",
      "Starred at the 2022 World Cup and Euro 2024 with England.",
      "Joined Real Madrid in 2023 and won the Champions League in his first season.",
    ],
    highlights: [
      "Youngest player to start for England at a World Cup in 2022.",
      "Scored in multiple Real Madrid Clasico and Champions League knockout games.",
    ],
  },
  "ENG:bukayo-saka": {
    playStyle:
      "Direct winger who combines dribbling with end product, comfortable on either flank.",
    journey: [
      "Arsenal academy graduate and a first-team regular from a young age.",
      "Missed the decisive penalty in the Euro 2020 final shootout, then became England's key wide outlet.",
      "Named in the Premier League Team of the Season multiple times.",
    ],
    highlights: [
      "One of England's most capped players of his generation.",
      "Known for consistency and durability across long seasons.",
    ],
  },
  "ESP:lamine-yamal": {
    playStyle:
      "Left-footed winger who beats defenders on the outside, cuts inside, and creates from wide areas at speed.",
    journey: [
      "Breakthrough at Barcelona's La Masia and became a first-team regular as a teenager.",
      "Starred for Spain at Euro 2024, winning Young Player of the Tournament.",
      "One of the youngest players ever to feature at a European Championship.",
    ],
    highlights: [
      "Became the youngest goalscorer in Euro history at Euro 2024.",
      "Central to Spain's Euro 2024 title run.",
    ],
  },
  "ESP:pedri": {
    playStyle:
      "Calm central midfielder who keeps the ball moving, resists pressure, and controls tempo.",
    journey: [
      "Rose at Las Palmas before joining Barcelona in 2020.",
      "Named Young Player of the Tournament at Euro 2020.",
      "Became a Spain regular despite injury setbacks in his early twenties.",
    ],
    highlights: [
      "Known for close control and minimal turnover rate in midfield.",
      "Golden Boy award winner in 2021.",
    ],
  },
  "POR:cristiano-ronaldo": {
    playStyle:
      "Penalty-box predator with elite aerial ability, powerful shooting, and a long record of decisive goals.",
    journey: [
      "Breakthrough at Sporting CP before iconic spells at Manchester United, Real Madrid, and Juventus.",
      "Returned to Manchester United and later joined Al Nassr in Saudi Arabia.",
      "Portugal's all-time leading scorer and most capped men's player.",
    ],
    highlights: [
      "Five-time Ballon d'Or winner.",
      "All-time leading men's international goalscorer.",
      "Euro 2016 and Nations League 2019 winner with Portugal.",
    ],
    records: ["Most men's international caps and goals in history"],
  },
  "POR:bruno-fernandes": {
    playStyle:
      "Creative No. 10 who plays forward passes, shoots from range, and leads pressing from the front.",
    journey: [
      "Developed in Portugal before starring at Sporting CP and Manchester United.",
      "Became Portugal's primary creative outlet in the late 2010s.",
      "Named Manchester United captain in 2023.",
    ],
    highlights: [
      "Regular penalty and set-piece taker for club and country.",
      "One of the Premier League's top chance creators since 2020.",
    ],
  },
  "GER:jamal-musiala": {
    playStyle:
      "Agile attacking midfielder who dribbles in tight spaces and slides between the lines.",
    journey: [
      "Chelsea academy product who moved to Bayern Munich as a teenager.",
      "Chose to represent Germany internationally despite England youth caps.",
      "Breakthrough star for Bayern and Germany in the early 2020s.",
    ],
    highlights: [
      "Known for close control and balance in crowded areas.",
      "Multiple Bundesliga title winner with Bayern Munich.",
    ],
  },
  "GER:florian-wirtz": {
    playStyle:
      "Left-footed playmaker who operates between the lines, combines with forwards, and scores from midfield.",
    journey: [
      "Breakthrough at Bayer Leverkusen in the Bundesliga.",
      "Named in Germany's squad for Euro 2024 after a dominant club season.",
      "Part of Leverkusen's unbeaten Bundesliga title run in 2023-24.",
    ],
    highlights: [
      "One of the most creative midfielders in the Bundesliga during the mid-2020s.",
      "Returned from a serious knee injury to reach top form again.",
    ],
  },
  "NED:virgil-van-dijk": {
    playStyle:
      "Dominant centre-back who wins aerial duels, steps into midfield, and organises the defensive line.",
    journey: [
      "Developed at Celtic and Southampton before becoming Liverpool's defensive leader.",
      "Named captain of the Netherlands and Liverpool.",
      "Returned from a major knee injury to remain among the world's top defenders.",
    ],
    highlights: [
      "UEFA Men's Player of the Year in 2019.",
      "Won the Premier League and Champions League with Liverpool.",
    ],
  },
  "NED:cody-gakpo": {
    playStyle:
      "Versatile forward who can play wide or through the middle, with good movement and left-footed finishing.",
    journey: [
      "Starred at PSV Eindhoven in the Eredivisie.",
      "Scored three goals at the 2022 World Cup for the Netherlands.",
      "Joined Liverpool in 2023.",
    ],
    highlights: [
      "One of the Netherlands' most reliable goal threats in recent tournaments.",
    ],
  },
  "BEL:kevin-de-bruyne": {
    playStyle:
      "World-class passer who switches play, delivers through balls, and controls tempo from midfield or half-space.",
    journey: [
      "Breakthrough at Genk before spells at Chelsea, Wolfsburg, and Manchester City.",
      "Became one of the Premier League's greatest ever midfielders at City.",
      "Long-time leader of Belgium's golden generation.",
    ],
    highlights: [
      "Multiple Premier League Playmaker of the Season awards.",
      "Over 100 assists in the Premier League.",
    ],
  },
  "CRO:luka-modric": {
    playStyle:
      "Metronomic midfielder who dictates rhythm, presses intelligently, and performs in the biggest games.",
    journey: [
      "Rose at Dinamo Zagreb before becoming a Real Madrid legend.",
      "Led Croatia to the 2018 World Cup final and third place in 2022.",
      "Won the Ballon d'Or in 2018.",
    ],
    highlights: [
      "Most capped player in Croatia men's history.",
      "Six-time Champions League winner with Real Madrid.",
    ],
    records: ["Oldest outfield player to score at a World Cup (2022, aged 37)"],
  },
  "MAR:achraf-hakimi": {
    playStyle:
      "Attacking full-back who overlaps constantly, carries the ball at pace, and creates from wide areas.",
    journey: [
      "Real Madrid academy product who starred at Borussia Dortmund, Inter Milan, and Paris Saint-Germain.",
      "Born in Spain and chose to represent Morocco internationally.",
      "Key to Morocco's historic run to the 2022 World Cup semi-finals.",
    ],
    highlights: [
      "One of the most attacking full-backs in world football.",
      "Morocco's primary outlet on the right flank.",
    ],
  },
  "SEN:sadio-mane": {
    playStyle:
      "Direct forward who presses from the front, drives at defences, and scores with both feet.",
    journey: [
      "Breakthrough at RB Salzburg before starring for Southampton, Liverpool, and Bayern Munich.",
      "Moved to Saudi Pro League club Al Nassr in 2023.",
      "Led Senegal to their first Africa Cup of Nations title in 2022.",
    ],
    highlights: [
      "Named African Footballer of the Year multiple times.",
      "Scored in the 2019 Champions League final for Liverpool.",
    ],
  },
  "NOR:erling-haaland": {
    playStyle:
      "Pure striker who attacks the penalty box, finishes with either foot, and converts chances at an elite rate.",
    journey: [
      "Breakthrough at Molde and RB Salzburg before starring at Borussia Dortmund.",
      "Joined Manchester City in 2022 and broke Premier League scoring records.",
      "Chose to represent Norway through family heritage.",
    ],
    highlights: [
      "Premier League record for most goals in a single season (36 in 2022-23).",
      "One of the most prolific scorers in Champions League history for his age.",
    ],
    records: ["Fastest player to 40 and 50 UEFA Champions League goals"],
  },
  "EGY:mohamed-salah": {
    playStyle:
      "Left-footed forward who cuts inside from the right, shoots from distance, and creates chances in the final third.",
    journey: [
      "Breakthrough at Basel before spells at Chelsea, Fiorentina, Roma, and Liverpool.",
      "Became Liverpool's talisman and one of the Premier League's top scorers.",
      "Egypt captain and the nation's greatest modern player.",
    ],
    highlights: [
      "Multiple Premier League Golden Boot winner.",
      "Named PFA Players' Player of the Year multiple times.",
      "Scored in the 2018 Champions League final for Liverpool.",
    ],
  },
  "KOR:son-heung-min": {
    playStyle:
      "Two-footed forward who can play wide or centrally, with elite dribbling and composure in front of goal.",
    journey: [
      "Developed in Germany at Hamburg and Bayer Leverkusen before joining Tottenham Hotspur.",
      "Named Tottenham captain in 2023.",
      "Led South Korea at multiple World Cups and Asian Cup campaigns.",
    ],
    highlights: [
      "First Asian player to win the Premier League Golden Boot (2021-22).",
      "South Korea's all-time leading scorer.",
    ],
  },
  "JPN:takefusa-kubo": {
    playStyle:
      "Technical winger who dribbles inside from the right and creates from tight spaces.",
    journey: [
      "La Masia product who returned to Japan before moves in Spain with Mallorca and Real Sociedad.",
      "Became one of Japan's most recognisable players abroad.",
      "Regular in Japan's national team from a young age.",
    ],
    highlights: [
      "Known as one of Japan's most skilled dribblers.",
      "Featured at multiple major tournaments for Japan.",
    ],
  },
  "USA:christian-pulisic": {
    playStyle:
      "Direct winger who takes on defenders, drives into the box, and delivers in big USMNT moments.",
    journey: [
      "Breakthrough at Borussia Dortmund as a teenager.",
      "Joined Chelsea and later AC Milan, becoming Milan's key wide attacker.",
      "United States men's national team captain and record appearance holder.",
    ],
    highlights: [
      "Scored the goal that sent the USMNT to the 2022 World Cup round of 16.",
      "Known as 'Captain America' in US soccer culture.",
    ],
  },
  "MEX:hirving-lozano": {
    playStyle:
      "Pacy wide forward who attacks full-backs, cuts inside, and works hard defensively.",
    journey: [
      "Breakthrough at Pachuca before moves to PSV Eindhoven and Napoli.",
      "Scored the winner against Germany at the 2018 World Cup.",
      "Long-time key player for Mexico in multiple World Cups.",
    ],
    highlights: [
      "One of Mexico's most capped players of his generation.",
      "Famous for the 2018 World Cup upset win over Germany.",
    ],
  },
  "URU:federico-valverde": {
    playStyle:
      "Box-to-box midfielder with engine, long-range shooting, and tactical discipline.",
    journey: [
      "Joined Real Madrid from Penarol as a teenager.",
      "Became a Champions League and La Liga regular in midfield.",
      "Established Uruguay starter before World Cup 2026.",
    ],
    highlights: [
      "Known for covering huge ground in midfield.",
      "Multiple Champions League winner with Real Madrid.",
    ],
  },
  "URU:darwin-nunez": {
    playStyle:
      "Physical centre-forward who runs channels, presses high, and finishes with power.",
    journey: [
      "Starred at Almeria and Benfica in Portugal.",
      "Joined Liverpool in 2022 for a club-record fee.",
      "Became Uruguay's primary striker alongside veterans like Luis Suarez.",
    ],
    highlights: [
      "Prolific scorer in the Primeira Liga before moving to England.",
      "Known for relentless pressing from the front.",
    ],
  },
  "COL:luis-diaz": {
    playStyle:
      "Direct left winger who beats defenders with pace and finishes with power.",
    journey: [
      "Breakthrough in Colombia before moves to Junior, Porto, and Liverpool.",
      "Starred at Copa America and World Cup qualifiers for Colombia.",
      "Father's release from kidnapping made global headlines in 2023.",
    ],
    highlights: [
      "One of Colombia's most important attacking players.",
      "Known for explosive pace and cutting inside from the left.",
    ],
  },
  "CAN:alphonso-davies": {
    playStyle:
      "Explosive left-back or winger who carries the ball long distances and creates in transition.",
    journey: [
      "Born in a Ghanaian refugee camp in Ghana, raised in Canada, and joined Bayern Munich from Vancouver Whitecaps.",
      "Became one of the fastest defenders in world football.",
      "Key player as Canada returned to the World Cup in 2022.",
    ],
    highlights: [
      "First Canadian to win the UEFA Champions League (2020 with Bayern).",
      "Known for incredible top speed on the flank.",
    ],
  },
  "SUI:granit-xhaka": {
    playStyle:
      "Deep-lying midfielder who passes long, shields the defence, and leads the press.",
    journey: [
      "Arsenal academy product who became captain at Borussia Monchengladbach and later Bayer Leverkusen.",
      "Long-time Switzerland captain and midfield anchor.",
      "Part of Leverkusen's unbeaten Bundesliga season in 2023-24.",
    ],
    highlights: [
      "One of Switzerland's most capped players.",
      "Known for leadership and range of passing.",
    ],
  },
  "AUT:david-alaba": {
    playStyle:
      "Versatile defender who can play centre-back or left-back, reads the game well, and distributes cleanly.",
    journey: [
      "Bayern Munich academy product and long-time first-team regular.",
      "Joined Real Madrid in 2021 and won multiple Champions League titles.",
      "Austria captain and one of the nation's greatest players.",
    ],
    highlights: [
      "Won the treble with Bayern Munich in 2020.",
      "Played in multiple positions at the highest level for over a decade.",
    ],
  },
  "TUR:hakan-calhanoglu": {
    playStyle:
      "Set-piece specialist and deep playmaker who switches play and strikes dead balls with precision.",
    journey: [
      "Developed in Germany before starring at Bayer Leverkusen and AC Milan.",
      "Joined Inter Milan and became a Serie A champion.",
      "Turkey's primary creator from midfield.",
    ],
    highlights: [
      "One of Europe's top free-kick and penalty takers.",
      "Serie A title winner with Inter Milan.",
    ],
  },
  "IRN:mehdi-taremi": {
    playStyle:
      "Target forward who holds up play, links midfield to attack, and finishes in the box.",
    journey: [
      "Starred in Portugal with Rio Ave and Porto.",
      "Became one of Iran's most experienced European-based players.",
      "Regular scorer in World Cup and Asian Cup qualifiers.",
    ],
    highlights: [
      "Iran's primary attacking reference in recent qualifying cycles.",
      "Prolific in the Primeira Liga with Porto.",
    ],
  },
  "GHA:thomas-partey": {
    playStyle:
      "Physical defensive midfielder who shields the back line, breaks up play, and distributes simply.",
    journey: [
      "Breakthrough at Atletico Madrid after developing in Spain.",
      "Joined Arsenal in 2020 and became a Premier League regular.",
      "Key part of Ghana's midfield for multiple Africa Cup of Nations and World Cup campaigns.",
    ],
    highlights: [
      "La Liga winner with Atletico Madrid.",
      "Ghana's midfield anchor in recent international tournaments.",
    ],
  },
  "SCO:andrew-robertson": {
    playStyle:
      "Attacking left-back who overlaps, delivers crosses, and maintains high work rate.",
    journey: [
      "Rose through Queen's Park and Dundee United before joining Hull City and Liverpool.",
      "Became Liverpool captain and one of the Premier League's best left-backs.",
      "Scotland captain and leader of a new generation qualifying for Euro 2020.",
    ],
    highlights: [
      "Premier League and Champions League winner with Liverpool.",
      "Known for stamina and crossing from the left flank.",
    ],
  },
  "ECU:moises-caicedo": {
    playStyle:
      "Aggressive defensive midfielder who covers ground, tackles hard, and starts attacks with forward passes.",
    journey: [
      "Breakthrough at Independiente del Valle before joining Brighton in the Premier League.",
      "Record transfer to Chelsea in 2023.",
      "Became Ecuador's midfield enforcer at a young age.",
    ],
    highlights: [
      "One of the most expensive midfield transfers in Premier League history.",
      "Central to Ecuador's World Cup 2022 squad.",
    ],
  },
  "PAR:miguel-almiron": {
    playStyle:
      "Hard-working winger who presses, carries the ball, and arrives late in the box.",
    journey: [
      "Starred in Argentina with Lanus and Atlanta before joining Newcastle United.",
      "Became a fan favourite in the Premier League for work rate and goals.",
      "Long-time Paraguay international.",
    ],
    highlights: [
      "One of Paraguay's most recognisable players in Europe.",
      "Known for relentless energy on the wing.",
    ],
  },
  "CIV:nicolas-pepe": {
    playStyle:
      "Left-footed winger who dribbles 1v1, cuts inside, and shoots from wide areas.",
    journey: [
      "Breakthrough at Lille before a club-record move to Arsenal.",
      "Returned to form at Trabzonspor and later Villarreal.",
      "Ivory Coast international and AFCON 2023 winner.",
    ],
    highlights: [
      "AFCON 2023 champion with Ivory Coast.",
      "Known for flair and dribbling on the right wing.",
    ],
  },
  "AUS:mathew-ryan": {
    playStyle:
      "Experienced goalkeeper who commands his area and has played across Europe and Asia.",
    journey: [
      "Rose at Central Coast Mariners before moves to Club Brugge, Valencia, and Brighton.",
      "Long-time Australia No. 1 across multiple World Cups.",
      "One of the most capped players in Socceroos history.",
    ],
    highlights: [
      "Australia's first-choice keeper at multiple World Cups.",
      "Played in the Premier League, La Liga, and Eredivisie.",
    ],
  },
};

function editorialKey(teamCode: string, slug: string): string {
  return `${teamCode.toUpperCase()}:${slug.toLowerCase()}`;
}

/** Look up curated editorial by team + slug, with fuzzy name fallback. */
export function getPlayerEditorial(
  teamCode: string,
  slug: string,
  name?: string
): PlayerEditorial | null {
  const code = teamCode.toUpperCase();
  const direct = EDITORIAL[editorialKey(code, slug)];
  if (direct) return direct;

  if (name) {
    const normalizedSlug = slugifyPlayerName(name);
    const byName = EDITORIAL[editorialKey(code, normalizedSlug)];
    if (byName) return byName;
  }

  return null;
}

export function hasPlayerEditorial(teamCode: string, slug: string): boolean {
  return Boolean(EDITORIAL[editorialKey(teamCode, slug)]);
}

/** True when this player has a curated featured profile. */
export function isFeaturedPlayer(player: {
  teamCode: string;
  slug: string;
  name?: string;
}): boolean {
  return Boolean(getPlayerEditorial(player.teamCode, player.slug, player.name));
}

export const EDITORIAL_PLAYER_COUNT = Object.keys(EDITORIAL).length;
