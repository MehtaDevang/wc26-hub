import Link from "next/link";
import { TEAMS } from "@/lib/data";
import { AdBanner } from "@/components/AdBanner";
import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "World Cup 2026 Teams — All 48 Nations",
  description:
    "Browse every FIFA World Cup 2026 team — fixtures, results, group standings, and tournament stats for all 48 nations.",
  path: "/teams",
});

export default function TeamsIndexPage() {
  const teams = Object.values(TEAMS).sort((a, b) => a.name.localeCompare(b.name));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="section-title text-2xl sm:text-3xl">World Cup 2026 Teams</h1>
        <p className="text-sm text-zinc-500 mt-2 max-w-2xl">
          Every nation at the FIFA World Cup 2026 — tap a team for fixtures, results, group position, and full tournament journey.
        </p>
      </div>
      <AdBanner placement="inline" />
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
              <p className="text-xs text-zinc-400 mt-0.5">{team.code}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
