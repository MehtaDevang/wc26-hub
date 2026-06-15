import { TEAMS } from "./data";
import { getRivalryInfo, type RivalryInfo } from "./rivalries";
import type { Match } from "./types";

export interface RivalryPage extends RivalryInfo {
  slug: string;
  teamA: string;
  teamB: string;
  teamAName: string;
  teamBName: string;
  teamAFlag: string;
  teamBFlag: string;
}

function teamSlug(name: string): string {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function pairKey(a: string, b: string): string {
  return [a.toUpperCase(), b.toUpperCase()].sort().join("-");
}

export function rivalrySlug(codeA: string, codeB: string): string {
  const [a, b] = [codeA.toUpperCase(), codeB.toUpperCase()].sort();
  const nameA = TEAMS[a]?.name ?? a;
  const nameB = TEAMS[b]?.name ?? b;
  return `${teamSlug(nameA)}-vs-${teamSlug(nameB)}`;
}

const RIVALRY_PAIRS: Array<[string, string]> = [
  ["ARG", "FRA"],
  ["BRA", "ARG"],
  ["ENG", "GER"],
  ["MEX", "USA"],
  ["POR", "ESP"],
  ["NED", "GER"],
  ["URU", "ARG"],
  ["BRA", "GER"],
  ["CRO", "ARG"],
  ["JPN", "KOR"],
  ["SEN", "ARG"],
  ["MAR", "ESP"],
  ["BEL", "FRA"],
  ["COL", "BRA"],
  ["ECU", "ARG"],
  ["CAN", "USA"],
  ["MEX", "CAN"],
  ["SCO", "ENG"],
  ["AUS", "JPN"],
];

export function getAllRivalryPages(): RivalryPage[] {
  return RIVALRY_PAIRS.flatMap(([a, b]) => {
    const info = getRivalryInfo(a, b);
    const teamA = TEAMS[a];
    const teamB = TEAMS[b];
    if (!info || !teamA || !teamB) return [];
    return [
      {
        ...info,
        slug: rivalrySlug(a, b),
        teamA: a,
        teamB: b,
        teamAName: teamA.name,
        teamBName: teamB.name,
        teamAFlag: teamA.flag,
        teamBFlag: teamB.flag,
        name: info.name ?? `${teamA.name} vs ${teamB.name}`,
      },
    ];
  }).sort((x, y) => x.name!.localeCompare(y.name!));
}

export function getRivalryBySlug(slug: string): RivalryPage | null {
  return getAllRivalryPages().find((r) => r.slug === slug.toLowerCase()) ?? null;
}

export function findRivalryMatches(slug: string, matches: Match[]): Match[] {
  const rivalry = getRivalryBySlug(slug);
  if (!rivalry) return [];
  const key = pairKey(rivalry.teamA, rivalry.teamB);
  return matches.filter((m) => pairKey(m.home, m.away) === key);
}
