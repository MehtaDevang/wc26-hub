import { ImageResponse } from "next/og";
import {
  WALLPAPERS,
  WALLPAPER_FORMATS,
  getWallpaper,
  isWallpaperFormat,
  type Wallpaper,
} from "@/lib/wallpapers";

export const dynamic = "force-static";

export function generateStaticParams() {
  const params: { slug: string; format: string }[] = [];
  for (const wallpaper of WALLPAPERS) {
    for (const format of Object.keys(WALLPAPER_FORMATS)) {
      params.push({ slug: wallpaper.slug, format });
    }
  }
  return params;
}

function Poster({
  wallpaper,
  width,
  height,
}: {
  wallpaper: Wallpaper;
  width: number;
  height: number;
}) {
  const { theme, headline, match, venue, caption, year } = wallpaper;
  const portrait = height >= width;
  const unit = Math.min(width, height) / 100;

  return (
    <div
      style={{
        position: "relative",
        display: "flex",
        flexDirection: "column",
        width: "100%",
        height: "100%",
        backgroundImage: `linear-gradient(135deg, ${theme.from} 0%, ${theme.to} 100%)`,
        color: theme.ink,
        overflow: "hidden",
        fontFamily: "sans-serif",
      }}
    >
      {/* Accent top bar */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: unit * 0.9,
          backgroundColor: theme.accent,
          display: "flex",
        }}
      />
      {/* Giant faint year */}
      <div
        style={{
          position: "absolute",
          display: "flex",
          right: portrait ? -unit * 6 : -unit * 4,
          bottom: portrait ? unit * 18 : -unit * 10,
          fontSize: unit * (portrait ? 46 : 60),
          fontWeight: 800,
          color: "rgba(255,255,255,0.08)",
          lineHeight: 1,
        }}
      >
        {year}
      </div>
      {/* Translucent circles */}
      <div
        style={{
          position: "absolute",
          top: -unit * 14,
          left: -unit * 12,
          width: unit * 46,
          height: unit * 46,
          borderRadius: 9999,
          backgroundColor: "rgba(255,255,255,0.06)",
          display: "flex",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: -unit * 10,
          right: portrait ? -unit * 8 : unit * 6,
          width: unit * 30,
          height: unit * 30,
          borderRadius: 9999,
          border: `${unit * 0.7}px solid ${theme.accent}`,
          opacity: 0.35,
          display: "flex",
        }}
      />

      {/* Content */}
      <div
        style={{
          position: "relative",
          display: "flex",
          flexDirection: "column",
          width: "100%",
          height: "100%",
          padding: portrait ? unit * 8 : unit * 9,
          paddingBottom: portrait ? unit * 8 : unit * 11,
          justifyContent: portrait ? "center" : "flex-end",
          alignItems: "flex-start",
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: unit * 2.6,
            fontWeight: 700,
            letterSpacing: unit * 0.5,
            color: theme.accent,
          }}
        >
          {`FIFA WORLD CUP ${year}`}
        </div>
        <div
          style={{
            display: "flex",
            marginTop: unit * 2.5,
            fontSize: unit * (portrait ? 11 : 13),
            fontWeight: 800,
            lineHeight: 1.02,
            maxWidth: portrait ? "100%" : "70%",
          }}
        >
          {headline.toUpperCase()}
        </div>
        <div
          style={{
            marginTop: unit * 3,
            width: unit * 9,
            height: unit * 0.9,
            backgroundColor: theme.accent,
            display: "flex",
          }}
        />
        <div style={{ display: "flex", marginTop: unit * 3.5, fontSize: unit * 3, fontWeight: 700 }}>
          {match}
        </div>
        <div style={{ display: "flex", marginTop: unit * 1.4, fontSize: unit * 2.3, opacity: 0.85 }}>
          {venue}
        </div>
        <div
          style={{
            display: "flex",
            marginTop: unit * 3,
            fontSize: unit * 2.2,
            lineHeight: 1.35,
            opacity: 0.82,
            maxWidth: portrait ? "100%" : "60%",
          }}
        >
          {caption}
        </div>
        <div
          style={{
            display: "flex",
            marginTop: unit * 4,
            fontSize: unit * 2,
            fontWeight: 700,
            color: theme.accent,
            letterSpacing: unit * 0.2,
          }}
        >
          thegoalposts.in
        </div>
      </div>
    </div>
  );
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string; format: string }> }
) {
  const { slug, format } = await params;
  const wallpaper = getWallpaper(slug);

  if (!wallpaper || !isWallpaperFormat(format)) {
    return new Response("Not found", { status: 404 });
  }

  const { width, height } = WALLPAPER_FORMATS[format];

  return new ImageResponse(
    <Poster wallpaper={wallpaper} width={width} height={height} />,
    {
      width,
      height,
      headers: {
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    }
  );
}
