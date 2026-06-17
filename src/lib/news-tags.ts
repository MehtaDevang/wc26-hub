import { TEAMS } from "./data";
import type { NewsArticle } from "./types";

/** Infer team codes mentioned in a headline or summary. */
export function inferNewsTeamCodes(text: string): string[] {
  const lower = text.toLowerCase();
  const found: string[] = [];

  for (const [code, team] of Object.entries(TEAMS)) {
    const name = team.name.toLowerCase();
    if (lower.includes(name) || lower.includes(code.toLowerCase())) {
      found.push(code);
    }
  }

  return [...new Set(found)];
}

export function newsMatchesTeams(article: NewsArticle, teamCodes: string[]): boolean {
  if (teamCodes.length === 0) return true;
  const text = `${article.headline} ${article.summary}`;
  const inferred = inferNewsTeamCodes(text);
  return teamCodes.some((code) => inferred.includes(code.toUpperCase()));
}

export function filterNewsArticles(
  articles: NewsArticle[],
  options: {
    filter?: "all" | "exclusive" | "video";
    team?: string;
  }
): NewsArticle[] {
  let result = articles;

  if (options.filter === "exclusive") {
    result = result.filter((a) => a.isOriginal);
  } else if (options.filter === "video") {
    result = result.filter((a) => a.type === "video");
  }

  if (options.team) {
    result = result.filter((a) => newsMatchesTeams(a, [options.team!]));
  }

  return result;
}

export function getNewsForMatch(
  articles: NewsArticle[],
  homeCode: string,
  awayCode: string,
  limit = 4
): NewsArticle[] {
  return articles
    .filter((a) => newsMatchesTeams(a, [homeCode, awayCode]))
    .slice(0, limit);
}
