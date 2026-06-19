import { Suspense } from "react";
import Link from "next/link";
import { BracketPredictor } from "@/components/BracketPredictor";
import { WC26PageBanner } from "@/components/WC26Brand";
import { createPageMetadata } from "@/lib/seo";
import { getKnockoutBracket } from "@/lib/espn/services";
import { getServerTimezone } from "@/lib/timezone";

export const metadata = createPageMetadata({
  title: "World Cup 2026 Bracket Predictor - Pick & Share Your Knockout Picks",
  description:
    "Fill in your FIFA World Cup 2026 knockout bracket - pick every winner from the Round of 32 to the Final and share your prediction with friends.",
  path: "/bracket/predict",
  keywords: [
    "World Cup bracket predictor",
    "World Cup 2026 bracket",
    "knockout bracket picks",
    "World Cup predictions",
  ],
});

export const revalidate = 300;

export default async function BracketPredictPage() {
  const timeZone = await getServerTimezone();
  const bracket = await getKnockoutBracket(timeZone);

  return (
    <div className="space-y-6">
      <WC26PageBanner
        title="Bracket Predictor"
        subtitle="Pick every knockout winner and share your World Cup 2026 bracket"
      />
      <p className="text-sm text-zinc-500">
        <Link href="/bracket" className="text-blue-600 hover:underline font-medium">
          View live bracket →
        </Link>
      </p>
      <Suspense fallback={<p className="text-sm text-zinc-400 text-center py-12">Loading bracket…</p>}>
        <BracketPredictor initialData={bracket} />
      </Suspense>
    </div>
  );
}
