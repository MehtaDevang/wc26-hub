import { fetchEspnScoreboard } from "@/lib/espn/client";
import { transformEvents } from "@/lib/espn/transform";
import { FixturesList } from "@/components/FixturesList";
import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "Fixtures & Results",
  description: "Full FIFA World Cup 2026 fixture list with venues, groups, kick-off times, and live scores.",
  path: "/fixtures",
});

export const revalidate = 60;

export default async function FixturesPage() {
  const scoreboard = await fetchEspnScoreboard({ dates: "20260611-20260719" });
  const matches = transformEvents(scoreboard.events ?? []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="section-title">Fixtures & Results</h1>
        <p className="text-zinc-500 text-sm mt-1">
          All World Cup 2026 matches · {matches.length} fixtures
        </p>
      </div>
      <FixturesList matches={matches} />
    </div>
  );
}
