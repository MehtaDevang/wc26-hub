import type { MetadataRoute } from "next";
import { SITE_NAME, SITE_DESCRIPTION } from "@/lib/site";

export default function manifest(): MetadataRoute.Manifest {
  return {
    id: "/",
    name: `${SITE_NAME} - World Cup 2026 Live Scores`,
    short_name: "Goal Posts",
    description: SITE_DESCRIPTION,
    start_url: "/?source=pwa",
    display: "standalone",
    display_override: ["standalone", "minimal-ui"],
    orientation: "any",
    background_color: "#002868",
    theme_color: "#002868",
    icons: [
      { src: "/favicon.svg", sizes: "any", type: "image/svg+xml", purpose: "any" },
      { src: "/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icon-maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
    scope: "/",
    lang: "en",
    dir: "ltr",
    categories: ["sports", "news"],
    prefer_related_applications: false,
    shortcuts: [
      {
        name: "Live scores & fixtures",
        short_name: "Fixtures",
        url: "/fixtures?source=pwa",
        icons: [{ src: "/icon-192.png", sizes: "192x192", type: "image/png" }],
      },
      {
        name: "Group standings",
        short_name: "Standings",
        url: "/standings?source=pwa",
        icons: [{ src: "/icon-192.png", sizes: "192x192", type: "image/png" }],
      },
      {
        name: "Today at the World Cup",
        short_name: "Today",
        url: "/daily?source=pwa",
        icons: [{ src: "/icon-192.png", sizes: "192x192", type: "image/png" }],
      },
      {
        name: "My World Cup",
        short_name: "My WC",
        url: "/my?source=pwa",
        icons: [{ src: "/icon-192.png", sizes: "192x192", type: "image/png" }],
      },
    ],
  };
}
