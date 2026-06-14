/** Curated rivalry context for international matchups at WC 2026. */

export interface RivalryInfo {
  name?: string;
  context: string;
  funFact?: string;
}

function pairKey(a: string, b: string): string {
  return [a.toUpperCase(), b.toUpperCase()].sort().join("-");
}

const RIVALRIES: Record<string, RivalryInfo> = {
  "ARG-FRA": {
    name: "Argentina vs France",
    context:
      "Two World Cup heavyweights with a rivalry sharpened by the 2018 final in Moscow and the 2022 final in Lusail — back-to-back deciders that rank among the greatest in tournament history.",
    funFact: "France beat Argentina 4-3 on penalties after a 3-3 draw in 2022; Argentina had won 4-3 on penalties in 2018 after a 4-4 draw in a friendly.",
  },
  "BRA-ARG": {
    name: "Superclásico of the Americas",
    context:
      "South America's fiercest football rivalry. Brazil and Argentina have met at five World Cups, with tension, flair, and trophy stakes every time they share a pitch.",
    funFact: "Argentina eliminated Brazil in the 1990 Round of 16 and again in the 2019 Copa América semi-final.",
  },
  "ENG-GER": {
    name: "England vs Germany",
    context:
      "A rivalry forged in World Cup knockouts — from 1966 at Wembley to penalty heartbreak in 1990 and 1996, and Germany's 4-1 demolition in South Africa 2010.",
    funFact: "England's only World Cup triumph came against West Germany in the 1966 final.",
  },
  "MEX-USA": {
    name: "CONCACAF Derby",
    context:
      "The defining rivalry of North American football. Mexico and the United States have traded blows for decades in World Cup qualifiers, Gold Cups, and friendlies.",
    funFact: "The teams have met at three World Cups: 1930, 1950, and 2002 group stages.",
  },
  "POR-ESP": {
    name: "Iberian Derby",
    context:
      "Neighbours with shared history and contrasting styles — Portugal's organisation against Spain's possession. Their 2010 World Cup Round of 16 clash went to Spain on a David Villa goal.",
    funFact: "Spain beat Portugal 1-0 in the 2010 World Cup Round of 16 en route to their first title.",
  },
  "NED-GER": {
    name: "Deutsch-Niederländische Rivalität",
    context:
      "Total Football vs German efficiency. The 1974 World Cup final and 1988 European Championship semi-final remain iconic chapters in European football.",
    funFact: "Netherlands beat West Germany 2-1 in the Euro 1988 semi-final in Hamburg.",
  },
  "ITA-FRA": {
    name: "Mediterranean Giants",
    context:
      "Two nations that have shaped World Cup history — Italy's four stars against France's 1998 and 2018 triumphs, including the dramatic 2006 final in Berlin.",
    funFact: "Italy won the 2006 World Cup final on penalties after Zinedine Zidane's infamous headbutt.",
  },
  "URU-ARG": {
    name: "Clásico del Río de la Plata",
    context:
      "The oldest international rivalry in football. Uruguay's 1930 and 1950 World Cup pedigree runs directly through battles with Argentina.",
    funFact: "Uruguay beat Argentina 4-2 in the inaugural 1930 World Cup final in Montevideo.",
  },
  "BRA-GER": {
    name: "Samba vs Die Mannschaft",
    context:
      "Brazil and Germany have produced some of the World Cup's most dramatic nights — from the 2002 final to the seismic 7-1 in Belo Horizonte in 2014.",
    funFact: "Germany's 7-1 semi-final win in 2014 is the biggest margin in a World Cup semi-final.",
  },
  "CRO-ARG": {
    name: "2018 Final Rematch",
    context:
      "Croatia and Argentina met in the 2018 group stage before Argentina's run to the 2022 title. Croatia's golden generation always raises the floor in knockouts.",
    funFact: "Argentina beat Croatia 3-0 in the 2022 World Cup semi-final.",
  },
  "JPN-KOR": {
    name: "East Asian Derby",
    context:
      "Asia's most watched international fixture. Japan and South Korea co-hosted the 2002 World Cup and have met in qualifiers, Asian Cups, and friendlies for decades.",
    funFact: "South Korea reached the 2002 semi-finals as co-hosts; Japan reached the Round of 16.",
  },
  "SEN-ARG": {
    context:
      "Senegal stunned France in the 2002 World Cup opener. African champions against South American royalty is always a compelling contrast of styles.",
    funFact: "Senegal's 1-0 win over France in 2002 remains one of the greatest World Cup opening-day shocks.",
  },
  "MAR-ESP": {
    context:
      "Morocco became the first African nation to reach a World Cup semi-final in 2022. Spain's possession game against Morocco's organisation produced a penalty-shootout classic in Qatar.",
    funFact: "Morocco beat Spain on penalties in the 2022 World Cup Round of 16.",
  },
  "BEL-FRA": {
    context:
      "Neighbours and 2018 World Cup semi-finalists. Belgium's golden generation sought a first major trophy against a French side that went on to lift the cup in Russia.",
    funFact: "France beat Belgium 1-0 in the 2018 World Cup semi-final in Saint Petersburg.",
  },
  "COL-BRA": {
    context:
      "South American World Cup qualifiers and Copa América battles have made Colombia vs Brazil a staple of the continent's football calendar.",
    funFact: "James Rodríguez's six goals powered Colombia to the 2014 World Cup quarter-finals.",
  },
  "ECU-ARG": {
    context:
      "Neighbours in CONMEBOL World Cup qualifying. Ecuador's altitude in Quito has historically made life difficult for Argentina.",
    funFact: "Ecuador have qualified for four of the last five World Cups.",
  },
  "CAN-USA": {
    name: "North American Neighbours",
    context:
      "Co-hosts of World Cup 2026 alongside Mexico. Canada and the United States share a border and a growing football rivalry as both nations invest in the sport.",
    funFact: "Canada returned to the World Cup in 2022 after a 36-year absence.",
  },
  "MEX-CAN": {
    context:
      "Two of three World Cup 2026 host nations. Mexico's pedigree and Canada's rise under the modern era make every meeting a gauge of CONCACAF's top tier.",
    funFact: "Mexico have appeared at every World Cup since 1994.",
  },
  "SCO-ENG": {
    name: "Auld Enemy",
    context:
      "British football's oldest international rivalry. Scotland and England played in the first ever official international match in 1872.",
    funFact: "The teams drew 0-0 in that first international at Hamilton Crescent, Glasgow.",
  },
  "AUS-JPN": {
    context:
      "Asia-Pacific powers with contrasting styles. Japan's technical game against Australia's physicality has produced memorable Asian Cup and World Cup qualifying clashes.",
  },
};

export function getRivalryInfo(homeCode: string, awayCode: string): RivalryInfo | undefined {
  return RIVALRIES[pairKey(homeCode, awayCode)];
}
