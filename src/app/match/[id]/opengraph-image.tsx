import { ImageResponse } from "next/og";
import { fetchEspnScoreboard } from "@/lib/espn/client";
import { transformEvent } from "@/lib/espn/transform";
import { getTeam } from "@/lib/data";
import { OgMatchLayout, OG_SIZE } from "@/lib/og-image";
import { isValidMatchId } from "@/lib/api-security";
import { getServerTimezone } from "@/lib/timezone";

export const alt = "World Cup 2026 match";
export const size = OG_SIZE;
export const contentType = "image/png";
export const revalidate = 30;

interface OgProps {
  params: Promise<{ id: string }>;
}

export default async function Image({ params }: OgProps) {
  const { id } = await params;

  if (!isValidMatchId(id)) {
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
            color: "#18181b",
          }}
        >
          World Cup 2026 Match
        </div>
      ),
      { ...size }
    );
  }

  try {
    const timeZone = await getServerTimezone();
    const scoreboard = await fetchEspnScoreboard({ dates: "20260611-20260719" });
    const event = scoreboard.events?.find((e) => e.id === id);

    if (!event) {
      throw new Error("match not found");
    }

    const match = transformEvent(event, timeZone);
    const home = getTeam(match.home, match.homeName, match.homeLogo);
    const away = getTeam(match.away, match.awayName, match.awayLogo);

    const score =
      match.status === "upcoming"
        ? "vs"
        : `${match.homeScore}–${match.awayScore}`;

    const statusLabel =
      match.status === "live"
        ? match.displayClock ?? `${match.minute ?? 0}'`
        : match.status === "finished"
          ? "Full Time"
          : "Upcoming";

    const badge =
      match.status === "live"
        ? { label: "Live", color: "#ffffff", bg: "#dc2626" }
        : match.status === "finished"
          ? { label: "Result", color: "#ffffff", bg: "#1d4ed8" }
          : undefined;

    const groupLabel =
      match.group === "?"
        ? match.stageLabel ?? "Knockout"
        : `Group ${match.group}`;

    return new ImageResponse(
      (
        <OgMatchLayout
          homeFlag={home.flag}
          awayFlag={away.flag}
          homeName={home.name}
          awayName={away.name}
          homeCode={match.home}
          awayCode={match.away}
          score={score}
          statusLabel={statusLabel}
          subtitle={`${groupLabel} · ${match.venue}`}
          badge={badge}
        />
      ),
      { ...size }
    );
  } catch {
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
            color: "#18181b",
          }}
        >
          World Cup 2026 Match
        </div>
      ),
      { ...size }
    );
  }
}
