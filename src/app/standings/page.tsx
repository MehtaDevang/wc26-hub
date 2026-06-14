import Link from "next/link";
import { InteractiveStandingsGrid } from "@/components/InteractiveStandingsGrid";
import { LiveKnockoutBracket } from "@/components/LiveKnockoutBracket";
import { WC26PageBanner } from "@/components/WC26Brand";
import { fetchAllGroupStandings } from "@/lib/espn/standings";
import { getKnockoutBracket } from "@/lib/espn/services";
import { AdBanner } from "@/components/AdBanner";
import { createPageMetadata } from "@/lib/seo";
import { getServerTimezone } from "@/lib/timezone";

export const metadata = createPageMetadata({
  title: "Group Tables & Standings",
  description: "Live FIFA World Cup 2026 group standings, points, goal difference, and knockout qualification.",
  path: "/standings",
});

export const revalidate = 120;

export default async function StandingsPage() {
  const timeZone = await getServerTimezone();
  const [standings, bracket] = await Promise.all([
    fetchAllGroupStandings(),
    getKnockoutBracket(timeZone),
  ]);

  return (
    <div className="space-y-6">
      <WC26PageBanner
        title="Group Standings"
        subtitle="Live tables for all 12 World Cup groups — tap a team or browse by group"
      />
      <p className="text-sm text-zinc-500 flex flex-wrap items-center gap-x-3 gap-y-1">
        <Link href="/groups" className="text-blue-600 hover:underline font-medium">
          View all groups A–L →
        </Link>
        <span className="text-zinc-300">·</span>
        <Link href="/bracket" className="text-blue-600 hover:underline font-medium">
          Full knockout bracket →
        </Link>
      </p>
      <AdBanner placement="standings" />
      <InteractiveStandingsGrid groups={standings} />
      <LiveKnockoutBracket initialData={bracket} showLink />
    </div>
  );
}
