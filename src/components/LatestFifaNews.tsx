"use client";

import { useState, useEffect, useCallback } from "react";
import { Loader2, Newspaper, Play, RefreshCw } from "lucide-react";
import { fetchNews } from "@/lib/matches";
import { NewsArticleModal } from "@/components/NewsArticleModal";
import type { NewsArticle } from "@/lib/types";

const REFRESH_MS = 5 * 60_000;

function formatRelativeTime(iso: string): string {
  const diffMs = Date.now() - new Date(iso).getTime();
  const minutes = Math.round(diffMs / 60_000);
  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.round(hours / 24);
  return `${days}d ago`;
}

function typeLabel(type: NewsArticle["type"]): string {
  if (type === "video") return "Video";
  if (type === "story") return "Story";
  return "News";
}

function NewsCard({
  article,
  onOpen,
}: {
  article: NewsArticle;
  onOpen: (article: NewsArticle) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onOpen(article)}
      className="group flex gap-4 rounded-2xl border border-zinc-100 bg-white p-4 text-left shadow-sm hover:border-blue-200 hover:shadow-md transition-all cursor-pointer w-full"
    >
      <div className="relative h-20 w-28 sm:h-24 sm:w-36 shrink-0 overflow-hidden rounded-xl bg-zinc-100">
        {article.imageUrl ? (
          <img
            src={article.imageUrl}
            alt={article.imageAlt ?? ""}
            className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-zinc-300">
            <Newspaper size={28} />
          </div>
        )}
        {article.type === "video" && (
          <span className="absolute bottom-1.5 right-1.5 inline-flex items-center gap-0.5 rounded-md bg-black/70 px-1.5 py-0.5 text-[10px] font-bold text-white">
            <Play size={10} fill="currentColor" />
            Video
          </span>
        )}
      </div>

      <div className="min-w-0 flex-1">
        <div className="mb-1.5 flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-zinc-500">
            {typeLabel(article.type)}
          </span>
          <span className="text-[11px] text-zinc-400">{formatRelativeTime(article.publishedAt)}</span>
        </div>
        <h3 className="font-bold text-sm sm:text-base text-zinc-900 leading-snug line-clamp-2 group-hover:text-blue-600 transition-colors">
          {article.headline}
        </h3>
        {article.description && (
          <p className="mt-1.5 text-xs sm:text-sm text-zinc-500 leading-relaxed line-clamp-2">
            {article.description}
          </p>
        )}
        <span className="mt-2 inline-block text-[11px] font-semibold text-blue-600">
          Read more →
        </span>
      </div>
    </button>
  );
}

interface LatestFifaNewsProps {
  initialArticles?: NewsArticle[];
  limit?: number;
}

export function LatestFifaNews({ initialArticles, limit = 8 }: LatestFifaNewsProps) {
  const [articles, setArticles] = useState<NewsArticle[]>(initialArticles ?? []);
  const [loading, setLoading] = useState(initialArticles === undefined);
  const [error, setError] = useState("");
  const [lastUpdated, setLastUpdated] = useState<Date | null>(
    initialArticles?.length ? new Date() : null
  );
  const [selected, setSelected] = useState<NewsArticle | null>(null);

  const loadNews = useCallback(async (showSpinner = false) => {
    if (showSpinner) setLoading(true);
    setError("");
    try {
      const data = await fetchNews(limit);
      setArticles(data);
      setLastUpdated(new Date());
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load news");
    } finally {
      setLoading(false);
    }
  }, [limit]);

  useEffect(() => {
    if (initialArticles === undefined) {
      loadNews(true);
    } else {
      loadNews(false);
    }
  }, [initialArticles, loadNews]);

  useEffect(() => {
    const interval = setInterval(() => loadNews(false), REFRESH_MS);
    return () => clearInterval(interval);
  }, [loadNews]);

  const showSpinner = loading && articles.length === 0;

  return (
    <section>
      <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="section-title flex items-center gap-2">
            <Newspaper size={20} className="text-blue-600" />
            Latest FIFA News
          </h2>
        </div>
        {lastUpdated && (
          <span className="text-xs text-zinc-400">
            Updated {formatRelativeTime(lastUpdated.toISOString())}
          </span>
        )}
      </div>

      <div className="card-surface rounded-2xl overflow-hidden">
        <div className="host-stripe" />

        {showSpinner && (
          <div className="flex items-center justify-center gap-2 py-12 text-sm text-zinc-400">
            <Loader2 size={18} className="animate-spin" />
            Loading news...
          </div>
        )}

        {error && articles.length === 0 && (
          <div className="py-10 text-center px-4">
            <p className="mb-3 text-sm text-red-600">{error}</p>
            <button
              type="button"
              onClick={() => loadNews(true)}
              className="btn-secondary inline-flex items-center gap-2 px-4 py-2 text-sm"
            >
              <RefreshCw size={14} />
              Retry
            </button>
          </div>
        )}

        {!showSpinner && articles.length === 0 && !error && (
          <p className="py-10 text-center text-sm text-zinc-400">No news available right now.</p>
        )}

        {articles.length > 0 && (
          <div className="grid gap-3 p-4 sm:p-5 sm:grid-cols-2">
            {articles.map((article) => (
              <NewsCard key={article.id} article={article} onOpen={setSelected} />
            ))}
          </div>
        )}

        {error && articles.length > 0 && (
          <p className="border-t border-zinc-100 px-4 py-2 text-center text-xs text-amber-600">
            Couldn&apos;t refresh — showing last loaded headlines
          </p>
        )}
      </div>

      {selected && (
        <NewsArticleModal
          articleId={selected.id}
          preview={selected}
          onClose={() => setSelected(null)}
        />
      )}
    </section>
  );
}
