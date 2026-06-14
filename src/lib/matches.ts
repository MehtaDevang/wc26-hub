import type { Match, MatchDetail, Highlight } from "./types";
import { fetchJson } from "./fetch-json";

export async function fetchMatches(params?: {
  date?: "today" | string;
  range?: "group-stage" | "recent";
}): Promise<Match[]> {
  const search = new URLSearchParams();
  if (params?.date) search.set("date", params.date);
  if (params?.range) search.set("range", params.range);

  const data = await fetchJson<{ matches: Match[] }>(`/api/matches?${search}`);
  return data.matches ?? [];
}

export async function fetchMatchDetail(id: string): Promise<{
  match: Match;
  detail: MatchDetail;
  highlights: Highlight[];
}> {
  return fetchJson(`/api/matches/${id}`);
}

export async function fetchHighlights(): Promise<Highlight[]> {
  const data = await fetchJson<{ highlights: Highlight[] }>("/api/highlights", {
    timeoutMs: 20_000,
  });
  return data.highlights ?? [];
}
