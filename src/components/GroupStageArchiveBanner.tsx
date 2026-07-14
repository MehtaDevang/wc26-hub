import Link from "next/link";
import { Archive, ArrowRight } from "lucide-react";

interface GroupStageArchiveBannerProps {
  variant?: "knockout" | "scenarios";
}

export function GroupStageArchiveBanner({ variant = "knockout" }: GroupStageArchiveBannerProps) {
  const title =
    variant === "scenarios"
      ? "Group-stage simulator — archived"
      : "Group stage complete — knockout is live";

  const body =
    variant === "scenarios"
      ? "Qualification math and what-if scores were for the group stage. Follow the live bracket, today's knockout fixtures, and Golden Boot race instead."
      : "The 32 knockout spots are set. Track live scores, Round of 16 matchups, and the full path to the Final on the main bracket.";

  return (
    <div className="rounded-xl border border-amber-200 bg-gradient-to-r from-amber-50/90 to-orange-50/50 px-4 py-3.5 flex flex-col sm:flex-row sm:items-center gap-3">
      <div className="flex items-start gap-2.5 flex-1 min-w-0">
        <Archive className="text-amber-700 shrink-0 mt-0.5" size={18} aria-hidden />
        <div>
          <p className="text-sm font-semibold text-amber-950">{title}</p>
          <p className="text-xs text-amber-900/80 mt-0.5 leading-relaxed">{body}</p>
        </div>
      </div>
      <div className="flex flex-wrap gap-2 shrink-0">
        <Link
          href="/bracket"
          className="inline-flex items-center gap-1.5 rounded-lg bg-[var(--wc-usa)] px-3.5 py-2 text-xs font-semibold text-white hover:opacity-90 transition-opacity"
        >
          Live bracket
          <ArrowRight size={14} />
        </Link>
        <Link
          href="/fixtures"
          className="inline-flex items-center gap-1.5 rounded-lg border border-amber-300 bg-white/80 px-3.5 py-2 text-xs font-semibold text-amber-950 hover:bg-white transition-colors"
        >
          Knockout fixtures
        </Link>
      </div>
    </div>
  );
}
