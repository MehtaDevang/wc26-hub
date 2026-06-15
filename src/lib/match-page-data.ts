import { notFound } from "next/navigation";
import { fetchEspnScoreboard, fetchEspnSummary } from "@/lib/espn/client";
import {
  transformEvent,
  transformSummary,
  buildAllMatchHighlights,
  buildMinimalMatchDetail,
  transformEvents,
} from "@/lib/espn/transform";
import { buildHeadToHead } from "@/lib/espn/head-to-head";
import { getRivalryInfo } from "@/lib/rivalries";
import { lookupVenue } from "@/lib/venues";
import { fetchMatchWeather } from "@/lib/weather";
import { isValidMatchId } from "@/lib/api-security";
import type { Highlight, Match, MatchDetail } from "@/lib/types";

export interface MatchPageData {
  match: Match;
  detail: MatchDetail;
  highlights: Highlight[];
}

export async function loadMatchPageData(
  id: string,
  timeZone: string
): Promise<MatchPageData | null> {
  if (!isValidMatchId(id)) return null;

  const scoreboard = await fetchEspnScoreboard({ dates: "20260611-20260719" });
  const event = scoreboard.events?.find((e) => e.id === id);
  if (!event) return null;

  const match = transformEvent(event, timeZone);
  let detail = buildMinimalMatchDetail(match);
  let highlights: Highlight[] = [];

  try {
    const summary = await fetchEspnSummary(id);
    try {
      detail = transformSummary(summary, match);
    } catch {
      const h2h = buildHeadToHead(match, summary);
      const rivalry = getRivalryInfo(match.home, match.away);
      detail = {
        ...buildMinimalMatchDetail(match),
        headToHead: h2h.meetings,
        headToHeadRecord: h2h.record,
        rivalryNote: rivalry?.context,
        rivalryName: rivalry?.name,
        rivalryFunFact: rivalry?.funFact,
      };
    }
    highlights = buildAllMatchHighlights(match, summary);
  } catch {
    // minimal detail for placeholders
  }

  const venueMeta = lookupVenue(
    detail.venue?.name ?? match.venue,
    detail.venue?.city ?? match.venueCity,
    detail.venue?.country ?? match.venueCountry
  );
  const weather = await fetchMatchWeather(venueMeta.lat, venueMeta.lon, match.date);
  if (weather) detail.weather = weather;

  return { match, detail, highlights };
}

export async function requireMatchPageData(
  id: string,
  timeZone: string
): Promise<MatchPageData> {
  const data = await loadMatchPageData(id, timeZone);
  if (!data) notFound();
  return data;
}

export async function loadAllMatches(timeZone: string): Promise<Match[]> {
  const scoreboard = await fetchEspnScoreboard({ dates: "20260611-20260719" });
  return transformEvents(scoreboard.events ?? [], timeZone);
}
