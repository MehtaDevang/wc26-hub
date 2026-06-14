import type { MetadataRoute } from "next";
import { SITE_NAME, getSiteUrl, SITE_DESCRIPTION } from "@/lib/site";

export default function manifest(): MetadataRoute.Manifest {
  const siteUrl = getSiteUrl();

  return {
    name: `${SITE_NAME} — World Cup 2026 Live Scores`,
    short_name: "Goal Posts",
    description: SITE_DESCRIPTION,
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#002868",
    icons: [
      { src: "/favicon.svg", sizes: "any", type: "image/svg+xml" },
      { src: "/apple-touch-icon.svg", sizes: "180x180", type: "image/svg+xml" },
    ],
    scope: siteUrl,
    lang: "en",
    categories: ["sports", "news"],
  };
}
