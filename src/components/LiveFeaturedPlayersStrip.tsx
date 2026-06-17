"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, Target } from "lucide-react";
import { fetchLeaders } from "@/lib/matches";
import { PlayerListCard } from "@/components/PlayerPageView";
import { isFeaturedPlayer } from "@/lib/player-editorial";
import type { PlayerListItem } from "@/lib/types";

const REFRESH_MS = 120_000;

function leadersToPlayers(
  leaders: Awaited<ReturnType<typeof fetchLeaders>>,
  limit: number
): PlayerListItem[] {
  return leaders.scorers.slice(0, limit).map((p) => ({
    id: p.id,
    slug: p.slug,
    name: p.name,
    teamCode: p.teamCode,
    teamName: p.teamName,
    flag: p.flag,
    goals: p.goals,
    position: p.position,
    number: p.number,
    headshot: p.headshot,
    isFeatured: isFeaturedPlayer({
      teamCode: p.teamCode,
      slug: p.slug,
      name: p.name,
    }),
  }));
}

export function LiveFeaturedPlayersStrip({
  initialScorers,
}: {
  initialScorers: PlayerListItem[];
}) {
  const [scorers, setScorers] = useState(initialScorers);

  const refresh = useCallback(async () => {
    try {
      const leaders = await fetchLeaders();
      const next = leadersToPlayers(leaders, 8);
      if (next.length > 0) setScorers(next);
    } catch {
      // keep last good data
    }
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      if (document.visibilityState === "visible") refresh();
    }, REFRESH_MS);
    return () => clearInterval(interval);
  }, [refresh]);

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
