import Link from "next/link";
import { getAllGroupLetters } from "@/lib/espn/groups";
import { AdBanner } from "@/components/AdBanner";
import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "World Cup 2026 Groups — Standings A to L",
  description:
    "All 12 FIFA World Cup 2026 groups with live standings, fixtures, results, and team hubs for groups A through L.",
  path: "/groups",
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
