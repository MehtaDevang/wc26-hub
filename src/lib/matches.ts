import type { Match, MatchDetail, Highlight, NewsArticle, NewsArticleDetail } from "./types";
import { fetchJson } from "./fetch-json";
import { detectBrowserTimezone } from "./timezone";

export async function fetchMatches(params?: {
  date?: "today" | string;
  range?: "group-stage" | "full" | "recent";
  timeZone?: string;
}): Promise<Match[]> {
  const search = new URLSearchParams();
  if (params?.date) search.set("date", params.date);
  if (params?.range) search.set("range", params.range);
  search.set("tz", params?.timeZone ?? detectBrowserTimezone());

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

export async function fetchNews(limit = 8): Promise<NewsArticle[]> {
  const data = await fetchJson<{ articles: NewsArticle[] }>(`/api/news?limit=${limit}`, {
    timeoutMs: 15_000,
  });
  return data.articles ?? [];
}

export async function fetchNewsArticle(id: string): Promise<NewsArticleDetail> {
  const data = await fetchJson<{ article: NewsArticleDetail }>(`/api/news/${id}`, {
    timeoutMs: 15_000,
  });
  if (!data.article) throw new Error("Article not found");
  return data.article;
}
