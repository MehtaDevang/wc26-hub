import Link from "next/link";
import { History, ArrowRight } from "lucide-react";
import { findHistoricalParallel } from "@/lib/historical-parallels";
import type { Match } from "@/lib/types";

export function HistoricalParallel({ match }: { match: Match }) {
  const parallel = findHistoricalParallel(match);
  if (!parallel) return null;

  const { moment, hook } = parallel;

  return (
    <Link
      href="/history"
      className="card-surface group block overflow-hidden rounded-2xl border border-[var(--wc-gold)]/20"
    >
      <div className="flex flex-col sm:flex-row">
        <div
          className="h-32 sm:h-auto sm:w-44 shrink-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${moment.imageUrl})` }}
          aria-hidden
        />
        <div className="p-5 min-w-0 flex-1">
          <p className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--wc-gold)]">
            <History size={12} />
            World Cup history rhymes
          </p>
          <p className="mt-2 text-sm text-zinc-700 leading-relaxed">{hook}</p>
          <p className="mt-3 text-sm font-bold text-zinc-900 group-hover:text-blue-600 transition-colors">
            {moment.title}
          </p>
          <span className="mt-1 inline-flex items-center gap-1 text-xs font-semibold text-blue-600">
            Explore World Cup history
            <ArrowRight size={13} />
          </span>
        </div>
      </div>
    </Link>
  );
}
