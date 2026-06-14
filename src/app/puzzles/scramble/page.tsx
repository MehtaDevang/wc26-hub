import { ScramblePuzzle } from "@/components/ScramblePuzzle";
import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "Name Scramble",
  description: "Unscramble the jumbled footballer name. A new World Cup puzzle every day.",
  path: "/puzzles/scramble",
});

export default function ScramblePage() {
  return <ScramblePuzzle />;
}
