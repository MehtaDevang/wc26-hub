import { Suspense } from "react";
import Link from "next/link";
import { BracketPool } from "@/components/BracketPool";
import { WC26PageBanner } from "@/components/WC26Brand";
import { createPageMetadata } from "@/lib/seo";
import { getKnockoutBracket } from "@/lib/espn/services";
import { getServerTimezone } from "@/lib/timezone";

export const metadata = createPageMetadata({
  title: "World Cup 2026 Bracket Pool - Compete With Friends",
  description:
    "Start a FIFA World Cup 2026 bracket pool with friends. Share your knockout picks, add everyone's brackets, and watch the leaderboard auto-score against real results.",
  path: "/bracket/pool",
  keywords: [
    "World Cup bracket pool",
    "World Cup office pool",
    "bracket challenge friends",
    "World Cup 2026 leaderboard",
  ],
});

export const revalidate = 300;

export default async function BracketPoolPage() {
  const timeZone = await getServerTimezone();
  const bracket = await getKnockoutBracket(timeZone);

  return (
    <div className="space-y-6">
      <WC26PageBanner
        title="Bracket Pool"
        subtitle="Challenge your friends - everyone's picks, auto-scored against live results"
      />
      <p className="text-sm text-zinc-500">
        <Link href="/bracket/predict" className="text-blue-600 hover:underline font-medium">
          Make your picks first →
        </Link>
      </p>
      <Suspense fallback={<p className="text-sm text-zinc-400 text-center py-12">Loading pool…</p>}>
        <BracketPool bracket={bracket} />
      </Suspense>
    </div>
  );
}
