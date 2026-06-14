import { notFound } from "next/navigation";
import { fetchEspnScoreboard, fetchEspnSummary } from "@/lib/espn/client";
import { transformEvent, transformSummary, buildAllMatchHighlights, buildMinimalMatchDetail } from "@/lib/espn/transform";
import { buildHeadToHead } from "@/lib/espn/head-to-head";
import { getRivalryInfo } from "@/lib/rivalries";
import { MatchDetailView } from "@/components/MatchDetailView";
import { JsonLd } from "@/components/JsonLd";
import { lookupVenue } from "@/lib/venues";
import { fetchMatchWeather } from "@/lib/weather";
import { createPageMetadata } from "@/lib/seo";
import { buildSportsEventJsonLd, buildBreadcrumbJsonLd } from "@/lib/structured-data";
import { mergeKeywords, LIVE_SCORES_KEYWORDS, STATS_KEYWORDS } from "@/lib/seo-keywords";
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
    const liveTag = match.status === "live" ? "Live Score" : match.status === "finished" ? "Result" : "Preview";

    return createPageMetadata({
      title: `${match.homeName} ${score} ${match.awayName} — World Cup 2026 ${liveTag}`,
      description: `${match.homeName} vs ${match.awayName} at FIFA World Cup 2026 — live score, scorers, match stats, lineups, head-to-head history, highlights, and full match report.`,
      path: `/match/${id}`,
      keywords: mergeKeywords(LIVE_SCORES_KEYWORDS, STATS_KEYWORDS, [
        `${match.homeName} vs ${match.awayName}`,
        `${match.homeName} ${match.awayName} live score`,
        "World Cup match stats",
        "match highlights",
        "head to head",
      ]),
    });
  } catch {
    return createPageMetadata({
      title: "World Cup 2026 Match — Live Score, Stats & Highlights",
      description: "FIFA World Cup 2026 match live score, stats, lineups, head-to-head history, and highlights.",
      path: `/match/${id}`,
      keywords: mergeKeywords(LIVE_SCORES_KEYWORDS, STATS_KEYWORDS),
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
  let highlights: Awaited<ReturnType<typeof buildAllMatchHighlights>> = [];

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
    // ESPN summary can be unavailable for early knockout placeholders — keep minimal detail
  }

  const venueMeta = lookupVenue(
    detail.venue?.name ?? match.venue,
    detail.venue?.city ?? match.venueCity,
    detail.venue?.country ?? match.venueCountry
  );
  const weather = await fetchMatchWeather(venueMeta.lat, venueMeta.lon, match.date);
  if (weather) detail.weather = weather;

  const matchJsonLd = buildSportsEventJsonLd(match, id);
  const breadcrumbJsonLd = buildBreadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Fixtures", path: "/fixtures" },
    { name: `${match.homeName} vs ${match.awayName}`, path: `/match/${id}` },
  ]);

  return (
    <>
      <JsonLd data={matchJsonLd} />
      <JsonLd data={breadcrumbJsonLd} />
      <MatchDetailView
        match={match}
        detail={detail}
        highlights={highlights}
      />
    </>
  );
}
