"use client";

import { ExternalLink, Loader2 } from "lucide-react";
import { MediaShareButton } from "@/components/MediaShareButton";
import { buildNewsSharePayload } from "@/lib/share";
import type { NewsArticleDetail } from "@/lib/types";

function formatPublished(iso: string): string {
  return new Date(iso).toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function typeLabel(type: NewsArticleDetail["type"]): string {
  if (type === "video") return "Video";
  if (type === "story") return "Story";
  return "News";
}

export function NewsArticleContent({
  article,
  compact = false,
}: {
  article: NewsArticleDetail;
  compact?: boolean;
}) {
  const share = buildNewsSharePayload(article);

  return (
    <article className={compact ? "space-y-4" : "space-y-5"}>
      {article.imageUrl && (
        <div className={`overflow-hidden rounded-xl bg-zinc-100 ${compact ? "" : "sm:rounded-2xl"}`}>
          <img
            src={article.imageUrl}
            alt={article.imageAlt ?? article.headline}
            className="w-full max-h-72 object-cover"
          />
        </div>
      )}

      <div className="flex flex-wrap items-center gap-2">
        {article.isOriginal ? (
          <span className="rounded-full bg-[var(--wc-usa)] px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">
            Exclusive
          </span>
        ) : (
          <span className="rounded-full bg-zinc-100 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-zinc-500">
            {typeLabel(article.type)}
          </span>
        )}
        <span className="text-xs text-zinc-400">{formatPublished(article.publishedAt)}</span>
        {article.byline && (
          <span className="text-xs text-zinc-500">· {article.byline}</span>
        )}
        <div className="ml-auto shrink-0">
          <MediaShareButton
            url={share.url}
            title={share.title}
            text={share.text}
            label={share.label}
            variant="overlay"
            menuAlign="end"
          />
        </div>
      </div>

      <h1
        className={`font-extrabold text-zinc-900 leading-snug ${
          compact ? "text-xl sm:text-2xl" : "text-2xl sm:text-3xl"
        }`}
      >
        {article.headline}
      </h1>

      {article.body?.length ? (
        <div className="news-article-body max-w-none text-sm sm:text-base leading-relaxed">
          {article.body.map((paragraph, i) => (
            <p key={i}>{paragraph}</p>
          ))}
        </div>
      ) : (
        <div className="rounded-xl border border-blue-100 bg-blue-50/50 px-4 py-4">
          <p className="text-[10px] font-bold uppercase tracking-widest text-blue-700 mb-2">
            In brief
          </p>
          <p className="text-base text-zinc-700 leading-relaxed">{article.summary}</p>
        </div>
      )}

      {article.sourceUrl && (
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 pt-2">
          <a
            href={article.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary inline-flex items-center justify-center gap-2 px-5 py-2.5 text-sm"
          >
            {article.type === "video" ? "Watch on ESPN" : "Read full story on ESPN"}
            <ExternalLink size={15} />
          </a>
          <p className="text-xs text-zinc-400">
            Full {article.type === "video" ? "clip" : "report"} published by ESPN - not republished here.
          </p>
        </div>
      )}
    </article>
  );
}

export function NewsArticleLoading() {
  return (
    <div className="flex items-center justify-center gap-2 py-16 text-sm text-zinc-400">
      <Loader2 size={20} className="animate-spin" />
      Loading…
    </div>
  );
}
