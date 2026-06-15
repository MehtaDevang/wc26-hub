import { redirect } from "next/navigation";
import { MatchNarrativePageView } from "@/components/MatchNarrativePageView";
import { JsonLd } from "@/components/JsonLd";
import { createPageMetadata } from "@/lib/seo";
import { buildBreadcrumbJsonLd } from "@/lib/structured-data";
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
      title: "Match Preview Not Found",
      description: "World Cup 2026 match preview not found.",
      path: `/match/${id}/preview`,
      noIndex: true,
    });
  }

  try {
    const timeZone = await getServerTimezone();
    const { match } = await requireMatchPageData(id, timeZone);
    return createPageMetadata({
      title: `${match.homeName} vs ${match.awayName} Preview — World Cup 2026`,
      description: `Preview ${match.homeName} vs ${match.awayName} at FIFA World Cup 2026 — form guide, head-to-head, venue, weather, and keys to watch before kickoff.`,
      path: `/match/${id}/preview`,
      keywords: mergeKeywords(LIVE_SCORES_KEYWORDS, STATS_KEYWORDS, [
        `${match.homeName} vs ${match.awayName} preview`,
        "World Cup match preview",
        "pre-match analysis",
      ]),
    });
  } catch {
    return createPageMetadata({
      title: "World Cup 2026 Match Preview",
      description: "FIFA World Cup 2026 match preview and pre-match analysis.",
      path: `/match/${id}/preview`,
      noIndex: true,
    });
  }
}

export default async function MatchPreviewPage({ params }: PageProps) {
  const { id } = await params;
  const timeZone = await getServerTimezone();
  const { match, detail } = await requireMatchPageData(id, timeZone);

  if (match.status === "finished") redirect(`/match/${id}/recap`);
  if (match.status === "live") redirect(`/match/${id}`);

  const breadcrumbJsonLd = buildBreadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Fixtures", path: "/fixtures" },
    { name: `${match.homeName} vs ${match.awayName}`, path: `/match/${id}` },
    { name: "Preview", path: `/match/${id}/preview` },
  ]);

  return (
    <>
      <JsonLd data={breadcrumbJsonLd} />
      <MatchNarrativePageView match={match} detail={detail} mode="preview" timeZone={timeZone} />
    </>
  );
}
