import {
  fetchEspnScoreboard,
  fetchEspnSummary,
  todayEspnDate,
  formatEspnDate,
} from "./client";
import { transformEvents, transformEvent, goalsToHighlights } from "./transform";
import { extractMomentHighlights } from "./highlight-images";
import type { Match, Highlight } from "../types";

const ESPN_TIMEOUT_MS = 8_000;

async function withTimeout<T>(promise: Promise<T>, ms = ESPN_TIMEOUT_MS): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error("ESPN request timed out")), ms)
    ),
  ]);
}

export async function getTodayMatches(): Promise<Match[]> {
  const data = await withTimeout(
    fetchEspnScoreboard({ dates: todayEspnDate() })
  );
  return transformEvents(data.events ?? []);
}

export async function getMatchesByParams(params: {
  date?: string | null;
  range?: string | null;
}): Promise<Match[]> {
  let dates: string | undefined;

  if (params.range === "group-stage") {
    dates = "20260611-20260627";
  } else if (params.range === "full") {
    dates = "20260611-20260719";
  } else if (params.date === "today") {
    dates = todayEspnDate();
  } else if (params.date) {
    dates = params.date.replace(/-/g, "");
  } else if (params.range === "recent") {
    const end = new Date();
    const start = new Date();
    start.setDate(start.getDate() - 3);
    dates = `${formatEspnDate(start)}-${formatEspnDate(end)}`;
  }

  const data = await withTimeout(
    fetchEspnScoreboard(dates ? { dates } : undefined)
  );
  return transformEvents(data.events ?? []);
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

export async function getRecentHighlights(limit = 6): Promise<Highlight[]> {
  const end = new Date();
  const start = new Date();
  start.setDate(start.getDate() - 4);

  const data = await withTimeout(
    fetchEspnScoreboard({
      dates: `${formatEspnDate(start)}-${formatEspnDate(end)}`,
    })
  );

  const finished = (data.events ?? [])
    .filter((e) => e.competitions[0]?.status.type.state === "post")
    .slice(-6)
    .reverse();

  const results = await Promise.allSettled(
    finished.map(async (event) => {
      const match = transformEvent(event);
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
