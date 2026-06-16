import { Target } from "lucide-react";
import { getPlayersByCountry, getTopScorers } from "@/lib/espn/player-profile";
import { PlayersExplorer } from "@/components/PlayersExplorer";
import { PlayerListCard } from "@/components/PlayerPageView";
import { AdBanner } from "@/components/AdBanner";
import { createPageMetadata } from "@/lib/seo";
import { mergeKeywords, PLAYERS_KEYWORDS, STATS_KEYWORDS } from "@/lib/seo-keywords";

export const metadata = createPageMetadata({
  title: "World Cup 2026 Players - Squads, Stats & Top Scorers",
  description:
    "Every FIFA World Cup 2026 player by country - live stats, goals, assists, cards, positions, photos, and full profiles for all 48 squad lists.",
  path: "/players",
  keywords: mergeKeywords(PLAYERS_KEYWORDS, STATS_KEYWORDS),
});

export const revalidate = 300;
export const maxDuration = 120;

export default async function PlayersIndexPage() {
  const [sections, scorers] = await Promise.all([
    getPlayersByCountry(),
    getTopScorers(16),
  ]);

  const totalPlayers = sections.reduce((sum, s) => sum + s.players.length, 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="section-title flex items-center gap-2 text-2xl sm:text-3xl">
          <Target size={28} className="text-[var(--wc-usa)]" />
          World Cup 2026 Players
        </h1>
        <p className="text-sm text-zinc-500 mt-2 max-w-2xl">
          Full squads for all 48 nations at the FIFA World Cup 2026 - tap any player for photos,
          personal info, tournament stats, and recent club performances.
        </p>
        {totalPlayers > 0 && (
          <p className="text-xs text-zinc-400 mt-2">
            {totalPlayers} players across {sections.length} countries
          </p>
        )}
      </div>
      <AdBanner placement="inline" />

      {scorers.length > 0 && (
        <section>
          <h2 className="section-title mb-4 text-base">Top Goal Scorers</h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {scorers.map((player) => (
              <PlayerListCard key={player.id} player={player} />
            ))}
          </div>
        </section>
      )}

      {sections.length > 0 ? (
        <PlayersExplorer sections={sections} />
      ) : (
        <p className="text-sm text-zinc-400 text-center py-12">
          Squad lists will appear once ESPN publishes full World Cup 2026 rosters.
        </p>
      )}
    </div>
  );
}
