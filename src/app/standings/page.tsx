import Link from "next/link";
import { WC26PageBanner } from "@/components/WC26Brand";
import { AdBanner } from "@/components/AdBanner";
import { EditorialHubIntro } from "@/components/EditorialHubIntro";
import {
  StandingsBracketSection,
  StandingsTablesSection,
} from "@/components/standings/StandingsPageContent";
import { STANDINGS_HUB_INTRO } from "@/lib/editorial-hub-intros";
import { createPageMetadata } from "@/lib/seo";
import { mergeKeywords, LIVE_SCORES_KEYWORDS } from "@/lib/seo-keywords";

export const metadata = createPageMetadata({
  title: "World Cup 2026 Standings - Final Group Tables (Archive)",
  description:
    "Final FIFA World Cup 2026 group-stage standings for all 12 groups. Points, goal difference, and who advanced to the knockout bracket.",
  path: "/standings",
  keywords: mergeKeywords(LIVE_SCORES_KEYWORDS, [
    "World Cup points table",
    "group stage standings",
    "qualification standings",
    "World Cup table live",
  ]),
});

export const revalidate = 120;

export default function StandingsPage() {
  return (
    <div className="space-y-6">
      <WC26PageBanner
        title="Group Standings"
        subtitle="Final group-stage tables — who advanced to the Round of 32"
      />
      <p className="text-sm text-zinc-500 flex flex-wrap items-center gap-x-3 gap-y-1">
        <Link href="/bracket" className="text-blue-600 hover:underline font-medium">
          Live knockout bracket →
        </Link>
        <span className="text-zinc-300">·</span>
        <Link href="/fixtures" className="text-blue-600 hover:underline font-medium">
          Knockout fixtures →
        </Link>
        <span className="text-zinc-300">·</span>
        <Link href="/leaders" className="text-blue-600 hover:underline font-medium">
          Golden Boot leaders →
        </Link>
        <span className="text-zinc-300">·</span>
        <Link href="/groups" className="text-blue-600 hover:underline font-medium">
          All groups A–L →
        </Link>
      </p>
      <EditorialHubIntro intro={STANDINGS_HUB_INTRO} />
      <AdBanner placement="standings" />
      <StandingsTablesSection />
      <StandingsBracketSection />
    </div>
  );
}
