"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Check, X, ArrowRight } from "lucide-react";
import { PUZZLE_CATALOG } from "@/lib/puzzles/catalog";
import {
  getPuzzleStatus,
  clearStalePuzzleState,
} from "@/lib/storage";
import { useTodayKey } from "@/lib/hooks/useTodayKey";
import { formatTodayDisplay } from "@/lib/puzzles/daily";
import { PuzzleDailyBanner } from "./PuzzleDailyBanner";
import { PuzzleStreakCard } from "./PuzzleStreakCard";
import { ShareButtons } from "./ShareButtons";
import { buildPuzzlesSharePayload } from "@/lib/share";
import { AdBanner } from "./AdBanner";

const COLOR_MAP = {
  blue: { icon: "bg-blue-50 text-blue-600", badge: "bg-blue-50 text-blue-700", ring: "hover:border-blue-200" },
  violet: { icon: "bg-violet-50 text-violet-600", badge: "bg-violet-50 text-violet-700", ring: "hover:border-violet-200" },
  amber: { icon: "bg-amber-50 text-amber-600", badge: "bg-amber-50 text-amber-700", ring: "hover:border-amber-200" },
  emerald: { icon: "bg-emerald-50 text-emerald-600", badge: "bg-emerald-50 text-emerald-700", ring: "hover:border-emerald-200" },
};

function StatusBadge({ status }: { status: "done" | "lost" | "pending" }) {
  if (status === "done") {
    return (
      <span className="inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
        <Check size={10} /> Done
      </span>
    );
  }
  if (status === "lost") {
    return (
      <span className="inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider text-red-500 bg-red-50 px-2 py-0.5 rounded-full">
        <X size={10} /> Missed
      </span>
    );
  }
  return (
    <span className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400 bg-zinc-50 px-2 py-0.5 rounded-full">
      Play
    </span>
  );
}

export function PuzzlesHub() {
  const { today, ready: dateReady } = useTodayKey();
  const [statuses, setStatuses] = useState<Record<string, "done" | "lost" | "pending">>({});

  useEffect(() => {
    if (!today) return;
    clearStalePuzzleState(today);
    setStatuses({
      "guess-player": getPuzzleStatus("guess-player", today),
      scramble: getPuzzleStatus("scramble", today),
      quiz: getPuzzleStatus("quiz", today),
    });
  }, [today]);

  const completed = Object.values(statuses).filter((s) => s === "done").length;
  const share = buildPuzzlesSharePayload();

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="section-title">
          Daily <span className="text-blue-600">Puzzles</span>
        </h1>
        <p className="text-zinc-500 text-sm mt-1">
          {dateReady && today
            ? `${formatTodayDisplay(today)} · ${completed}/${PUZZLE_CATALOG.length} completed today`
            : "Loading today's puzzles…"}
        </p>
      </div>

      <PuzzleDailyBanner />

      <PuzzleStreakCard />

      <div className="card-surface rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <p className="font-semibold text-zinc-900">Challenge a friend</p>
          <p className="text-sm text-zinc-500 mt-1">
            Share today&apos;s puzzles — {completed}/{PUZZLE_CATALOG.length} done on your board.
          </p>
        </div>
        <ShareButtons
          url={share.url}
          title={share.title}
          text={share.text}
          label={share.label}
          className="shrink-0"
        />
      </div>

      <AdBanner placement="puzzles" />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {PUZZLE_CATALOG.map((puzzle) => {
          const c = COLOR_MAP[puzzle.color];
          const Icon = puzzle.icon;
          const status = statuses[puzzle.id] ?? "pending";

          return (
            <Link
              key={puzzle.id}
              href={puzzle.href}
              className={`group card-surface rounded-2xl p-5 hover:shadow-md transition-all hover:-translate-y-0.5 ${c.ring}`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`rounded-xl p-2.5 ${c.icon}`}>
                  <Icon size={22} />
                </div>
                <div className="flex flex-col items-end gap-1.5">
                  <span className={`text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full font-semibold ${c.badge}`}>
                    {puzzle.badge}
                  </span>
                  <StatusBadge status={status} />
                </div>
              </div>
              <h3 className="font-bold text-zinc-900 text-base mb-1.5 group-hover:text-blue-600 transition-colors">
                {puzzle.title}
              </h3>
              <p className="text-sm text-zinc-500 leading-relaxed">{puzzle.description}</p>
              <span className="inline-flex items-center gap-1 text-xs text-blue-600 font-medium mt-3">
                Play <ArrowRight size={12} />
              </span>
            </Link>
          );
        })}
      </div>

      <AdBanner placement="puzzles" />
    </div>
  );
}
