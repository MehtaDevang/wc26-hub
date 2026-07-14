import { cache } from "react";
import { Radio, GitBranch } from "lucide-react";
import { LiveScores } from "@/components/LiveScores";
import { LiveKnockoutBracket } from "@/components/LiveKnockoutBracket";
import { HomeDashboardPanel } from "@/components/home/HomeDashboardPanel";
import { HomeGoldenBootStrip } from "@/components/home/HomeGoldenBootStrip";
import { MatchHighlights } from "@/components/MatchHighlights";
import { LatestFifaNews } from "@/components/LatestFifaNews";
import { LiveMomentsStrip } from "@/components/LiveMomentsStrip";
import { LiveNextMatchCountdown } from "@/components/LiveNextMatchCountdown";
import { MyTeamsMatches } from "@/components/MyTeamsMatches";
import { LiveHomeHeroSpotlight } from "@/components/LiveHomeHeroSpotlight";
import { FeaturedPlayersStrip } from "@/components/FeaturedPlayersStrip";
import { PlayerOfTheDayCard } from "@/components/PlayerOfTheDayCard";
import { buildHeroSlides } from "@/lib/hero-background";
import { getServerTimezone } from "@/lib/timezone";
import { getTournamentLeaders } from "@/lib/espn/tournament-stats";
import { pickPlayerOfTheDay } from "@/lib/player-of-the-day";
import {
  getKnockoutBracket,
  getMatchesByParams,
  getNextUpcomingMatches,
  getRecentHighlights,
  getTodayMatches,
  getWorldCupNews,
} from "@/lib/espn/services";
import { fetchEspnScoreboard } from "@/lib/espn/client";
import { transformEvents } from "@/lib/espn/transform";
import { pickRecentFinishedMatches } from "@/lib/upcoming-matches";
import { getFinaleState, type FinaleState } from "@/lib/tournament-stage";
import { HomeFinaleHero } from "@/components/home/HomeFinaleHero";
import { HomeFinalFour } from "@/components/home/HomeFinalFour";
import { getStrings, localePath, type Locale } from "@/lib/i18n";
import type { Match } from "@/lib/types";

const getHomeTimezone = cache(getServerTimezone);

const loadTodayMatches = cache(async () => {
  const timeZone = await getHomeTimezone();
  try {
    return await getTodayMatches(timeZone);
  } catch {
    return [];
  }
});

const loadNextMatches = cache(async () => {
  const timeZone = await getHomeTimezone();
  try {
    return await getNextUpcomingMatches(2, timeZone);
  } catch {
    return [];
  }
});

const loadHighlights = cache(async () => {
  const timeZone = await getHomeTimezone();
  try {
    return await getRecentHighlights(12, timeZone);
  } catch {
    return [];
  }
});

const loadBracket = cache(async () => {
  const timeZone = await getHomeTimezone();
  try {
    return await getKnockoutBracket(timeZone);
  } catch {
    return null;
  }
});

const loadNews = cache(async () => {
  try {
    return await getWorldCupNews(8);
  } catch {
    return [];
  }
});

const loadFullMatches = cache(async () => {
  const timeZone = await getHomeTimezone();
  try {
    return await getMatchesByParams({ range: "full", timeZone });
  } catch {
    return [];
  }
});

const loadSemiFinalFixtures = cache(async () => {
  const timeZone = await getHomeTimezone();
  try {
    const data = await fetchEspnScoreboard({ dates: "20260714-20260715" });
    return transformEvents(data.events ?? [], timeZone);
  } catch {
    return [];
  }
});

export interface HomeFinaleData {
  state: FinaleState;
  initialTodayMatches: Match[];
  initialUpcomingMatches: Match[];
  initialRecentFinished: Match[];
  semiFinalFixtures: Match[];
}

/**
 * Server-side finale detection + the match data the finale hero needs.
 * Reuses the cached home loaders so this adds no extra fetches per request.
 */
export async function getHomeFinaleData(): Promise<HomeFinaleData> {
  const [bracket, todayMatches, upcomingMatches, fullMatches, semiFinalFixtures] =
    await Promise.all([
      loadBracket(),
      loadTodayMatches(),
      loadNextMatches(),
      loadFullMatches(),
      loadSemiFinalFixtures(),
    ]);

  const state = getFinaleState(bracket);

  return {
    state,
    initialTodayMatches: todayMatches,
    initialUpcomingMatches: upcomingMatches,
    initialRecentFinished: pickRecentFinishedMatches(fullMatches, 1, true),
    semiFinalFixtures: state.stage === "semi" ? semiFinalFixtures : [],
  };
}

export function HomeFinaleHeroSection({ data }: { data: HomeFinaleData }) {
  const { state } = data;
  return (
    <HomeFinaleHero
      stage={state.stage}
      stageLabel={state.stageLabel}
      initialTodayMatches={data.initialTodayMatches}
      initialUpcomingMatches={data.initialUpcomingMatches}
      initialRecentFinished={data.initialRecentFinished}
      semiFinals={state.semiFinals}
      finalMatch={state.finalMatch}
      champion={state.champion}
    />
  );
}

export async function HomeFinalFourSection({ state }: { state: FinaleState }) {
  const leaders = await loadLeaders();
  return <HomeFinalFour state={state} scorers={leaders?.scorers ?? []} />;
}

export async function HomeHeroSpotlightSection() {
  const [todayMatches, upcomingMatches, fullMatches] = await Promise.all([
    loadTodayMatches(),
    loadNextMatches(),
    loadFullMatches(),
  ]);

  const recentFinished = pickRecentFinishedMatches(fullMatches, 1, true);

  return (
    <LiveHomeHeroSpotlight
      initialTodayMatches={todayMatches}
      initialUpcomingMatches={upcomingMatches}
      initialRecentFinished={recentFinished}
    />
  );
}

export async function HomeMyTeamsSection() {
  const matches = await loadTodayMatches();
  return (
    <div id="my-teams">
      <MyTeamsMatches matches={matches} />
    </div>
  );
}

export async function HomeDashboardScoresSection({
  locale,
  maxItems = 6,
}: {
  locale: Locale;
  maxItems?: number;
}) {
  const t = getStrings(locale);
  const fixturesHref = localePath(locale, "/fixtures");
  const matches = await loadTodayMatches();
  const liveCount = matches.filter((m) => m.status === "live").length;

  return (
    <HomeDashboardPanel
      title={t.liveScores}
      subtitle={liveCount > 0 ? `${liveCount} live now` : "Today's knockout matches"}
      icon={Radio}
      accent="scores"
      href={fixturesHref}
      hrefLabel="All fixtures"
    >
      <LiveScores
        embedded
        initialMatches={matches}
        fixturesHref={fixturesHref}
        compact
        maxItems={maxItems}
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
    </HomeDashboardPanel>
  );
}

export async function HomeDashboardBracketSection() {
  const bracket = await loadBracket();
  if (!bracket) return null;

  const activeRound = bracket.rounds.find((r) => r.id === bracket.activeRound);
  const subtitle = [
    `${bracket.finishedMatches}/${bracket.totalMatches} played`,
    activeRound ? `Now: ${activeRound.label}` : null,
  ]
    .filter(Boolean)
    .join(" · ");

  return (
    <HomeDashboardPanel
      title="Knockout Bracket"
      subtitle={subtitle}
      icon={GitBranch}
      accent="bracket"
      href="/bracket"
      hrefLabel="Full bracket"
    >
      <LiveKnockoutBracket initialData={bracket} compact embedded showLink={false} />
    </HomeDashboardPanel>
  );
}

export async function HomeLiveScoresSection({
  locale,
  compact = false,
  maxItems,
}: {
  locale: Locale;
  compact?: boolean;
  maxItems?: number;
}) {
  const t = getStrings(locale);
  const fixturesHref = localePath(locale, "/fixtures");
  const matches = await loadTodayMatches();

  return (
    <section id="live">
      <LiveScores
        initialMatches={matches}
        fixturesHref={fixturesHref}
        compact={compact}
        maxItems={maxItems}
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
  );
}

export async function HomeMomentsSection() {
  const highlights = await loadHighlights();
  const slides = buildHeroSlides(highlights);
  return <LiveMomentsStrip slides={slides} />;
}

export async function HomeNextMatchSection() {
  const nextMatches = await loadNextMatches();
  return <LiveNextMatchCountdown initialMatches={nextMatches} />;
}

export async function HomeBracketSection() {
  const bracket = await loadBracket();
  if (!bracket) return null;

  return (
    <div id="bracket">
      <LiveKnockoutBracket initialData={bracket} compact showLink />
    </div>
  );
}

export async function HomeHighlightsSection() {
  const highlights = await loadHighlights();
  return (
    <section id="highlights">
      <MatchHighlights initialHighlights={highlights.slice(0, 6)} />
    </section>
  );
}

export async function HomeGoldenBootSection({
  variant = "default",
}: {
  variant?: "default" | "finale";
} = {}) {
  const leaders = await loadLeaders();
  if (!leaders?.scorers.length) return null;
  return <HomeGoldenBootStrip scorers={leaders.scorers.slice(0, 3)} variant={variant} />;
}

export async function HomeNewsSection({ limit = 4 }: { limit?: number }) {
  const news = await loadNews();
  return (
    <section id="news">
      <LatestFifaNews initialArticles={news.slice(0, limit)} />
    </section>
  );
}

const loadLeaders = cache(async () => {
  try {
    return await getTournamentLeaders();
  } catch {
    return null;
  }
});

export async function HomePlayerOfTheDaySection() {
  const leaders = await loadLeaders();
  const potd = pickPlayerOfTheDay(leaders);
  if (!potd) return null;
  return <PlayerOfTheDayCard data={potd} />;
}

export async function HomeFeaturedPlayersSection() {
  return <FeaturedPlayersStrip />;
}

export function HomeSectionSkeleton({
  height = 160,
  className = "",
}: {
  height?: number;
  className?: string;
}) {
  return (
    <div
      className={`animate-pulse rounded-2xl bg-zinc-100/80 ${className}`}
      style={{ height }}
      aria-hidden
    />
  );
}
