import { createPageMetadata } from "@/lib/seo";
import { mergeKeywords, LIVE_SCORES_KEYWORDS, CORE_KEYWORDS } from "@/lib/seo-keywords";
import { LocalizedHomePage } from "@/components/LocalizedHomePage";

export const metadata = createPageMetadata({
  title: "FIFA World Cup 2026 Live Scores Today — Fixtures, Standings & Stats",
  description:
    "Live World Cup 2026 scores updated throughout the day. Full fixtures, group standings, team & player stats, match highlights, knockout bracket, and football history.",
  path: "/",
  keywords: mergeKeywords(CORE_KEYWORDS, LIVE_SCORES_KEYWORDS),
});

export default function Home() {
  return <LocalizedHomePage locale="en" />;
}
