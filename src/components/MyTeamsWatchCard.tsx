"use client";

import { useMemo } from "react";
import Link from "next/link";
import { Tv, ExternalLink, ArrowRight } from "lucide-react";
import { getTeam } from "@/lib/data";
import { useTimezone } from "@/components/TimezoneProvider";
import {
  getWatchCountry,
  guessWatchCountryFromTimezone,
} from "@/lib/watch-by-country";
import type { Match } from "@/lib/types";

function teamInMatch(match: Match, code: string): boolean {
  const u = code.toUpperCase();
  return match.home.toUpperCase() === u || match.away.toUpperCase() === u;
}

export function MyTeamsWatchCard({
  codes,
  matches,
}: {
  codes: string[];
  matches: Match[];
}) {
  const timezone = useTimezone();
  const countryId = guessWatchCountryFromTimezone(timezone);
  const country = getWatchCountry(countryId);

  const nextMatch = useMemo(() => {
    if (!codes.length) return null;
    return (
      matches
        .filter(
          (m) =>
            (m.status === "upcoming" || m.status === "live") &&
            codes.some((c) => teamInMatch(m, c))
        )
        .sort((a, b) => (a.kickoffAt ?? "").localeCompare(b.kickoffAt ?? ""))[0] ?? null
    );
  }, [matches, codes]);

  if (!codes.length || !country) return null;

  const broadcasters = country.broadcasters.slice(0, 3);
  const teamNames = codes.map((c) => getTeam(c).name);
  const teamLabel =
    teamNames.length <= 2
      ? teamNames.join(" & ")
      : `${teamNames.slice(0, 2).join(", ")} +${teamNames.length - 2}`;

  return (
    <section className="card-surface rounded-2xl overflow-hidden">
      <h2 className="flex items-center gap-2 px-5 py-3 border-b border-zinc-100 bg-zinc-50/60 text-sm font-bold text-zinc-900">
        <Tv size={16} className="text-blue-600" />
        Watch {teamLabel} in {country.name} {country.flag}
      </h2>

      <div className="p-5 space-y-4">
        {nextMatch && (
          <Link
            href={`/match/${nextMatch.id}`}
            className="group flex items-center gap-3 rounded-xl border border-zinc-100 bg-white px-3 py-2.5 hover:border-blue-200 transition-colors"
          >
            <span className="flex items-center gap-1 text-lg shrink-0">
              <span aria-hidden>{getTeam(nextMatch.home, nextMatch.homeName).flag}</span>
              <span aria-hidden>{getTeam(nextMatch.away, nextMatch.awayName).flag}</span>
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-[10px] font-bold uppercase tracking-wide text-zinc-400">
                {nextMatch.status === "live" ? "Live now" : "Next up"}
              </p>
              <p className="truncate text-sm font-semibold text-zinc-900 group-hover:text-blue-600 transition-colors">
                {nextMatch.homeName} vs {nextMatch.awayName}
              </p>
            </div>
            <span className="text-xs text-zinc-500 shrink-0">
              {nextMatch.date} · {nextMatch.time}
            </span>
          </Link>
        )}

        <div>
          <p className="text-[11px] font-semibold uppercase tracking-wide text-zinc-400 mb-2">
            Broadcasters in {country.name}
          </p>
          <div className="flex flex-wrap gap-2">
            {broadcasters.map((b) => (
              <a
                key={b.name}
                href={b.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-3 py-1.5 text-xs font-medium text-zinc-700 hover:border-blue-200 hover:text-blue-700 transition-colors"
              >
                {b.name}
                <span className="text-[9px] uppercase text-zinc-400">{b.type}</span>
                <ExternalLink size={11} className="text-zinc-300" />
              </a>
            ))}
          </div>
        </div>

        <Link
          href={`/watch/${country.id}`}
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-600 hover:underline"
        >
          Full watch guide for {country.name}
          <ArrowRight size={14} />
        </Link>
      </div>
    </section>
  );
}
