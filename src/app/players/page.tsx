import { Suspense } from "react";
import { Target } from "lucide-react";
import { AdBanner } from "@/components/AdBanner";
import { HomePlayerOfTheDaySection, HomeSectionSkeleton } from "@/components/home/HomeSections";
import { PlayersTopScorersSection } from "@/components/players/PlayersPageSections";
import { PlayersSquadsSection } from "@/components/players/PlayersSquadsSection";
import { createPageMetadata } from "@/lib/seo";
import { mergeKeywords, PLAYERS_KEYWORDS, STATS_KEYWORDS } from "@/lib/seo-keywords";

export const metadata = createPageMetadata({
  title: "World Cup 2026 Players - Squads, Stats & Top Scorers",
  description:
    "Every FIFA World Cup 2026 player by country - live stats, goals, assists, cards, positions, photos, and full profiles for all 48 squad lists.",
  path: "/players",
  keywords: mergeKeywords(PLAYERS_KEYWORDS, STATS_KEYWORDS),
});

export const revalidate = 300;
export const maxDuration = 120;

export default function PlayersIndexPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="section-title flex items-center gap-2 text-2xl sm:text-3xl">
          <Target size={28} className="text-[var(--wc-usa)]" />
          World Cup 2026 Players
        </h1>
        <p className="text-sm text-zinc-500 mt-2 max-w-2xl">
          Full squads for all 48 nations at the FIFA World Cup 2026 - tap any player for photos,
          personal info, tournament stats, and recent club performances.
        </p>
      </div>
      <AdBanner placement="inline" />

      <Suspense fallback={<HomeSectionSkeleton height={120} />}>
        <HomePlayerOfTheDaySection />
      </Suspense>

      <Suspense fallback={<HomeSectionSkeleton height={200} />}>
        <PlayersTopScorersSection />
      </Suspense>

      <Suspense fallback={<HomeSectionSkeleton height={480} />}>
        <PlayersSquadsSection />
      </Suspense>
    </div>
  );
}
