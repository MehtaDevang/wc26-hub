import Link from "next/link";
import { TEAMS } from "@/lib/data";
import { getFifaRank } from "@/lib/fifa-rankings";
import { FifaRankBadge } from "@/components/FifaRankBadge";
import { createPageMetadata } from "@/lib/seo";
import { mergeKeywords, TEAMS_KEYWORDS } from "@/lib/seo-keywords";

export const metadata = createPageMetadata({
  title: "World Cup 2026 Teams - All 48 Countries, Squads & Stats",
  description:
    "Browse every FIFA World Cup 2026 country - live results, group standings, fixtures, squad players, and full tournament stats for all 48 national teams.",
  path: "/teams",
  keywords: mergeKeywords(TEAMS_KEYWORDS, [
    "national teams",
    "World Cup nations",
    "country football teams",
  ]),
});

export default function TeamsIndexPage() {
  const teams = Object.values(TEAMS).sort((a, b) => {
    const rankA = getFifaRank(a.code) ?? 999;
    const rankB = getFifaRank(b.code) ?? 999;
    return rankA - rankB || a.name.localeCompare(b.name);
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="section-title text-2xl sm:text-3xl">World Cup 2026 Teams</h1>
        <p className="text-sm text-zinc-500 mt-2 max-w-2xl">
          Every nation at the FIFA World Cup 2026 - sorted by FIFA world ranking (June 2026). Tap a team for fixtures, results, group position, and full tournament journey.
        </p>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {teams.map((team) => (
          <Link
            key={team.code}
            href={`/teams/${team.code}`}
            className="card-surface rounded-xl px-4 py-3 flex items-center gap-3 hover:border-blue-200 hover:shadow-sm transition-all group"
          >
            <span className="text-2xl shrink-0">{team.flag}</span>
            <div className="min-w-0">
              <p className="font-bold text-zinc-900 group-hover:text-blue-600 transition-colors truncate">
                {team.name}
              </p>
              <div className="flex items-center gap-2 mt-0.5">
                <p className="text-xs text-zinc-400">{team.code}</p>
                <FifaRankBadge code={team.code} variant="compact" />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
