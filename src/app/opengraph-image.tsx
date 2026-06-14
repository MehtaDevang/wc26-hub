import { ImageResponse } from "next/og";
import { SITE_DESCRIPTION, SITE_NAME } from "@/lib/site";

export const alt = `${SITE_NAME} — World Cup 2026`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "72px",
          background: "linear-gradient(135deg, #ffffff 0%, #f0f7ff 45%, #fff8e8 100%)",
          color: "#18181b",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
            fontSize: 28,
            fontWeight: 700,
            color: "#1d4ed8",
          }}
        >
          <span>⚽</span>
          <span>{SITE_NAME}</span>
        </div>
        <div
          style={{
            marginTop: 32,
            fontSize: 64,
            fontWeight: 800,
            lineHeight: 1.1,
            maxWidth: 900,
          }}
        >
          FIFA World Cup 2026
        </div>
        <div
          style={{
            marginTop: 24,
            fontSize: 30,
            lineHeight: 1.4,
            color: "#52525b",
            maxWidth: 820,
          }}
        >
          {SITE_DESCRIPTION}
        </div>
        <div
          style={{
            marginTop: 48,
            display: "flex",
            gap: 12,
          }}
        >
          {["Live Scores", "Fixtures", "Puzzles", "History"].map((label) => (
            <div
              key={label}
              style={{
                padding: "10px 20px",
                borderRadius: 999,
                background: "#1d4ed8",
                color: "#ffffff",
                fontSize: 22,
                fontWeight: 600,
              }}
            >
              {label}
            </div>
          ))}
        </div>
      </div>
    ),
    { ...size }
  );
}
