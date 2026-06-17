import { cache } from "react";
import { LiveScores } from "@/components/LiveScores";
import { MatchHighlights } from "@/components/MatchHighlights";
import { LatestFifaNews } from "@/components/LatestFifaNews";
import { LiveMomentsStrip } from "@/components/LiveMomentsStrip";
import { LiveNextMatchCountdown } from "@/components/LiveNextMatchCountdown";
import { LiveKnockoutBracket } from "@/components/LiveKnockoutBracket";
import { MyTeamsMatches } from "@/components/MyTeamsMatches";
import { LiveHomeHeroSpotlight } from "@/components/LiveHomeHeroSpotlight";
import { FeaturedPlayersStrip } from "@/components/FeaturedPlayersStrip";
import { buildHeroSlides } from "@/lib/hero-background";
import { getServerTimezone } from "@/lib/timezone";
import {
  getKnockoutBracket,
  getNextUpcomingMatches,
  getRecentHighlights,
  getTodayMatches,
  getWorldCupNews,
} from "@/lib/espn/services";
import { getStrings, localePath, type Locale } from "@/lib/i18n";

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

export async function HomeHeroSpotlightSection() {
  const [todayMatches, upcomingMatches] = await Promise.all([
    loadTodayMatches(),
    loadNextMatches(),
  ]);

  return (
    <LiveHomeHeroSpotlight
      initialTodayMatches={todayMatches}
      initialUpcomingMatches={upcomingMatches}
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

export async function HomeLiveScoresSection({ locale }: { locale: Locale }) {
  const t = getStrings(locale);
  const fixturesHref = localePath(locale, "/fixtures");
  const matches = await loadTodayMatches();

  return (
    <section id="live">
      <LiveScores
        initialMatches={matches}
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

export async function HomeNewsSection() {
  const news = await loadNews();
  return (
    <section id="news">
      <LatestFifaNews initialArticles={news} />
    </section>
  );
}

export async function HomeFeaturedPlayersSection() {
  return <FeaturedPlayersStrip />;
}

export function HomeSectionSkeleton({ height = 160 }: { height?: number }) {
  return (
    <div
      className="animate-pulse rounded-2xl bg-zinc-100/80"
      style={{ height }}
      aria-hidden
    />
  );
}
