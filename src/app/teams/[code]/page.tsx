import Link from "next/link";
import { notFound } from "next/navigation";
import { getTeamJourney } from "@/lib/espn/team-journey";
import { getTeamSquadPlayers } from "@/lib/espn/player-profile";
import { getTeamQualification } from "@/lib/team-qualification";
import { TeamJourneyContent } from "@/components/TeamJourneyContent";
import { TeamSquad } from "@/components/TeamSquad";
import { TeamQualificationCard } from "@/components/TeamQualification";
import { AdBanner } from "@/components/AdBanner";
import { createPageMetadata } from "@/lib/seo";
import { mergeKeywords, TEAMS_KEYWORDS, LIVE_SCORES_KEYWORDS } from "@/lib/seo-keywords";
import { isValidTeamCode } from "@/lib/api-security";
import { resolveTeamCode, getTeamName } from "@/lib/team-lookup";
import { getServerTimezone } from "@/lib/timezone";
import { JsonLd } from "@/components/JsonLd";
import { buildBreadcrumbJsonLd, buildSportsTeamJsonLd } from "@/lib/structured-data";

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
    title: `${name} World Cup 2026 — Live Scores, Fixtures, Squad & Stats`,
    description: `${name} at FIFA World Cup 2026 — how they qualified, live scores, results, group standings, upcoming fixtures, squad players, goals, and full tournament stats.`,
    path: `/teams/${teamCode}`,
    ogImagePath: `/teams/${teamCode}/opengraph-image`,
    keywords: mergeKeywords(TEAMS_KEYWORDS, LIVE_SCORES_KEYWORDS, [
      `${name} World Cup`,
      `${name} football team`,
      `${name} squad`,
    ]),
  });
}

export const revalidate = 120;
export const maxDuration = 30;

export default async function TeamPage({ params }: PageProps) {
  const { code } = await params;

  if (!isValidTeamCode(code)) notFound();

  const timeZone = await getServerTimezone();
  const [journey, players] = await Promise.all([
    getTeamJourney(code, timeZone),
    getTeamSquadPlayers(code).catch(() => []),
  ]);
  if (!journey) notFound();

  const qualification = getTeamQualification(journey.teamCode);

  return (
    <div className="space-y-6">
      <JsonLd
        data={buildSportsTeamJsonLd({
          name: journey.teamName,
          code: journey.teamCode,
          path: `/teams/${journey.teamCode}`,
        })}
      />
      <JsonLd
        data={buildBreadcrumbJsonLd([
          { name: "Teams", path: "/teams" },
          { name: journey.teamName, path: `/teams/${journey.teamCode}` },
        ])}
      />
      <nav className="text-sm text-zinc-400">
        <Link href="/teams" className="hover:text-blue-600">Teams</Link>
        <span className="mx-2">/</span>
        <span className="text-zinc-600">{journey.teamName}</span>
      </nav>
      <AdBanner placement="match" />
      {qualification && (
        <TeamQualificationCard teamName={journey.teamName} qualification={qualification} />
      )}
      <TeamSquad teamName={journey.teamName} players={players} />
      <TeamJourneyContent journey={journey} timezone={timeZone} />
    </div>
  );
}
