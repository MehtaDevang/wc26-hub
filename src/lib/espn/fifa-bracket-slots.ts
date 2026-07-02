/**
 * FIFA World Cup 2026 knockout bracket positions.
 *
 * The UI tree pairs adjacent R32 slots (0+1, 2+3, …) into each R16 slot.
 * FIFA's official bracket numbers (1–16) are *not* in kickoff order — this map
 * places each R32 fixture on the correct tree slot and sets matchNumber to the
 * FIFA label used in feeder strings ("Round of 32 11 Winner", etc.).
 */

/** FIFA bracket position (1–16) → visual tree slot (0–15) */
export const FIFA_R32_POSITION_TO_TREE_SLOT: Record<number, number> = {
  1: 0,
  3: 1,
  2: 2,
  5: 3,
  4: 4,
  6: 5,
  7: 6,
  8: 7,
  11: 8,
  12: 9,
  9: 10,
  10: 11,
  14: 12,
  16: 13,
  13: 14,
  15: 15,
};

/** ESPN event id → FIFA R32 bracket position (stable for WC26). */
const ESPN_R32_EVENT_POSITION: Record<string, number> = {
  "760486": 1, // South Africa vs Canada
  "760489": 2, // Germany vs Paraguay
  "760488": 3, // Netherlands vs Morocco
  "760487": 4, // Brazil vs Japan
  "760492": 5, // France vs Sweden
  "760490": 6, // Ivory Coast vs Norway
  "760491": 7, // Mexico vs Ecuador
  "760495": 8, // England vs DR Congo
  "760494": 9, // United States vs Bosnia
  "760493": 10, // Belgium vs Senegal
  "760497": 11, // Spain vs Austria
  "760496": 12, // Portugal vs Croatia
  "760498": 13, // Switzerland vs Algeria
  "760500": 14, // Argentina vs Cape Verde
  "760501": 15, // Colombia vs Ghana
  "760499": 16, // Australia vs Egypt
};

/** Sorted team-code pair → FIFA R32 position (fallback when id unknown). */
const R32_TEAM_PAIR_POSITION: Record<string, number> = {
  "CAN:RSA": 1,
  "GER:PAR": 2,
  "MAR:NED": 3,
  "BRA:JPN": 4,
  "FRA:SWE": 5,
  "CIV:NOR": 6,
  "ECU:MEX": 7,
  "COD:ENG": 8,
  "BIH:USA": 9,
  "BEL:SEN": 10,
  "AUT:ESP": 11,
  "CRO:POR": 12,
  "ALG:SUI": 13,
  "ARG:CPV": 14,
  "COL:GHA": 15,
  "AUS:EGY": 16,
};

function teamPairKey(a: string, b: string): string {
  return [a.toUpperCase(), b.toUpperCase()].sort().join(":");
}

export function fifaR32PositionForMatch(
  eventId: string,
  homeCode: string,
  awayCode: string
): number | null {
  const fromId = ESPN_R32_EVENT_POSITION[eventId];
  if (fromId) return fromId;

  const fromTeams = R32_TEAM_PAIR_POSITION[teamPairKey(homeCode, awayCode)];
  return fromTeams ?? null;
}

/** Known R16 fixtures (team pair) → tree slot — matches FIFA R16_PAIRINGS order. */
const R16_TEAM_PAIR_SLOT: Record<string, number> = {
  "CAN:MAR": 0,
  "FRA:PAR": 1,
  "BRA:NOR": 2,
  "ENG:MEX": 3,
  "BEL:USA": 5,
};

export function r16TreeSlotForTeams(homeCode: string, awayCode: string): number | null {
  return R16_TEAM_PAIR_SLOT[teamPairKey(homeCode, awayCode)] ?? null;
}
