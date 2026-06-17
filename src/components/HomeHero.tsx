import Link from "next/link";
import { Suspense } from "react";
import { Puzzle, Calendar } from "lucide-react";
import { WC26MascotStrip } from "@/components/WC26Brand";
import {
  HomeHeroSpotlightSection,
  HomeSectionSkeleton,
} from "@/components/home/HomeSections";
import { WC26_HOSTS } from "@/lib/wc26-brand";

const STATS = [
  { label: "Matches", value: "104", color: "text-[var(--wc-usa)]" },
  { label: "Teams", value: "48", color: "text-[var(--wc-mexico)]" },
  { label: "Groups", value: "12", color: "text-[var(--wc-canada)]" },
  { label: "Days", value: "39", color: "text-[var(--wc-gold)]" },
] as const;

export function HomeHero() {
  return (
    <section className="home-hero">
      <div className="home-hero-glow" aria-hidden />

      <div className="host-stripe rounded-t-2xl" />

      <div className="home-hero-inner">
        <WC26MascotStrip variant="hero" className="mb-8" />

        <div className="inline-flex items-center gap-2 rounded-full bg-white/90 border border-zinc-200 px-4 py-1.5 text-sm mb-6 shadow-sm">
          <span className="flex h-2 w-2 rounded-full bg-[var(--wc-canada)] animate-pulse" />
          <span className="text-zinc-600 font-medium">FIFA World Cup 2026 - Live</span>
        </div>

        <h1 className="text-4xl sm:text-[3.5rem] font-extrabold text-zinc-900 leading-[1.1] tracking-tight">
          Follow Every Moment.
          <br />
          <span className="text-gradient-hero">World Cup 2026.</span>
        </h1>

        <p className="mt-5 text-lg text-zinc-500 max-w-xl mx-auto leading-relaxed">
          Live scores, match details, fixtures, standings, and daily puzzles.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-2 mt-5">
          {WC26_HOSTS.map((host) => (
            <span
              key={host.id}
              className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold border"
              style={{
                background: host.colorLight,
                borderColor: `${host.color}22`,
                color: host.color,
              }}
            >
              {host.flag} {host.country}
            </span>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center mt-8">
          <Link
            href="/fixtures"
            className="btn-primary inline-flex items-center justify-center gap-2 px-7 py-3.5 text-[15px]"
          >
            <Calendar size={18} />
            View Fixtures
          </Link>
          <Link
            href="/puzzles"
            className="btn-usa inline-flex items-center justify-center gap-2 px-7 py-3.5 text-[15px]"
          >
            <Puzzle size={18} />
            Daily Puzzles
          </Link>
        </div>

        <Suspense fallback={<HomeSectionSkeleton height={140} />}>
          <HomeHeroSpotlightSection />
        </Suspense>
      </div>

      <div className="grid grid-cols-4 gap-3 max-w-md mx-auto px-4 pb-6 sm:pb-8">
        {STATS.map((s) => (
          <div key={s.label} className="card-surface rounded-xl py-4 text-center bg-white/80">
            <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
            <p className="text-[11px] text-zinc-400 mt-0.5 uppercase tracking-wide">{s.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
