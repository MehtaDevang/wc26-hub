import type { Metadata } from "next";
import { createPageMetadata } from "@/lib/seo";
import { mergeKeywords, LIVE_SCORES_KEYWORDS, CORE_KEYWORDS } from "@/lib/seo-keywords";
import { LocalizedHomePage } from "@/components/LocalizedHomePage";
import { getHomeFinaleData } from "@/components/home/HomeSections";
import { getTeam } from "@/lib/data";

const KEYWORDS = mergeKeywords(CORE_KEYWORDS, LIVE_SCORES_KEYWORDS);

const DEFAULT_METADATA = createPageMetadata({
  title: "FIFA World Cup 2026 Live Scores Today - Fixtures, Standings & Stats",
  description:
    "Live World Cup 2026 scores updated throughout the day. Full fixtures, group standings, team & player stats, match highlights, knockout bracket, and football history.",
  path: "/",
  keywords: KEYWORDS,
});

export async function generateMetadata(): Promise<Metadata> {
  try {
    const { state } = await getHomeFinaleData();

    if (state.stage === "champions" && state.champion) {
      const team = getTeam(state.champion.code ?? "", state.champion.name);
      return createPageMetadata({
        title: `${team.name} Win the FIFA World Cup 2026 - Final Result & Highlights`,
        description: `${team.name} are World Cup 2026 champions. Relive the Final, the road to the trophy, the Golden Boot race and every knockout result.`,
        path: "/",
        keywords: KEYWORDS,
      });
    }

    if (state.stage !== "pre") {
      return createPageMetadata({
        title: `FIFA World Cup 2026 ${state.stageLabel} - Live Scores, Bracket & Road to the Final`,
        description: `Follow the World Cup 2026 ${state.stageLabel.toLowerCase()} live: countdown to kickoff, the final four, the full knockout bracket and the Golden Boot race.`,
        path: "/",
        keywords: KEYWORDS,
      });
    }
  } catch {
    // fall back to default metadata
  }

  return DEFAULT_METADATA;
}

export default function Home() {
  return <LocalizedHomePage locale="en" />;
}
