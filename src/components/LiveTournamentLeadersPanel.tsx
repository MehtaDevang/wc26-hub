"use client";

import { useCallback, useEffect, useState } from "react";
import { Loader2, RefreshCw } from "lucide-react";
import { fetchLeaders } from "@/lib/matches";
import type { TournamentLeaders } from "@/lib/espn/tournament-stats";
import { TournamentLeadersPanel } from "@/components/TournamentLeadersPanel";

const REFRESH_MS = 90_000;

export function LiveTournamentLeadersPanel({
  initialLeaders,
}: {
  initialLeaders: TournamentLeaders;
}) {
  const [leaders, setLeaders] = useState(initialLeaders);
  const [refreshing, setRefreshing] = useState(false);

  const refresh = useCallback(async (showSpinner = false) => {
    if (showSpinner) setRefreshing(true);
    try {
      const data = await fetchLeaders();
      setLeaders(data);
    } catch {
      // keep last good data
    } finally {
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    refresh(false);
    const interval = setInterval(() => {
      if (document.visibilityState === "visible") {
        refresh(false);
      }
    }, REFRESH_MS);
    return () => clearInterval(interval);
  }, [refresh]);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-end gap-2">
        <button
          type="button"
          onClick={() => refresh(true)}
          disabled={refreshing}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-500 hover:text-blue-600 transition-colors disabled:opacity-50"
        >
          {refreshing ? (
            <Loader2 size={12} className="animate-spin" />
          ) : (
            <RefreshCw size={12} />
          )}
          Refresh stats
        </button>
      </div>
      <TournamentLeadersPanel leaders={leaders} />
    </div>
  );
}
