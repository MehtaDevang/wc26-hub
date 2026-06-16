"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ExternalLink, Globe, Radio, Search, Tv } from "lucide-react";
import { useTimezone } from "@/components/TimezoneProvider";
import { getTeam } from "@/lib/data";
import { formatKickoffDateKey } from "@/lib/timezone";
import type { WatchMatchEntry } from "@/lib/espn/watch-guide";
import {
  WATCH_COUNTRIES,
  getMatchBroadcastsForCountry,
  getWatchCountry,
  type WatchBroadcaster,
} from "@/lib/watch-by-country";

interface WatchGuideProps {
  entries: WatchMatchEntry[];
  initialCountry?: string;
}

type Filter = "all" | "today" | "live";

function BroadcasterChip({ broadcaster }: { broadcaster: WatchBroadcaster }) {
  return (
    <a
      href={broadcaster.url}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1 rounded-full bg-blue-50 text-blue-800 px-2.5 py-1 text-xs font-semibold hover:bg-blue-100 transition-colors group"
      title={`Watch on ${broadcaster.name}`}
    >
      <Radio size={11} className="shrink-0" />
      <span>{broadcaster.name}</span>
      <ExternalLink size={10} className="opacity-50 group-hover:opacity-100 shrink-0" />
    </a>
  );
}

function CountryRightsCard({ countryId }: { countryId: string }) {
  const country = getWatchCountry(countryId);
  if (!country) return null;

  return (
    <div className="card-surface rounded-2xl p-5">
      <h2 className="font-bold text-zinc-900 flex items-center gap-2 mb-3">
        <span className="text-xl">{country.flag}</span>
        Watch in {country.name}
      </h2>
      {country.rightsNote && (
        <p className="text-sm text-zinc-500 mb-4 leading-relaxed">{country.rightsNote}</p>
      )}
      <div className="flex flex-wrap gap-2">
        {country.broadcasters.map((b) => (
          <a
            key={b.name}
            href={b.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm font-semibold text-zinc-800 hover:border-blue-300 hover:bg-blue-50/50 transition-all group"
          >
            <Tv size={14} className="text-blue-600 shrink-0" />
            <span>
              {b.name}
              {b.language && (
                <span className="text-zinc-400 font-normal"> · {b.language}</span>
              )}
            </span>
            <span className="text-[10px] uppercase tracking-wide text-zinc-400 font-bold">
              {b.type}
            </span>
            <ExternalLink size={12} className="text-zinc-300 group-hover:text-blue-500 shrink-0" />
          </a>
        ))}
      </div>
    </div>
  );
}

export function WatchGuide({ entries, initialCountry = "usa" }: WatchGuideProps) {
  const timezone = useTimezone();
  const [countryId, setCountryId] = useState(initialCountry);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<Filter>("all");

  const todayKey = useMemo(() => formatKickoffDateKey(new Date().toISOString(), timezone), [timezone]);
  const country = getWatchCountry(countryId);

  const filtered = useMemo(() => {
    return entries.filter(({ match, broadcasts }) => {
      if (filter === "live" && match.status !== "live") return false;
      if (filter === "today" && match.date !== todayKey && match.status !== "live") return false;

      const matchBroadcasts = getMatchBroadcastsForCountry(countryId, broadcasts);

      if (query.trim()) {
        const q = query.toLowerCase();
        const inTeams =
          match.homeName.toLowerCase().includes(q) ||
          match.awayName.toLowerCase().includes(q);
        const inNetwork = matchBroadcasts.some((b) => b.name.toLowerCase().includes(q));
        if (!inTeams && !inNetwork) return false;
      }

      return true;
    });
  }, [entries, filter, query, todayKey, countryId]);

  const byDate = useMemo(() => {
    const map = new Map<string, WatchMatchEntry[]>();
    for (const entry of filtered) {
      const list = map.get(entry.match.date) ?? [];
      list.push(entry);
      map.set(entry.match.date, list);
    }
    return [...map.entries()];
  }, [filtered]);

  return (
    <div className="space-y-6">
      <div className="card-surface rounded-2xl p-4 sm:p-5 space-y-4">
        <div className="flex items-center gap-2 text-sm font-bold text-zinc-700">
          <Globe size={16} className="text-blue-600" />
          Select your country
        </div>
        <div className="flex flex-wrap gap-2">
          {WATCH_COUNTRIES.map((c) => (
            <Link
              key={c.id}
              href={`/watch/${c.id}`}
              onClick={(e) => {
                e.preventDefault();
                setCountryId(c.id);
                window.history.replaceState({}, "", `/watch/${c.id}`);
              }}
              className={`inline-flex items-center gap-1.5 rounded-xl px-3 py-2 text-sm font-semibold transition-colors ${
                countryId === c.id
                  ? "bg-blue-600 text-white shadow-sm"
                  : "bg-zinc-100 text-zinc-700 hover:bg-zinc-200"
              }`}
            >
              <span>{c.flag}</span>
              <span className="hidden sm:inline">{c.name}</span>
              <span className="sm:hidden">{c.name.split(" ")[0]}</span>
            </Link>
          ))}
        </div>
      </div>

      <CountryRightsCard countryId={countryId} />

      <div className="card-surface rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={`Search team or channel in ${country?.name ?? "your country"}…`}
            className="w-full rounded-xl border border-zinc-200 bg-white pl-9 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30"
          />
        </div>
        <div className="flex gap-2">
          {(["all", "today", "live"] as const).map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => setFilter(value)}
              className={`rounded-xl px-3 py-2 text-xs font-bold uppercase tracking-wide transition-colors ${
                filter === value
                  ? "bg-blue-600 text-white"
                  : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
              }`}
            >
              {value}
            </button>
          ))}
        </div>
      </div>

      <p className="text-xs text-zinc-400 flex items-start gap-2">
        <Tv size={14} className="shrink-0 mt-0.5" />
        Official rights holders for {country?.name}. US match rows may show live ESPN channel data.
        Links go to broadcaster sites - confirm your package and kickoff times locally.
      </p>

      {byDate.length === 0 ? (
        <p className="text-sm text-zinc-400 text-center py-12 card-surface rounded-2xl">
          No matches match your filters.
        </p>
      ) : (
        byDate.map(([date, dayEntries]) => (
          <section key={date}>
            <h2 className="section-title text-base mb-3">{date}</h2>
            <div className="space-y-3">
              {dayEntries.map(({ match, broadcasts }) => {
                const home = getTeam(match.home, match.homeName, match.homeLogo);
                const away = getTeam(match.away, match.awayName, match.awayLogo);
                const matchBroadcasts = getMatchBroadcastsForCountry(countryId, broadcasts);

                return (
                  <article key={match.id} className="card-elevated rounded-2xl p-4 sm:p-5">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <Link href={`/match/${match.id}`} className="group min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-bold text-zinc-900 group-hover:text-blue-600 transition-colors">
                            {home.flag} {home.name}
                          </span>
                          <span className="text-zinc-400 text-sm">vs</span>
                          <span className="font-bold text-zinc-900 group-hover:text-blue-600 transition-colors">
                            {away.flag} {away.name}
                          </span>
                          {match.status === "live" && (
                            <span className="badge-live text-[10px]">Live</span>
                          )}
                        </div>
                        <p className="text-xs text-zinc-400 mt-1">
                          {match.time} · {match.venue}
                          {match.group !== "?" && ` · Group ${match.group}`}
                        </p>
                      </Link>

                      <div className="flex flex-wrap gap-2 sm:justify-end sm:max-w-md">
                        {matchBroadcasts.length > 0 ? (
                          matchBroadcasts.map((b) => (
                            <BroadcasterChip key={`${match.id}-${b.name}`} broadcaster={b} />
                          ))
                        ) : (
                          <span className="text-xs text-zinc-400 italic">Listing TBA</span>
                        )}
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </section>
        ))
      )}
    </div>
  );
}
