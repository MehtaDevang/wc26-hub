import Link from "next/link";
import { ChevronRight, Trophy } from "lucide-react";
import { getPlayerPath } from "@/lib/espn/player-profile";
import { getTeam } from "@/lib/data";
import type { TournamentLeaderEntry } from "@/lib/espn/tournament-stats";

function ScorerChip({ player, rank }: { player: TournamentLeaderEntry; rank: number }) {
  const team = getTeam(player.teamCode, player.teamName);
  const href = getPlayerPath(player);

  return (
    <Link
      href={href}
      className="home-golden-boot-chip group flex items-center gap-2.5 min-w-0 rounded-xl border border-amber-200/80 bg-white/90 px-3 py-2.5 hover:border-amber-300 hover:shadow-md transition-all"
    >
      <span
        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-extrabold ${
          rank === 1
            ? "bg-gradient-to-br from-amber-400 to-orange-500 text-white shadow-md"
            : rank === 2
              ? "bg-gradient-to-br from-zinc-300 to-zinc-400 text-zinc-800"
              : "bg-gradient-to-br from-amber-700/80 to-amber-900 text-amber-100"
        }`}
      >
        {rank}
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-bold text-zinc-900 truncate group-hover:text-[var(--wc-usa)] transition-colors">
          {player.name}
        </p>
        <p className="text-[11px] text-zinc-500 truncate">
          {team.flag} {team.name}
        </p>
      </div>
      <div className="shrink-0 text-right">
        <p className="text-xl font-black tabular-nums text-zinc-900 leading-none">{player.goals}</p>
        <p className="text-[9px] font-bold uppercase tracking-wider text-amber-700">goals</p>
      </div>
    </Link>
  );
}

export function HomeGoldenBootStrip({
  scorers,
  variant = "default",
}: {
  scorers: TournamentLeaderEntry[];
  variant?: "default" | "finale";
}) {
  if (scorers.length === 0) return null;

  const isFinale = variant === "finale";
  const title = isFinale ? "Race for the Golden Boot" : "Golden Boot race";
  const subtitle = isFinale
    ? "Every goal counts now - who takes the Golden Boot?"
    : "Top scorers at World Cup 2026";

  return (
    <section className="home-golden-boot-row">
      <div className="home-golden-boot-row-stripe" aria-hidden />
      <div className="home-golden-boot-row-inner">
        <div className="flex items-center justify-between gap-3 mb-3">
          <div className="flex items-center gap-2 min-w-0">
            <span className="home-golden-boot-row-icon">
              <Trophy size={18} />
            </span>
            <div>
              <h2 className="text-sm font-extrabold text-zinc-900 tracking-tight">{title}</h2>
              <p className="text-[11px] text-amber-800/80 font-medium">{subtitle}</p>
            </div>
          </div>
          <Link
            href="/leaders"
            className="text-xs font-bold text-[var(--wc-usa)] hover:underline inline-flex items-center gap-0.5 shrink-0"
          >
            All leaders <ChevronRight size={12} />
          </Link>
        </div>
        <div className="home-golden-boot-row-grid">
          {scorers.map((player, i) => (
            <ScorerChip key={player.id} player={player} rank={i + 1} />
          ))}
        </div>
      </div>
    </section>
  );
}
