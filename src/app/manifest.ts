import type { MetadataRoute } from "next";
import { SITE_NAME, getSiteUrl } from "@/lib/site";

export default function manifest(): MetadataRoute.Manifest {
  const siteUrl = getSiteUrl();

  return {
    name: SITE_NAME,
    short_name: "Goal Posts",
    description:
      "FIFA World Cup 2026 live scores, fixtures, standings, and daily football puzzles.",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#1d4ed8",
    icons: [
      { src: "/favicon.svg", sizes: "any", type: "image/svg+xml" },
      { src: "/apple-touch-icon.svg", sizes: "180x180", type: "image/svg+xml" },
    ],
    scope: siteUrl,
    lang: "en",
  };
}
