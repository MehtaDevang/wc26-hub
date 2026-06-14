import type { MetadataRoute } from "next";
import { fetchEspnScoreboard } from "@/lib/espn/client";
import { getSiteUrl } from "@/lib/site";

const STATIC_ROUTES: Array<{
  path: string;
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
  priority: number;
}> = [
  { path: "/", changeFrequency: "hourly", priority: 1 },
  { path: "/fixtures", changeFrequency: "hourly", priority: 0.9 },
  { path: "/standings", changeFrequency: "hourly", priority: 0.9 },
  { path: "/history", changeFrequency: "weekly", priority: 0.8 },
  { path: "/puzzles", changeFrequency: "daily", priority: 0.8 },
  { path: "/puzzles/guess-player", changeFrequency: "daily", priority: 0.7 },
  { path: "/puzzles/scramble", changeFrequency: "daily", priority: 0.7 },
  { path: "/puzzles/quiz", changeFrequency: "daily", priority: 0.7 },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = getSiteUrl();
  const now = new Date();

  const entries: MetadataRoute.Sitemap = STATIC_ROUTES.map((route) => ({
    url: `${siteUrl}${route.path}`,
    lastModified: now,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));

  try {
    const scoreboard = await fetchEspnScoreboard({ dates: "20260611-20260719" });
    for (const event of scoreboard.events ?? []) {
      entries.push({
        url: `${siteUrl}/match/${event.id}`,
        lastModified: now,
        changeFrequency: "hourly",
        priority: 0.85,
      });
    }
  } catch {
    // Sitemap still works with static routes if ESPN is unavailable.
  }

  return entries;
}
