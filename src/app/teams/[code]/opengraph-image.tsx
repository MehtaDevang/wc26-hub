import { ImageResponse } from "next/og";
import { OgTeamLayout, OG_SIZE } from "@/lib/og-image";
import { isValidTeamCode } from "@/lib/api-security";
import { resolveTeamCode, getTeamName } from "@/lib/team-lookup";
import { getTeamFlag } from "@/lib/teams";

export const alt = "World Cup 2026 team";
export const size = OG_SIZE;
export const contentType = "image/png";
export const revalidate = 300;

interface OgProps {
  params: Promise<{ code: string }>;
}

export default async function Image({ params }: OgProps) {
  const { code } = await params;
  const teamCode = resolveTeamCode(code) ?? code.toUpperCase();

  if (!isValidTeamCode(code)) {
    return new ImageResponse(
      (
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 48,
            fontWeight: 700,
            background: "#f8fafc",
          }}
        >
          World Cup 2026 Team
        </div>
      ),
      { ...size }
    );
  }

  const teamName = getTeamName(teamCode);
  const flag = getTeamFlag(teamCode);

  return new ImageResponse(
    (
      <OgTeamLayout
        flag={flag}
        teamName={teamName}
        subtitle="Live scores, fixtures, squad players & tournament stats"
      />
    ),
    { ...size }
  );
}
