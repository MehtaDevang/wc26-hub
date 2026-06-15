import { redirect } from "next/navigation";
import { MatchNarrativePageView } from "@/components/MatchNarrativePageView";
import { JsonLd } from "@/components/JsonLd";
import { createPageMetadata } from "@/lib/seo";
import { buildBreadcrumbJsonLd, buildSportsEventJsonLd } from "@/lib/structured-data";
import { mergeKeywords, LIVE_SCORES_KEYWORDS, STATS_KEYWORDS } from "@/lib/seo-keywords";
import { isValidMatchId } from "@/lib/api-security";
import { getServerTimezone } from "@/lib/timezone";
import { requireMatchPageData } from "@/lib/match-page-data";

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { id } = await params;
  if (!isValidMatchId(id)) {
    return createPageMetadata({
      title: "Match Recap Not Found",
      description: "World Cup 2026 match recap not found.",
      path: `/match/${id}/recap`,
      noIndex: true,
    });
  }

  try {
    const timeZone = await getServerTimezone();
    const { match } = await requireMatchPageData(id, timeZone);
    const score =
      match.status !== "upcoming"
        ? `${match.homeScore}-${match.awayScore}`
        : "";
    return createPageMetadata({
      title: `${match.homeName} ${score} ${match.awayName} Recap — World Cup 2026`,
      description: `Full recap: ${match.homeName} ${match.homeScore}-${match.awayScore} ${match.awayName} at FIFA World Cup 2026 — scorers, match stats, and key moments.`,
      path: `/match/${id}/recap`,
      keywords: mergeKeywords(LIVE_SCORES_KEYWORDS, STATS_KEYWORDS, [
        `${match.homeName} vs ${match.awayName} recap`,
        `${match.homeName} vs ${match.awayName} result`,
        "World Cup match report",
      ]),
    });
  } catch {
    return createPageMetadata({
      title: "World Cup 2026 Match Recap",
      description: "FIFA World Cup 2026 match recap and full-time report.",
      path: `/match/${id}/recap`,
      noIndex: true,
    });
  }
}

export default async function MatchRecapPage({ params }: PageProps) {
  const { id } = await params;
  const timeZone = await getServerTimezone();
  const { match, detail } = await requireMatchPageData(id, timeZone);

  if (match.status === "upcoming") redirect(`/match/${id}/preview`);
  if (match.status === "live") redirect(`/match/${id}`);

  const breadcrumbJsonLd = buildBreadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Fixtures", path: "/fixtures" },
    { name: `${match.homeName} vs ${match.awayName}`, path: `/match/${id}` },
    { name: "Recap", path: `/match/${id}/recap` },
  ]);

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@graph": [buildSportsEventJsonLd(match, id), breadcrumbJsonLd],
        }}
      />
      <MatchNarrativePageView match={match} detail={detail} mode="recap" timeZone={timeZone} />
    </>
  );
}
