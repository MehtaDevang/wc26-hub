import type { Team } from "./types";
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

export const TEAMS: Record<string, Team> = Object.fromEntries(
  Object.entries(TEAM_NAMES).map(([code, name]) => [
    code,
    { code, name, flag: getTeamFlag(code) },
  ])
);

export function getTeam(code: string, name?: string, logo?: string): Team {
  const upper = code.toUpperCase();
  const base = TEAMS[upper] ?? { code: upper, name: name ?? code, flag: getTeamFlag(upper) };
  return { ...base, name: name ?? base.name, logo };
}

export function isKnownTeam(code: string): boolean {
  return code.toUpperCase() in TEAMS;
}
