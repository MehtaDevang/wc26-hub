import Link from "next/link";
import { InteractiveStandingsGrid } from "@/components/InteractiveStandingsGrid";
import { LiveKnockoutBracket } from "@/components/LiveKnockoutBracket";
import { WC26PageBanner } from "@/components/WC26Brand";
import { fetchAllGroupStandings } from "@/lib/espn/standings";
import { getKnockoutBracket } from "@/lib/espn/services";
import { AdBanner } from "@/components/AdBanner";
import { EditorialHubIntro } from "@/components/EditorialHubIntro";
import { STANDINGS_HUB_INTRO } from "@/lib/editorial-hub-intros";
import { createPageMetadata } from "@/lib/seo";
import { mergeKeywords, LIVE_SCORES_KEYWORDS } from "@/lib/seo-keywords";
import { getServerTimezone } from "@/lib/timezone";

export const metadata = createPageMetadata({
  title: "World Cup 2026 Standings - Live Group Tables & Points",
  description:
    "Live FIFA World Cup 2026 group standings for all 12 groups. Points, goal difference, qualification spots, and knockout bracket - updated after every match.",
  path: "/standings",
  keywords: mergeKeywords(LIVE_SCORES_KEYWORDS, [
    "World Cup points table",
    "group stage standings",
    "qualification standings",
    "World Cup table live",
  ]),
});

export const revalidate = 120;

export default async function StandingsPage() {
  const timeZone = await getServerTimezone();
  const standings = await fetchAllGroupStandings();
  const bracket = await getKnockoutBracket(timeZone, standings);

  return (
    <div className="space-y-6">
      <WC26PageBanner
        title="Group Standings"
        subtitle="Live tables for all 12 World Cup groups - tap a team or browse by group"
      />
      <p className="text-sm text-zinc-500 flex flex-wrap items-center gap-x-3 gap-y-1">
        <Link href="/groups" className="text-blue-600 hover:underline font-medium">
          View all groups A–L →
        </Link>
        <span className="text-zinc-300">·</span>
        <Link href="/knockout" className="text-blue-600 hover:underline font-medium">
          Road to Round of 32 →
        </Link>
        <span className="text-zinc-300">·</span>
        <Link href="/bracket" className="text-blue-600 hover:underline font-medium">
          Full knockout bracket →
        </Link>
        <span className="text-zinc-300">·</span>
        <Link href="/scenarios" className="text-blue-600 hover:underline font-medium">
          Qualification scenarios →
        </Link>
      </p>
      <EditorialHubIntro intro={STANDINGS_HUB_INTRO} />
      <AdBanner placement="standings" />
      <InteractiveStandingsGrid groups={standings} />
      <LiveKnockoutBracket initialData={bracket} showLink />
    </div>
  );
}
