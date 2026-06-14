import { WC26PageBanner } from "@/components/WC26Brand";
import { WorldCupHistoryHub } from "@/components/history/WorldCupHistoryHub";

export const metadata = {
  title: "World Cup History — WC26 Hub",
  description:
    "Complete FIFA World Cup history: winners, finals, records, awards, prize money, and documented controversies from 1930 to 2026.",
};

export default function HistoryPage() {
  return (
    <div className="space-y-6">
      <WC26PageBanner
        title="World Cup History"
        subtitle="Winners, finals, records, awards, prizes & controversies — 1930 to 2026"
      />
      <WorldCupHistoryHub />
    </div>
  );
}
