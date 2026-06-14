import { InteractiveStandingsGrid } from "@/components/InteractiveStandingsGrid";
import { WC26PageBanner } from "@/components/WC26Brand";
import { fetchAllGroupStandings } from "@/lib/espn/standings";
import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "Group Tables & Standings",
  description: "Live FIFA World Cup 2026 group standings, points, goal difference, and knockout qualification.",
  path: "/standings",
});

export const revalidate = 120;

export default async function StandingsPage() {
  const standings = await fetchAllGroupStandings();

  return (
    <div className="space-y-6">
      <WC26PageBanner
        title="Group Standings"
        subtitle="Live tables for all 12 World Cup groups — tap any team row to explore their journey"
      />
      <InteractiveStandingsGrid groups={standings} />
    </div>
  );
}
