import {
  fetchEspnScoreboard,
  fetchEspnSummary,
  todayEspnDate,
  formatEspnDate,
} from "./client";
import { transformEvents, transformEvent, goalsToHighlights } from "./transform";
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
      return goalsToHighlights(match, summary);
    })
  );

  const highlights: Highlight[] = [];
  for (const result of results) {
    if (result.status === "fulfilled") {
      highlights.push(...result.value);
      if (highlights.length >= limit) break;
    }
  }

  return highlights.slice(0, limit);
}
