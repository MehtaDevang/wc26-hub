import Link from "next/link";
import { Users } from "lucide-react";
import { PlayerSquadCard } from "@/components/PlayerPageView";
import type { PlayerListItem } from "@/lib/types";

interface TeamSquadProps {
  teamName: string;
  players: PlayerListItem[];
}

export function TeamSquad({ teamName, players }: TeamSquadProps) {
  if (players.length === 0) {
    return (
      <section>
        <h2 className="section-title mb-3 text-base flex items-center gap-2">
          <Users size={18} className="text-[var(--wc-usa)]" />
          Squad
        </h2>
        <p className="text-sm text-zinc-500 card-surface rounded-xl px-4 py-8 text-center">
          Squad list for {teamName} will appear once ESPN publishes the World Cup 2026 roster.
        </p>
      </section>
    );
  }

  return (
    <section>
      <div className="flex items-center justify-between gap-3 mb-4">
        <h2 className="section-title text-base flex items-center gap-2">
          <Users size={18} className="text-[var(--wc-usa)]" />
          Squad
        </h2>
        <div className="flex items-center gap-3 text-xs text-zinc-400">
          <span className="font-medium tabular-nums">{players.length} players</span>
          <Link href="/players" className="text-blue-600 hover:underline font-medium">
            All squads →
          </Link>
        </div>
      </div>
      <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {players.map((player) => (
          <PlayerSquadCard key={player.id} player={player} />
        ))}
      </div>
    </section>
  );
}
