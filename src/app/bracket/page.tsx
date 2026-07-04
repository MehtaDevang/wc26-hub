import Link from "next/link";
import { WC26PageBanner } from "@/components/WC26Brand";
import { AdBanner } from "@/components/AdBanner";
import { BracketPageContent, BracketPageLinks } from "@/components/bracket/BracketPageContent";
import { createPageMetadata } from "@/lib/seo";
import { mergeKeywords, LIVE_SCORES_KEYWORDS } from "@/lib/seo-keywords";

export const metadata = createPageMetadata({
  title: "World Cup 2026 Knockout Bracket - Live Scores & Results",
  description:
    "FIFA World Cup 2026 knockout bracket with live scores - Round of 32, Round of 16, quarter-finals, semi-finals, third-place match, and the final.",
  path: "/bracket",
  keywords: mergeKeywords(LIVE_SCORES_KEYWORDS, [
    "World Cup knockout stage",
    "elimination bracket",
    "World Cup playoffs",
  ]),
});

export const revalidate = 60;

export default function BracketPage() {
  return (
    <div className="space-y-6">
      <WC26PageBanner
        title="Knockout Bracket"
        subtitle="Follow the road to the Final - Round of 32, Round of 16, quarters, semis & the trophy match"
      />
      <BracketPageLinks />
      <AdBanner placement="inline" />
      <BracketPageContent />
    </div>
  );
}
