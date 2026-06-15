import Link from "next/link";
import { ArrowRight, Target } from "lucide-react";
import { getTopScorers } from "@/lib/espn/player-profile";
import { PlayerListCard } from "@/components/PlayerPageView";

export async function FeaturedPlayersStrip() {
  const scorers = await getTopScorers(8);
  if (scorers.length === 0) return null;

  return (
    <section>
      <div className="flex items-end justify-between gap-4 mb-5">
        <div>
          <h2 className="section-title flex items-center gap-2">
            <Target size={22} className="text-[var(--wc-usa)]" />
            Top Players
          </h2>
          <p className="text-sm text-zinc-500 mt-1">
            Tournament goal scorers and squad profiles for all 48 nations.
          </p>
        </div>
        <Link
          href="/players"
          className="hidden sm:inline-flex items-center gap-1 text-sm font-semibold text-blue-600 hover:underline shrink-0"
        >
          All players <ArrowRight size={14} />
        </Link>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {scorers.map((player) => (
          <PlayerListCard key={player.id} player={player} />
        ))}
      </div>

      <Link
        href="/players"
        className="sm:hidden inline-flex items-center gap-1 text-sm font-semibold text-blue-600 mt-4 hover:underline"
      >
        Browse all players <ArrowRight size={14} />
      </Link>
    </section>
  );
}
