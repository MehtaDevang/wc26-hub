import Link from "next/link";
import { LiveKnockoutBracket } from "@/components/LiveKnockoutBracket";
import { WC26PageBanner } from "@/components/WC26Brand";
import { AdBanner } from "@/components/AdBanner";
import { createPageMetadata } from "@/lib/seo";
import { mergeKeywords, LIVE_SCORES_KEYWORDS } from "@/lib/seo-keywords";
import { getKnockoutBracket } from "@/lib/espn/services";
import { getServerTimezone } from "@/lib/timezone";

export const metadata = createPageMetadata({
  title: "World Cup 2026 Knockout Bracket — Live Scores & Results",
  description:
    "FIFA World Cup 2026 knockout bracket with live scores — Round of 32, Round of 16, quarter-finals, semi-finals, third-place match, and the final.",
  path: "/bracket",
  keywords: mergeKeywords(LIVE_SCORES_KEYWORDS, [
    "World Cup knockout stage",
    "elimination bracket",
    "World Cup playoffs",
  ]),
});

export const revalidate = 120;

export default async function BracketPage() {
  const timeZone = await getServerTimezone();
  const bracket = await getKnockoutBracket(timeZone);

  return (
    <div className="space-y-6">
      <WC26PageBanner
        title="Knockout Bracket"
        subtitle="Follow the road to the Final — Round of 32, Round of 16, quarters, semis & the trophy match"
      />
      <p className="text-sm text-zinc-500 flex flex-wrap gap-x-3 gap-y-1">
        <Link href="/bracket/predict" className="text-blue-600 hover:underline font-medium">
          Fill in your bracket predictor →
        </Link>
        <span className="text-zinc-300">·</span>
        <Link href="/scenarios" className="text-blue-600 hover:underline font-medium">
          Qualification scenarios →
        </Link>
      </p>
      <AdBanner placement="inline" />
      <LiveKnockoutBracket initialData={bracket} />
    </div>
  );
}
