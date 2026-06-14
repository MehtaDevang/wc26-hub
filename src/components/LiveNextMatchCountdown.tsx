"use client";

import { useCallback, useEffect, useState } from "react";
import { NextMatchCountdown } from "@/components/NextMatchCountdown";
import { useTimezone } from "@/components/TimezoneProvider";
import { fetchMatches } from "@/lib/matches";
import type { Match } from "@/lib/types";

interface LiveNextMatchCountdownProps {
  initialMatches: Match[];
}

function pickNextMatches(matches: Match[], limit = 2): Match[] {
  const now = Date.now();
  return matches
    .filter(
      (match) =>
        match.status === "upcoming" &&
        match.kickoffAt &&
        new Date(match.kickoffAt).getTime() > now
    )
    .sort((a, b) => new Date(a.kickoffAt).getTime() - new Date(b.kickoffAt).getTime())
    .slice(0, limit);
}

export function LiveNextMatchCountdown({ initialMatches }: LiveNextMatchCountdownProps) {
  const timezone = useTimezone();
  const [matches, setMatches] = useState(initialMatches);

  const refresh = useCallback(async () => {
    try {
      const all = await fetchMatches({ range: "full", timeZone: timezone });
      const next = pickNextMatches(all);
      if (next.length > 0) setMatches(next);
    } catch {
      // keep last good data
    }
  }, [timezone]);

  useEffect(() => {
    setMatches(initialMatches);
  }, [initialMatches]);

  useEffect(() => {
    const interval = setInterval(refresh, 120_000);
    return () => clearInterval(interval);
  }, [refresh]);

  if (matches.length === 0) return null;

  return <NextMatchCountdown matches={matches} />;
}
