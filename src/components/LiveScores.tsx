"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { Radio, Clock, ChevronRight, Loader2, RefreshCw } from "lucide-react";
import { getTeam } from "@/lib/data";
import { fetchMatches } from "@/lib/matches";
import type { Match } from "@/lib/types";

function LiveBadge() {
  return (
    <span className="badge-live">
      <span className="relative flex h-1.5 w-1.5">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-500 opacity-60" />
        <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-red-500" />
      </span>
      Live
    </span>
  );
}

function MatchRow({ match, liveMinute }: { match: Match; liveMinute?: number }) {
  const home = getTeam(match.home, match.homeName, match.homeLogo);
  const away = getTeam(match.away, match.awayName, match.awayLogo);
  const isLive = match.status === "live";
  const isFinished = match.status === "finished";

  return (
    <Link
      href={`/match/${match.id}`}
      className={`match-row group ${isLive ? "match-row-live" : ""}`}
    >
      <div className="w-12 shrink-0 text-center">
        {isLive ? (
          <span className="text-xs font-bold text-red-600 tabular-nums">
            {match.displayClock ?? `${liveMinute}'`}
          </span>
        ) : isFinished ? (
          <span className="text-[10px] font-semibold text-zinc-400 uppercase">FT</span>
        ) : (
          <span className="text-[11px] text-zinc-400 tabular-nums">{match.time}</span>
        )}
      </div>

      <div className="flex-1 min-w-0 grid grid-cols-[1fr_auto] gap-x-3 gap-y-1.5">
        <div className="flex items-center gap-2 min-w-0 col-span-1">
          {home.logo ? (
            <img src={home.logo} alt="" className="h-5 w-5 object-contain shrink-0" />
          ) : (
            <span className="text-sm shrink-0">{home.flag}</span>
          )}
          <span className={`text-sm truncate ${isLive || isFinished ? "font-semibold text-zinc-900" : "text-zinc-600"}`}>
            {home.name}
          </span>
        </div>
        {(isLive || isFinished) && (
          <span className="text-sm font-bold text-zinc-900 tabular-nums text-right row-span-2 self-center">
            {match.homeScore} – {match.awayScore}
          </span>
        )}
        <div className="flex items-center gap-2 min-w-0 col-span-1">
          {away.logo ? (
            <img src={away.logo} alt="" className="h-5 w-5 object-contain shrink-0" />
          ) : (
            <span className="text-sm shrink-0">{away.flag}</span>
          )}
          <span className={`text-sm truncate ${isLive || isFinished ? "font-semibold text-zinc-900" : "text-zinc-600"}`}>
            {away.name}
          </span>
        </div>
      </div>

      <div className="shrink-0 flex flex-col items-end gap-1.5 pl-2">
        {isLive && <LiveBadge />}
        {!isLive && !isFinished && <span className="badge-upcoming">Soon</span>}
        <span className="text-[10px] text-zinc-300 font-medium">Grp {match.group}</span>
        <ChevronRight size={14} className="text-zinc-300 group-hover:text-blue-500 transition-colors" />
      </div>
    </Link>
  );
}

interface LiveScoresProps {
  initialMatches?: Match[];
}

export function LiveScores({ initialMatches }: LiveScoresProps) {
  const [matches, setMatches] = useState<Match[]>(initialMatches ?? []);
  const [loading, setLoading] = useState(initialMatches === undefined);
  const [error, setError] = useState("");
  const [liveMinute, setLiveMinute] = useState(0);

  const loadMatches = useCallback(async (showSpinner = false) => {
    if (showSpinner) setLoading(true);
    setError("");
    try {
      const data = await fetchMatches({ date: "today" });
      setMatches(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load scores");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (initialMatches === undefined) {
      loadMatches(true);
    } else {
      loadMatches(false);
    }

    const interval = setInterval(() => loadMatches(false), 60_000);
    return () => clearInterval(interval);
  }, [initialMatches, loadMatches]);

  const liveMatches = matches.filter((m) => m.status === "live");
  const upcomingToday = matches.filter((m) => m.status === "upcoming");
  const finishedToday = matches.filter((m) => m.status === "finished");

  useEffect(() => {
    if (liveMatches.length === 0) return;
    setLiveMinute(liveMatches[0].minute ?? 0);
    const interval = setInterval(() => {
      setLiveMinute((m) => (m >= 90 ? 90 : m + 1));
    }, 8000);
    return () => clearInterval(interval);
  }, [liveMatches.length, liveMatches[0]?.minute]);

  const todayLabel = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  const showSpinner = loading && matches.length === 0;

  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <h2 className="section-title flex items-center gap-2">
          <Radio size={20} className="text-red-500" />
          Live Scores
        </h2>
        <Link href="/fixtures" className="text-[13px] text-blue-600 hover:text-blue-700 font-medium flex items-center gap-0.5">
          All fixtures <ChevronRight size={14} />
        </Link>
      </div>

      <div className="card-elevated overflow-hidden">
        <div className="host-stripe" />
        <div className="flex items-center justify-between px-4 py-3 bg-zinc-50 border-b border-zinc-100">
          <div className="flex items-center gap-2 text-sm text-zinc-600">
            <Clock size={14} className="text-zinc-400" />
            {todayLabel}
          </div>
          <span className="text-[10px] text-zinc-400 font-medium uppercase tracking-wider">ESPN</span>
        </div>

        {showSpinner && (
          <div className="flex items-center justify-center gap-2 py-14 text-zinc-400 text-sm">
            <Loader2 size={18} className="animate-spin" />
            Loading scores...
          </div>
        )}

        {error && matches.length === 0 && (
          <div className="px-4 py-10 text-center">
            <p className="text-red-600 text-sm mb-3">{error}</p>
            <button
              onClick={() => loadMatches(true)}
              className="btn-secondary inline-flex items-center gap-2 px-4 py-2 text-sm"
            >
              <RefreshCw size={14} /> Retry
            </button>
          </div>
        )}

        {!showSpinner && (matches.length > 0 || error) && (
          <>
            {error && matches.length > 0 && (
              <p className="px-4 py-2 text-xs text-amber-600 bg-amber-50 border-b border-amber-100">
                Couldn&apos;t refresh — showing cached scores
              </p>
            )}
            {liveMatches.length > 0 && (
              <div>
                <p className="px-4 pt-3 pb-0 text-[10px] uppercase tracking-widest text-red-500 font-bold">
                  Live
                </p>
                {liveMatches.map((m) => (
                  <MatchRow key={m.id} match={m} liveMinute={liveMinute} />
                ))}
              </div>
            )}
            {upcomingToday.length > 0 && (
              <div>
                <p className="px-4 pt-3 pb-0 text-[10px] uppercase tracking-widest text-zinc-400 font-semibold">
                  Upcoming
                </p>
                {upcomingToday.map((m) => <MatchRow key={m.id} match={m} />)}
              </div>
            )}
            {finishedToday.length > 0 && (
              <div>
                <p className="px-4 pt-3 pb-0 text-[10px] uppercase tracking-widest text-zinc-400 font-semibold">
                  Full Time
                </p>
                {finishedToday.map((m) => <MatchRow key={m.id} match={m} />)}
              </div>
            )}
            {matches.length === 0 && !error && (
              <p className="px-4 py-10 text-center text-zinc-400 text-sm">No matches today</p>
            )}
          </>
        )}
      </div>
    </section>
  );
}
