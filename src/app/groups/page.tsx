import Link from "next/link";
import { getAllGroupLetters } from "@/lib/espn/groups";
import { AdBanner } from "@/components/AdBanner";
import { createPageMetadata } from "@/lib/seo";
import { mergeKeywords, TEAMS_KEYWORDS, LIVE_SCORES_KEYWORDS } from "@/lib/seo-keywords";

export const metadata = createPageMetadata({
  title: "World Cup 2026 Groups A–L — Standings, Teams & Fixtures",
  description:
    "All 12 FIFA World Cup 2026 groups with live standings, points tables, fixtures, results, and links to every country in groups A through L.",
  path: "/groups",
  keywords: mergeKeywords(TEAMS_KEYWORDS, LIVE_SCORES_KEYWORDS, [
    "World Cup group stage",
    "group standings live",
  ]),
});

export default function GroupsIndexPage() {
  const groups = getAllGroupLetters();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="section-title text-2xl sm:text-3xl">World Cup 2026 Groups</h1>
        <p className="text-sm text-zinc-500 mt-2 max-w-2xl">
          Live group standings and fixtures for all 12 groups at the 48-team FIFA World Cup 2026.
        </p>
      </div>
      <AdBanner placement="standings" />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {groups.map((letter) => (
          <Link
            key={letter}
            href={`/groups/${letter}`}
            className="wc26-group-card p-5 hover:border-blue-200 hover:shadow-md transition-all group"
          >
            <p className="text-3xl font-extrabold text-[var(--wc-usa)] group-hover:text-blue-600 transition-colors">
              Group {letter}
            </p>
            <p className="text-sm text-zinc-500 mt-2">Standings · fixtures · results</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
