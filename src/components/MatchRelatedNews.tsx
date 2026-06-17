import Link from "next/link";
import { Newspaper, ArrowRight } from "lucide-react";
import { CdnFillImage } from "@/components/CdnImage";
import { buildNewsCardBlurb } from "@/lib/news-summary";
import type { NewsArticle } from "@/lib/types";

export function MatchRelatedNews({
  articles,
  homeName,
  awayName,
}: {
  articles: NewsArticle[];
  homeName: string;
  awayName: string;
}) {
  if (articles.length === 0) return null;

  return (
    <section className="card-surface rounded-2xl overflow-hidden">
      <div className="px-5 py-4 border-b border-zinc-100 flex items-center justify-between gap-3">
        <h2 className="font-bold text-zinc-900 flex items-center gap-2 text-sm sm:text-base">
          <Newspaper size={18} className="text-blue-600" />
          News · {homeName} & {awayName}
        </h2>
        <Link href="/news" className="text-xs font-semibold text-blue-600 hover:underline shrink-0">
          All news
        </Link>
      </div>
      <div className="divide-y divide-zinc-50">
        {articles.map((article) => {
          const blurb = buildNewsCardBlurb(article.summary);
          return (
            <Link
              key={article.id}
              href={`/news/${article.id}`}
              className="flex gap-3 p-4 hover:bg-zinc-50/80 transition-colors group"
            >
              {article.imageUrl && (
                <div className="relative h-16 w-24 shrink-0 overflow-hidden rounded-lg bg-zinc-100">
                  <CdnFillImage
                    src={article.imageUrl}
                    alt={article.imageAlt ?? ""}
                    className="object-cover"
                    sizes="96px"
                  />
                </div>
              )}
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 mb-1">
                  {article.isOriginal && (
                    <span className="rounded bg-[var(--wc-usa)] px-1.5 py-0.5 text-[9px] font-bold uppercase text-white">
                      Exclusive
                    </span>
                  )}
                </div>
                <p className="font-semibold text-sm text-zinc-900 line-clamp-2 group-hover:text-blue-600 transition-colors">
                  {article.headline}
                </p>
                {blurb && (
                  <p className="text-xs text-zinc-500 mt-1 line-clamp-2">{blurb}</p>
                )}
              </div>
              <ArrowRight size={14} className="text-zinc-300 group-hover:text-blue-500 shrink-0 mt-1" />
            </Link>
          );
        })}
      </div>
    </section>
  );
}
