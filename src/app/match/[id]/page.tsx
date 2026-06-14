import { notFound } from "next/navigation";
import { fetchEspnScoreboard, fetchEspnSummary } from "@/lib/espn/client";
import { transformEvent, transformSummary, goalsToHighlights } from "@/lib/espn/transform";
import { MatchDetailView } from "@/components/MatchDetailView";
import { lookupVenue } from "@/lib/venues";
import { fetchMatchWeather } from "@/lib/weather";

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { id } = await params;
  try {
    const scoreboard = await fetchEspnScoreboard({ dates: "20260611-20260719" });
    const event = scoreboard.events?.find((e) => e.id === id);
    if (!event) return { title: "Match Not Found — WC26 Hub" };
    const match = transformEvent(event);
    const score =
      match.status !== "upcoming"
        ? `${match.homeScore}-${match.awayScore}`
        : "vs";
    return {
      title: `${match.homeName} ${score} ${match.awayName} — WC26 Hub`,
      description: `Live match details, scorers, stats and highlights for ${match.homeName} vs ${match.awayName}.`,
    };
  } catch {
    return { title: "Match — WC26 Hub" };
  }
}

export default async function MatchPage({ params }: PageProps) {
  const { id } = await params;

  const scoreboard = await fetchEspnScoreboard({ dates: "20260611-20260719" });
  const event = scoreboard.events?.find((e) => e.id === id);
  if (!event) notFound();

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

  return (
    <MatchDetailView
      match={match}
      detail={detail}
      highlights={highlights}
    />
  );
}
