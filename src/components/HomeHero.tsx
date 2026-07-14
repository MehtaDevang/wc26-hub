import Link from "next/link";
import { Suspense } from "react";
import { GitBranch, BarChart3, Star } from "lucide-react";
import {
  HomeHeroSpotlightSection,
  HomeSectionSkeleton,
} from "@/components/home/HomeSections";

export function HomeHero() {
  return (
    <section className="home-dashboard-hero">
      <div className="home-dashboard-hero-glow" aria-hidden />
      <div className="host-stripe rounded-t-2xl" />

      <div className="home-dashboard-hero-inner">
        <div className="home-dashboard-hero-header">
          <div className="min-w-0">
            <div className="inline-flex items-center gap-2 mb-2">
              <span className="home-dashboard-live-dot" aria-hidden />
              <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-zinc-500">
                FIFA World Cup 2026 · Knockout phase
              </span>
            </div>
            <h1 className="home-dashboard-title">Live scores & bracket</h1>
            <p className="home-dashboard-subtitle">
              Today&apos;s knockout games, the path to the Final, and the Golden Boot race.
            </p>
          </div>

          <div className="home-dashboard-hero-actions">
            <Link href="/bracket" className="home-dashboard-cta home-dashboard-cta-primary">
              <GitBranch size={16} />
              Bracket
            </Link>
            <Link href="/leaders" className="home-dashboard-cta">
              <BarChart3 size={16} />
              Leaders
            </Link>
            <Link href="/my" className="home-dashboard-cta home-dashboard-cta-icon" aria-label="My World Cup">
              <Star size={16} />
            </Link>
          </div>
        </div>

        <Suspense fallback={<HomeSectionSkeleton height={148} className="mt-4" />}>
          <HomeHeroSpotlightSection />
        </Suspense>
      </div>
    </section>
  );
}
