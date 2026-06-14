import { getTeamFlag } from "./teams";

const TEAM_NAMES: Record<string, string> = {
  MEX: "Mexico", RSA: "South Africa", KOR: "South Korea", CZE: "Czechia",
  CAN: "Canada", BIH: "Bosnia", QAT: "Qatar", SUI: "Switzerland",
  BRA: "Brazil", MAR: "Morocco", HAI: "Haiti", SCO: "Scotland",
  USA: "United States", PAR: "Paraguay", AUS: "Australia", TUR: "Türkiye",
  GER: "Germany", CUW: "Curaçao", CIV: "Ivory Coast", ECU: "Ecuador",
  NED: "Netherlands", JPN: "Japan", TUN: "Tunisia", SWE: "Sweden",
  BEL: "Belgium", EGY: "Egypt", IRN: "Iran", NZL: "New Zealand",
  ESP: "Spain", CPV: "Cabo Verde", KSA: "Saudi Arabia", URU: "Uruguay",
  FRA: "France", SEN: "Senegal", IRQ: "Iraq", NOR: "Norway",
  ARG: "Argentina", ALG: "Algeria", AUT: "Austria", JOR: "Jordan",
  POR: "Portugal", COD: "DR Congo", UZB: "Uzbekistan", COL: "Colombia",
  ENG: "England", CRO: "Croatia", GHA: "Ghana", PAN: "Panama",
};

const NAME_ALIASES: Record<string, string> = {
  turkey: "TUR",
  "korea republic": "KOR",
  "republic of korea": "KOR",
  "cote d'ivoire": "CIV",
  "côte d'ivoire": "CIV",
  "curacao": "CUW",
  "cape verde": "CPV",
  "saudi arabia": "KSA",
  "dr congo": "COD",
  "democratic republic of the congo": "COD",
  "bosnia and herzegovina": "BIH",
  "bosnia-herzegovina": "BIH",
  "czech republic": "CZE",
  "czechia": "CZE",
  "ivory coast": "CIV",
  "usa": "USA",
  "u.s.": "USA",
  "u.s.a.": "USA",
};

const nameToCode = new Map<string, string>();
for (const [code, name] of Object.entries(TEAM_NAMES)) {
  nameToCode.set(name.toLowerCase(), code);
  nameToCode.set(code.toLowerCase(), code);
}
for (const [alias, code] of Object.entries(NAME_ALIASES)) {
  nameToCode.set(alias.toLowerCase(), code);
}

export function getTeamName(code: string): string {
  return TEAM_NAMES[code.toUpperCase()] ?? code;
}

export function resolveTeamCode(nameOrCode: string): string | undefined {
  const key = nameOrCode.trim().toLowerCase();
  if (!key) return undefined;
  return nameToCode.get(key) ?? nameToCode.get(key.replace(/\./g, ""));
}

export function teamsMatch(
  codeA: string,
  nameA: string,
  codeB: string,
  nameB: string
): boolean {
  const a = codeA.toUpperCase();
  const b = codeB.toUpperCase();
  if (a === b) return true;
  if (nameA.toLowerCase() === nameB.toLowerCase()) return true;
  const resolvedA = resolveTeamCode(nameA) ?? resolveTeamCode(codeA);
  const resolvedB = resolveTeamCode(nameB) ?? resolveTeamCode(codeB);
  return !!resolvedA && resolvedA === resolvedB;
}

export function getTeamDisplay(code: string, name?: string, logo?: string) {
  const upper = code.toUpperCase();
  return {
    code: upper,
    name: name ?? getTeamName(upper),
    flag: getTeamFlag(upper),
    logo,
  };
}
