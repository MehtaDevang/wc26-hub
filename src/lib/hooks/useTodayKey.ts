"use client";

import { useState, useEffect } from "react";
import { useTimezone } from "@/components/TimezoneProvider";
import { todayDateKey } from "@/lib/timezone";
import {
  getMsUntilNextPuzzleResetInTimezone,
} from "@/lib/puzzles/daily";

/**
 * Calendar date for daily puzzles in the user's active timezone.
 * Waits for client mount so SSR UTC never seeds yesterday's set.
 */
export function useTodayKey() {
  const timezone = useTimezone();
  const [today, setToday] = useState<string | null>(null);
  const [resetsInMs, setResetsInMs] = useState(0);

  useEffect(() => {
    const tick = () => {
      const next = todayDateKey(timezone);
      setToday((prev) => (prev !== next ? next : prev));
      setResetsInMs(getMsUntilNextPuzzleResetInTimezone(timezone));
    };

    tick();
    const interval = setInterval(tick, 30_000);

    const onVisible = () => {
      if (document.visibilityState === "visible") tick();
    };
    document.addEventListener("visibilitychange", onVisible);

    return () => {
      clearInterval(interval);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, [timezone]);

  return { today, resetsInMs, ready: today !== null };
}
