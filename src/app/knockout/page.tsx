import Link from "next/link";
import { WC26PageBanner } from "@/components/WC26Brand";
import { AdBanner } from "@/components/AdBanner";
import { FaqSection } from "@/components/FaqSection";
import { GroupStageArchiveBanner } from "@/components/GroupStageArchiveBanner";
import {
  GroupQualificationGrid,
  GroupStageProgress,
  KnockoutQualificationBoard,
  ThirdPlaceTracker,
} from "@/components/knockout/KnockoutQualificationHub";
import { KnockoutBracketPreview } from "@/components/knockout/KnockoutBracketPreview";
import { createPageMetadata } from "@/lib/seo";
import { fetchAllGroupStandings } from "@/lib/espn/standings";
import { getKnockoutBracket, getMatchesByParams } from "@/lib/espn/services";
import { buildKnockoutQualification } from "@/lib/knockout-qualification";
import { getServerTimezone } from "@/lib/timezone";

export const metadata = createPageMetadata({
  title: "Road to Round of 32 - World Cup 2026 Qualification Tracker",
  description:
    "Live World Cup 2026 knockout qualification tracker - best third-placed teams ranking, 32-team projection board, group progress, and Round of 32 bracket preview.",
  path: "/knockout",
  keywords: [
    "World Cup 2026 Round of 32",
    "best third placed teams",
    "World Cup qualification tracker",
    "knockout qualification",
    "World Cup 2026 groups to knockout",
  ],
});

export const revalidate = 120;

export default async function KnockoutQualificationPage() {
  const timeZone = await getServerTimezone();
  const [standings, matches, bracket] = await Promise.all([
    fetchAllGroupStandings(),
    getMatchesByParams({ range: "group-stage", timeZone }),
    getKnockoutBracket(timeZone),
  ]);

  const snapshot = buildKnockoutQualification(standings, matches);

  return (
    <div className="space-y-6">
      <WC26PageBanner
        title="Road to the Round of 32"
        subtitle="Group-stage qualification tracker — archived after the Round of 32 draw"
      />

      <GroupStageArchiveBanner />

      <p className="text-sm text-zinc-500 flex flex-wrap gap-x-3 gap-y-1">
        <Link href="/bracket" className="text-blue-600 hover:underline font-medium">
          Live bracket →
        </Link>
        <span className="text-zinc-300">·</span>
        <Link href="/fixtures" className="text-blue-600 hover:underline font-medium">
          Knockout fixtures →
        </Link>
        <span className="text-zinc-300">·</span>
        <Link href="/standings" className="text-blue-600 hover:underline font-medium">
          Final group tables →
        </Link>
      </p>

      <GroupStageProgress snapshot={snapshot} />
      <KnockoutQualificationBoard snapshot={snapshot} />
      <ThirdPlaceTracker snapshot={snapshot} />
      <KnockoutBracketPreview bracket={bracket} />
      <GroupQualificationGrid snapshot={snapshot} />

      <AdBanner placement="inline" />

      <FaqSection heading="World Cup 2026 knockout qualification" items={KNOCKOUT_FAQ} />
    </div>
  );
}

const KNOCKOUT_FAQ = [
  {
    question: "How many teams qualify for the Round of 32?",
    answer:
      "Thirty-two teams advance from the 48-team group stage: the top two in each of the 12 groups (24 teams), plus the eight best third-placed teams.",
  },
  {
    question: "How are the best third-placed teams ranked?",
    answer:
      "All twelve third-placed teams are compared on points, then goal difference, then goals scored. Fair play and the drawing of lots follow if teams are still level.",
  },
  {
    question: "When is a group's qualification final?",
    answer:
      "A group is final once all six group-stage matches are played. Until then, positions on this page are live projections from the current table.",
  },
];
