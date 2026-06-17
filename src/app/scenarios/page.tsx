import Link from "next/link";
import { ScenariosTabs } from "@/components/ScenariosTabs";
import { WC26PageBanner } from "@/components/WC26Brand";
import { AdBanner } from "@/components/AdBanner";
import { createPageMetadata } from "@/lib/seo";
import { fetchAllGroupStandings } from "@/lib/espn/standings";
import { getMatchesByParams } from "@/lib/espn/services";
import { getServerTimezone } from "@/lib/timezone";

export const metadata = createPageMetadata({
  title: "World Cup 2026 Qualification Scenarios & Group Simulator",
  description:
    "World Cup 2026 group qualification calculator and what-if simulator - set hypothetical scores for remaining fixtures and watch the table reshuffle, or see what each team needs to advance.",
  path: "/scenarios",
  keywords: [
    "World Cup qualification scenarios",
    "World Cup group simulator",
    "what if group calculator",
    "can team qualify",
    "group stage calculator",
    "World Cup 2026 advancement",
  ],
});

export const revalidate = 300;

export default async function ScenariosPage() {
  const timeZone = await getServerTimezone();
  const [standings, matches] = await Promise.all([
    fetchAllGroupStandings(),
    getMatchesByParams({ range: "group-stage", timeZone }),
  ]);

  return (
    <div className="space-y-6">
      <WC26PageBanner
        title="Qualification Scenarios"
        subtitle="What does your team need - or simulate the whole group yourself"
      />
      <p className="text-sm text-zinc-500 flex flex-wrap gap-x-3 gap-y-1">
        <Link href="/standings" className="text-blue-600 hover:underline font-medium">
          Live standings →
        </Link>
        <span className="text-zinc-300">·</span>
        <Link href="/groups" className="text-blue-600 hover:underline font-medium">
          All groups →
        </Link>
      </p>
      <AdBanner placement="inline" />
      <ScenariosTabs standings={standings} matches={matches} />
    </div>
  );
}
