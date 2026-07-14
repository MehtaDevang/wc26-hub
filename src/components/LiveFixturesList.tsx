"use client";

import { useCallback, useEffect, useState } from "react";
import { FixturesExplorer } from "@/components/FixturesExplorer";
import { useTimezone } from "@/components/TimezoneProvider";
import { fetchMatches } from "@/lib/matches";
import type { Match } from "@/lib/types";

interface LiveFixturesListProps {
  initialMatches: Match[];
  defaultPhase?: "all" | "knockout";
}

export function LiveFixturesList({ initialMatches, defaultPhase = "all" }: LiveFixturesListProps) {
  const timezone = useTimezone();
  const [matches, setMatches] = useState(initialMatches);
  const [refreshing, setRefreshing] = useState(false);

  const refresh = useCallback(async () => {
    setRefreshing(true);
    try {
      const data = await fetchMatches({ range: "full", timeZone: timezone });
      setMatches(data);
    } catch {
      // keep cached fixtures
    } finally {
      setRefreshing(false);
    }
  }, [timezone]);

  useEffect(() => {
    setMatches(initialMatches);
  }, [initialMatches]);

  useEffect(() => {
    const hasLive = matches.some((m) => m.status === "live");
    const interval = setInterval(refresh, hasLive ? 60_000 : 120_000);
    return () => clearInterval(interval);
  }, [matches, refresh]);

  return (
    <div className="space-y-2">
      {refreshing && (
        <p className="text-center text-xs text-zinc-400">Refreshing fixtures…</p>
      )}
      <FixturesExplorer matches={matches} defaultPhase={defaultPhase} />
    </div>
  );
}
