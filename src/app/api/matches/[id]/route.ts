import { NextRequest, NextResponse } from "next/server";
import { fetchEspnScoreboard, fetchEspnSummary } from "@/lib/espn/client";
import { transformEvent, transformSummary, goalsToHighlights } from "@/lib/espn/transform";
import { lookupVenue } from "@/lib/venues";
import { fetchMatchWeather } from "@/lib/weather";

export const revalidate = 30;

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const scoreboard = await fetchEspnScoreboard({ dates: "20260611-20260719" });
    const event = scoreboard.events?.find((e) => e.id === id);

    if (!event) {
      return NextResponse.json({ error: "Match not found" }, { status: 404 });
    }

    const match = transformEvent(event);
    const summary = await fetchEspnSummary(id);
    const detail = transformSummary(summary, match);
    const highlights = goalsToHighlights(match, summary);

    const venueMeta = lookupVenue(
      detail.venue?.name ?? match.venue,
      detail.venue?.city ?? match.venueCity,
      detail.venue?.country ?? match.venueCountry
    );
    const weather = await fetchMatchWeather(venueMeta.lat, venueMeta.lon, match.date);
    if (weather) detail.weather = weather;

    return NextResponse.json({ match, detail, highlights, source: "espn" });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to fetch match" },
      { status: 500 }
    );
  }
}
