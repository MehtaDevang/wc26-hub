"use client";

import Link from "next/link";
import { Camera } from "lucide-react";
import { CdnFillImage } from "@/components/CdnImage";
import type { HeroSlide } from "@/lib/hero-background";

interface LiveMomentsStripProps {
  slides: HeroSlide[];
}

export function LiveMomentsStrip({ slides }: LiveMomentsStripProps) {
  if (slides.length === 0) return null;

  return (
    <section className="-mx-4 sm:-mx-6">
      <div className="px-4 sm:px-6 mb-3 flex items-center justify-between gap-3">
        <h2 className="text-sm font-bold text-zinc-700 flex items-center gap-2">
          <Camera size={16} className="text-[var(--wc-usa)]" />
          Live from the tournament
        </h2>
        <span className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400">
          Updated from recent matches
        </span>
      </div>

      <div className="flex gap-3 overflow-x-auto px-4 sm:px-6 pb-2 snap-x snap-mandatory scrollbar-none">
        {slides.map((slide) => {
          const card = (
            <article className="group relative h-44 w-64 sm:h-48 sm:w-72 shrink-0 snap-start overflow-hidden rounded-2xl bg-zinc-200 shadow-sm">
              <CdnFillImage
                src={slide.url}
                alt={slide.alt}
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                sizes="(max-width: 640px) 256px, 288px"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />
              {slide.label && (
                <p className="absolute bottom-3 left-3 right-3 text-sm font-semibold text-white leading-snug line-clamp-2 drop-shadow">
                  {slide.label}
                </p>
              )}
            </article>
          );

          if (slide.matchId) {
            return (
              <Link
                key={slide.url}
                href={`/match/${slide.matchId}`}
                className="shrink-0 rounded-2xl focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
              >
                {card}
              </Link>
            );
          }

          return (
            <div key={slide.url} className="shrink-0">
              {card}
            </div>
          );
        })}
      </div>
    </section>
  );
}
