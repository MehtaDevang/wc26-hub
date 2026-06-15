import { WC26PageBanner } from "@/components/WC26Brand";
import { WorldCupHistoryHub } from "@/components/history/WorldCupHistoryHub";
import { AdBanner } from "@/components/AdBanner";
import { IconicMoments } from "@/components/IconicMoments";
import { createPageMetadata } from "@/lib/seo";
import { mergeKeywords, HISTORY_KEYWORDS } from "@/lib/seo-keywords";

export const metadata = createPageMetadata({
  title: "World Cup History — Winners, Finals, Records & Football Stats",
  description:
    "Complete FIFA World Cup history from 1930 to 2026 — every winner, final score, all-time goal records, Golden Boot leaders, records, prizes, and controversies.",
  path: "/history",
  keywords: mergeKeywords(HISTORY_KEYWORDS, [
    "World Cup champions",
    "football World Cup stats",
    "soccer tournament history",
  ]),
});

export default function HistoryPage() {
  return (
    <div className="space-y-6">
      <WC26PageBanner
        title="World Cup History"
        subtitle="Winners, finals, records, awards, prizes & controversies — 1930 to 2026"
      />
      <IconicMoments limit={6} showClassicLink={false} />
      <AdBanner placement="history" />
      <WorldCupHistoryHub />
    </div>
  );
}
