import Link from "next/link";
import { ArrowRight, Swords } from "lucide-react";
import { AdBanner } from "@/components/AdBanner";
import { createPageMetadata } from "@/lib/seo";
import { getAllRivalryPages } from "@/lib/rivalry-pages";

export const metadata = createPageMetadata({
  title: "World Cup Rivalries - Historic International Football Matchups",
  description:
    "Explore the greatest FIFA World Cup rivalries - Argentina vs Brazil, England vs Germany, Mexico vs USA, and more. History, fun facts, and WC 2026 context.",
  path: "/rivalries",
  keywords: [
    "World Cup rivalries",
    "Brazil vs Argentina",
    "England vs Germany",
    "Mexico vs USA football",
    "international football derbies",
  ],
});

export default function RivalriesPage() {
  const rivalries = getAllRivalryPages();

  return (
    <div className="space-y-8">
      <div className="card-surface rounded-2xl overflow-hidden">
        <div className="host-stripe" />
        <div className="p-5 sm:p-6">
          <h1 className="section-title text-2xl sm:text-3xl flex items-center gap-2">
            <Swords size={28} className="text-[var(--wc-usa)]" />
            World Cup Rivalries
          </h1>
          <p className="text-sm text-zinc-500 mt-2 max-w-2xl leading-relaxed">
            The international matchups that define tournament history - context, iconic moments,
            and what to watch when these nations meet at World Cup 2026.
          </p>
        </div>
      </div>

      <AdBanner placement="inline" />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {rivalries.map((r) => (
          <Link
            key={r.slug}
            href={`/rivalries/${r.slug}`}
            className="card-surface rounded-2xl p-5 hover:shadow-md hover:border-blue-200 transition-all group"
          >
            <div className="flex items-center gap-2 mb-3 text-2xl">
              <span>{r.teamAFlag}</span>
              <span className="text-xs font-bold text-zinc-300">vs</span>
              <span>{r.teamBFlag}</span>
            </div>
            <h2 className="font-bold text-zinc-900 group-hover:text-blue-600 transition-colors">
              {r.name}
            </h2>
            <p className="text-sm text-zinc-500 mt-2 line-clamp-3 leading-relaxed">{r.context}</p>
            <span className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 mt-3">
              Read more <ArrowRight size={12} />
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
