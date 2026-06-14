import { notFound } from "next/navigation";
import { fetchEspnScoreboard, fetchEspnSummary } from "@/lib/espn/client";
import { transformEvent, transformSummary, goalsToHighlights, buildMinimalMatchDetail } from "@/lib/espn/transform";
import { MatchDetailView } from "@/components/MatchDetailView";
import { JsonLd } from "@/components/JsonLd";
import { lookupVenue } from "@/lib/venues";
import { fetchMatchWeather } from "@/lib/weather";
import { createPageMetadata } from "@/lib/seo";
import { getSiteUrl } from "@/lib/site";
import { isValidMatchId } from "@/lib/api-security";
import { getServerTimezone } from "@/lib/timezone";

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { id } = await params;

  if (!isValidMatchId(id)) {
    return createPageMetadata({
      title: "Match Not Found",
      description: "The requested World Cup 2026 match could not be found.",
      path: `/match/${id}`,
      noIndex: true,
    });
  }

  try {
    const timeZone = await getServerTimezone();
    const scoreboard = await fetchEspnScoreboard({ dates: "20260611-20260719" });
    const event = scoreboard.events?.find((e) => e.id === id);
    if (!event) {
      return createPageMetadata({
        title: "Match Not Found",
        description: "The requested World Cup 2026 match could not be found.",
        path: `/match/${id}`,
        noIndex: true,
      });
    }

    const match = transformEvent(event, timeZone);
    const score =
      match.status !== "upcoming"
        ? `${match.homeScore}-${match.awayScore}`
        : "vs";

    return createPageMetadata({
      title: `${match.homeName} ${score} ${match.awayName}`,
      description: `Live match details, scorers, stats, lineups, and highlights for ${match.homeName} vs ${match.awayName} at the FIFA World Cup 2026.`,
      path: `/match/${id}`,
    });
  } catch {
    return createPageMetadata({
      title: "Match Details",
      description: "World Cup 2026 match details, stats, and highlights.",
      path: `/match/${id}`,
    });
  }
}

export default async function MatchPage({ params }: PageProps) {
  const { id } = await params;

  if (!isValidMatchId(id)) notFound();

  const timeZone = await getServerTimezone();
  const scoreboard = await fetchEspnScoreboard({ dates: "20260611-20260719" });
  const event = scoreboard.events?.find((e) => e.id === id);
  if (!event) notFound();

  const match = transformEvent(event, timeZone);

  let detail = buildMinimalMatchDetail(match);
  let highlights: Awaited<ReturnType<typeof goalsToHighlights>> = [];

  try {
    const summary = await fetchEspnSummary(id);
    detail = transformSummary(summary, match);
    highlights = goalsToHighlights(match, summary);
  } catch {
    // ESPN summary can be unavailable for early knockout placeholders — keep minimal detail
  }

  const venueMeta = lookupVenue(
    detail.venue?.name ?? match.venue,
    detail.venue?.city ?? match.venueCity,
    detail.venue?.country ?? match.venueCountry
  );
  const weather = await fetchMatchWeather(venueMeta.lat, venueMeta.lon, match.date);
  if (weather) detail.weather = weather;

  const matchJsonLd: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "SportsEvent",
    name: `${match.homeName} vs ${match.awayName}`,
    sport: "Soccer",
    startDate: match.date,
    location: {
      "@type": "Place",
      name: match.venue,
      address: {
        "@type": "PostalAddress",
        addressLocality: match.venueCity,
        addressCountry: match.venueCountry,
      },
    },
    homeTeam: { "@type": "SportsTeam", name: match.homeName },
    awayTeam: { "@type": "SportsTeam", name: match.awayName },
    url: `${getSiteUrl()}/match/${id}`,
  };

  if (match.status !== "finished") {
    matchJsonLd.eventStatus = "https://schema.org/EventScheduled";
  }

  return (
    <>
      <JsonLd data={matchJsonLd} />
      <MatchDetailView
        match={match}
        detail={detail}
        highlights={highlights}
      />
    </>
  );
}
