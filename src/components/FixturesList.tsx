"use client";

import Link from "next/link";
import { useMemo } from "react";
import { Calendar, MapPin } from "lucide-react";
import type { Match } from "@/lib/types";
import { getTeam } from "@/lib/data";

function MatchFixtureRow({ match }: { match: Match }) {
  const home = getTeam(match.home, match.homeName, match.homeLogo);
  const away = getTeam(match.away, match.awayName, match.awayLogo);

  return (
    <Link
      href={`/match/${match.id}`}
      className="match-row group"
    >
      <div className="w-14 shrink-0 text-center">
        <p className="text-[10px] text-zinc-400">{match.time}</p>
        {match.status === "live" && <span className="badge-live mt-1">Live</span>}
        {match.status === "finished" && (
          <span className="text-[10px] font-bold text-zinc-400 uppercase">FT</span>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 flex-1 min-w-0">
            {home.logo ? (
              <img src={home.logo} alt="" className="h-5 w-5 object-contain shrink-0" />
            ) : (
              <span className="text-sm shrink-0">{home.flag}</span>
            )}
            <span className="text-sm font-medium text-zinc-900 truncate">{home.name}</span>
          </div>
          {match.status !== "upcoming" ? (
            <span className="font-bold text-zinc-900 text-sm w-6 text-center">{match.homeScore}</span>
          ) : null}
        </div>
        <div className="flex items-center justify-between gap-2 mt-1">
          <div className="flex items-center gap-2 flex-1 min-w-0">
            {away.logo ? (
              <img src={away.logo} alt="" className="h-5 w-5 object-contain shrink-0" />
            ) : (
              <span className="text-sm shrink-0">{away.flag}</span>
            )}
            <span className="text-sm font-medium text-zinc-900 truncate">{away.name}</span>
          </div>
          {match.status !== "upcoming" ? (
            <span className="font-bold text-zinc-900 text-sm w-6 text-center">{match.awayScore}</span>
          ) : (
            <span className="text-xs text-zinc-400">vs</span>
          )}
        </div>
      </div>

      <div className="hidden sm:block text-right shrink-0 max-w-[120px]">
        <p className="text-[10px] text-blue-600 font-medium">Group {match.group}</p>
        <p className="text-[10px] text-zinc-400 truncate flex items-center justify-end gap-0.5">
          <MapPin size={9} />
          {match.venueCity ?? match.venue}
        </p>
      </div>
    </Link>
  );
}

export function FixturesList({ matches }: { matches: Match[] }) {
  const byDate = useMemo(() => {
    const map = new Map<string, Match[]>();
    for (const m of matches) {
      const list = map.get(m.date) ?? [];
      list.push(m);
      map.set(m.date, list);
    }
    return [...map.entries()].sort(([a], [b]) => a.localeCompare(b));
  }, [matches]);

  if (!matches.length) {
    return <p className="text-sm text-zinc-400 text-center py-12">No fixtures available.</p>;
  }

  return (
    <div className="space-y-6">
      {byDate.map(([date, dayMatches]) => (
        <div key={date} className="card-surface rounded-2xl overflow-hidden">
          <div className="px-4 py-3 border-b border-zinc-100 flex items-center gap-2 bg-zinc-50/50">
            <Calendar size={14} className="text-blue-600" />
            <h3 className="font-semibold text-zinc-900 text-sm">
              {new Date(date + "T12:00:00").toLocaleDateString("en-US", {
                weekday: "long",
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </h3>
            <span className="text-xs text-zinc-400 ml-auto">{dayMatches.length} matches</span>
          </div>
          <div>
            {dayMatches.map((m) => (
              <MatchFixtureRow key={m.id} match={m} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
