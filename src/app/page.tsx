import Link from "next/link";
import { Puzzle, Trophy, TrendingUp, ArrowRight, Calendar, Table2, History, GitBranch, Calculator, Tv, BarChart3, MapPin } from "lucide-react";
import { LiveScores } from "@/components/LiveScores";
import { MatchHighlights } from "@/components/MatchHighlights";
import { IconicMoments } from "@/components/IconicMoments";
import { HomeHero } from "@/components/HomeHero";
import { LiveMomentsStrip } from "@/components/LiveMomentsStrip";
import { LiveNextMatchCountdown } from "@/components/LiveNextMatchCountdown";
import { LiveKnockoutBracket } from "@/components/LiveKnockoutBracket";
import { MyTeamsMatches } from "@/components/MyTeamsMatches";
import { MyTeamsPicker } from "@/components/MyTeams";
import { TeamJourneyPromo } from "@/components/TeamJourneyPromo";
import { PuzzleStreakCard } from "@/components/PuzzleStreakCard";
import { FeaturedPlayersStrip } from "@/components/FeaturedPlayersStrip";
import { createPageMetadata } from "@/lib/seo";
import { mergeKeywords, LIVE_SCORES_KEYWORDS, CORE_KEYWORDS } from "@/lib/seo-keywords";
import { JsonLd } from "@/components/JsonLd";
import { buildWebPageJsonLd } from "@/lib/structured-data";
import { getKnockoutBracket, getNextUpcomingMatches, getTodayMatches, getRecentHighlights } from "@/lib/espn/services";
import { buildHeroSlides } from "@/lib/hero-background";
import { getServerTimezone } from "@/lib/timezone";

export const metadata = createPageMetadata({
  title: "FIFA World Cup 2026 Live Scores Today — Fixtures, Standings & Stats",
  description:
    "Live World Cup 2026 scores updated throughout the day. Full fixtures, group standings, team & player stats, match highlights, knockout bracket, and football history.",
  path: "/",
  keywords: mergeKeywords(CORE_KEYWORDS, LIVE_SCORES_KEYWORDS),
});

export default async function Home() {
  const timeZone = await getServerTimezone();
  const [matchesResult, highlightsResult, nextMatchesResult, bracketResult] =
    await Promise.allSettled([
    getTodayMatches(timeZone),
    getRecentHighlights(12, timeZone),
    getNextUpcomingMatches(2, timeZone),
    getKnockoutBracket(timeZone),
  ]);

  const initialMatches = matchesResult.status === "fulfilled" ? matchesResult.value : [];
  const allHighlights = highlightsResult.status === "fulfilled" ? highlightsResult.value : [];
  const initialHighlights = allHighlights.slice(0, 6);
  const heroSlides = buildHeroSlides(allHighlights);
  const nextMatches = nextMatchesResult.status === "fulfilled" ? nextMatchesResult.value : [];
  const bracket = bracketResult.status === "fulfilled" ? bracketResult.value : null;

  return (
    <div className="space-y-14">
      <JsonLd
        data={buildWebPageJsonLd({
          path: "/",
          title: "FIFA World Cup 2026 Live Scores Today",
          description:
            "Live World Cup scores, fixtures, standings, teams, players, stats, and history.",
        })}
      />

      <HomeHero
        initialTodayMatches={initialMatches}
        initialUpcomingMatches={nextMatches}
      />

      <LiveScores initialMatches={initialMatches} />

      <MyTeamsMatches matches={initialMatches} />

      <LiveMomentsStrip slides={heroSlides} />

      <LiveNextMatchCountdown initialMatches={nextMatches} />

      {bracket && <LiveKnockoutBracket initialData={bracket} compact showLink />}

      <MatchHighlights initialHighlights={initialHighlights} />

      <IconicMoments limit={9} />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
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
        <Link href="/bracket" className="card-surface rounded-2xl p-5 hover:shadow-md transition-all group flex items-center justify-between sm:col-span-2 lg:col-span-1">
          <div>
            <h3 className="font-bold text-zinc-900 group-hover:text-blue-600 transition-colors">Knockout Bracket</h3>
            <p className="text-sm text-zinc-500 mt-1">R32 through the Final — live tournament path</p>
          </div>
          <ArrowRight size={18} className="text-zinc-300 group-hover:text-blue-600" />
        </Link>
      </div>

      <MyTeamsPicker />

      <TeamJourneyPromo />

      <FeaturedPlayersStrip />

      <section>
        <h2 className="section-title mb-5 flex items-center gap-2">
          <GitBranch size={22} className="text-blue-600" />
          Fan Tools
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Link href="/bracket/predict" className="card-surface rounded-2xl p-5 hover:shadow-md transition-all group">
            <GitBranch size={20} className="text-blue-600 mb-3" />
            <h3 className="font-bold text-zinc-900 group-hover:text-blue-600 transition-colors">Bracket Predictor</h3>
            <p className="text-sm text-zinc-500 mt-1">Pick winners & share your bracket</p>
          </Link>
          <Link href="/scenarios" className="card-surface rounded-2xl p-5 hover:shadow-md transition-all group">
            <Calculator size={20} className="text-violet-600 mb-3" />
            <h3 className="font-bold text-zinc-900 group-hover:text-blue-600 transition-colors">Qualification Scenarios</h3>
            <p className="text-sm text-zinc-500 mt-1">What does each team need to advance?</p>
          </Link>
          <Link href="/watch" className="card-surface rounded-2xl p-5 hover:shadow-md transition-all group">
            <Tv size={20} className="text-emerald-600 mb-3" />
            <h3 className="font-bold text-zinc-900 group-hover:text-blue-600 transition-colors">Where to Watch</h3>
            <p className="text-sm text-zinc-500 mt-1">TV channels for every match</p>
          </Link>
          <Link href="/leaders" className="card-surface rounded-2xl p-5 hover:shadow-md transition-all group">
            <BarChart3 size={20} className="text-amber-600 mb-3" />
            <h3 className="font-bold text-zinc-900 group-hover:text-blue-600 transition-colors">Stat Leaders</h3>
            <p className="text-sm text-zinc-500 mt-1">Golden Boot, assists & more</p>
          </Link>
        </div>
      </section>

      <Link href="/cities" className="card-surface rounded-2xl p-5 hover:shadow-md transition-all group flex items-center justify-between">
        <div>
          <h3 className="font-bold text-zinc-900 group-hover:text-blue-600 transition-colors flex items-center gap-2">
            <MapPin size={18} className="text-emerald-600" />
            Host City Travel Guides
          </h3>
          <p className="text-sm text-zinc-500 mt-1">Airports, stadium transit, fan zones & tips for every host city</p>
        </div>
        <ArrowRight size={18} className="text-zinc-300 group-hover:text-blue-600" />
      </Link>

      <section>
        <h2 className="section-title mb-5 flex items-center gap-2">
          <TrendingUp size={22} className="text-blue-600" />
          Daily Puzzles
        </h2>
        <PuzzleStreakCard />
        <div className="grid gap-4 sm:grid-cols-3 mt-5">
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
