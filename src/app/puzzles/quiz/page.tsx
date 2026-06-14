import { QuizPuzzle } from "@/components/QuizPuzzle";
import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "Daily Football Quiz",
  description: "One World Cup trivia question every day. Test your football knowledge in five rounds.",
  path: "/puzzles/quiz",
});

export default function QuizPage() {
  return <QuizPuzzle />;
}
