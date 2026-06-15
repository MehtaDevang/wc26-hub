import Link from "next/link";
import {
  Puzzle,
  Trophy,
  TrendingUp,
  ArrowRight,
  Calendar,
  Table2,
  History,
  GitBranch,
  Calculator,
  Tv,
  BarChart3,
  MapPin,
  Swords,
  Users,
  Code2,
} from "lucide-react";
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
import { HomeJumpNav } from "@/components/HomeJumpNav";
import { JsonLd } from "@/components/JsonLd";
import { buildWebPageJsonLd } from "@/lib/structured-data";
import {
  getKnockoutBracket,
  getNextUpcomingMatches,
  getTodayMatches,
  getRecentHighlights,
} from "@/lib/espn/services";
import { buildHeroSlides } from "@/lib/hero-background";
import { getServerTimezone } from "@/lib/timezone";
import { getHomeCopy, getStrings, localePath, type Locale } from "@/lib/i18n";

interface LocalizedHomePageProps {
  locale: Locale;
}

export async function LocalizedHomePage({ locale }: LocalizedHomePageProps) {
  const timeZone = await getServerTimezone();
  const t = getStrings(locale);
  const copy = getHomeCopy(locale);
  const fixturesHref = localePath(locale, "/fixtures");

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

  const jsonTitle =
    locale === "es"
      ? "Mundial 2026 — Resultados en vivo"
      : locale === "fr"
        ? "Coupe du monde 2026 — Scores en direct"
        : "FIFA World Cup 2026 Live Scores Today";

  return (
    <div className="space-y-14">
      <JsonLd
        data={buildWebPageJsonLd({
          path: localePath(locale),
          title: jsonTitle,
          description: t.homeSubtitle,
        })}
      />

      {locale !== "en" && (
        <div className="card-surface rounded-2xl overflow-hidden">
          <div className="host-stripe" />
          <div className="p-5 sm:p-6">
            <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 mb-2">
              {copy.localeLabel}
            </p>
            <h1 className="section-title text-2xl sm:text-3xl">{t.homeTitle}</h1>
            <p className="text-sm text-zinc-500 mt-2 max-w-2xl">{t.homeSubtitle}</p>
          </div>
        </div>
      )}

      <HomeHero initialTodayMatches={initialMatches} initialUpcomingMatches={nextMatches} />

      <HomeJumpNav />

      <div id="my-teams">
        <MyTeamsMatches matches={initialMatches} />
      </div>

      <section id="live">
      <LiveScores
        initialMatches={initialMatches}
        fixturesHref={fixturesHref}
        labels={{
          title: t.liveScores,
          allFixtures: t.allFixtures,
          live: t.live,
          upcoming: t.upcoming,
          fullTime: t.fullTime,
          noMatchesToday: t.noMatchesToday,
          loadingScores: t.loadingScores,
          autoUpdates: t.autoUpdates,
        }}
      />
      </section>

      <LiveMomentsStrip slides={heroSlides} />

      <LiveNextMatchCountdown initialMatches={nextMatches} />

      {bracket && (
        <div id="bracket">
          <LiveKnockoutBracket initialData={bracket} compact showLink />
        </div>
      )}

      <section id="highlights">
      <MatchHighlights initialHighlights={initialHighlights} />
      </section>

      <IconicMoments limit={9} />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3" id="explore">
        <Link
          href={fixturesHref}
          className="card-surface rounded-2xl p-5 hover:shadow-md transition-all group flex items-center justify-between"
        >
          <div>
            <h3 className="font-bold text-zinc-900 group-hover:text-blue-600 transition-colors">
              {t.fullFixtures}
            </h3>
            <p className="text-sm text-zinc-500 mt-1">{t.fullFixturesDesc}</p>
          </div>
          <ArrowRight size={18} className="text-zinc-300 group-hover:text-blue-600" />
        </Link>
        <Link
          href="/standings"
          className="card-surface rounded-2xl p-5 hover:shadow-md transition-all group flex items-center justify-between"
        >
          <div>
            <h3 className="font-bold text-zinc-900 group-hover:text-blue-600 transition-colors">
              {t.groupTables}
            </h3>
            <p className="text-sm text-zinc-500 mt-1">{t.groupTablesDesc}</p>
          </div>
          <ArrowRight size={18} className="text-zinc-300 group-hover:text-blue-600" />
        </Link>
        <Link
          href="/bracket"
          className="card-surface rounded-2xl p-5 hover:shadow-md transition-all group flex items-center justify-between sm:col-span-2 lg:col-span-1"
        >
          <div>
            <h3 className="font-bold text-zinc-900 group-hover:text-blue-600 transition-colors">
              {t.knockoutBracket}
            </h3>
            <p className="text-sm text-zinc-500 mt-1">{t.knockoutBracketDesc}</p>
          </div>
          <ArrowRight size={18} className="text-zinc-300 group-hover:text-blue-600" />
        </Link>
      </div>

      <MyTeamsPicker />

      <div className="text-center">
        <Link
          href="/my"
          className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--wc-usa)] hover:underline"
        >
          Open My World Cup dashboard →
        </Link>
      </div>

      <TeamJourneyPromo />

      <FeaturedPlayersStrip />

      <section>
        <h2 className="section-title mb-5 flex items-center gap-2">
          <GitBranch size={22} className="text-blue-600" />
          {copy.fanTools}
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Link href="/bracket/predict" className="card-surface rounded-2xl p-5 hover:shadow-md transition-all group">
            <GitBranch size={20} className="text-blue-600 mb-3" />
            <h3 className="font-bold text-zinc-900 group-hover:text-blue-600 transition-colors">
              {copy.bracketPredictor}
            </h3>
            <p className="text-sm text-zinc-500 mt-1">{copy.bracketPredictorDesc}</p>
          </Link>
          <Link href="/scenarios" className="card-surface rounded-2xl p-5 hover:shadow-md transition-all group">
            <Calculator size={20} className="text-violet-600 mb-3" />
            <h3 className="font-bold text-zinc-900 group-hover:text-blue-600 transition-colors">
              {copy.qualificationScenarios}
            </h3>
            <p className="text-sm text-zinc-500 mt-1">{copy.qualificationScenariosDesc}</p>
          </Link>
          <Link href="/watch" className="card-surface rounded-2xl p-5 hover:shadow-md transition-all group">
            <Tv size={20} className="text-emerald-600 mb-3" />
            <h3 className="font-bold text-zinc-900 group-hover:text-blue-600 transition-colors">
              {copy.whereToWatch}
            </h3>
            <p className="text-sm text-zinc-500 mt-1">{copy.whereToWatchDesc}</p>
          </Link>
          <Link href="/leaders" className="card-surface rounded-2xl p-5 hover:shadow-md transition-all group">
            <BarChart3 size={20} className="text-amber-600 mb-3" />
            <h3 className="font-bold text-zinc-900 group-hover:text-blue-600 transition-colors">
              {copy.statLeaders}
            </h3>
            <p className="text-sm text-zinc-500 mt-1">{copy.statLeadersDesc}</p>
          </Link>
          <Link href="/pool" className="card-surface rounded-2xl p-5 hover:shadow-md transition-all group">
            <Users size={20} className="text-rose-600 mb-3" />
            <h3 className="font-bold text-zinc-900 group-hover:text-blue-600 transition-colors">
              {copy.officePool}
            </h3>
            <p className="text-sm text-zinc-500 mt-1">{copy.officePoolDesc}</p>
          </Link>
        </div>
      </section>

      <div className="grid gap-4 sm:grid-cols-2">
        <Link
          href="/rivalries"
          className="card-surface rounded-2xl p-5 hover:shadow-md transition-all group flex items-center justify-between"
        >
          <div>
            <h3 className="font-bold text-zinc-900 group-hover:text-blue-600 transition-colors flex items-center gap-2">
              <Swords size={18} className="text-[var(--wc-usa)]" />
              {copy.rivalries}
            </h3>
            <p className="text-sm text-zinc-500 mt-1">{copy.rivalriesDesc}</p>
          </div>
          <ArrowRight size={18} className="text-zinc-300 group-hover:text-blue-600" />
        </Link>
        <Link
          href="/embed"
          className="card-surface rounded-2xl p-5 hover:shadow-md transition-all group flex items-center justify-between"
        >
          <div>
            <h3 className="font-bold text-zinc-900 group-hover:text-blue-600 transition-colors flex items-center gap-2">
              <Code2 size={18} className="text-blue-600" />
              {copy.embedWidget}
            </h3>
            <p className="text-sm text-zinc-500 mt-1">{copy.embedWidgetDesc}</p>
          </div>
          <ArrowRight size={18} className="text-zinc-300 group-hover:text-blue-600" />
        </Link>
      </div>

      <Link
        href="/cities"
        className="card-surface rounded-2xl p-5 hover:shadow-md transition-all group flex items-center justify-between"
      >
        <div>
          <h3 className="font-bold text-zinc-900 group-hover:text-blue-600 transition-colors flex items-center gap-2">
            <MapPin size={18} className="text-emerald-600" />
            {copy.cityGuides}
          </h3>
          <p className="text-sm text-zinc-500 mt-1">{copy.cityGuidesDesc}</p>
        </div>
        <ArrowRight size={18} className="text-zinc-300 group-hover:text-blue-600" />
      </Link>

      <section>
        <h2 className="section-title mb-5 flex items-center gap-2">
          <TrendingUp size={22} className="text-blue-600" />
          {copy.dailyPuzzles}
        </h2>
        <PuzzleStreakCard />
        <div className="grid gap-4 sm:grid-cols-3 mt-5">
          <Link
            href="/puzzles/guess-player"
            className="group card-surface rounded-2xl p-5 hover:shadow-md transition-all hover:-translate-y-0.5"
          >
            <div className="rounded-xl p-2.5 bg-blue-50 text-blue-600 w-fit mb-4">
              <Puzzle size={22} />
            </div>
            <h3 className="font-bold text-zinc-900 text-base mb-1.5 group-hover:text-blue-600 transition-colors">
              {copy.guessPlayer}
            </h3>
            <p className="text-sm text-zinc-500 leading-relaxed">{copy.guessPlayerDesc}</p>
          </Link>
          <Link
            href="/puzzles/scramble"
            className="group card-surface rounded-2xl p-5 hover:shadow-md transition-all hover:-translate-y-0.5"
          >
            <div className="rounded-xl p-2.5 bg-violet-50 text-violet-600 w-fit mb-4">
              <Puzzle size={22} />
            </div>
            <h3 className="font-bold text-zinc-900 text-base mb-1.5 group-hover:text-blue-600 transition-colors">
              {copy.nameScramble}
            </h3>
            <p className="text-sm text-zinc-500 leading-relaxed">{copy.nameScrambleDesc}</p>
          </Link>
          <Link
            href="/puzzles/quiz"
            className="group card-surface rounded-2xl p-5 hover:shadow-md transition-all hover:-translate-y-0.5"
          >
            <div className="rounded-xl p-2.5 bg-amber-50 text-amber-600 w-fit mb-4">
              <Puzzle size={22} />
            </div>
            <h3 className="font-bold text-zinc-900 text-base mb-1.5 group-hover:text-blue-600 transition-colors">
              {copy.dailyQuiz}
            </h3>
            <p className="text-sm text-zinc-500 leading-relaxed">{copy.dailyQuizDesc}</p>
          </Link>
        </div>
        <Link
          href="/puzzles"
          className="inline-flex items-center gap-1 text-sm text-blue-600 font-medium mt-4 hover:underline"
        >
          {copy.viewAllPuzzles} <ArrowRight size={14} />
        </Link>
      </section>

      <section>
        <h2 className="section-title mb-5 flex items-center gap-2">
          <History size={22} className="text-[var(--wc-gold)]" />
          {copy.worldCupHistory}
        </h2>
        <Link
          href="/history"
          className="group card-surface rounded-2xl p-6 sm:p-8 hover:shadow-md transition-all block relative overflow-hidden"
        >
          <div className="host-stripe absolute top-0 left-0 right-0" />
          <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 mb-2">
                1930 — 2022
              </p>
              <h3 className="text-xl font-bold text-zinc-900 group-hover:text-[var(--wc-usa)] transition-colors">
                {copy.historyTitle}
              </h3>
              <p className="text-sm text-zinc-500 mt-2 max-w-lg leading-relaxed">{copy.historyDesc}</p>
            </div>
            <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--wc-usa)] shrink-0">
              {copy.browseHistory}{" "}
              <ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
            </span>
          </div>
        </Link>
      </section>

      <section className="card-elevated rounded-2xl p-8 sm:p-10 text-center relative overflow-hidden">
        <div className="host-stripe absolute top-0 left-0 right-0" />
        <div className="absolute inset-0 bg-gradient-to-b from-blue-50/50 to-transparent pointer-events-none" />
        <Trophy className="mx-auto text-blue-600 mb-3 relative mt-1" size={36} />
        <h2 className="text-xl font-bold text-zinc-900 mb-2 relative">{t.exploreTournament}</h2>
        <p className="text-zinc-500 text-sm max-w-sm mx-auto mb-6 relative leading-relaxed">
          {copy.exploreSubtitle}
        </p>
        <div className="flex flex-wrap justify-center gap-3 relative">
          <Link href={fixturesHref} className="btn-primary inline-flex items-center gap-2 px-5 py-2.5 text-sm">
            <Calendar size={16} />
            {copy.fixturesBtn}
          </Link>
          <Link href="/standings" className="btn-usa inline-flex items-center gap-2 px-5 py-2.5 text-sm">
            <Table2 size={16} />
            {copy.standingsBtn}
          </Link>
        </div>
      </section>
    </div>
  );
}
