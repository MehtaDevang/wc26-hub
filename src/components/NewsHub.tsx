"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Newspaper, Play } from "lucide-react";
import { CdnFillImage } from "@/components/CdnImage";
import { buildNewsCardBlurb } from "@/lib/news-summary";
import { filterNewsArticles, inferNewsTeamCodes } from "@/lib/news-tags";
import { TEAMS } from "@/lib/data";
import type { NewsArticle } from "@/lib/types";

type NewsFilter = "all" | "exclusive" | "video";

function formatRelativeTime(iso: string): string {
  const diffMs = Date.now() - new Date(iso).getTime();
  const minutes = Math.round(diffMs / 60_000);
  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.round(hours / 24)}d ago`;
}

function NewsHubCard({ article }: { article: NewsArticle }) {
  const blurb = buildNewsCardBlurb(article.summary);
  const teams = inferNewsTeamCodes(`${article.headline} ${article.summary}`).slice(0, 3);

  return (
    <Link
      href={`/news/${article.id}`}
      className="group flex gap-4 rounded-2xl border border-zinc-100 bg-white p-4 shadow-sm hover:border-blue-200 hover:shadow-md transition-all"
    >
      <div className="relative h-20 w-28 sm:h-24 sm:w-36 shrink-0 overflow-hidden rounded-xl bg-zinc-100">
        {article.imageUrl ? (
          <CdnFillImage
            src={article.imageUrl}
            alt={article.imageAlt ?? ""}
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="144px"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-zinc-300">
            <Newspaper size={28} />
          </div>
        )}
        {article.type === "video" && (
          <span className="absolute bottom-1.5 right-1.5 inline-flex items-center gap-0.5 rounded-md bg-black/70 px-1.5 py-0.5 text-[10px] font-bold text-white">
            <Play size={10} fill="currentColor" />
          </span>
        )}
      </div>
      <div className="min-w-0 flex-1">
        <div className="mb-1.5 flex flex-wrap items-center gap-2">
          {article.isOriginal ? (
            <span className="rounded-full bg-[var(--wc-usa)] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">
              Exclusive
            </span>
          ) : (
            <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-zinc-500">
              {article.type === "video" ? "Video" : "News"}
            </span>
          )}
          <span className="text-[11px] text-zinc-400">{formatRelativeTime(article.publishedAt)}</span>
        </div>
        <h3 className="font-bold text-sm sm:text-base text-zinc-900 leading-snug line-clamp-2 group-hover:text-blue-600 transition-colors">
          {article.headline}
        </h3>
        {blurb && (
          <p className="mt-1.5 text-xs sm:text-sm text-zinc-500 leading-relaxed line-clamp-2">
            {blurb}
          </p>
        )}
        {teams.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1">
            {teams.map((code) => (
              <span
                key={code}
                className="text-[10px] font-semibold text-zinc-500 bg-zinc-50 rounded px-1.5 py-0.5"
              >
                {TEAMS[code]?.flag} {TEAMS[code]?.name ?? code}
              </span>
            ))}
          </div>
        )}
      </div>
    </Link>
  );
}

export function NewsHub({ articles }: { articles: NewsArticle[] }) {
  const [filter, setFilter] = useState<NewsFilter>("all");
  const [team, setTeam] = useState<string>("");

  const filtered = useMemo(
    () => filterNewsArticles(articles, { filter, team: team || undefined }),
    [articles, filter, team]
  );

  const teamOptions = useMemo(() => {
    const codes = new Set<string>();
    for (const article of articles) {
      for (const code of inferNewsTeamCodes(`${article.headline} ${article.summary}`)) {
        codes.add(code);
      }
    }
    return [...codes]
      .map((code) => ({ code, name: TEAMS[code]?.name ?? code, flag: TEAMS[code]?.flag ?? "" }))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [articles]);

  const filters: { id: NewsFilter; label: string }[] = [
    { id: "all", label: "All" },
    { id: "exclusive", label: "Exclusive" },
    { id: "video", label: "Video" },
  ];

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap gap-2">
        {filters.map((f) => (
          <button
            key={f.id}
            type="button"
            onClick={() => setFilter(f.id)}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
              filter === f.id
                ? "bg-blue-600 text-white"
                : "bg-white border border-zinc-200 text-zinc-600 hover:border-zinc-300"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {teamOptions.length > 0 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          <button
            type="button"
            onClick={() => setTeam("")}
            className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-semibold transition-colors ${
              !team ? "bg-zinc-900 text-white" : "bg-zinc-100 text-zinc-600"
            }`}
          >
            All teams
          </button>
          {teamOptions.map((t) => (
            <button
              key={t.code}
              type="button"
              onClick={() => setTeam(t.code)}
              className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-semibold transition-colors ${
                team === t.code ? "bg-zinc-900 text-white" : "bg-zinc-100 text-zinc-600"
              }`}
            >
              {t.flag} {t.name}
            </button>
          ))}
        </div>
      )}

      {filtered.length === 0 ? (
        <p className="text-sm text-zinc-400 text-center py-12">No articles match this filter.</p>
      ) : (
        <div className="grid gap-4">
          {filtered.map((article) => (
            <NewsHubCard key={article.id} article={article} />
          ))}
        </div>
      )}
    </div>
  );
}
