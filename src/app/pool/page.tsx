import { OfficePoolKit } from "@/components/OfficePoolKit";
import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "World Cup 2026 Office Pool — Free Bracket & Rules PDF",
  description:
    "Free FIFA World Cup 2026 office pool kit — printable bracket sheet, scoring rules, and tiebreakers. Perfect for workplaces and watch parties.",
  path: "/pool",
  keywords: [
    "World Cup office pool",
    "bracket pool rules",
    "World Cup 2026 pool template",
    "printable World Cup bracket",
  ],
});

export default function PoolPage() {
  return <OfficePoolKit />;
}
