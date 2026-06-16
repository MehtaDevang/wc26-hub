import type {
  EspnNewsArticle,
  EspnNewsDetailHeadline,
  EspnNewsDetailResponse,
  EspnNewsResponse,
  EspnNewsVideo,
} from "./client";
import { sanitizeNewsHtml } from "../news-html";
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

function pickVideoUrl(video?: EspnNewsVideo): string | undefined {
  if (!video?.links) return undefined;
  return (
    video.links.source?.HD?.href ??
    video.links.source?.full?.href ??
    video.links.source?.href ??
    video.links.mobile?.source?.href
  );
}

export function transformNewsArticle(article: EspnNewsArticle): NewsArticle | null {
  const headline = article.headline?.trim();
  if (!headline || article.id == null) return null;

  const image = pickImage(article);

  return {
    id: String(article.id),
    headline,
    description: article.description?.trim() || undefined,
    imageUrl: image.url,
    imageAlt: image.alt,
    publishedAt: article.published ?? article.lastModified ?? new Date().toISOString(),
    type: mapArticleType(article.type),
  };
}

export function transformNewsDetail(response: EspnNewsDetailResponse): NewsArticleDetail | null {
  const raw = response.headlines?.[0];
  if (!raw) return null;

  const base = transformNewsArticle(raw);
  if (!base) return null;

  const story = raw.story?.trim();
  const video = raw.video?.[0];
  const videoUrl = pickVideoUrl(video);

  return {
    ...base,
    byline: raw.byline?.trim() || undefined,
    bodyHtml: story ? sanitizeNewsHtml(story) : undefined,
    videoUrl,
    imageUrl: base.imageUrl ?? video?.thumbnail,
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
