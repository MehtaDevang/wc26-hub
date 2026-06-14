import Link from "next/link";
import { notFound } from "next/navigation";
import { getPlayerWorldCupProfile } from "@/lib/espn/player-profile";
import { PlayerPageView } from "@/components/PlayerPageView";
import { AdBanner } from "@/components/AdBanner";
import { JsonLd } from "@/components/JsonLd";
import { createPageMetadata } from "@/lib/seo";
import { mergeKeywords, PLAYERS_KEYWORDS, STATS_KEYWORDS } from "@/lib/seo-keywords";
import { isValidPlayerId } from "@/lib/api-security";
import { getSiteUrl } from "@/lib/site";
import { buildBreadcrumbJsonLd } from "@/lib/structured-data";

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { id } = await params;

  if (!isValidPlayerId(id)) {
    return createPageMetadata({
      title: "Player Not Found",
      description: "World Cup 2026 player profile not found.",
      path: `/players/${id}`,
      noIndex: true,
    });
  }

  try {
    const player = await getPlayerWorldCupProfile(id);
    if (!player) {
      return createPageMetadata({
        title: "Player Not Found",
        description: "World Cup 2026 player profile not found.",
        path: `/players/${id}`,
        noIndex: true,
      });
    }

    return createPageMetadata({
      title: `${player.name} — ${player.teamName} World Cup 2026 Player Stats`,
      description: `${player.name} (${player.teamName}) at FIFA World Cup 2026 — ${player.worldCupGoals} goals, ${player.matchesPlayed} matches, position, cards, and match-by-match football stats.`,
      path: `/players/${player.espnId ?? player.id}`,
      keywords: mergeKeywords(PLAYERS_KEYWORDS, STATS_KEYWORDS, [
        player.name,
        `${player.teamName} players`,
        "World Cup player stats",
      ]),
    });
  } catch {
    return createPageMetadata({
      title: "Player Profile",
      description: "FIFA World Cup 2026 player stats and match history.",
      path: `/players/${id}`,
    });
  }
}

export const revalidate = 300;
export const maxDuration = 120;

export default async function PlayerPage({ params }: PageProps) {
  const { id } = await params;

  if (!isValidPlayerId(id)) notFound();

  const player = await getPlayerWorldCupProfile(id);
  if (!player) notFound();

  const playerJsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: player.name,
    url: `${getSiteUrl()}/players/${player.espnId ?? player.id}`,
    affiliation: {
      "@type": "SportsTeam",
      name: player.teamName,
    },
    jobTitle: player.position,
    description:
      `${player.name} (${player.teamName}) footballer at FIFA World Cup 2026. Position: ${player.position}. World Cup goals, match stats, and tournament record.`,
  };

  return (
    <div className="space-y-6">
      <JsonLd data={playerJsonLd} />
      <JsonLd
        data={buildBreadcrumbJsonLd([
          { name: "Players", path: "/players" },
          { name: player.name, path: `/players/${player.espnId ?? player.id}` },
        ])}
      />
      <nav className="text-sm text-zinc-400">
        <Link href="/players" className="hover:text-blue-600">Players</Link>
        <span className="mx-2">/</span>
        <span className="text-zinc-600">{player.name}</span>
      </nav>
      <AdBanner placement="match" />
      <PlayerPageView player={player} />
    </div>
  );
}
