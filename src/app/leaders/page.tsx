import Link from "next/link";
import { TournamentLeadersPanel } from "@/components/TournamentLeadersPanel";
import { WC26PageBanner } from "@/components/WC26Brand";
import { AdBanner } from "@/components/AdBanner";
import { createPageMetadata } from "@/lib/seo";
import { getTournamentLeaders } from "@/lib/espn/tournament-stats";

export const metadata = createPageMetadata({
  title: "World Cup 2026 Stat Leaders - Golden Boot, Assists & Cards",
  description:
    "FIFA World Cup 2026 tournament stat leaders - Golden Boot top scorers, assists, appearances, yellow cards, and red cards updated from every match.",
  path: "/leaders",
  keywords: [
    "World Cup Golden Boot",
    "World Cup top scorers",
    "World Cup assists",
    "World Cup stat leaders",
  ],
});

export const revalidate = 120;
export const maxDuration = 60;

export default async function LeadersPage() {
  const leaders = await getTournamentLeaders();

  return (
    <div className="space-y-6">
      <WC26PageBanner
        title="Tournament Leaders"
        subtitle="Golden Boot, assists, appearances, and discipline - updated after every match"
      />
      <p className="text-sm text-zinc-500 flex flex-wrap gap-x-3 gap-y-1">
        <Link href="/players" className="text-blue-600 hover:underline font-medium">
          All players →
        </Link>
        <span className="text-zinc-300">·</span>
        <Link href="/history#goals" className="text-blue-600 hover:underline font-medium">
          All-time goal records →
        </Link>
        <span className="text-zinc-300">·</span>
        <Link href="/standings" className="text-blue-600 hover:underline font-medium">
          Group standings →
        </Link>
      </p>
      <AdBanner placement="inline" />
      <TournamentLeadersPanel leaders={leaders} />
    </div>
  );
}
