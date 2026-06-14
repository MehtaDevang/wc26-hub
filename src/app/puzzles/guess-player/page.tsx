import { GuessPlayerGame } from "@/components/GuessPlayerGame";
import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "Guess the Player",
  description: "Daily World Cup player guessing game with progressive clues. Five rounds every day.",
  path: "/puzzles/guess-player",
});

export default function GuessPlayerPage() {
  return <GuessPlayerGame />;
}
