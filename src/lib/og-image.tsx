import { SITE_NAME } from "./site";
import { getTeamColors } from "./team-colors";

export const OG_SIZE = { width: 1200, height: 630 };

export function OgShell({
  eyebrow,
  title,
  subtitle,
  badge,
  footer,
  accent,
}: {
  eyebrow: string;
  title: string;
  subtitle?: string;
  badge?: { label: string; color: string; bg: string };
  footer?: string;
  accent?: string;
}) {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "56px 64px",
        background: "linear-gradient(135deg, #ffffff 0%, #f0f7ff 45%, #fff8e8 100%)",
        color: "#18181b",
        position: "relative",
      }}
    >
      {accent && (
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 8,
            background: accent,
          }}
        />
      )}
      <div style={{ display: "flex", flexDirection: "column" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            fontSize: 24,
            fontWeight: 700,
            color: "#1d4ed8",
          }}
        >
          <span>⚽</span>
          <span>{SITE_NAME}</span>
        </div>
        <div
          style={{
            marginTop: 28,
            fontSize: 22,
            fontWeight: 600,
            color: "#71717a",
            textTransform: "uppercase",
            letterSpacing: "0.08em",
          }}
        >
          {eyebrow}
        </div>
        <div
          style={{
            marginTop: 16,
            fontSize: 58,
            fontWeight: 800,
            lineHeight: 1.08,
            maxWidth: 980,
          }}
        >
          {title}
        </div>
        {subtitle && (
          <div
            style={{
              marginTop: 18,
              fontSize: 28,
              lineHeight: 1.35,
              color: "#52525b",
              maxWidth: 900,
            }}
          >
            {subtitle}
          </div>
        )}
      </div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ fontSize: 22, color: "#a1a1aa", fontWeight: 600 }}>
          {footer ?? "thegoalposts.in"}
        </div>
        {badge && (
          <div
            style={{
              padding: "10px 22px",
              borderRadius: 999,
              background: badge.bg,
              color: badge.color,
              fontSize: 22,
              fontWeight: 800,
              textTransform: "uppercase",
              letterSpacing: "0.06em",
            }}
          >
            {badge.label}
          </div>
        )}
      </div>
    </div>
  );
}

export function OgMatchLayout({
  homeFlag,
  awayFlag,
  homeName,
  awayName,
  homeCode,
  awayCode,
  homeRank,
  awayRank,
  score,
  statusLabel,
  subtitle,
  badge,
}: {
  homeFlag: string;
  awayFlag: string;
  homeName: string;
  awayName: string;
  homeCode: string;
  awayCode: string;
  homeRank?: number;
  awayRank?: number;
  score: string;
  statusLabel: string;
  subtitle: string;
  badge?: { label: string; color: string; bg: string };
}) {
  const homeColors = getTeamColors(homeCode);
  const awayColors = getTeamColors(awayCode);
  const accent = `linear-gradient(90deg, ${homeColors.primary} 0%, ${homeColors.primary} 48%, ${awayColors.primary} 52%, ${awayColors.primary} 100%)`;

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "48px 56px",
        background: "linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)",
        color: "#18181b",
      }}
    >
      <div style={{ height: 8, borderRadius: 999, background: accent }} />
      <div style={{ display: "flex", alignItems: "center", gap: 12, fontSize: 22, fontWeight: 700, color: "#1d4ed8" }}>
        <span>⚽</span>
        <span>{SITE_NAME}</span>
        <span style={{ color: "#d4d4d8" }}>·</span>
        <span style={{ color: "#71717a", fontWeight: 600 }}>World Cup 2026</span>
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 48,
          flex: 1,
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: 300 }}>
          <div style={{ fontSize: 88, lineHeight: 1 }}>{homeFlag}</div>
          <div style={{ marginTop: 16, fontSize: 34, fontWeight: 800, textAlign: "center" }}>{homeName}</div>
          {homeRank != null && (
            <div style={{ marginTop: 8, fontSize: 20, fontWeight: 600, color: "#a1a1aa" }}>
              FIFA #{homeRank}
            </div>
          )}
        </div>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", minWidth: 220 }}>
          <div style={{ fontSize: 88, fontWeight: 800, letterSpacing: "-0.04em" }}>{score}</div>
          <div style={{ marginTop: 12, fontSize: 24, fontWeight: 700, color: "#71717a" }}>{statusLabel}</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: 300 }}>
          <div style={{ fontSize: 88, lineHeight: 1 }}>{awayFlag}</div>
          <div style={{ marginTop: 16, fontSize: 34, fontWeight: 800, textAlign: "center" }}>{awayName}</div>
          {awayRank != null && (
            <div style={{ marginTop: 8, fontSize: 20, fontWeight: 600, color: "#a1a1aa" }}>
              FIFA #{awayRank}
            </div>
          )}
        </div>
      </div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ fontSize: 22, color: "#71717a" }}>{subtitle}</div>
        {badge && (
          <div
            style={{
              padding: "10px 22px",
              borderRadius: 999,
              background: badge.bg,
              color: badge.color,
              fontSize: 20,
              fontWeight: 800,
              textTransform: "uppercase",
            }}
          >
            {badge.label}
          </div>
        )}
      </div>
    </div>
  );
}

export function OgTeamLayout({
  flag,
  teamName,
  subtitle,
}: {
  flag: string;
  teamName: string;
  subtitle: string;
}) {
  return (
    <OgShell
      eyebrow="FIFA World Cup 2026"
      title={`${flag} ${teamName}`}
      subtitle={subtitle}
      footer="Fixtures · Results · Squad · Stats"
    />
  );
}

export function OgGroupLayout({
  group,
  teams,
  subtitle,
}: {
  group: string;
  teams: string[];
  subtitle: string;
}) {
  return (
    <OgShell
      eyebrow="Group Standings"
      title={`World Cup 2026 Group ${group}`}
      subtitle={subtitle}
      footer={teams.slice(0, 4).join(" · ")}
      accent="linear-gradient(90deg, #006847 0%, #002868 50%, #D80621 100%)"
    />
  );
}

export function OgPuzzlesLayout() {
  return (
    <OgShell
      eyebrow="Daily Football Puzzles"
      title="Can you solve today's World Cup set?"
      subtitle="Guess the Player · Name Scramble · Trivia Quiz - new puzzles every day."
      badge={{ label: "Play now", color: "#ffffff", bg: "#1d4ed8" }}
    />
  );
}
