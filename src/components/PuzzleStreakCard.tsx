"use client";

import { useEffect, useState } from "react";
import { Flame, Trophy } from "lucide-react";
import { getPuzzleStreakState, refreshPuzzleStreak, type PuzzleStreakState } from "@/lib/puzzle-streaks";
import { useTodayKey } from "@/lib/hooks/useTodayKey";
import { ShareButtons } from "./ShareButtons";
import { buildStreakShareText } from "@/lib/puzzle-streaks";
import { getSiteUrl } from "@/lib/site";

export function PuzzleStreakCard() {
  const { today } = useTodayKey();
  const [streak, setStreak] = useState<PuzzleStreakState | null>(null);

  useEffect(() => {
    if (!today) return;
    setStreak(refreshPuzzleStreak(today));
  }, [today]);

  if (!streak) return null;

  const shareText = buildStreakShareText(streak);

  return (
    <div className="card-elevated rounded-2xl overflow-hidden">
      <div className="host-stripe" />
      <div className="p-5 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 mb-1">
              Puzzle League
            </p>
            <h2 className="text-lg font-bold text-zinc-900 flex items-center gap-2">
              <Flame size={20} className="text-orange-500" />
              {streak.currentStreak > 0
                ? `${streak.currentStreak}-day streak`
                : "Start your streak"}
            </h2>
            <p className="text-sm text-zinc-500 mt-1">
              Complete all 3 daily puzzles to keep your run going.
            </p>
          </div>
          <div className="flex gap-4">
            <div className="text-center">
              <p className="text-2xl font-black tabular-nums text-zinc-900">{streak.currentStreak}</p>
              <p className="text-[10px] uppercase tracking-wide text-zinc-400">Current</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-black tabular-nums text-amber-600">{streak.bestStreak}</p>
              <p className="text-[10px] uppercase tracking-wide text-zinc-400">Best</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-black tabular-nums text-emerald-600">{streak.totalPerfectDays}</p>
              <p className="text-[10px] uppercase tracking-wide text-zinc-400">Perfect days</p>
            </div>
          </div>
        </div>

        {streak.currentStreak >= 3 && (
          <div className="mt-4 pt-4 border-t border-zinc-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <p className="text-sm text-zinc-600 flex items-center gap-2">
              <Trophy size={16} className="text-amber-500" />
              On fire! Share your streak with friends.
            </p>
            <ShareButtons
              url={`${getSiteUrl()}/puzzles`}
              title="World Cup 2026 Daily Puzzles"
              text={shareText}
              label="Share streak"
              className="justify-start sm:justify-end"
            />
          </div>
        )}
      </div>
    </div>
  );
}

export function PuzzleStreakBadge() {
  const { today } = useTodayKey();
  const [streak, setStreak] = useState(0);

  useEffect(() => {
    if (!today) return;
    setStreak(refreshPuzzleStreak(today).currentStreak);
  }, [today]);

  if (streak < 1) return null;

  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-orange-50 text-orange-700 px-2.5 py-1 text-xs font-bold">
      <Flame size={12} />
      {streak}-day streak
    </span>
  );
}
