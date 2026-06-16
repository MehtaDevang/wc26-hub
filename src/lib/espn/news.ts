import type {
  EspnNewsArticle,
  EspnNewsDetailHeadline,
  EspnNewsDetailResponse,
  EspnNewsResponse,
} from "./client";
import { buildNewsSummary } from "../news-summary";
import type { NewsArticle, NewsArticleDetail } from "../types";

function pickImage(article: Pick<EspnNewsArticle, "images" | "headline">): {
  url?: string;
  alt?: string;
} {
  const images = article.images ?? [];
  const header = images.find((img) => img.type === "header" && img.url);
  const photo = images.find((img) => img.url && !img.type?.toLowerCase().includes("media"));
  const fallback = images.find((img) => img.url);
  const chosen = header ?? photo ?? fallback;

  return {
    url: chosen?.url,
    alt: chosen?.caption ?? chosen?.name ?? article.headline,
  };
}

function mapArticleType(type?: string): NewsArticle["type"] {
  if (type === "Media") return "video";
  if (type === "Story") return "story";
  return "other";
}

function buildArticleFields(article: EspnNewsArticle): Omit<NewsArticle, "id"> | null {
  const headline = article.headline?.trim();
  if (!headline || article.id == null) return null;

  const type = mapArticleType(article.type);
  const image = pickImage(article);
  const description = article.description?.trim();

  return {
    headline,
    summary: buildNewsSummary(headline, description, type),
    imageUrl: image.url,
    imageAlt: image.alt,
    publishedAt: article.published ?? article.lastModified ?? new Date().toISOString(),
    type,
    sourceUrl: article.links?.web?.href,
  };
}

export function transformNewsArticle(article: EspnNewsArticle): NewsArticle | null {
  const fields = buildArticleFields(article);
  if (!fields) return null;

  return {
    id: String(article.id),
    ...fields,
  };
}

export function transformNewsDetail(response: EspnNewsDetailResponse): NewsArticleDetail | null {
  const raw = response.headlines?.[0];
  if (!raw) return null;

  const base = transformNewsArticle(raw);
  if (!base) return null;

  const videoThumb = raw.video?.[0]?.thumbnail;

  return {
    ...base,
    byline: raw.byline?.trim() || undefined,
    imageUrl: base.imageUrl ?? videoThumb,
  };
}

export function transformNewsResponse(response: EspnNewsResponse, limit = 8): NewsArticle[] {
  const seen = new Set<string>();
  const articles: NewsArticle[] = [];

  for (const raw of response.articles ?? []) {
    const article = transformNewsArticle(raw);
    if (!article || seen.has(article.id)) continue;
    seen.add(article.id);
    articles.push(article);
    if (articles.length >= limit) break;
  }

  return articles;
}

export type { EspnNewsDetailHeadline };
