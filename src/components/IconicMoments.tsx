"use client";

import Link from "next/link";
import { Sparkles, ArrowRight } from "lucide-react";
import {
  getIconicMoments,
  CATEGORY_LABELS,
  type IconicMoment,
} from "@/lib/iconic-moments";

function MomentCard({ moment }: { moment: IconicMoment }) {
  return (
    <article className="group card-surface overflow-hidden rounded-xl transition-all hover:-translate-y-0.5 hover:shadow-md">
      <div className="relative aspect-[16/10] overflow-hidden bg-zinc-100">
        <img
          src={moment.imageUrl}
          alt={moment.imageAlt}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent" />
        <div className="absolute left-3 top-3 flex flex-wrap gap-2">
          <span className="rounded-md bg-black/70 px-2 py-1 text-[10px] font-bold text-white backdrop-blur-sm">
            {moment.year}
          </span>
          <span className="rounded-md bg-white/90 px-2 py-1 text-[10px] font-semibold text-zinc-700 backdrop-blur-sm">
            {CATEGORY_LABELS[moment.category]}
          </span>
          {moment.era === "wc26" && (
            <span className="rounded-md bg-[var(--wc-usa)]/90 px-2 py-1 text-[10px] font-bold text-white backdrop-blur-sm">
              WC26
            </span>
          )}
        </div>
        <p className="absolute bottom-3 left-3 right-3 text-xs font-medium text-white/90">
          {moment.teams}
        </p>
      </div>
      <div className="p-4">
        <h3 className="line-clamp-2 text-sm font-semibold leading-snug text-zinc-900 transition-colors group-hover:text-blue-600">
          {moment.title}
        </h3>
        <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-zinc-500">
          {moment.description}
        </p>
      </div>
    </article>
  );
}

interface IconicMomentsProps {
  limit?: number;
  showClassicLink?: boolean;
}

export function IconicMoments({ limit = 6, showClassicLink = true }: IconicMomentsProps) {
  const moments = getIconicMoments(limit);

  return (
    <section>
      <div className="mb-4 flex items-end justify-between gap-4">
        <div>
          <h2 className="section-title flex items-center gap-2">
            <Sparkles size={20} className="text-[var(--wc-gold)]" />
            Iconic Moments
          </h2>
          <p className="mt-1 text-sm text-zinc-500">
            Legendary goals, stadium atmospheres, shock results, and World Cup 2026 memories.
          </p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {moments.map((moment) => (
          <MomentCard key={moment.id} moment={moment} />
        ))}
      </div>

      {showClassicLink && (
        <Link
          href="/history"
          className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-blue-600 hover:underline"
        >
          Explore full World Cup history <ArrowRight size={14} />
        </Link>
      )}
    </section>
  );
}
