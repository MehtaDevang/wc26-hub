import Link from "next/link";
import { Swords, Tv, Clock, GitBranch } from "lucide-react";
import { getTeam } from "@/lib/data";
import { rivalrySlug } from "@/lib/rivalry-pages";
import type { Match } from "@/lib/types";

interface RivalryMatchdayHubProps {
  match: Match;
  rivalryName?: string;
  rivalryNote?: string;
  rivalryFunFact?: string;
}

export function RivalryMatchdayHub({
  match,
  rivalryName,
  rivalryNote,
  rivalryFunFact,
}: RivalryMatchdayHubProps) {
  if (!rivalryName && !rivalryNote) return null;

  const home = getTeam(match.home, match.homeName, match.homeLogo);
  const away = getTeam(match.away, match.awayName, match.awayLogo);
  const slug = rivalrySlug(match.home, match.away);
  const isLive = match.status === "live";
  const isUpcoming = match.status === "upcoming";

  const statusLabel = isLive
    ? "Rivalry matchday · Live now"
    : isUpcoming
      ? "Rivalry matchday · Upcoming"
      : "Rivalry matchday · Full time";

  return (
    <section className="card-elevated rounded-2xl overflow-hidden border border-rose-100">
      <div className="bg-gradient-to-br from-rose-50 via-white to-orange-50 px-5 py-5 sm:px-6 sm:py-6">
        <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-rose-700/80 flex items-center gap-1.5">
              <Swords size={12} />
              {statusLabel}
            </p>
            <h2 className="text-lg sm:text-xl font-extrabold text-zinc-900 mt-1">
              {rivalryName ?? `${home.name} vs ${away.name}`}
            </h2>
          </div>
          <div className="flex items-center gap-2 text-2xl shrink-0">
            <span>{home.flag}</span>
            <span className="text-sm font-bold text-zinc-300">vs</span>
            <span>{away.flag}</span>
          </div>
        </div>

        {rivalryNote && (
          <p className="text-sm text-zinc-600 leading-relaxed max-w-2xl">{rivalryNote}</p>
        )}
        {rivalryFunFact && (
          <p className="mt-3 text-xs text-rose-800/90 bg-white/70 border border-rose-100 rounded-xl px-3 py-2 max-w-2xl">
            {rivalryFunFact}
          </p>
        )}

        <div className="flex flex-wrap gap-2 mt-5">
          <Link
            href={`/rivalries/${slug}`}
            className="inline-flex items-center gap-1.5 rounded-full bg-rose-600 text-white px-4 py-2 text-xs font-bold hover:bg-rose-700 transition-colors"
          >
            <Swords size={13} />
            Rivalry hub
          </Link>
          {(isLive || match.status === "finished") && (
            <Link
              href={`/match/${match.id}?tab=live`}
              className="inline-flex items-center gap-1.5 rounded-full bg-white border border-zinc-200 text-zinc-700 px-4 py-2 text-xs font-semibold hover:border-rose-200 transition-colors"
            >
              <Clock size={13} />
              {isLive ? "Live feed" : "Match timeline"}
            </Link>
          )}
          <Link
            href="/watch"
            className="inline-flex items-center gap-1.5 rounded-full bg-white border border-zinc-200 text-zinc-700 px-4 py-2 text-xs font-semibold hover:border-rose-200 transition-colors"
          >
            <Tv size={13} />
            Where to watch
          </Link>
          {isUpcoming && (
            <Link
              href={`/match/${match.id}/preview`}
              className="inline-flex items-center gap-1.5 rounded-full bg-white border border-zinc-200 text-zinc-700 px-4 py-2 text-xs font-semibold hover:border-rose-200 transition-colors"
            >
              <GitBranch size={13} />
              Match preview
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}
