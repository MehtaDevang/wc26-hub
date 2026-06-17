import Link from "next/link";
import { Flame } from "lucide-react";
import { getPlayerPath } from "@/lib/espn/player-profile";
import type { PlayerListItem } from "@/lib/types";

function initials(name: string): string {
  const parts = name.split(/\s+/).filter(Boolean);
  if (parts.length >= 2) return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
  return name.slice(0, 2).toUpperCase();
}

/** Top scorers within a single nation's squad - factual, derived from live goals. */
export function TeamTopPerformers({
  teamName,
  players,
}: {
  teamName: string;
  players: PlayerListItem[];
}) {
  const top = players
    .filter((p) => p.goals > 0)
    .sort((a, b) => b.goals - a.goals || a.name.localeCompare(b.name))
    .slice(0, 3);

  if (top.length === 0) return null;

  return (
    <section className="card-surface rounded-2xl p-4 sm:p-5">
      <h2 className="text-sm font-bold text-zinc-900 flex items-center gap-2 mb-3">
        <Flame size={16} className="text-orange-500" />
        {teamName} top scorers
      </h2>
      <div className="grid gap-2 sm:grid-cols-3">
        {top.map((player, index) => (
          <Link
            key={player.id}
            href={getPlayerPath(player)}
            className="group flex items-center gap-3 rounded-xl border border-zinc-100 bg-white px-3 py-2.5 hover:border-blue-200 transition-colors"
          >
            <span className="relative shrink-0">
              {player.headshot ? (
                <img
                  src={player.headshot}
                  alt=""
                  className="h-11 w-11 rounded-full object-cover bg-zinc-100 ring-1 ring-zinc-200"
                />
              ) : (
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-zinc-100 text-sm font-bold text-zinc-600 ring-1 ring-zinc-200">
                  {initials(player.name)}
                </span>
              )}
              {index === 0 && (
                <span className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-orange-500 text-[10px] font-bold text-white ring-2 ring-white">
                  1
                </span>
              )}
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-zinc-900 group-hover:text-blue-600 transition-colors">
                {player.name}
              </p>
              <p className="text-xs text-zinc-500">
                {player.position || "Squad"}
                {player.number > 0 ? ` · #${player.number}` : ""}
              </p>
            </div>
            <div className="text-right shrink-0">
              <p className="text-lg font-extrabold tabular-nums text-zinc-900">{player.goals}</p>
              <p className="text-[10px] uppercase tracking-wide text-zinc-400">
                {player.goals === 1 ? "goal" : "goals"}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
