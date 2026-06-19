import { WC26PageBanner } from "@/components/WC26Brand";
import { WorldCupHistoryHub } from "@/components/history/WorldCupHistoryHub";
import { IconicMoments } from "@/components/IconicMoments";
import { createPageMetadata } from "@/lib/seo";
import { mergeKeywords, HISTORY_KEYWORDS } from "@/lib/seo-keywords";
import { HISTORY_INTRO } from "@/lib/world-cup-history";

export const metadata = createPageMetadata({
  title: "FIFA World Cup History - Winners, Finals, Records & Football Stats",
  description:
    "Complete FIFA World Cup history from 1930 to 2026 - every winner, final score, host nation, all-time goal records, Golden Ball winners, trophy evolution, and documented controversies.",
  path: "/history",
  keywords: mergeKeywords(HISTORY_KEYWORDS, [
    "FIFA World Cup history",
    "World Cup champions",
    "football World Cup stats",
    "soccer tournament history",
  ]),
});

export default function HistoryPage() {
  return (
    <div className="space-y-6">
      <WC26PageBanner
        title={HISTORY_INTRO.title}
        subtitle="Winners, finals, host nations, records, awards, prizes & controversies - 1930 to 2026"
      />
      <IconicMoments limit={6} showClassicLink={false} />
      <WorldCupHistoryHub />
    </div>
  );
}
