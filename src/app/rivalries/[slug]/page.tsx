import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { AdBanner } from "@/components/AdBanner";
import { createPageMetadata } from "@/lib/seo";
import { getAllRivalryPages, getRivalryBySlug, findRivalryMatches } from "@/lib/rivalry-pages";
import { fetchEspnScoreboard } from "@/lib/espn/client";
import { transformEvents } from "@/lib/espn/transform";
import { getServerTimezone } from "@/lib/timezone";
import { MatchClashRow } from "@/components/MatchBattleGraphic";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getAllRivalryPages().map((r) => ({ slug: r.slug }));
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const rivalry = getRivalryBySlug(slug);
  if (!rivalry) {
    return createPageMetadata({
      title: "Rivalry Not Found",
      description: "World Cup rivalry page not found.",
      path: `/rivalries/${slug}`,
      noIndex: true,
    });
  }
  return createPageMetadata({
    title: `${rivalry.name} — World Cup Rivalry History`,
    description: `${rivalry.teamAName} vs ${rivalry.teamBName} rivalry at the FIFA World Cup. ${rivalry.context.slice(0, 140)}…`,
    path: `/rivalries/${rivalry.slug}`,
    keywords: [
      `${rivalry.teamAName} vs ${rivalry.teamBName}`,
      "World Cup rivalry",
      rivalry.name ?? "",
    ],
  });
}

export default async function RivalryDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const rivalry = getRivalryBySlug(slug);
  if (!rivalry) notFound();

  const timeZone = await getServerTimezone();
  const scoreboard = await fetchEspnScoreboard({ dates: "20260611-20260719" }).catch(() => null);
  const allMatches = scoreboard
    ? transformEvents(scoreboard.events ?? [], timeZone)
    : [];
  const wcMatches = findRivalryMatches(slug, allMatches);

  return (
    <div className="space-y-8">
      <Link
        href="/rivalries"
        className="inline-flex items-center gap-2 text-sm text-zinc-500 hover:text-zinc-900 transition-colors"
      >
        <ArrowLeft size={16} />
        All rivalries
      </Link>

      <div className="card-elevated rounded-2xl overflow-hidden">
        <div className="host-stripe" />
        <div className="p-6 sm:p-8 text-center">
          <div className="flex items-center justify-center gap-4 sm:gap-8 mb-4">
            <div>
              <span className="text-5xl">{rivalry.teamAFlag}</span>
              <p className="font-bold text-zinc-900 mt-2">{rivalry.teamAName}</p>
              <Link href={`/teams/${rivalry.teamA}`} className="text-xs text-blue-600 hover:underline">
                Team hub →
              </Link>
            </div>
            <span className="text-2xl font-black text-zinc-300">vs</span>
            <div>
              <span className="text-5xl">{rivalry.teamBFlag}</span>
              <p className="font-bold text-zinc-900 mt-2">{rivalry.teamBName}</p>
              <Link href={`/teams/${rivalry.teamB}`} className="text-xs text-blue-600 hover:underline">
                Team hub →
              </Link>
            </div>
          </div>
          <h1 className="section-title text-xl sm:text-2xl">{rivalry.name}</h1>
        </div>
      </div>

      <section className="card-surface rounded-2xl p-6">
        <h2 className="font-bold text-zinc-900 mb-3">The rivalry</h2>
        <p className="text-zinc-600 leading-relaxed">{rivalry.context}</p>
        {rivalry.funFact && (
          <p className="text-sm text-zinc-500 mt-4 italic border-l-2 border-amber-300 pl-4">
            {rivalry.funFact}
          </p>
        )}
      </section>

      {wcMatches.length > 0 && (
        <section>
          <h2 className="section-title text-base mb-4">World Cup 2026 fixtures</h2>
          <div className="card-surface rounded-2xl overflow-hidden match-clash-list">
            {wcMatches.map((m) => (
              <MatchClashRow key={m.id} match={m} />
            ))}
          </div>
        </section>
      )}

      <div className="grid gap-3 sm:grid-cols-2">
        <Link
          href={`/teams/${rivalry.teamA}`}
          className="card-surface rounded-xl p-4 hover:shadow-md transition-all group flex items-center justify-between"
        >
          <span className="font-semibold text-zinc-900 group-hover:text-blue-600">
            {rivalry.teamAFlag} {rivalry.teamAName} journey
          </span>
          <ArrowRight size={16} className="text-zinc-300 group-hover:text-blue-500" />
        </Link>
        <Link
          href={`/teams/${rivalry.teamB}`}
          className="card-surface rounded-xl p-4 hover:shadow-md transition-all group flex items-center justify-between"
        >
          <span className="font-semibold text-zinc-900 group-hover:text-blue-600">
            {rivalry.teamBFlag} {rivalry.teamBName} journey
          </span>
          <ArrowRight size={16} className="text-zinc-300 group-hover:text-blue-500" />
        </Link>
      </div>

      <AdBanner placement="inline" />
    </div>
  );
}
