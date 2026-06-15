import { fetchEspnScoreboard, fetchEspnSummary } from "./client";
import { transformEvent } from "./transform";
import type { BroadcastInfo, Match } from "../types";

export interface WatchMatchEntry {
  match: Match;
  broadcasts: BroadcastInfo[];
}

async function mapWithConcurrency<T, R>(
  items: T[],
  limit: number,
  fn: (item: T) => Promise<R>
): Promise<R[]> {
  const results: R[] = new Array(items.length);
  let index = 0;

  async function worker() {
    while (index < items.length) {
      const current = index++;
      results[current] = await fn(items[current]);
    }
  }

  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, () => worker()));
  return results;
}

function transformBroadcastsFromSummary(summary: Awaited<ReturnType<typeof fetchEspnSummary>>): BroadcastInfo[] {
  const raw = summary.broadcasts ?? summary.header?.competitions?.[0]?.broadcasts ?? [];
  return raw.map((b) => ({
    network: b.media?.name ?? b.media?.shortName ?? b.media?.callLetters ?? "TV",
    type: b.type?.shortName ?? "TV",
  }));
}

export async function getWatchGuideMatches(
  timeZone: string,
  options: { daysAhead?: number; includeFinished?: boolean } = {}
): Promise<WatchMatchEntry[]> {
  const daysAhead = options.daysAhead ?? 14;
  const data = await fetchEspnScoreboard({ dates: "20260611-20260719" });
  const now = Date.now();
  const horizon = now + daysAhead * 24 * 60 * 60 * 1000;

  const candidates = (data.events ?? [])
    .map((event) => transformEvent(event, timeZone))
    .filter((match) => {
      if (!match.kickoffAt) return false;
      const kickoff = new Date(match.kickoffAt).getTime();
      if (match.status === "upcoming" || match.status === "live") {
        return kickoff <= horizon;
      }
      if (options.includeFinished && match.status === "finished") {
        return kickoff >= now - 2 * 24 * 60 * 60 * 1000;
      }
      return false;
    })
    .sort((a, b) => new Date(a.kickoffAt).getTime() - new Date(b.kickoffAt).getTime())
    .slice(0, 40);

  const eventIds = new Map<string, string>();
  for (const event of data.events ?? []) {
    eventIds.set(String(event.id), String(event.id));
  }

  const entries = await mapWithConcurrency(candidates, 6, async (match) => {
    try {
      const summary = await fetchEspnSummary(match.id);
      const broadcasts = transformBroadcastsFromSummary(summary);
      return { match, broadcasts };
    } catch {
      return { match, broadcasts: [] as BroadcastInfo[] };
    }
  });

  return entries;
}

export function groupWatchEntriesByDate(entries: WatchMatchEntry[]): Map<string, WatchMatchEntry[]> {
  const map = new Map<string, WatchMatchEntry[]>();
  for (const entry of entries) {
    const date = entry.match.date;
    const list = map.get(date) ?? [];
    list.push(entry);
    map.set(date, list);
  }
  return map;
}
