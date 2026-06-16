import Link from "next/link";
import { PuzzleStatsDashboard } from "@/components/PuzzleStatsDashboard";
import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "Your Puzzle League Stats - World Cup 2026 Daily Puzzles",
  description:
    "Track your World Cup 2026 daily puzzle streak, perfect days, and today's progress on The Goal Posts.",
  path: "/puzzles/stats",
  keywords: ["World Cup puzzles", "puzzle streak", "daily football quiz"],
});

export default function PuzzleStatsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="section-title">Puzzle League</h1>
        <p className="text-sm text-zinc-500 mt-1">
          Your personal streak and daily puzzle progress.
        </p>
      </div>
      <PuzzleStatsDashboard />
      <p className="text-xs text-zinc-400 text-center">
        Stats are stored locally in your browser on this device.
      </p>
    </div>
  );
}
