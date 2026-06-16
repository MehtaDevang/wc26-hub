import {
  fetchEspnScoreboard,
  fetchEspnSummary,
  fetchEspnNews,
  fetchEspnNewsArticle,
} from "./client";
import { transformEvents, transformEvent, goalsToHighlights } from "./transform";
import { extractMomentHighlights } from "./highlight-images";
import {
  todayEspnDateInTimezone,
  todayDateKey,
  shiftDateKey,
  dateKeyToEspn,
  filterMatchesForScoreboardToday,
  formatEspnDateInTimezone,
  DEFAULT_TIMEZONE,
} from "../timezone";
import type { Match, Highlight, NewsArticle, NewsArticleDetail } from "../types";
import { buildKnockoutBracket } from "./bracket";
import { fetchAllGroupStandings } from "./standings";
import { transformNewsResponse, transformNewsDetail } from "./news";

const ESPN_TIMEOUT_MS = 8_000;

async function withTimeout<T>(promise: Promise<T>, ms = ESPN_TIMEOUT_MS): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error("ESPN request timed out")), ms)
    ),
  ]);
}

export async function getTodayMatches(
  timeZone: string = DEFAULT_TIMEZONE
): Promise<Match[]> {
  const localToday = todayDateKey(timeZone);
  const yesterday = shiftDateKey(localToday, -1);
  const tomorrow = shiftDateKey(localToday, 1);
  const data = await withTimeout(
    fetchEspnScoreboard({
      dates: `${dateKeyToEspn(yesterday)}-${dateKeyToEspn(tomorrow)}`,
    })
  );
  const matches = transformEvents(data.events ?? [], timeZone);
  return filterMatchesForScoreboardToday(matches, localToday, timeZone);
}

export async function getNextUpcomingMatches(
  limit = 2,
  timeZone: string = DEFAULT_TIMEZONE
): Promise<Match[]> {
  const today = todayEspnDateInTimezone(timeZone);
  const data = await withTimeout(
    fetchEspnScoreboard({ dates: `${today}-20260719` })
  );
  const now = Date.now();

  return transformEvents(data.events ?? [], timeZone)
    .filter(
      (match) =>
        match.status === "upcoming" &&
        match.kickoffAt &&
        new Date(match.kickoffAt).getTime() > now
    )
    .sort(
      (a, b) =>
        new Date(a.kickoffAt).getTime() - new Date(b.kickoffAt).getTime()
    )
    .slice(0, limit);
}

export async function getMatchesByParams(params: {
  date?: string | null;
  range?: string | null;
  timeZone?: string;
}): Promise<Match[]> {
  const timeZone = params.timeZone ?? DEFAULT_TIMEZONE;
  let dates: string | undefined;

  if (params.range === "group-stage") {
    dates = "20260611-20260627";
  } else if (params.range === "full") {
    dates = "20260611-20260719";
  } else if (params.date === "today") {
    const localToday = todayDateKey(timeZone);
    const yesterday = shiftDateKey(localToday, -1);
    const tomorrow = shiftDateKey(localToday, 1);
    dates = `${dateKeyToEspn(yesterday)}-${dateKeyToEspn(tomorrow)}`;
  } else if (params.date) {
    dates = params.date.replace(/-/g, "");
  } else if (params.range === "recent") {
    const end = new Date();
    const start = new Date();
    start.setDate(start.getDate() - 3);
    dates = `${formatEspnDateInTimezone(start, timeZone)}-${formatEspnDateInTimezone(end, timeZone)}`;
  }

  const data = await withTimeout(
    fetchEspnScoreboard(dates ? { dates } : undefined)
  );
  const matches = transformEvents(data.events ?? [], timeZone);

  if (params.date === "today") {
    return filterMatchesForScoreboardToday(matches, todayDateKey(timeZone), timeZone);
  }

  return matches;
}

function sortHighlights(highlights: Highlight[]): Highlight[] {
  return [...highlights].sort((a, b) => {
    if (a.type === "goal" && b.type !== "goal") return -1;
    if (b.type === "goal" && a.type !== "goal") return 1;
    if (a.imageUrl && !b.imageUrl) return -1;
    if (b.imageUrl && !a.imageUrl) return 1;
    return 0;
  });
}

export async function getRecentHighlights(
  limit = 6,
  timeZone: string = DEFAULT_TIMEZONE
): Promise<Highlight[]> {
  const end = new Date();
  const start = new Date();
  start.setDate(start.getDate() - 4);

  const data = await withTimeout(
    fetchEspnScoreboard({
      dates: `${formatEspnDateInTimezone(start, timeZone)}-${formatEspnDateInTimezone(end, timeZone)}`,
    })
  );

  const finished = (data.events ?? [])
    .filter((e) => e.competitions[0]?.status.type.state === "post")
    .slice(-6)
    .reverse();

  const results = await Promise.allSettled(
    finished.map(async (event) => {
      const match = transformEvent(event, timeZone);
      const summary = await withTimeout(fetchEspnSummary(event.id), 6_000);
      const goals = goalsToHighlights(match, summary);
      const usedUrls = new Set(
        goals.map((g) => g.imageUrl).filter((url): url is string => !!url)
      );
      const moments = extractMomentHighlights(match, summary, usedUrls, 3);
      return { goals, moments };
    })
  );

  const goals: Highlight[] = [];
  const moments: Highlight[] = [];

  for (const result of results) {
    if (result.status !== "fulfilled") continue;
    goals.push(...result.value.goals);
    moments.push(...result.value.moments);
  }

  const combined = sortHighlights([...goals, ...moments]);
  return combined.slice(0, limit);
}

export async function getKnockoutBracket(
  timeZone: string = DEFAULT_TIMEZONE
): Promise<ReturnType<typeof buildKnockoutBracket>> {
  const [data, standings] = await Promise.all([
    withTimeout(fetchEspnScoreboard({ dates: "20260611-20260719" })),
    withTimeout(fetchAllGroupStandings()).catch(() => [] as Awaited<ReturnType<typeof fetchAllGroupStandings>>),
  ]);
  const matches = transformEvents(data.events ?? [], timeZone);
  return buildKnockoutBracket(matches, standings);
}

export async function getWorldCupNews(limit = 8): Promise<NewsArticle[]> {
  const data = await withTimeout(fetchEspnNews(Math.max(limit, 12)));
  return transformNewsResponse(data, limit);
}

export async function getWorldCupNewsArticle(id: string): Promise<NewsArticleDetail | null> {
  const data = await withTimeout(fetchEspnNewsArticle(id));
  return transformNewsDetail(data);
}
