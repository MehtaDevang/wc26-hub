"use client";

import { Clock, RefreshCw } from "lucide-react";
import { useTodayKey } from "@/lib/hooks/useTodayKey";
import { formatResetCountdown, formatTodayDisplay } from "@/lib/puzzles/daily";

export function PuzzleDailyBanner() {
  const { today, resetsInMs } = useTodayKey();

  return (
    <div className="card-surface rounded-xl px-4 py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-sm">
      <div className="flex items-center gap-2 text-zinc-600">
        <RefreshCw size={14} className="text-blue-600 shrink-0" />
        <span>
          Today&apos;s set · <span className="font-medium text-zinc-900">{formatTodayDisplay(today)}</span>
        </span>
      </div>
      <div className="flex items-center gap-1.5 text-zinc-400 text-xs">
        <Clock size={12} />
        New puzzles in {formatResetCountdown(resetsInMs)}
      </div>
    </div>
  );
}
