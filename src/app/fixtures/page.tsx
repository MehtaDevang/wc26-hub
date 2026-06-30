import { fetchEspnScoreboard } from "@/lib/espn/client";
import { transformEvents } from "@/lib/espn/transform";
import { LiveFixturesList } from "@/components/LiveFixturesList";
import { AddTournamentCalendar } from "@/components/AddTournamentCalendar";
import { EditorialHubIntro } from "@/components/EditorialHubIntro";
import { AdBanner } from "@/components/AdBanner";
import { FIXTURES_HUB_INTRO } from "@/lib/editorial-hub-intros";
import { createPageMetadata } from "@/lib/seo";
import { mergeKeywords, LIVE_SCORES_KEYWORDS } from "@/lib/seo-keywords";
import { getServerTimezone } from "@/lib/timezone";

export const metadata = createPageMetadata({
  title: "World Cup 2026 Fixtures & Results - Full Schedule & Live Scores",
  description:
    "Complete FIFA World Cup 2026 fixture list with kick-off times, venues, groups, live scores, and match results. Every game from the group stage to the final.",
  path: "/fixtures",
  keywords: mergeKeywords(LIVE_SCORES_KEYWORDS, [
    "World Cup fixture list",
    "World Cup match schedule",
    "World Cup kick off times",
    "football fixtures today",
  ]),
});

export const revalidate = 60;

export default async function FixturesPage() {
  const timeZone = await getServerTimezone();
  const scoreboard = await fetchEspnScoreboard({ dates: "20260611-20260719" });
  const matches = transformEvents(scoreboard.events ?? [], timeZone);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="section-title">Fixtures & Results</h1>
          <p className="text-zinc-500 text-sm mt-1">
            All World Cup 2026 matches · {matches.length} fixtures · kick-offs in your local time
          </p>
        </div>
        <AddTournamentCalendar matches={matches} />
      </div>
      <EditorialHubIntro intro={FIXTURES_HUB_INTRO} />
      <AdBanner placement="fixtures" />
      <LiveFixturesList initialMatches={matches} />
    </div>
  );
}
