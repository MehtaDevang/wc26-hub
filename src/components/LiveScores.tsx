"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { useMounted } from "@/hooks/useMounted";
import Link from "next/link";
import { Radio, Clock, ChevronRight, Loader2, RefreshCw } from "lucide-react";
import { fetchMatches } from "@/lib/matches";
import { MatchClashRow } from "@/components/MatchBattleGraphic";
import { useTimezone } from "@/components/TimezoneProvider";
import { TimezoneBadge } from "@/components/TimezoneBadge";
import {
  applyTimezoneToMatches,
  filterMatchesForScoreboardToday,
  formatTodayLabel,
  todayDateKey,
} from "@/lib/timezone";
import type { Match } from "@/lib/types";

export interface LiveScoresLabels {
  title: string;
  allFixtures: string;
  live: string;
  upcoming: string;
  fullTime: string;
  noMatchesToday: string;
  loadingScores: string;
  autoUpdates: string;
}

const DEFAULT_LABELS: LiveScoresLabels = {
  title: "Live Scores",
  allFixtures: "All fixtures",
  live: "Live",
  upcoming: "Upcoming",
  fullTime: "Full Time",
  noMatchesToday: "No matches today",
  loadingScores: "Loading scores...",
  autoUpdates: "Auto-updates",
};

interface LiveScoresProps {
  initialMatches?: Match[];
  fixturesHref?: string;
  labels?: Partial<LiveScoresLabels>;
  compact?: boolean;
  maxItems?: number;
  embedded?: boolean;
}

export function LiveScores({
  initialMatches,
  fixturesHref = "/fixtures",
  labels: labelOverrides,
  compact = false,
  maxItems,
  embedded = false,
}: LiveScoresProps) {
  const labels = { ...DEFAULT_LABELS, ...labelOverrides };
  const timezone = useTimezone();
  const mounted = useMounted();
  const [matches, setMatches] = useState<Match[]>(initialMatches ?? []);
  const [loading, setLoading] = useState(initialMatches === undefined);
  const [error, setError] = useState("");
  const [liveMinute, setLiveMinute] = useState(0);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const localizedMatches = useMemo(() => {
    const localized = applyTimezoneToMatches(matches, timezone);
    return filterMatchesForScoreboardToday(localized, todayDateKey(timezone), timezone);
  }, [matches, timezone]);

  const loadMatches = useCallback(async (showSpinner = false) => {
    if (showSpinner) setLoading(true);
    setError("");
    try {
      const data = await fetchMatches({ date: "today", timeZone: timezone });
      setMatches(data);
      setLastUpdated(new Date());
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load scores");
    } finally {
      setLoading(false);
    }
  }, [timezone]);

  useEffect(() => {
    if (initialMatches === undefined) {
      loadMatches(true);
    } else if (initialMatches.length > 0) {
      setLastUpdated(new Date());
    }
  }, [initialMatches, loadMatches]);

  const liveMatches = localizedMatches.filter((m) => m.status === "live");
  const upcomingToday = localizedMatches.filter((m) => m.status === "upcoming");
  const finishedToday = localizedMatches.filter((m) => m.status === "finished");

  const limitList = (list: Match[], remaining: number) => {
    if (remaining <= 0) return [];
    return list.slice(0, remaining);
  };

  let remaining = maxItems ?? Number.POSITIVE_INFINITY;
  const visibleLive = limitList(liveMatches, remaining);
  remaining -= visibleLive.length;
  const visibleUpcoming = limitList(upcomingToday, remaining);
  remaining -= visibleUpcoming.length;
  const visibleFinished = limitList(finishedToday, remaining);
  const visibleCount = visibleLive.length + visibleUpcoming.length + visibleFinished.length;
  const hiddenCount = localizedMatches.length - visibleCount;

  useEffect(() => {
    const hasLive = liveMatches.length > 0;
    const interval = setInterval(() => loadMatches(false), hasLive ? 30_000 : 60_000);
    return () => clearInterval(interval);
  }, [liveMatches.length, loadMatches]);

  useEffect(() => {
    if (liveMatches.length === 0) return;
    setLiveMinute(liveMatches[0].minute ?? 0);
    const interval = setInterval(() => {
      setLiveMinute((m) => (m >= 90 ? 90 : m + 1));
    }, 8000);
    return () => clearInterval(interval);
  }, [liveMatches.length, liveMatches[0]?.minute]);

  const todayLabel = mounted ? formatTodayLabel(timezone) : "Today's matches";
  const showSpinner = loading && localizedMatches.length === 0;

  const scoresBody = (
    <>
        <div className={`home-scores-toolbar ${embedded ? "home-scores-toolbar--embedded" : ""}`}>
          <div className="flex items-center gap-2 text-sm text-zinc-700 min-w-0 font-medium">
            <Clock size={14} className="text-[var(--wc-usa)] shrink-0" />
            <span className="truncate">{todayLabel}</span>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <TimezoneBadge showIcon={false} />
            {lastUpdated && (
              <span className="text-[10px] text-zinc-500 tabular-nums hidden sm:inline">
                Updated {lastUpdated.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}
              </span>
            )}
            <span className="home-scores-live-pill">{labels.autoUpdates}</span>
          </div>
        </div>

        {showSpinner && (
          <div className="flex items-center justify-center gap-2 py-14 text-zinc-400 text-sm">
            <Loader2 size={18} className="animate-spin" />
            {labels.loadingScores}
          </div>
        )}

        {error && localizedMatches.length === 0 && (
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

        {!showSpinner && (localizedMatches.length > 0 || error) && (
          <div className="match-clash-list home-scores-list">
            {error && localizedMatches.length > 0 && (
              <p className="px-4 py-2 text-xs text-amber-600 bg-amber-50 border-b border-amber-100">
                Couldn&apos;t refresh - showing cached scores
              </p>
            )}
            {visibleLive.length > 0 && (
              <div>
                <p className="px-4 pt-3 pb-1 text-[10px] uppercase tracking-widest text-red-500 font-bold">
                  {labels.live}
                </p>
                {visibleLive.map((m) => (
                  <MatchClashRow key={m.id} match={m} liveMinute={liveMinute} />
                ))}
              </div>
            )}
            {visibleUpcoming.length > 0 && (
              <div>
                <p className="px-4 pt-3 pb-1 text-[10px] uppercase tracking-widest text-zinc-400 font-semibold">
                  {labels.upcoming}
                </p>
                {visibleUpcoming.map((m) => <MatchClashRow key={m.id} match={m} />)}
              </div>
            )}
            {visibleFinished.length > 0 && (
              <div>
                <p className="px-4 pt-3 pb-1 text-[10px] uppercase tracking-widest text-zinc-400 font-semibold">
                  {labels.fullTime}
                </p>
                {visibleFinished.map((m) => <MatchClashRow key={m.id} match={m} />)}
              </div>
            )}
            {localizedMatches.length === 0 && !error && (
              <p className="px-4 py-10 text-center text-zinc-400 text-sm">{labels.noMatchesToday}</p>
            )}
            {hiddenCount > 0 && (
              <Link
                href={fixturesHref}
                className="home-scores-more-link"
              >
                {hiddenCount} more today →
              </Link>
            )}
          </div>
        )}
    </>
  );

  if (embedded) {
    return <div className="home-scores-embedded">{scoresBody}</div>;
  }

  return (
    <section>
      <div className={`flex items-center justify-between ${compact ? "mb-3" : "mb-4"}`}>
        <h2 className={`section-title flex items-center gap-2 ${compact ? "text-base" : ""}`}>
          <Radio size={compact ? 18 : 20} className="text-red-500" />
          {labels.title}
        </h2>
        <Link href={fixturesHref} className="text-[13px] text-blue-600 hover:text-blue-700 font-medium flex items-center gap-0.5">
          {labels.allFixtures} <ChevronRight size={14} />
        </Link>
      </div>
      <div className={`card-elevated overflow-hidden rounded-2xl ${compact ? "shadow-sm" : ""}`}>
        <div className="host-stripe" />
        {scoresBody}
      </div>
    </section>
  );
}
