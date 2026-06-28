import Link from "next/link";
import { ScenariosTabs } from "@/components/ScenariosTabs";
import { FaqSection } from "@/components/FaqSection";
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
        <Link href="/knockout" className="text-blue-600 hover:underline font-medium">
          Road to Round of 32 →
        </Link>
        <span className="text-zinc-300">·</span>
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
      <FaqSection
        heading="World Cup 2026 qualification - FAQ"
        items={SCENARIOS_FAQ}
      />
    </div>
  );
}

const SCENARIOS_FAQ = [
  {
    question: "How many teams qualify from each group at World Cup 2026?",
    answer:
      "The top two teams in each of the 12 groups qualify automatically for the knockout stage. They are joined by the eight best third-placed teams, making 32 teams in the Round of 32.",
  },
  {
    question: "How are the best third-placed teams decided?",
    answer:
      "The 12 group third-placed teams are ranked against each other - first by points, then goal difference, then goals scored, and finally disciplinary record. The top eight advance to the Round of 32.",
  },
  {
    question: "How many points are usually needed to advance?",
    answer:
      "Four points often secures a top-two finish, and even three points with a positive goal difference can be enough to reach the knockout stage as one of the best third-placed teams. It varies by group.",
  },
  {
    question: "What happens if teams are level on points in a group?",
    answer:
      "Ties are broken by goal difference, then goals scored, then the head-to-head result between the tied teams, and finally fair-play and drawing of lots if still level.",
  },
];
