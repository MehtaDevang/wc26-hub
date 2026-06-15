"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import Link from "next/link";
import { Loader2, RefreshCw } from "lucide-react";
import { fetchMatches } from "@/lib/matches";
import { MatchClashRow } from "@/components/MatchBattleGraphic";
import { useTimezone } from "@/components/TimezoneProvider";
import {
  applyTimezoneToMatches,
  filterMatchesForScoreboardToday,
  todayDateKey,
} from "@/lib/timezone";
import type { Match } from "@/lib/types";
import type { EmbedStrings } from "@/lib/i18n";

interface EmbedLiveScoresProps {
  initialMatches?: Match[];
  strings: EmbedStrings;
  poweredByHref?: string;
}

export function EmbedLiveScores({
  initialMatches,
  strings,
  poweredByHref = "/",
}: EmbedLiveScoresProps) {
  const timezone = useTimezone();
  const [matches, setMatches] = useState<Match[]>(initialMatches ?? []);
  const [loading, setLoading] = useState(initialMatches === undefined);
  const [error, setError] = useState("");

  const localizedMatches = useMemo(() => {
    const localized = applyTimezoneToMatches(matches, timezone);
    return filterMatchesForScoreboardToday(localized, todayDateKey(timezone), timezone);
  }, [matches, timezone]);

  const loadMatches = useCallback(async () => {
    setError("");
    try {
      const data = await fetchMatches({ date: "today", timeZone: timezone });
      setMatches(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load");
    } finally {
      setLoading(false);
    }
  }, [timezone]);

  useEffect(() => {
    loadMatches();
    const interval = setInterval(loadMatches, 60_000);
    return () => clearInterval(interval);
  }, [loadMatches]);

  const liveMatches = localizedMatches.filter((m) => m.status === "live");
  const upcomingToday = localizedMatches.filter((m) => m.status === "upcoming");
  const finishedToday = localizedMatches.filter((m) => m.status === "finished");

  return (
    <div className="embed-live-scores bg-white text-zinc-900 min-h-[280px]">
      <div className="host-stripe" />
      {loading && localizedMatches.length === 0 && (
        <div className="flex items-center justify-center gap-2 py-12 text-zinc-400 text-sm">
          <Loader2 size={16} className="animate-spin" />
          {strings.loadingScores}
        </div>
      )}

      {error && localizedMatches.length === 0 && (
        <div className="px-4 py-10 text-center">
          <button
            type="button"
            onClick={loadMatches}
            className="inline-flex items-center gap-2 text-sm text-blue-600 font-medium"
          >
            <RefreshCw size={14} /> Retry
          </button>
        </div>
      )}

      {!loading && localizedMatches.length > 0 && (
        <div className="match-clash-list">
          {liveMatches.length > 0 && (
            <div>
              <p className="px-3 pt-2 pb-1 text-[10px] uppercase tracking-widest text-red-500 font-bold">
                {strings.live}
              </p>
              {liveMatches.map((m) => (
                <MatchClashRow key={m.id} match={m} showGroup={false} />
              ))}
            </div>
          )}
          {upcomingToday.length > 0 && (
            <div>
              <p className="px-3 pt-2 pb-1 text-[10px] uppercase tracking-widest text-zinc-400 font-semibold">
                {strings.upcoming}
              </p>
              {upcomingToday.map((m) => (
                <MatchClashRow key={m.id} match={m} showGroup={false} />
              ))}
            </div>
          )}
          {finishedToday.length > 0 && (
            <div>
              <p className="px-3 pt-2 pb-1 text-[10px] uppercase tracking-widest text-zinc-400 font-semibold">
                {strings.fullTime}
              </p>
              {finishedToday.map((m) => (
                <MatchClashRow key={m.id} match={m} showGroup={false} />
              ))}
            </div>
          )}
        </div>
      )}

      {!loading && localizedMatches.length === 0 && !error && (
        <p className="px-4 py-10 text-center text-zinc-400 text-sm">{strings.noMatchesToday}</p>
      )}

      <div className="border-t border-zinc-100 px-3 py-2 text-center">
        <Link
          href={poweredByHref}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[10px] font-semibold text-zinc-400 hover:text-blue-600 transition-colors"
        >
          Powered by The Goal Posts
        </Link>
      </div>
    </div>
  );
}
