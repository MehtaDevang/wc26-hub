import { fetchEspnScoreboard } from "./espn/client";
import { transformEvents } from "./espn/transform";
import { isMatchAtVenue, type VenueMeta } from "./venues";
import type { Match } from "./types";

const STATUS_ORDER = { live: 0, upcoming: 1, finished: 2 } as const;

export async function getMatchesAtVenue(
  venue: VenueMeta,
  timeZone: string
): Promise<Match[]> {
  const data = await fetchEspnScoreboard({ dates: "20260611-20260719" });
  const matches = transformEvents(data.events ?? [], timeZone).filter((m) =>
    isMatchAtVenue(m, venue)
  );

  return matches.sort((a, b) => {
    const statusDiff = STATUS_ORDER[a.status] - STATUS_ORDER[b.status];
    if (statusDiff !== 0) return statusDiff;
    const aTime = a.kickoffAt ? new Date(a.kickoffAt).getTime() : 0;
    const bTime = b.kickoffAt ? new Date(b.kickoffAt).getTime() : 0;
    return aTime - bTime;
  });
}
