"use client";

import { useCallback, useEffect, useState } from "react";
import { X } from "lucide-react";
import { fetchNewsArticle } from "@/lib/matches";
import { NewsArticleContent, NewsArticleLoading } from "@/components/NewsArticleContent";
import type { NewsArticle, NewsArticleDetail } from "@/lib/types";

export function NewsArticleModal({
  articleId,
  preview,
  onClose,
}: {
  articleId: string;
  preview?: NewsArticle;
  onClose: () => void;
}) {
  const [article, setArticle] = useState<NewsArticleDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError("");

    fetchNewsArticle(articleId)
      .then((data) => {
        if (!cancelled) setArticle(data);
      })
      .catch((e) => {
        if (!cancelled) {
          setError(e instanceof Error ? e.message : "Failed to load story");
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [articleId]);

  const handleBackdrop = useCallback(
    (event: React.MouseEvent) => {
      if (event.target === event.currentTarget) onClose();
    },
    [onClose]
  );

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="news-article-title"
      onClick={handleBackdrop}
    >
      <div className="absolute inset-0 bg-black/55 backdrop-blur-[2px]" aria-hidden />

      <div className="relative z-10 w-full max-w-3xl max-h-[92vh] overflow-y-auto rounded-t-2xl sm:rounded-2xl bg-white shadow-2xl">
        <div className="sticky top-0 z-10 flex items-center justify-between gap-3 border-b border-zinc-100 bg-white/95 backdrop-blur px-4 py-3 sm:px-6">
          <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">
            News brief
          </p>
          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-zinc-100 text-zinc-600 transition-colors hover:bg-zinc-200"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        <div className="p-5 sm:p-6">
          {loading && <NewsArticleLoading />}

          {error && !loading && (
            <div className="py-12 text-center">
              <p className="text-sm text-red-600 mb-2">{error}</p>
              {preview && (
                <div className="mt-6 text-left border-t border-zinc-100 pt-6">
                  <h2 id="news-article-title" className="text-xl font-bold text-zinc-900">
                    {preview.headline}
                  </h2>
                  {preview.summary && (
                    <p className="mt-3 text-sm text-zinc-600">{preview.summary}</p>
                  )}
                </div>
              )}
            </div>
          )}

          {article && !loading && (
            <div id="news-article-title">
              <NewsArticleContent article={article} compact />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
