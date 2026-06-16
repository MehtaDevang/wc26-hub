import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { JsonLd } from "@/components/JsonLd";
import { TeamPersonalityResultCard } from "@/components/TeamPersonalityResultCard";
import { ShareButtons } from "@/components/ShareButtons";
import {
  ELIGIBLE_TEAM_CODES,
  getTeamMatchByCode,
} from "@/lib/quiz/team-personality";
import { buildTeamPersonalitySharePayload } from "@/lib/share";
import { createPageMetadata } from "@/lib/seo";
import { buildBreadcrumbJsonLd } from "@/lib/structured-data";

export function generateStaticParams() {
  return ELIGIBLE_TEAM_CODES.map((code) => ({ code: code.toLowerCase() }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ code: string }>;
}): Promise<Metadata> {
  const { code } = await params;
  const match = getTeamMatchByCode(code);
  if (!match) {
    return createPageMetadata({
      title: "Which World Cup Team Are You?",
      path: "/which-team",
    });
  }
  const lower = match.code.toLowerCase();
  return createPageMetadata({
    title: `I'm ${match.name} — Which World Cup Team Are You?`,
    description: `${match.flag} ${match.name}: ${match.tagline} Take the quiz and find out which FIFA World Cup 2026 team matches your style.`,
    path: `/which-team/${lower}`,
    ogImagePath: `/which-team/${lower}/opengraph-image`,
  });
}

export default async function WhichTeamResultPage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = await params;
  const match = getTeamMatchByCode(code);
  if (!match) notFound();

  const share = buildTeamPersonalitySharePayload(match.code, match.name, match.flag);

  return (
    <div className="mx-auto max-w-xl space-y-5 py-4">
      <JsonLd
        data={buildBreadcrumbJsonLd([
          { name: "Which team are you?", path: "/which-team" },
          { name: match.name, path: `/which-team/${match.code.toLowerCase()}` },
        ])}
      />

      <TeamPersonalityResultCard top={match} intro="This player's World Cup team is">
        <div className="space-y-3 pt-1">
          <ShareButtons
            url={share.url}
            title={share.title}
            text={share.text}
            label={share.label}
            className="justify-center"
          />
        </div>
      </TeamPersonalityResultCard>

      <Link
        href="/which-team"
        className="btn-primary mx-auto flex w-fit items-center gap-1.5 px-5 py-2.5 text-sm"
      >
        Which team are you? Take the quiz <ArrowRight size={16} />
      </Link>
    </div>
  );
}
