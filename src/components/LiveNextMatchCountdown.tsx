"use client";

import { useCallback, useEffect, useState } from "react";
import { NextMatchCountdown } from "@/components/NextMatchCountdown";
import { useTimezone } from "@/components/TimezoneProvider";
import { fetchMatches } from "@/lib/matches";
import {
  mergeMatchesById,
  pickNextUpcomingMatches,
} from "@/lib/upcoming-matches";
import type { Match } from "@/lib/types";

interface LiveNextMatchCountdownProps {
  initialMatches: Match[];
}

export function LiveNextMatchCountdown({ initialMatches }: LiveNextMatchCountdownProps) {
  const timezone = useTimezone();
  const [matches, setMatches] = useState(initialMatches);

  const refresh = useCallback(async () => {
    try {
      const [today, all] = await Promise.all([
        fetchMatches({ date: "today", timeZone: timezone }),
        fetchMatches({ range: "full", timeZone: timezone }),
      ]);
      const next = pickNextUpcomingMatches(mergeMatchesById(today, all));
      if (next.length > 0) setMatches(next);
    } catch {
      // keep last good data
    }
  }, [timezone]);

  useEffect(() => {
    setMatches(initialMatches);
  }, [initialMatches]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  useEffect(() => {
    const interval = setInterval(refresh, 120_000);
    return () => clearInterval(interval);
  }, [refresh]);

  if (matches.length === 0) return null;

  return <NextMatchCountdown matches={matches} />;
}
