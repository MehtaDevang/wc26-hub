import Link from "next/link";
import { Star } from "lucide-react";
import { getPlayerPath } from "@/lib/espn/player-profile";
import { getTeam } from "@/lib/data";
import type { PlayerOfTheDay } from "@/lib/player-of-the-day";

function initials(name: string): string {
  const parts = name.split(/\s+/).filter(Boolean);
  if (parts.length >= 2) return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
  return name.slice(0, 2).toUpperCase();
}

export function PlayerOfTheDayCard({ data }: { data: PlayerOfTheDay }) {
  const { player, reason } = data;
  const team = getTeam(player.teamCode, player.teamName, player.teamLogo);

  return (
    <Link
      href={getPlayerPath(player)}
      className="card-elevated group block overflow-hidden rounded-2xl"
    >
      <div className="relative flex items-center gap-4 bg-gradient-to-br from-indigo-50 via-white to-blue-50 px-5 py-5 sm:px-6">
        <div className="absolute -right-6 -top-6 h-28 w-28 rounded-full bg-indigo-200/30 blur-2xl" />

        {player.headshot ? (
          <img
            src={player.headshot}
            alt=""
            className="h-16 w-16 sm:h-20 sm:w-20 shrink-0 rounded-full object-cover bg-white ring-2 ring-indigo-200 shadow-sm"
          />
        ) : (
          <span className="flex h-16 w-16 sm:h-20 sm:w-20 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-xl font-bold text-indigo-700 ring-2 ring-indigo-200">
            {initials(player.name)}
          </span>
        )}

        <div className="relative min-w-0 flex-1">
          <p className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-indigo-700/80">
            <Star size={12} className="fill-indigo-400 text-indigo-400" />
            Player of the Day
          </p>
          <p className="mt-1 truncate text-lg sm:text-xl font-extrabold text-zinc-900 group-hover:text-blue-600 transition-colors">
            <span className="mr-1.5" aria-hidden>{team.flag}</span>
            {player.name}
          </p>
          <p className="mt-0.5 text-sm text-zinc-600 leading-snug">{reason}</p>
        </div>

        <div className="relative hidden sm:flex shrink-0 flex-col items-center pl-4 border-l border-indigo-100">
          <span className="text-3xl font-black tabular-nums text-zinc-900 leading-none">
            {player.goals > 0 ? player.goals : player.assists > 0 ? player.assists : player.appearances}
          </span>
          <span className="text-[10px] font-semibold uppercase tracking-wide text-indigo-700 mt-1">
            {player.goals > 0 ? "goals" : player.assists > 0 ? "assists" : "apps"}
          </span>
        </div>
      </div>
    </Link>
  );
}
