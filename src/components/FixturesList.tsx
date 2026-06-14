"use client";

import Link from "next/link";
import { useMemo } from "react";
import { Calendar } from "lucide-react";
import type { Match } from "@/lib/types";
import { getTeam } from "@/lib/data";
import { AdBanner } from "@/components/AdBanner";
import { MatchKickoffTime } from "@/components/MatchKickoffTime";
import { TimezoneBadge } from "@/components/TimezoneBadge";
import { useTimezone } from "@/components/TimezoneProvider";
import { formatKickoffDateKey, formatKickoffDateLabel } from "@/lib/timezone";

function TeamLine({
  name,
  flag,
  logo,
}: {
  name: string;
  flag: string;
  logo?: string;
}) {
  return (
    <div className="flex items-center gap-2 min-w-0">
      {logo ? (
        <img src={logo} alt="" className="h-5 w-5 object-contain shrink-0" />
      ) : (
        <span className="text-sm leading-none shrink-0">{flag}</span>
      )}
      <span className="text-sm font-medium text-zinc-900 leading-snug">{name}</span>
    </div>
  );
}

function MatchFixtureRow({ match }: { match: Match }) {
  const home = getTeam(match.home, match.homeName, match.homeLogo);
  const away = getTeam(match.away, match.awayName, match.awayLogo);
  const hasScore = match.status !== "upcoming";

  return (
    <Link
      href={`/match/${match.id}`}
      className="fixture-row group"
    >
      <div className="row-span-2 self-center text-center">
        <MatchKickoffTime match={match} className="text-[10px] text-zinc-400 tabular-nums leading-tight" />
        {match.status === "live" && <span className="badge-live mt-1">Live</span>}
        {match.status === "finished" && (
          <span className="mt-0.5 block text-[10px] font-bold text-zinc-400 uppercase">FT</span>
        )}
      </div>

      <div className="col-start-2 row-start-1 min-w-0">
        <TeamLine name={home.name} flag={home.flag} logo={home.logo} />
      </div>

      <div className="col-start-2 row-start-2 min-w-0">
        <TeamLine name={away.name} flag={away.flag} logo={away.logo} />
        <span className="mt-1 inline-block text-[10px] font-semibold text-blue-600 sm:hidden">
          Grp {match.group}
        </span>
      </div>

      <div className="col-start-3 row-span-2 self-center justify-self-center">
        {hasScore ? (
          <span className="fixture-score">
            <span className="fixture-score-home tabular-nums">{match.homeScore}</span>
            <span className="fixture-score-sep" aria-hidden>–</span>
            <span className="fixture-score-away tabular-nums">{match.awayScore}</span>
          </span>
        ) : (
          <span className="text-xs font-semibold text-zinc-400">vs</span>
        )}
      </div>

      <div className="hidden sm:col-start-4 sm:row-span-2 sm:self-center sm:block sm:text-right">
        <span className="text-[10px] font-semibold text-blue-600">Grp {match.group}</span>
      </div>
    </Link>
  );
}

export function FixturesList({ matches }: { matches: Match[] }) {
  const timezone = useTimezone();

  const byDate = useMemo(() => {
    const map = new Map<string, Match[]>();
    for (const m of matches) {
      const dateKey = m.kickoffAt
        ? formatKickoffDateKey(m.kickoffAt, timezone)
        : m.date;
      const list = map.get(dateKey) ?? [];
      list.push(m);
      map.set(dateKey, list);
    }
    return [...map.entries()].sort(([a], [b]) => a.localeCompare(b));
  }, [matches, timezone]);

  if (!matches.length) {
    return <p className="text-sm text-zinc-400 text-center py-12">No fixtures available.</p>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <TimezoneBadge />
      </div>
      {byDate.map(([date, dayMatches], index) => (
        <div key={date}>
          <div className="card-surface rounded-2xl overflow-hidden">
            <div className="px-4 py-3 border-b border-zinc-100 flex items-center gap-2 bg-zinc-50/50">
              <Calendar size={14} className="text-blue-600" />
              <h3 className="font-semibold text-zinc-900 text-sm">
                {formatKickoffDateLabel(date, timezone)}
              </h3>
              <span className="text-xs text-zinc-400 ml-auto">{dayMatches.length} matches</span>
            </div>
            <div>
              {dayMatches.map((m) => (
                <MatchFixtureRow key={m.id} match={m} />
              ))}
            </div>
          </div>
          {(index + 1) % 3 === 0 && index < byDate.length - 1 && (
            <div className="mt-6">
              <AdBanner placement="fixtures" />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
