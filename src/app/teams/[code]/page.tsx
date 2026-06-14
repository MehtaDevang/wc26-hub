import Link from "next/link";
import { notFound } from "next/navigation";
import { getTeamJourney } from "@/lib/espn/team-journey";
import { TeamJourneyContent } from "@/components/TeamJourneyContent";
import { AdBanner } from "@/components/AdBanner";
import { createPageMetadata } from "@/lib/seo";
import { isValidTeamCode } from "@/lib/api-security";
import { resolveTeamCode, getTeamName } from "@/lib/team-lookup";
import { getServerTimezone } from "@/lib/timezone";

interface PageProps {
  params: Promise<{ code: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { code } = await params;
  const teamCode = resolveTeamCode(code) ?? code.toUpperCase();

  if (!isValidTeamCode(code)) {
    return createPageMetadata({
      title: "Team Not Found",
      description: "World Cup 2026 team page not found.",
      path: `/teams/${code}`,
      noIndex: true,
    });
  }

  const name = getTeamName(teamCode);
  return createPageMetadata({
    title: `${name} World Cup 2026 — Fixtures, Results & Standings`,
    description: `Follow ${name} at FIFA World Cup 2026 — group standings, live results, upcoming fixtures, goals, and full tournament journey.`,
    path: `/teams/${teamCode}`,
  });
}

export const revalidate = 120;
export const maxDuration = 30;

export default async function TeamPage({ params }: PageProps) {
  const { code } = await params;

  if (!isValidTeamCode(code)) notFound();

  const timeZone = await getServerTimezone();
  const journey = await getTeamJourney(code, timeZone);
  if (!journey) notFound();

  return (
    <div className="space-y-6">
      <nav className="text-sm text-zinc-400">
        <Link href="/teams" className="hover:text-blue-600">Teams</Link>
        <span className="mx-2">/</span>
        <span className="text-zinc-600">{journey.teamName}</span>
      </nav>
      <AdBanner placement="match" />
      <TeamJourneyContent journey={journey} timezone={timeZone} />
    </div>
  );
}
