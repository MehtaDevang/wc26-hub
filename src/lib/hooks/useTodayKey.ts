"use client";

import { useState, useEffect } from "react";
import {
  getTodayKey,
  getMsUntilNextPuzzleReset,
} from "@/lib/puzzles/daily";

export function useTodayKey() {
  const [today, setToday] = useState(() => getTodayKey());
  const [resetsInMs, setResetsInMs] = useState(() => getMsUntilNextPuzzleReset());

  useEffect(() => {
    const tick = () => {
      const next = getTodayKey();
      setToday((prev) => (prev !== next ? next : prev));
      setResetsInMs(getMsUntilNextPuzzleReset());
    };

    tick();
    const id = setInterval(tick, 30_000);
    return () => clearInterval(id);
  }, []);

  return { today, resetsInMs };
}
