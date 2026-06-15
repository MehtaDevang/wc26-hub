import { getTodayMatches } from "@/lib/espn/services";
import { EmbedLiveScores } from "@/components/EmbedLiveScores";
import { getEmbedStrings } from "@/lib/i18n";
import { getServerTimezone } from "@/lib/timezone";

export const metadata = {
  robots: { index: false, follow: false },
};

export const revalidate = 60;

export default async function EmbedLiveScoresPage() {
  const timeZone = await getServerTimezone();
  const matches = await getTodayMatches(timeZone).catch(() => []);
  const strings = getEmbedStrings("en");

  return (
    <EmbedLiveScores
      initialMatches={matches}
      strings={strings}
      poweredByHref="https://www.thegoalposts.in"
    />
  );
}
