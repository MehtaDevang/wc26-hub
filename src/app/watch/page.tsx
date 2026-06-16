import Link from "next/link";
import { WatchGuide } from "@/components/WatchGuide";
import { WC26PageBanner } from "@/components/WC26Brand";
import { AdBanner } from "@/components/AdBanner";
import { createPageMetadata } from "@/lib/seo";
import { getWatchGuideMatches } from "@/lib/espn/watch-guide";
import { getServerTimezone } from "@/lib/timezone";
import { getWatchCountry, guessWatchCountryFromTimezone } from "@/lib/watch-by-country";

export const metadata = createPageMetadata({
  title: "Where to Watch World Cup 2026 - TV Channels & Broadcast Guide",
  description:
    "World Cup 2026 TV schedule and broadcast guide by country - USA, UK, India, Mexico, Canada and more. Find channels, streaming links, and kickoff times.",
  path: "/watch",
  keywords: [
    "World Cup 2026 TV schedule",
    "where to watch World Cup",
    "World Cup broadcast by country",
    "World Cup TV channel",
  ],
});

export const revalidate = 300;
export const maxDuration = 60;

export default async function WatchPage() {
  const timeZone = await getServerTimezone();
  const entries = await getWatchGuideMatches(timeZone, { daysAhead: 21 });
  const defaultCountry = guessWatchCountryFromTimezone(timeZone);

  return (
    <div className="space-y-6">
      <WC26PageBanner
        title="Where to Watch"
        subtitle="TV & streaming by country - official broadcasters with links for every match"
      />
      <p className="text-sm text-zinc-500 flex flex-wrap gap-x-3 gap-y-1">
        <Link href="/fixtures" className="text-blue-600 hover:underline font-medium">
          Full fixtures schedule →
        </Link>
        <span className="text-zinc-300">·</span>
        <Link href={`/watch/${defaultCountry}`} className="text-blue-600 hover:underline font-medium">
          Your region ({getWatchCountry(defaultCountry)?.name}) →
        </Link>
      </p>
      <AdBanner placement="inline" />
      <WatchGuide entries={entries} initialCountry={defaultCountry} />
    </div>
  );
}
