export type Confederation = "AFC" | "CAF" | "CONCACAF" | "CONMEBOL" | "OFC" | "UEFA";

export type QualificationMethod =
  | "host"
  | "group-winner"
  | "group-top-two"
  | "confederation-round"
  | "uefa-playoff"
  | "intercontinental-playoff";

export interface TeamQualification {
  confederation: Confederation;
  method: QualificationMethod;
  headline: string;
  detail: string;
  qualifiedDate?: string;
  firstWorldCup?: boolean;
}

const CONFEDERATION_LABELS: Record<Confederation, string> = {
  AFC: "Asia (AFC)",
  CAF: "Africa (CAF)",
  CONCACAF: "North & Central America (CONCACAF)",
  CONMEBOL: "South America (CONMEBOL)",
  OFC: "Oceania (OFC)",
  UEFA: "Europe (UEFA)",
};

const METHOD_LABELS: Record<QualificationMethod, string> = {
  host: "Host nation",
  "group-winner": "Group winners",
  "group-top-two": "Top two in group",
  "confederation-round": "Confederation qualifiers",
  "uefa-playoff": "UEFA play-offs",
  "intercontinental-playoff": "Inter-confederation play-off",
};

const QUALIFICATION: Record<string, TeamQualification> = {
  CAN: {
    confederation: "CONCACAF",
    method: "host",
    headline: "Co-host - automatic berth",
    detail:
      "Canada qualified automatically as one of three co-hosts alongside Mexico and the United States. The Maple Leafs return after appearing at Qatar 2022.",
  },
  MEX: {
    confederation: "CONCACAF",
    method: "host",
    headline: "Co-host - automatic berth",
    detail:
      "Mexico qualified automatically as tournament co-hosts. El Tri have appeared at every World Cup since 1994 and will play on home soil.",
  },
  USA: {
    confederation: "CONCACAF",
    method: "host",
    headline: "Co-host - automatic berth",
    detail:
      "The United States qualified automatically as co-hosts. The USMNT reached the Round of 16 at Qatar 2022 and will look to go further on home turf.",
  },
  IRN: {
    confederation: "AFC",
    method: "group-winner",
    headline: "AFC Group A winners",
    detail:
      "Iran topped AFC third-round Group A with 23 points from 10 matches, finishing ahead of Uzbekistan, UAE, and Qatar.",
    qualifiedDate: "2025-06-05",
  },
  UZB: {
    confederation: "AFC",
    method: "group-top-two",
    headline: "AFC Group A runners-up",
    detail:
      "Uzbekistan finished second in AFC third-round Group A with 21 points - their first-ever World Cup qualification.",
    qualifiedDate: "2025-06-05",
    firstWorldCup: true,
  },
  KOR: {
    confederation: "AFC",
    method: "group-winner",
    headline: "AFC Group B winners",
    detail:
      "South Korea won AFC third-round Group B with 22 points, edging Jordan and Iraq over 10 home-and-away matches.",
    qualifiedDate: "2025-06-05",
  },
  JOR: {
    confederation: "AFC",
    method: "group-top-two",
    headline: "AFC Group B runners-up",
    detail:
      "Jordan finished second in AFC Group B with 16 points - qualifying for the World Cup for the first time in their history.",
    qualifiedDate: "2025-06-05",
    firstWorldCup: true,
  },
  JPN: {
    confederation: "AFC",
    method: "group-winner",
    headline: "AFC Group C winners",
    detail:
      "Japan topped AFC third-round Group C with 23 points, finishing ahead of Australia, Saudi Arabia, and Indonesia.",
    qualifiedDate: "2025-06-05",
  },
  AUS: {
    confederation: "AFC",
    method: "group-top-two",
    headline: "AFC Group C runners-up",
    detail:
      "Australia secured second place in AFC Group C with 19 points, continuing their run of World Cup appearances since 2006.",
    qualifiedDate: "2025-06-05",
  },
  QAT: {
    confederation: "AFC",
    method: "confederation-round",
    headline: "AFC fourth-round Group A winners",
    detail:
      "After finishing fourth in the third round, Qatar won the AFC fourth-round mini-league in Group A to book their first World Cup berth through qualifying (having debuted as hosts in 2022).",
    qualifiedDate: "2025-10-14",
  },
  KSA: {
    confederation: "AFC",
    method: "confederation-round",
    headline: "AFC fourth-round Group B winners",
    detail:
      "Saudi Arabia won AFC fourth-round Group B after placing third in the third round, returning to the World Cup after Qatar 2022.",
    qualifiedDate: "2025-10-14",
  },
  IRQ: {
    confederation: "AFC",
    method: "intercontinental-playoff",
    headline: "FIFA inter-confederation play-off winners",
    detail:
      "Iraq played a record 21 qualifying matches over 28 months - winning the AFC fifth-round tie, then beating Bolivia 2-1 in the FIFA play-off final in Monterrey to reach their first World Cup since 1986.",
    qualifiedDate: "2026-03-31",
  },
  EGY: {
    confederation: "CAF",
    method: "group-winner",
    headline: "CAF Group A winners",
    detail:
      "Egypt topped CAF qualifying Group A with 26 points from 10 matches, finishing ahead of Burkina Faso and Sierra Leone.",
    qualifiedDate: "2025-10-14",
  },
  SEN: {
    confederation: "CAF",
    method: "group-winner",
    headline: "CAF Group B winners",
    detail:
      "Senegal won CAF Group B with 24 points, returning after reaching the Round of 16 as African champions at Qatar 2022.",
    qualifiedDate: "2025-10-14",
  },
  RSA: {
    confederation: "CAF",
    method: "group-winner",
    headline: "CAF Group C winners",
    detail:
      "South Africa topped CAF Group C with 18 points, qualifying for their first World Cup since hosting in 2010.",
    qualifiedDate: "2025-11-16",
  },
  CPV: {
    confederation: "CAF",
    method: "group-winner",
    headline: "CAF Group D winners",
    detail:
      "Cabo Verde won CAF Group D with 23 points, denying Cameroon in a historic first World Cup qualification for the island nation.",
    qualifiedDate: "2025-10-13",
    firstWorldCup: true,
  },
  MAR: {
    confederation: "CAF",
    method: "group-winner",
    headline: "CAF Group E winners",
    detail:
      "Morocco topped CAF Group E with 24 points, building on their semi-final run as African representatives at Qatar 2022.",
    qualifiedDate: "2025-10-14",
  },
  CIV: {
    confederation: "CAF",
    method: "group-winner",
    headline: "CAF Group F winners",
    detail:
      "Ivory Coast won CAF Group F with 26 points, returning to the World Cup for the first time since 2014.",
    qualifiedDate: "2025-10-14",
  },
  ALG: {
    confederation: "CAF",
    method: "group-winner",
    headline: "CAF Group G winners",
    detail:
      "Algeria topped CAF Group G with 25 points, qualifying for their first World Cup since Brazil 2014.",
    qualifiedDate: "2025-10-14",
  },
  TUN: {
    confederation: "CAF",
    method: "group-winner",
    headline: "CAF Group H winners",
    detail:
      "Tunisia dominated CAF Group H with 28 points from 10 games - the highest points tally of any African group winner.",
    qualifiedDate: "2025-10-14",
  },
  GHA: {
    confederation: "CAF",
    method: "group-winner",
    headline: "CAF Group I winners",
    detail:
      "Ghana won CAF Group I with 25 points, returning after group-stage exits at Qatar 2022.",
    qualifiedDate: "2025-10-14",
  },
  COD: {
    confederation: "CAF",
    method: "intercontinental-playoff",
    headline: "FIFA inter-confederation play-off winners",
    detail:
      "DR Congo advanced from CAF's best-runners-up play-off, then beat Jamaica in the FIFA inter-confederation play-off final in Guadalajara - their first World Cup since 1974 (as Zaire).",
    qualifiedDate: "2026-03-31",
  },
  PAN: {
    confederation: "CONCACAF",
    method: "group-winner",
    headline: "CONCACAF third-round Group A winners",
    detail:
      "Panama topped CONCACAF third-round Group A with 12 points from six matches, returning after missing Qatar 2022.",
    qualifiedDate: "2025-11-18",
  },
  CUW: {
    confederation: "CONCACAF",
    method: "group-winner",
    headline: "CONCACAF third-round Group B winners",
    detail:
      "Curaçao won CONCACAF Group B with 12 points - the smallest nation by population ever to qualify for a men's World Cup.",
    qualifiedDate: "2025-11-18",
    firstWorldCup: true,
  },
  HAI: {
    confederation: "CONCACAF",
    method: "group-winner",
    headline: "CONCACAF third-round Group C winners",
    detail:
      "Haiti topped CONCACAF Group C with 11 points, qualifying for their first World Cup since 1974.",
    qualifiedDate: "2025-11-18",
  },
  ARG: {
    confederation: "CONMEBOL",
    method: "confederation-round",
    headline: "CONMEBOL 1st place",
    detail:
      "Argentina finished top of the single CONMEBOL league table with 38 points from 18 matches as defending world champions.",
    qualifiedDate: "2025-09-09",
  },
  ECU: {
    confederation: "CONMEBOL",
    method: "confederation-round",
    headline: "CONMEBOL 2nd place",
    detail:
      "Ecuador secured automatic qualification in second place with 29 points across the 10-team home-and-away league.",
    qualifiedDate: "2025-09-09",
  },
  COL: {
    confederation: "CONMEBOL",
    method: "confederation-round",
    headline: "CONMEBOL 3rd place",
    detail:
      "Colombia finished third in the CONMEBOL table with 28 points, returning after missing Qatar 2022.",
    qualifiedDate: "2025-09-04",
  },
  URU: {
    confederation: "CONMEBOL",
    method: "confederation-round",
    headline: "CONMEBOL 4th place",
    detail:
      "Uruguay claimed the fourth automatic spot with 28 points in the CONMEBOL league, continuing their long World Cup tradition.",
    qualifiedDate: "2025-09-09",
  },
  BRA: {
    confederation: "CONMEBOL",
    method: "confederation-round",
    headline: "CONMEBOL 5th place",
    detail:
      "Brazil took the fifth automatic berth with 28 points - the Seleção have qualified for every World Cup in history.",
    qualifiedDate: "2025-09-09",
  },
  PAR: {
    confederation: "CONMEBOL",
    method: "confederation-round",
    headline: "CONMEBOL 6th place",
    detail:
      "Paraguay secured the sixth and final automatic CONMEBOL spot with 28 points, returning to the World Cup for the first time since 2010.",
    qualifiedDate: "2025-09-09",
  },
  NZL: {
    confederation: "OFC",
    method: "confederation-round",
    headline: "OFC knockout winners",
    detail:
      "New Zealand won the OFC third-round knockout tournament in March 2025, earning Oceania's guaranteed World Cup berth for the first time.",
    qualifiedDate: "2025-03-24",
  },
  GER: {
    confederation: "UEFA",
    method: "group-winner",
    headline: "UEFA Group A winners",
    detail:
      "Germany topped UEFA Group A with 15 points from six matches, bouncing back after a group-stage exit at Qatar 2022.",
    qualifiedDate: "2025-11-17",
  },
  SUI: {
    confederation: "UEFA",
    method: "group-winner",
    headline: "UEFA Group B winners",
    detail:
      "Switzerland won UEFA Group B with 14 points, reaching a sixth consecutive World Cup.",
    qualifiedDate: "2025-11-17",
  },
  SCO: {
    confederation: "UEFA",
    method: "group-winner",
    headline: "UEFA Group C winners",
    detail:
      "Scotland topped UEFA Group C with 13 points, qualifying for their first World Cup since France 1998.",
    qualifiedDate: "2025-11-17",
  },
  FRA: {
    confederation: "UEFA",
    method: "group-winner",
    headline: "UEFA Group D winners",
    detail:
      "France dominated UEFA Group D with 16 points from six games as runners-up at Qatar 2022.",
    qualifiedDate: "2025-11-17",
  },
  ESP: {
    confederation: "UEFA",
    method: "group-winner",
    headline: "UEFA Group E winners",
    detail:
      "Spain won UEFA Group E with 16 points, continuing their strong recent World Cup form after a Round of 16 exit in 2022.",
    qualifiedDate: "2025-11-17",
  },
  POR: {
    confederation: "UEFA",
    method: "group-winner",
    headline: "UEFA Group F winners",
    detail:
      "Portugal topped UEFA Group F with 13 points, led by a squad featuring Cristiano Ronaldo in his sixth World Cup.",
    qualifiedDate: "2025-11-17",
  },
  NED: {
    confederation: "UEFA",
    method: "group-winner",
    headline: "UEFA Group G winners",
    detail:
      "The Netherlands won UEFA Group G with 20 points from eight matches, reaching the World Cup after a quarter-final run in 2022.",
    qualifiedDate: "2025-11-17",
  },
  AUT: {
    confederation: "UEFA",
    method: "group-winner",
    headline: "UEFA Group H winners",
    detail:
      "Austria topped UEFA Group H with 19 points, qualifying for their first World Cup since 1998.",
    qualifiedDate: "2025-11-17",
  },
  NOR: {
    confederation: "UEFA",
    method: "group-winner",
    headline: "UEFA Group I winners",
    detail:
      "Norway dominated UEFA Group I with 24 points from eight games, sending Italy to the play-offs and returning after 28 years.",
    qualifiedDate: "2025-11-16",
  },
  BEL: {
    confederation: "UEFA",
    method: "group-winner",
    headline: "UEFA Group J winners",
    detail:
      "Belgium won UEFA Group J with 18 points, though the golden generation's last dance ended in a group-stage exit at Qatar 2022.",
    qualifiedDate: "2025-11-17",
  },
  ENG: {
    confederation: "UEFA",
    method: "group-winner",
    headline: "UEFA Group K winners",
    detail:
      "England topped UEFA Group K with a perfect 24 points from eight matches after a quarter-final run as favourites at Qatar 2022.",
    qualifiedDate: "2025-11-17",
  },
  CRO: {
    confederation: "UEFA",
    method: "group-winner",
    headline: "UEFA Group L winners",
    detail:
      "Croatia won UEFA Group L with 22 points, reaching a third consecutive World Cup after bronze at Qatar 2022.",
    qualifiedDate: "2025-11-17",
  },
  BIH: {
    confederation: "UEFA",
    method: "uefa-playoff",
    headline: "UEFA play-off Path A winners",
    detail:
      "Bosnia and Herzegovina beat Wales on penalties in the semi-final, then defeated Italy 4-1 on penalties in Zenica to reach their first World Cup since 2014.",
    qualifiedDate: "2026-03-31",
  },
  SWE: {
    confederation: "UEFA",
    method: "uefa-playoff",
    headline: "UEFA play-off Path B winners",
    detail:
      "Sweden entered via the UEFA Nations League route, beat Ukraine and Poland in the play-offs (3-2 in the final), and became the first European nation to qualify through the Nations League play-off path.",
    qualifiedDate: "2026-03-31",
  },
  TUR: {
    confederation: "UEFA",
    method: "uefa-playoff",
    headline: "UEFA play-off Path C winners",
    detail:
      "Türkiye finished second in UEFA Group E behind Spain, then beat Romania and Kosovo in the play-offs - their first World Cup since finishing third in 2002.",
    qualifiedDate: "2026-03-31",
  },
  CZE: {
    confederation: "UEFA",
    method: "uefa-playoff",
    headline: "UEFA play-off Path D winners",
    detail:
      "Czechia finished second in UEFA Group L behind Croatia, beat Republic of Ireland on penalties in the semi-final, then defeated Denmark 3-1 on penalties to qualify for their first World Cup since 2006.",
    qualifiedDate: "2026-03-31",
  },
};

export function getTeamQualification(teamCode: string): TeamQualification | null {
  return QUALIFICATION[teamCode.toUpperCase()] ?? null;
}

export function getConfederationLabel(confederation: Confederation): string {
  return CONFEDERATION_LABELS[confederation];
}

export function getQualificationMethodLabel(method: QualificationMethod): string {
  return METHOD_LABELS[method];
}

export function formatQualificationDate(isoDate: string): string {
  return new Date(isoDate + "T12:00:00").toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}
