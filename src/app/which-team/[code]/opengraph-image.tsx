import { ImageResponse } from "next/og";
import { OgTeamPersonalityLayout, OG_SIZE } from "@/lib/og-image";
import { getTeamMatchByCode, ELIGIBLE_TEAM_CODES } from "@/lib/quiz/team-personality";

export const alt = "Which World Cup 2026 team are you?";
export const size = OG_SIZE;
export const contentType = "image/png";

export function generateStaticParams() {
  return ELIGIBLE_TEAM_CODES.map((code) => ({ code: code.toLowerCase() }));
}

export default async function Image({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  const match = getTeamMatchByCode(code);

  if (!match) {
    return new ImageResponse(
      (
        <OgTeamPersonalityLayout flag="⚽" teamName="Which team are you?" tagline="Take the quiz" code="BRA" />
      ),
      { ...size }
    );
  }

  return new ImageResponse(
    (
      <OgTeamPersonalityLayout
        flag={match.flag}
        teamName={match.name}
        tagline={match.tagline}
        code={match.code}
      />
    ),
    { ...size }
  );
}
