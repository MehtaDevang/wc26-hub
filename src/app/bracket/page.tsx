import { LiveKnockoutBracket } from "@/components/LiveKnockoutBracket";
import { WC26PageBanner } from "@/components/WC26Brand";
import { AdBanner } from "@/components/AdBanner";
import { createPageMetadata } from "@/lib/seo";
import { getKnockoutBracket } from "@/lib/espn/services";
import { getServerTimezone } from "@/lib/timezone";

export const metadata = createPageMetadata({
  title: "World Cup 2026 Knockout Bracket",
  description:
    "FIFA World Cup 2026 knockout bracket — Round of 32 through the Final, with live scores and tournament progress.",
  path: "/bracket",
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
      <AdBanner placement="inline" />
      <LiveKnockoutBracket initialData={bracket} />
    </div>
  );
}
