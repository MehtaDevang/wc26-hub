import Link from "next/link";
import { Puzzle, Trophy, TrendingUp, ArrowRight, Calendar, Table2, History } from "lucide-react";
import { SponsoredBanner } from "@/components/SponsoredBanner";
import { AdBanner } from "@/components/AdBanner";
import { LiveScores } from "@/components/LiveScores";
import { MatchHighlights } from "@/components/MatchHighlights";
import { IconicMoments } from "@/components/IconicMoments";
import { WC26MascotStrip } from "@/components/WC26Brand";
import { LiveMomentsStrip } from "@/components/LiveMomentsStrip";
import { createPageMetadata } from "@/lib/seo";
import { getTodayMatches, getRecentHighlights } from "@/lib/espn/services";
import { buildHeroSlides } from "@/lib/hero-background";
import { getServerTimezone } from "@/lib/timezone";

export const metadata = createPageMetadata({
  title: "World Cup 2026 Live Scores, Fixtures & Daily Puzzles",
  description:
    "The Goal Posts — FIFA World Cup 2026 live scores, full fixture list, group standings, match highlights, World Cup history, and free daily football puzzles.",
  path: "/",
});

const STATS = [
  { label: "Matches", value: "104", color: "text-[var(--wc-usa)]" },
  { label: "Teams", value: "48", color: "text-[var(--wc-mexico)]" },
  { label: "Groups", value: "12", color: "text-[var(--wc-canada)]" },
  { label: "Days", value: "39", color: "text-[var(--wc-gold)]" },
];

export default async function Home() {
  const timeZone = await getServerTimezone();
  const [matchesResult, highlightsResult] = await Promise.allSettled([
    getTodayMatches(timeZone),
    getRecentHighlights(12, timeZone),
  ]);

  const initialMatches = matchesResult.status === "fulfilled" ? matchesResult.value : [];
  const allHighlights = highlightsResult.status === "fulfilled" ? highlightsResult.value : [];
  const initialHighlights = allHighlights.slice(0, 6);
  const heroSlides = buildHeroSlides(allHighlights);

  return (
    <div className="space-y-14">
      <section className="text-center pt-4 pb-2">
        <WC26MascotStrip variant="hero" className="mb-8" />

        <div className="inline-flex items-center gap-2 rounded-full bg-white border border-zinc-200 px-4 py-1.5 text-sm mb-6 shadow-sm">
          <span className="flex h-2 w-2 rounded-full bg-[var(--wc-canada)] animate-pulse" />
          <span className="text-zinc-600 font-medium">FIFA World Cup 2026 — Live</span>
          <span className="text-zinc-300">|</span>
          <span className="text-zinc-400 text-xs">🇲🇽 🇺🇸 🇨🇦</span>
        </div>

        <h1 className="text-4xl sm:text-[3.5rem] font-extrabold text-zinc-900 leading-[1.1] tracking-tight">
          Follow Every Moment.
          <br />
          <span className="text-gradient-hero">World Cup 2026.</span>
        </h1>
        <p className="mt-5 text-lg text-zinc-500 max-w-xl mx-auto leading-relaxed">
          Live scores, match details, fixtures, standings, and daily puzzles.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center mt-8">
          <Link href="/fixtures" className="btn-primary inline-flex items-center justify-center gap-2 px-7 py-3.5 text-[15px]">
            <Calendar size={18} />
            View Fixtures
          </Link>
          <Link href="/puzzles" className="btn-usa inline-flex items-center justify-center gap-2 px-7 py-3.5 text-[15px]">
            <Puzzle size={18} />
            Daily Puzzles
          </Link>
        </div>
      </section>

      <div className="grid grid-cols-4 gap-3 max-w-md mx-auto">
        {STATS.map((s) => (
          <div key={s.label} className="card-surface rounded-xl py-4 text-center">
            <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
            <p className="text-[11px] text-zinc-400 mt-0.5 uppercase tracking-wide">{s.label}</p>
          </div>
        ))}
      </div>

      <LiveMomentsStrip slides={heroSlides} />

      <LiveScores initialMatches={initialMatches} />

      <AdBanner placement="inline" />

      <MatchHighlights initialHighlights={initialHighlights} />

      <AdBanner placement="inline" />

      <IconicMoments limit={6} />

      <div className="grid gap-4 sm:grid-cols-2">
        <Link href="/fixtures" className="card-surface rounded-2xl p-5 hover:shadow-md transition-all group flex items-center justify-between">
          <div>
            <h3 className="font-bold text-zinc-900 group-hover:text-blue-600 transition-colors">Full Fixtures</h3>
            <p className="text-sm text-zinc-500 mt-1">Every match, venue & kickoff time</p>
          </div>
          <ArrowRight size={18} className="text-zinc-300 group-hover:text-blue-600" />
        </Link>
        <Link href="/standings" className="card-surface rounded-2xl p-5 hover:shadow-md transition-all group flex items-center justify-between">
          <div>
            <h3 className="font-bold text-zinc-900 group-hover:text-blue-600 transition-colors">Group Tables</h3>
            <p className="text-sm text-zinc-500 mt-1">Live standings for all 12 groups</p>
          </div>
          <ArrowRight size={18} className="text-zinc-300 group-hover:text-blue-600" />
        </Link>
      </div>

      <SponsoredBanner />

      <section>
        <h2 className="section-title mb-5 flex items-center gap-2">
          <TrendingUp size={22} className="text-blue-600" />
          Daily Puzzles
        </h2>
        <div className="grid gap-4 sm:grid-cols-3">
          <Link href="/puzzles/guess-player" className="group card-surface rounded-2xl p-5 hover:shadow-md transition-all hover:-translate-y-0.5">
            <div className="rounded-xl p-2.5 bg-blue-50 text-blue-600 w-fit mb-4">
              <Puzzle size={22} />
            </div>
            <h3 className="font-bold text-zinc-900 text-base mb-1.5 group-hover:text-blue-600 transition-colors">Guess the Player</h3>
            <p className="text-sm text-zinc-500 leading-relaxed">Clue-based mystery footballer. 5 players daily.</p>
          </Link>
          <Link href="/puzzles/scramble" className="group card-surface rounded-2xl p-5 hover:shadow-md transition-all hover:-translate-y-0.5">
            <div className="rounded-xl p-2.5 bg-violet-50 text-violet-600 w-fit mb-4">
              <Puzzle size={22} />
            </div>
            <h3 className="font-bold text-zinc-900 text-base mb-1.5 group-hover:text-blue-600 transition-colors">Name Scramble</h3>
            <p className="text-sm text-zinc-500 leading-relaxed">Unscramble 5 jumbled names to find footballers.</p>
          </Link>
          <Link href="/puzzles/quiz" className="group card-surface rounded-2xl p-5 hover:shadow-md transition-all hover:-translate-y-0.5">
            <div className="rounded-xl p-2.5 bg-amber-50 text-amber-600 w-fit mb-4">
              <Puzzle size={22} />
            </div>
            <h3 className="font-bold text-zinc-900 text-base mb-1.5 group-hover:text-blue-600 transition-colors">Daily Quiz</h3>
            <p className="text-sm text-zinc-500 leading-relaxed">5 World Cup trivia questions every day.</p>
          </Link>
        </div>
        <Link href="/puzzles" className="inline-flex items-center gap-1 text-sm text-blue-600 font-medium mt-4 hover:underline">
          View all puzzles <ArrowRight size={14} />
        </Link>
      </section>

      <AdBanner placement="inline" />

      <section>
        <h2 className="section-title mb-5 flex items-center gap-2">
          <History size={22} className="text-[var(--wc-gold)]" />
          World Cup History
        </h2>
        <Link
          href="/history"
          className="group card-surface rounded-2xl p-6 sm:p-8 hover:shadow-md transition-all block relative overflow-hidden"
        >
          <div className="host-stripe absolute top-0 left-0 right-0" />
          <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 mb-2">1930 — 2022</p>
              <h3 className="text-xl font-bold text-zinc-900 group-hover:text-[var(--wc-usa)] transition-colors">
                22 editions · 8 champions · legendary records
              </h3>
              <p className="text-sm text-zinc-500 mt-2 max-w-lg leading-relaxed">
                Explore every World Cup winner, final score, Golden Ball winners, all-time records, trophy history, prize money, and documented controversies.
              </p>
            </div>
            <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--wc-usa)] shrink-0">
              Browse history <ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
            </span>
          </div>
        </Link>
      </section>

      <section className="card-elevated rounded-2xl p-8 sm:p-10 text-center relative overflow-hidden">
        <div className="host-stripe absolute top-0 left-0 right-0" />
        <div className="absolute inset-0 bg-gradient-to-b from-blue-50/50 to-transparent pointer-events-none" />
        <Trophy className="mx-auto text-blue-600 mb-3 relative mt-1" size={36} />
        <h2 className="text-xl font-bold text-zinc-900 mb-2 relative">Explore the Tournament</h2>
        <p className="text-zinc-500 text-sm max-w-sm mx-auto mb-6 relative leading-relaxed">
          Videos, lineups, stats, photos, and live tables for every match.
        </p>
        <div className="flex flex-wrap justify-center gap-3 relative">
          <Link href="/fixtures" className="btn-primary inline-flex items-center gap-2 px-5 py-2.5 text-sm">
            <Calendar size={16} />
            Fixtures
          </Link>
          <Link href="/standings" className="btn-usa inline-flex items-center gap-2 px-5 py-2.5 text-sm">
            <Table2 size={16} />
            Standings
          </Link>
        </div>
      </section>
    </div>
  );
}
