import { PuzzlesHub } from "@/components/PuzzlesHub";
import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "Daily Football Puzzles",
  description: "Daily World Cup puzzles: guess the player, name scramble, and football trivia quiz.",
  path: "/puzzles",
});

export default function PuzzlesPage() {
  return <PuzzlesHub />;
}
