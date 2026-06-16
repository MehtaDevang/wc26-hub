/**
 * FIFA Men's World Ranking as of June 2026 (pre-World Cup release).
 * @see https://www.espn.com/soccer/story/_/id/46664763/fifa-mens-top-50-world-rankings
 */
export const FIFA_RANKING_AS_OF = "June 2026";

/** Team code → world rank (1 = best). */
export const FIFA_RANKINGS: Record<string, number> = {
  ARG: 1,
  ESP: 2,
  FRA: 3,
  ENG: 4,
  POR: 5,
  BRA: 6,
  MAR: 7,
  NED: 8,
  BEL: 9,
  GER: 10,
  CRO: 11,
  COL: 13,
  MEX: 14,
  SEN: 15,
  URU: 16,
  USA: 17,
  JPN: 18,
  SUI: 19,
  IRN: 20,
  TUR: 22,
  ECU: 23,
  AUT: 24,
  KOR: 25,
  AUS: 27,
  ALG: 28,
  EGY: 29,
  CAN: 30,
  NOR: 31,
  CIV: 33,
  PAN: 34,
  TUN: 45,
  COD: 46,
  UZB: 50,
  QAT: 56,
  IRQ: 57,
  RSA: 60,
  KSA: 61,
  JOR: 63,
  BIH: 64,
  CPV: 67,
  GHA: 73,
  CUW: 82,
  HAI: 83,
  NZL: 85,
  CZE: 40,
  PAR: 41,
  SCO: 42,
  SWE: 38,
};

export function getFifaRank(code: string): number | undefined {
  return FIFA_RANKINGS[code.toUpperCase()];
}

export function formatFifaRank(rank: number, style: "hash" | "label" = "hash"): string {
  return style === "label" ? `FIFA #${rank}` : `#${rank}`;
}

export function describeFifaRankingMatchup(
  homeCode: string,
  awayCode: string
): string | undefined {
  const homeRank = getFifaRank(homeCode);
  const awayRank = getFifaRank(awayCode);
  if (homeRank == null || awayRank == null) return undefined;
  return `${formatFifaRank(homeRank, "label")} vs ${formatFifaRank(awayRank)}`;
}

export function buildRankingInsight(
  homeCode: string,
  homeName: string,
  awayCode: string,
  awayName: string
): string | undefined {
  const homeRank = getFifaRank(homeCode);
  const awayRank = getFifaRank(awayCode);
  if (homeRank == null || awayRank == null) return undefined;

  const gap = Math.abs(homeRank - awayRank);
  const favorite = homeRank < awayRank ? homeName : awayName;
  const favoriteRank = Math.min(homeRank, awayRank);
  const underdog = homeRank < awayRank ? awayName : homeName;
  const underdogRank = Math.max(homeRank, awayRank);

  if (gap >= 25) {
    return `${favorite} (${formatFifaRank(favoriteRank, "label")}) are heavy favorites on paper against ${underdog} (${formatFifaRank(underdogRank)}).`;
  }
  if (gap >= 12) {
    return `On FIFA rankings (${formatFifaRank(homeRank)} vs ${formatFifaRank(awayRank)}), ${favorite} start as clear favorites.`;
  }
  if (gap <= 5) {
    return `A tight rankings matchup - ${homeName} (${formatFifaRank(homeRank)}) and ${awayName} (${formatFifaRank(awayRank)}) are separated by just ${gap} places.`;
  }
  return `${homeName} (${formatFifaRank(homeRank)}) vs ${awayName} (${formatFifaRank(awayRank)}) on the June 2026 FIFA chart.`;
}
