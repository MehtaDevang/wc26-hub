/** Search-intent keyword clusters for World Cup 2026 traffic. */

export const CORE_KEYWORDS = [
  "FIFA World Cup 2026",
  "World Cup 2026",
  "World Cup live scores",
  "World Cup scores today",
  "football live scores",
  "soccer live scores",
  "World Cup fixtures",
  "World Cup schedule",
  "World Cup results",
  "World Cup standings",
  "World Cup group tables",
  "World Cup teams",
  "World Cup countries",
  "World Cup players",
  "World Cup stats",
  "World Cup history",
  "World Cup bracket",
  "knockout bracket",
  "match highlights",
  "head to head",
  "USA Mexico Canada World Cup",
  "The Goal Posts",
] as const;

export const LIVE_SCORES_KEYWORDS = [
  "World Cup live score",
  "live football scores",
  "today World Cup matches",
  "World Cup score update",
  "real time soccer scores",
];

export const TEAMS_KEYWORDS = [
  "World Cup 2026 teams",
  "World Cup countries list",
  "national team squads",
  "team fixtures",
  "team standings",
];

export const PLAYERS_KEYWORDS = [
  "World Cup players",
  "World Cup squads",
  "player stats",
  "top scorers",
  "football player profiles",
];

export const STATS_KEYWORDS = [
  "match stats",
  "possession stats",
  "lineups",
  "goal scorers",
  "head to head record",
];

export const HISTORY_KEYWORDS = [
  "World Cup winners",
  "World Cup finals history",
  "World Cup records",
  "past World Cups",
  "football history",
];

export function mergeKeywords(...groups: readonly (readonly string[])[]): string[] {
  return [...new Set(groups.flat())];
}
