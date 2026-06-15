"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Sparkles, ArrowRight, X } from "lucide-react";
import {
  getIconicMoments,
  CATEGORY_LABELS,
  type IconicMoment,
} from "@/lib/iconic-moments";

function MomentDetailModal({
  moment,
  onClose,
}: {
  moment: IconicMoment;
  onClose: () => void;
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="moment-detail-title"
    >
      <button
        type="button"
        className="absolute inset-0 bg-black/55 backdrop-blur-[2px] cursor-pointer"
        onClick={onClose}
        aria-label="Close moment details"
      />
      <div className="relative z-10 w-full max-w-2xl max-h-[92vh] overflow-y-auto rounded-t-2xl sm:rounded-2xl bg-white shadow-2xl">
        <div className="relative aspect-video bg-zinc-100">
          <img
            src={moment.imageUrl}
            alt={moment.imageAlt}
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
          <button
            type="button"
            onClick={onClose}
            className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-sm transition-colors hover:bg-black/70 cursor-pointer"
            aria-label="Close"
          >
            <X size={18} />
          </button>
          <div className="absolute bottom-3 left-3 flex flex-wrap gap-2">
            <span className="rounded-md bg-black/70 px-2 py-1 text-[10px] font-bold text-white">
              {moment.year}
            </span>
            <span className="rounded-md bg-white/90 px-2 py-1 text-[10px] font-semibold text-zinc-700">
              {CATEGORY_LABELS[moment.category]}
            </span>
            {moment.era === "wc26" && (
              <span className="rounded-md bg-[var(--wc-usa)]/90 px-2 py-1 text-[10px] font-bold text-white">
                WC26
              </span>
            )}
          </div>
        </div>

        <div className="p-5 sm:p-6 space-y-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
              {moment.teams}
            </p>
            <h3
              id="moment-detail-title"
              className="mt-1 text-xl font-bold text-zinc-900 leading-snug"
            >
              {moment.title}
            </h3>
          </div>

          <p className="text-sm leading-relaxed text-zinc-600">{moment.description}</p>
          <p className="text-sm leading-relaxed text-zinc-500 border-l-2 border-[var(--wc-gold)] pl-4">
            {moment.details}
          </p>

          {moment.era === "classic" && (
            <Link
              href="/history"
              onClick={onClose}
              className="inline-flex items-center gap-1 text-sm font-medium text-blue-600 hover:underline"
            >
              Read more in FIFA World Cup history <ArrowRight size={14} />
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

function MomentCard({
  moment,
  onSelect,
}: {
  moment: IconicMoment;
  onSelect: (moment: IconicMoment) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onSelect(moment)}
      className="group card-surface w-full overflow-hidden rounded-xl text-left transition-all hover:-translate-y-0.5 hover:shadow-md cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--wc-usa)]"
      aria-label={`View details: ${moment.title}`}
    >
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
        <p className="mt-2 text-[10px] font-semibold uppercase tracking-wider text-blue-600 opacity-0 transition-opacity group-hover:opacity-100">
          Tap for details
        </p>
      </div>
    </button>
  );
}

type MomentFilter = "all" | "wc26" | "classic";

interface IconicMomentsProps {
  limit?: number;
  showClassicLink?: boolean;
  showFilters?: boolean;
}

export function IconicMoments({
  limit = 9,
  showClassicLink = true,
  showFilters = true,
}: IconicMomentsProps) {
  const [filter, setFilter] = useState<MomentFilter>("all");
  const [selected, setSelected] = useState<IconicMoment | null>(null);

  const moments = useMemo(() => {
    const era = filter === "all" ? undefined : filter;
    return getIconicMoments(limit, era);
  }, [filter, limit]);

  const closeModal = useCallback(() => setSelected(null), []);

  const filters: Array<{ id: MomentFilter; label: string }> = [
    { id: "all", label: "All" },
    { id: "wc26", label: "WC 2026" },
    { id: "classic", label: "Classics" },
  ];

  return (
    <section>
      <div className="mb-4 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h2 className="section-title flex items-center gap-2">
            <Sparkles size={20} className="text-[var(--wc-gold)]" />
            Iconic Moments
          </h2>
          <p className="mt-1 text-sm text-zinc-500">
            Legendary goals, shock results, stadium atmospheres, and memories from 2026 and beyond.
          </p>
        </div>
        {showFilters && (
          <div className="flex gap-1.5 shrink-0">
            {filters.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setFilter(item.id)}
                className={`rounded-full px-3 py-1.5 text-xs font-semibold transition-colors ${
                  filter === item.id
                    ? "bg-zinc-900 text-white"
                    : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {moments.map((moment) => (
          <MomentCard key={moment.id} moment={moment} onSelect={setSelected} />
        ))}
      </div>

      {showClassicLink && (
        <Link
          href="/history"
          className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-blue-600 hover:underline cursor-pointer"
        >
          Explore FIFA World Cup history <ArrowRight size={14} />
        </Link>
      )}

      {selected && <MomentDetailModal moment={selected} onClose={closeModal} />}
    </section>
  );
}
