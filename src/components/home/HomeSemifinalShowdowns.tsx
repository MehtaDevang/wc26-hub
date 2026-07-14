import Image from "next/image";
import Link from "next/link";
import { ChevronRight, Swords } from "lucide-react";
import { getTeam } from "@/lib/data";
import type { BracketMatch, Match } from "@/lib/types";

/** Generated matchup art keyed by the sorted pair of team codes. */
const SF_IMAGES: Record<string, string> = {
  "ESP|FRA": "/semifinals/sf-france-spain.png",
  "ARG|ENG": "/semifinals/sf-england-argentina-v2.png",
};

function imageFor(home?: string, away?: string): string | null {
  if (!home || !away) return null;
  return SF_IMAGES[[home, away].sort().join("|")] ?? null;
}

/** Bracket matches carry no ESPN id, so resolve it from the fixtures list. */
function matchIdFor(fixtures: Match[], home?: string, away?: string): string | null {
  if (!home || !away) return null;
  const found = fixtures.find(
    (m) =>
      (m.home === home && m.away === away) || (m.home === away && m.away === home)
  );
  return found?.id ?? null;
}

function ShowdownCard({ match, matchId }: { match: BracketMatch; matchId: string | null }) {
  const img = imageFor(match.home.code, match.away.code);
  if (!img) return null;

  const home = getTeam(match.home.code ?? "", match.home.name);
  const away = getTeam(match.away.code ?? "", match.away.name);
  const isLive = match.status === "live";
  const isDone = match.status === "finished";
  const showScore = isLive || isDone;
  const dateLabel = match.date
    ? `${match.date}${match.time ? ` · ${match.time}` : ""}`
    : "Kickoff soon";

  return (
    <Link
      href={
        matchId
          ? isDone
            ? `/match/${matchId}/recap`
            : isLive
              ? `/match/${matchId}`
              : `/match/${matchId}/preview`
          : "/bracket"
      }
      className="group relative block overflow-hidden rounded-2xl border border-white/10 shadow-[0_16px_40px_-16px_rgba(0,0,0,0.6)]"
    >
      <div className="relative aspect-[16/9] w-full bg-[var(--stadium-navy)]">
        <Image
          src={img}
          alt={`${home.name} vs ${away.name} — World Cup 2026 semi-final`}
          fill
          sizes="(max-width: 1024px) 100vw, 50vw"
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/25 to-black/5" />

        <div className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-black/50 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-white backdrop-blur-sm">
          <Swords size={12} /> Semi-Final
        </div>
        {isLive && (
          <span className="absolute right-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-[var(--wc-canada)] px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-white">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-white" /> Live
          </span>
        )}

        <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5">
          <h3 className="font-display text-2xl leading-none text-white drop-shadow sm:text-[1.9rem]">
            {home.name} <span className="text-white/45">vs</span> {away.name}
          </h3>
          <div className="mt-2.5 flex items-center justify-between gap-3">
            <span className="text-sm font-bold text-white/85 tabular-nums">
              {showScore
                ? `${match.home.score ?? 0} – ${match.away.score ?? 0}`
                : dateLabel}
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-white/10 px-3 py-1 text-xs font-bold uppercase tracking-wide text-[var(--wc-gold)] backdrop-blur-sm transition-colors group-hover:bg-white/20">
              {isLive ? "Follow live" : isDone ? "Recap" : "Preview"}
              <ChevronRight size={14} />
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}

export function HomeSemifinalShowdowns({
  matches,
  fixtures = [],
}: {
  matches: BracketMatch[];
  fixtures?: Match[];
}) {
  const cards = matches.filter((m) => imageFor(m.home.code, m.away.code));
  if (cards.length === 0) return null;

  return (
    <section aria-labelledby="sf-showdowns">
      <div className="stadium-head">
        <div>
          <h2 id="sf-showdowns" className="stadium-head-title">
            Semi-Final Showdowns
          </h2>
          <p className="stadium-head-sub">Two clashes. One ticket to the Final.</p>
        </div>
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        {cards.map((match, i) => (
          <ShowdownCard
            key={match.id ?? i}
            match={match}
            matchId={matchIdFor(fixtures, match.home.code, match.away.code)}
          />
        ))}
      </div>
    </section>
  );
}
