import { MyWorldCupDashboard } from "@/components/MyWorldCupDashboard";
import { WC26PageBanner } from "@/components/WC26Brand";
import { createPageMetadata } from "@/lib/seo";
import { getTodayMatches } from "@/lib/espn/services";
import { getServerTimezone } from "@/lib/timezone";

export const metadata = createPageMetadata({
  title: "My World Cup - Your Teams, Matches & Bracket",
  description:
    "Personalize The Goal Posts - follow your nations, see their fixtures first, track your bracket picks and puzzle streak. All on your device, no account needed.",
  path: "/my",
  keywords: [
    "my World Cup teams",
    "follow national team",
    "World Cup dashboard",
    "personalized football scores",
  ],
});

export const revalidate = 60;

export default async function MyWorldCupPage() {
  const timeZone = await getServerTimezone();
  const todayMatches = await getTodayMatches(timeZone).catch(() => []);

  return (
    <div className="space-y-6">
      <WC26PageBanner
        title="My World Cup"
        subtitle="Your teams, matches, and tools - saved on this device"
      />
      <MyWorldCupDashboard initialTodayMatches={todayMatches} />
    </div>
  );
}
