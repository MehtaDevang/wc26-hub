import { ImageResponse } from "next/og";
import { OgGroupLayout, OG_SIZE } from "@/lib/og-image";
import { isValidGroupLetter } from "@/lib/api-security";
import { getGroupPageData, normalizeGroupLetter } from "@/lib/espn/groups";
import { getServerTimezone } from "@/lib/timezone";

export const alt = "World Cup 2026 group standings";
export const size = OG_SIZE;
export const contentType = "image/png";
export const revalidate = 120;

interface OgProps {
  params: Promise<{ letter: string }>;
}

export default async function Image({ params }: OgProps) {
  const { letter } = await params;
  const group = normalizeGroupLetter(letter);

  if (!isValidGroupLetter(letter)) {
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
          World Cup 2026 Group
        </div>
      ),
      { ...size }
    );
  }

  try {
    const timeZone = await getServerTimezone();
    const data = await getGroupPageData(letter, timeZone);
    if (!data) throw new Error("group not found");

    const leader = data.standings.rows[0];
    const subtitle = leader
      ? `${leader.team} lead on ${leader.points} pts · Live table & fixtures`
      : "Live standings, fixtures & results";

    return new ImageResponse(
      (
        <OgGroupLayout
          group={group}
          teams={data.standings.rows.map((row) => row.team)}
          subtitle={subtitle}
        />
      ),
      { ...size }
    );
  } catch {
    return new ImageResponse(
      (
        <OgGroupLayout
          group={group}
          teams={[]}
          subtitle="Live standings, fixtures & results"
        />
      ),
      { ...size }
    );
  }
}
