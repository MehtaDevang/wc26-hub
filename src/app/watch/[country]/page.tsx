import Link from "next/link";
import { notFound } from "next/navigation";
import { WatchGuide } from "@/components/WatchGuide";
import { WC26PageBanner } from "@/components/WC26Brand";
import { AdBanner } from "@/components/AdBanner";
import { createPageMetadata } from "@/lib/seo";
import { getWatchGuideMatches } from "@/lib/espn/watch-guide";
import { getServerTimezone } from "@/lib/timezone";
import { getAllWatchCountryIds, getWatchCountry } from "@/lib/watch-by-country";

interface PageProps {
  params: Promise<{ country: string }>;
}

export function generateStaticParams() {
  return getAllWatchCountryIds().map((country) => ({ country }));
}

export async function generateMetadata({ params }: PageProps) {
  const { country: countryId } = await params;
  const country = getWatchCountry(countryId);

  if (!country) {
    return createPageMetadata({
      title: "Watch Guide Not Found",
      description: "World Cup 2026 watch guide not found.",
      path: `/watch/${countryId}`,
      noIndex: true,
    });
  }

  const channels = country.broadcasters.map((b) => b.name).join(", ");

  return createPageMetadata({
    title: `Where to Watch World Cup 2026 in ${country.name} — ${channels}`,
    description: `How to watch FIFA World Cup 2026 in ${country.name}. TV channels and streaming: ${channels}. Full match schedule with broadcaster links.`,
    path: `/watch/${country.id}`,
    keywords: [
      `World Cup 2026 ${country.name}`,
      `watch World Cup ${country.name}`,
      ...country.broadcasters.map((b) => `${b.name} World Cup`),
    ],
  });
}

export const revalidate = 300;
export const maxDuration = 60;

export default async function WatchCountryPage({ params }: PageProps) {
  const { country: countryId } = await params;
  const country = getWatchCountry(countryId);
  if (!country) notFound();

  const timeZone = await getServerTimezone();
  const entries = await getWatchGuideMatches(timeZone, { daysAhead: 21 });

  return (
    <div className="space-y-6">
      <WC26PageBanner
        title={`Watch in ${country.name} ${country.flag}`}
        subtitle={`TV & streaming links for World Cup 2026 — ${country.broadcasters.map((b) => b.name).join(", ")}`}
      />
      <p className="text-sm text-zinc-500">
        <Link href="/watch" className="text-blue-600 hover:underline font-medium">
          ← All countries
        </Link>
        <span className="text-zinc-300 mx-2">·</span>
        <Link href="/fixtures" className="text-blue-600 hover:underline font-medium">
          Fixtures schedule →
        </Link>
      </p>
      <AdBanner placement="inline" />
      <WatchGuide entries={entries} initialCountry={country.id} />
    </div>
  );
}
