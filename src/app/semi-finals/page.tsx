import Link from "next/link";
import { WC26PageBanner } from "@/components/WC26Brand";
import { AdBanner } from "@/components/AdBanner";
import { FaqSection } from "@/components/FaqSection";
import { JsonLd } from "@/components/JsonLd";
import { HomeSemifinalShowdowns } from "@/components/home/HomeSemifinalShowdowns";
import { BracketPageContent } from "@/components/bracket/BracketPageContent";
import { createPageMetadata } from "@/lib/seo";
import { mergeKeywords, LIVE_SCORES_KEYWORDS } from "@/lib/seo-keywords";
import { getKnockoutHubData } from "@/lib/knockout-hub-data";
import { SEMI_FINALS_FAQ } from "@/lib/knockout-hub-faq";
import { buildBreadcrumbJsonLd } from "@/lib/structured-data";
import { getTeam } from "@/lib/data";

export const revalidate = 60;

export async function generateMetadata() {
  try {
    const { state } = await getKnockoutHubData();
    const matchups = state.semiFinals
      .map((m) => {
        const home = getTeam(m.home.code ?? "", m.home.name).name;
        const away = getTeam(m.away.code ?? "", m.away.name).name;
        return `${home} vs ${away}`;
      })
      .join(" and ");

    const description = matchups
      ? `World Cup 2026 semi-finals: ${matchups}. Live scores, kick-off times, previews, head-to-head, and the road to the Final.`
      : "World Cup 2026 semi-finals — live scores, fixtures, previews, and the full knockout bracket on the road to the Final.";

    return createPageMetadata({
      title: "World Cup 2026 Semi-Finals - Schedule, Live Scores & Previews",
      description,
      path: "/semi-finals",
      keywords: mergeKeywords(LIVE_SCORES_KEYWORDS, [
        "World Cup 2026 semi finals",
        "World Cup semi final schedule",
        "World Cup semi final fixtures",
        "World Cup last four",
      ]),
    });
  } catch {
    return createPageMetadata({
      title: "World Cup 2026 Semi-Finals - Schedule, Live Scores & Previews",
      description:
        "World Cup 2026 semi-finals — live scores, fixtures, previews, and the full knockout bracket on the road to the Final.",
      path: "/semi-finals",
      keywords: mergeKeywords(LIVE_SCORES_KEYWORDS, ["World Cup 2026 semi finals"]),
    });
  }
}

export default async function SemiFinalsPage() {
  const { state, semiFinalFixtures } = await getKnockoutHubData();

  return (
    <div className="space-y-6">
      <JsonLd
        data={buildBreadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Semi-Finals", path: "/semi-finals" },
        ])}
      />

      <WC26PageBanner
        title="World Cup 2026 Semi-Finals"
        subtitle="The last four. Two matches decide who reaches the Final."
      />

      <p className="text-sm text-zinc-600 leading-relaxed max-w-3xl">
        Follow both semi-finals with live scores, pre-match previews, and full-time recaps.
        The winners meet in the{" "}
        <Link href="/final" className="text-blue-600 hover:underline font-medium">
          World Cup Final
        </Link>{" "}
        on 19 July — track every goal on our{" "}
        <Link href="/bracket" className="text-blue-600 hover:underline font-medium">
          live bracket
        </Link>
        .
      </p>

      <HomeSemifinalShowdowns matches={state.semiFinals} fixtures={semiFinalFixtures} />

      <AdBanner placement="inline" />

      <div className="stadium-head">
        <h2 className="stadium-head-title">Full Knockout Bracket</h2>
        <p className="stadium-head-sub">Every result on the road to the trophy</p>
      </div>
      <BracketPageContent />

      <FaqSection heading="World Cup 2026 semi-finals — FAQ" items={SEMI_FINALS_FAQ} />
    </div>
  );
}
