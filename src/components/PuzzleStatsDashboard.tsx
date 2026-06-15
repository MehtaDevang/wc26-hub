"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Flame, Trophy, Puzzle, ArrowRight } from "lucide-react";
import { PUZZLE_CATALOG } from "@/lib/puzzles/catalog";
import { getPuzzleStatus, clearStalePuzzleState } from "@/lib/storage";
import { useTodayKey } from "@/lib/hooks/useTodayKey";
import {
  getPuzzleStreakState,
  refreshPuzzleStreak,
  buildStreakShareText,
  type PuzzleStreakState,
} from "@/lib/puzzle-streaks";
import { ShareButtons } from "./ShareButtons";
import { getSiteUrl } from "@/lib/site";

export function PuzzleStatsDashboard() {
  const { today } = useTodayKey();
  const [streak, setStreak] = useState<PuzzleStreakState | null>(null);
  const [todayDone, setTodayDone] = useState(0);

  useEffect(() => {
    if (!today) return;
    clearStalePuzzleState(today);
    setStreak(refreshPuzzleStreak(today));
    const done = PUZZLE_CATALOG.filter((p) => getPuzzleStatus(p.id, today) === "done").length;
    setTodayDone(done);
  }, [today]);

  if (!streak || !today) {
    return <p className="text-sm text-zinc-400 text-center py-12">Loading your stats…</p>;
  }

  const perfectDates = Object.keys(streak.history).sort().reverse().slice(0, 14);
  const shareText = buildStreakShareText(streak);

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="card-surface rounded-2xl p-5 text-center">
          <Flame size={22} className="mx-auto text-orange-500 mb-2" />
          <p className="text-3xl font-black tabular-nums text-zinc-900">{streak.currentStreak}</p>
          <p className="text-xs text-zinc-400 uppercase tracking-wide mt-1">Current streak</p>
        </div>
        <div className="card-surface rounded-2xl p-5 text-center">
          <Trophy size={22} className="mx-auto text-amber-500 mb-2" />
          <p className="text-3xl font-black tabular-nums text-amber-600">{streak.bestStreak}</p>
          <p className="text-xs text-zinc-400 uppercase tracking-wide mt-1">Best streak</p>
        </div>
        <div className="card-surface rounded-2xl p-5 text-center">
          <Puzzle size={22} className="mx-auto text-blue-500 mb-2" />
          <p className="text-3xl font-black tabular-nums text-zinc-900">{streak.totalPerfectDays}</p>
          <p className="text-xs text-zinc-400 uppercase tracking-wide mt-1">Perfect days</p>
        </div>
        <div className="card-surface rounded-2xl p-5 text-center">
          <p className="text-3xl font-black tabular-nums text-emerald-600">
            {todayDone}/{PUZZLE_CATALOG.length}
          </p>
          <p className="text-xs text-zinc-400 uppercase tracking-wide mt-1">Today&apos;s puzzles</p>
        </div>
      </div>

      <section className="card-surface rounded-2xl p-5 sm:p-6">
        <h2 className="font-bold text-zinc-900 mb-4">Today&apos;s progress</h2>
        <div className="space-y-2">
          {PUZZLE_CATALOG.map((puzzle) => {
            const status = getPuzzleStatus(puzzle.id, today);
            return (
              <Link
                key={puzzle.id}
                href={puzzle.href}
                className="flex items-center justify-between gap-3 rounded-xl border border-zinc-100 px-4 py-3 hover:bg-zinc-50 transition-colors"
              >
                <span className="font-medium text-zinc-900">{puzzle.title}</span>
                <span
                  className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                    status === "done"
                      ? "bg-emerald-50 text-emerald-700"
                      : status === "lost"
                        ? "bg-red-50 text-red-600"
                        : "bg-zinc-100 text-zinc-500"
                  }`}
                >
                  {status === "done" ? "Done" : status === "lost" ? "Missed" : "Play"}
                </span>
              </Link>
            );
          })}
        </div>
        <p className="text-xs text-zinc-400 mt-4">
          Complete all {PUZZLE_CATALOG.length} puzzles in a day to extend your streak.
        </p>
      </section>

      {perfectDates.length > 0 && (
        <section className="card-surface rounded-2xl p-5 sm:p-6">
          <h2 className="font-bold text-zinc-900 mb-3">Recent perfect days</h2>
          <div className="flex flex-wrap gap-2">
            {perfectDates.map((date) => (
              <span
                key={date}
                className="inline-flex items-center gap-1 rounded-full bg-emerald-50 text-emerald-700 px-3 py-1 text-xs font-semibold"
              >
                ✓ {date}
              </span>
            ))}
          </div>
        </section>
      )}

      <section className="card-elevated rounded-2xl p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <p className="font-bold text-zinc-900">Your Puzzle League</p>
          <p className="text-sm text-zinc-500 mt-1">
            Personal stats saved on this device. Global leaderboards coming later.
          </p>
        </div>
        <ShareButtons
          url={`${getSiteUrl()}/puzzles`}
          title="World Cup 2026 Daily Puzzles"
          text={shareText}
          label="Share streak"
        />
      </section>

      <Link href="/puzzles" className="inline-flex items-center gap-1 text-sm font-semibold text-blue-600 hover:underline">
        Play today&apos;s puzzles <ArrowRight size={14} />
      </Link>
    </div>
  );
}
