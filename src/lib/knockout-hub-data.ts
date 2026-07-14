import { cache } from "react";
import { fetchEspnScoreboard } from "@/lib/espn/client";
import { transformEvents } from "@/lib/espn/transform";
import { getKnockoutBracket } from "@/lib/espn/services";
import { getFinaleState, type FinaleState } from "@/lib/tournament-stage";
import { getServerTimezone } from "@/lib/timezone";
import type { KnockoutBracketData, Match } from "@/lib/types";

export interface KnockoutHubData {
  state: FinaleState;
  bracket: KnockoutBracketData | null;
  semiFinalFixtures: Match[];
  finalFixtures: Match[];
}

export const getKnockoutHubData = cache(async (): Promise<KnockoutHubData> => {
  const timeZone = await getServerTimezone();
  const [bracket, semiBoard, finalBoard] = await Promise.all([
    getKnockoutBracket(timeZone).catch(() => null),
    fetchEspnScoreboard({ dates: "20260714-20260715" }).catch(() => ({ events: [] })),
    fetchEspnScoreboard({ dates: "20260718-20260719" }).catch(() => ({ events: [] })),
  ]);

  return {
    bracket,
    state: getFinaleState(bracket),
    semiFinalFixtures: transformEvents(semiBoard.events ?? [], timeZone),
    finalFixtures: transformEvents(finalBoard.events ?? [], timeZone),
  };
});

/** Knockout fixtures are underway — group-stage tools should drop out of search. */
export function isKnockoutPhase(bracket: KnockoutBracketData | null): boolean {
  return Boolean(bracket?.activeRound);
}
