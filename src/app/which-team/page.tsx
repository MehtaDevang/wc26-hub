import { TeamPersonalityQuiz } from "@/components/TeamPersonalityQuiz";
import { JsonLd } from "@/components/JsonLd";
import { createPageMetadata } from "@/lib/seo";
import { buildBreadcrumbJsonLd } from "@/lib/structured-data";

export const metadata = createPageMetadata({
  title: "Which World Cup Team Are You?",
  description:
    "Take our fun personality quiz and find out which FIFA World Cup 2026 team matches your style. Answer 8 quick questions and share your result.",
  path: "/which-team",
  keywords: [
    "which world cup team are you",
    "world cup 2026 quiz",
    "football personality quiz",
    "which team are you quiz",
  ],
});

export default function WhichTeamPage() {
  return (
    <div className="py-4">
      <JsonLd
        data={buildBreadcrumbJsonLd([
          { name: "Which team are you?", path: "/which-team" },
        ])}
      />
      <TeamPersonalityQuiz />
    </div>
  );
}
