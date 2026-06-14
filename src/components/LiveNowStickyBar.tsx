"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { fetchMatches } from "@/lib/matches";
import { getTeam } from "@/lib/data";
import { useTimezone } from "@/components/TimezoneProvider";
import {
  applyTimezoneToMatches,
  filterMatchesForScoreboardToday,
  todayDateKey,
} from "@/lib/timezone";
import type { Match } from "@/lib/types";

function LivePip() {
  return (
    <span className="relative flex h-1.5 w-1.5 shrink-0">
      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75" />
      <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-red-500" />
    </span>
  );
}

export function LiveNowStickyBar() {
  const pathname = usePathname();
  const timezone = useTimezone();
  const [matches, setMatches] = useState<Match[]>([]);

  const load = useCallback(async () => {
    try {
      const data = await fetchMatches({ date: "today", timeZone: timezone });
      setMatches(data);
    } catch {
      /* keep last snapshot */
    }
  }, [timezone]);

  useEffect(() => {
    load();
    const interval = setInterval(load, 30_000);
    return () => clearInterval(interval);
  }, [load]);

  const liveMatches = useMemo(() => {
    const localized = applyTimezoneToMatches(matches, timezone);
    const today = filterMatchesForScoreboardToday(
      localized,
      todayDateKey(timezone),
      timezone
    );
    return today.filter((m) => m.status === "live");
  }, [matches, timezone]);

  if (pathname === "/" || liveMatches.length === 0) {
    return null;
  }

  const primary = liveMatches[0]!;
  const home = getTeam(primary.home, primary.homeName, primary.homeLogo);
  const away = getTeam(primary.away, primary.awayName, primary.awayLogo);
  const extra = liveMatches.length - 1;

  return (
    <div className="live-now-sticky md:hidden" role="region" aria-label="Live matches">
      <Link href={`/match/${primary.id}`} className="live-now-sticky-link">
        <LivePip />
        <span className="live-now-sticky-label">Live</span>
        <span className="live-now-sticky-score tabular-nums">
          {home.flag} {primary.homeScore}–{primary.awayScore} {away.flag}
        </span>
        <span className="live-now-sticky-teams truncate">
          {home.name} vs {away.name}
        </span>
        {extra > 0 && (
          <span className="live-now-sticky-more">+{extra}</span>
        )}
        <ChevronRight size={14} className="shrink-0 opacity-70" />
      </Link>
      {extra > 0 && (
        <Link href="/" className="live-now-sticky-all">
          All live
        </Link>
      )}
    </div>
  );
}
