import type { MetadataRoute } from "next";
import { fetchEspnScoreboard } from "@/lib/espn/client";
import { getAllGroupLetters } from "@/lib/espn/groups";
import { getAllPlayerSlugs } from "@/lib/espn/player-profile";
import { TEAMS } from "@/lib/data";
import { getSiteUrl } from "@/lib/site";
import { getAllVenues, getVenueSlug } from "@/lib/venues";
import { getAllCityGuides } from "@/lib/city-guides";
import { getAllWatchCountryIds } from "@/lib/watch-by-country";

export const revalidate = 1800;

const STATIC_ROUTES: Array<{
  path: string;
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
  priority: number;
}> = [
  { path: "/", changeFrequency: "always", priority: 1 },
  { path: "/fixtures", changeFrequency: "always", priority: 0.95 },
  { path: "/standings", changeFrequency: "always", priority: 0.95 },
  { path: "/bracket", changeFrequency: "hourly", priority: 0.95 },
  { path: "/bracket/predict", changeFrequency: "daily", priority: 0.9 },
  { path: "/scenarios", changeFrequency: "hourly", priority: 0.9 },
  { path: "/watch", changeFrequency: "hourly", priority: 0.9 },
  { path: "/leaders", changeFrequency: "hourly", priority: 0.9 },
  { path: "/teams", changeFrequency: "hourly", priority: 0.9 },
  { path: "/hosts", changeFrequency: "weekly", priority: 0.85 },
  { path: "/cities", changeFrequency: "weekly", priority: 0.85 },
  { path: "/stadiums", changeFrequency: "weekly", priority: 0.85 },
  { path: "/groups", changeFrequency: "hourly", priority: 0.9 },
  { path: "/players", changeFrequency: "hourly", priority: 0.85 },
  { path: "/history", changeFrequency: "weekly", priority: 0.8 },
  { path: "/puzzles", changeFrequency: "daily", priority: 0.7 },
  { path: "/puzzles/guess-player", changeFrequency: "daily", priority: 0.6 },
  { path: "/puzzles/scramble", changeFrequency: "daily", priority: 0.6 },
  { path: "/puzzles/quiz", changeFrequency: "daily", priority: 0.6 },
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

  for (const team of Object.keys(TEAMS)) {
    entries.push({
      url: `${siteUrl}/teams/${team}`,
      lastModified: now,
      changeFrequency: "hourly",
      priority: 0.85,
    });
  }

  for (const venue of getAllVenues()) {
    entries.push({
      url: `${siteUrl}/stadiums/${getVenueSlug(venue)}`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    });
  }

  for (const city of getAllCityGuides()) {
    entries.push({
      url: `${siteUrl}/cities/${city.slug}`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    });
  }

  for (const countryId of getAllWatchCountryIds()) {
    entries.push({
      url: `${siteUrl}/watch/${countryId}`,
      lastModified: now,
      changeFrequency: "hourly",
      priority: 0.85,
    });
  }

  for (const letter of getAllGroupLetters()) {
    entries.push({
      url: `${siteUrl}/groups/${letter}`,
      lastModified: now,
      changeFrequency: "hourly",
      priority: 0.85,
    });
  }

  try {
    const players = await getAllPlayerSlugs();
    for (const player of players) {
      entries.push({
        url: `${siteUrl}/players/${player.id}`,
        lastModified: now,
        changeFrequency: "daily",
        priority: 0.7,
      });
    }
  } catch {
    // Player URLs omitted if index build fails.
  }

  try {
    const scoreboard = await fetchEspnScoreboard({ dates: "20260611-20260719" });
    for (const event of scoreboard.events ?? []) {
      entries.push({
        url: `${siteUrl}/match/${event.id}`,
        lastModified: now,
        changeFrequency: "always",
        priority: 0.9,
      });
    }
  } catch {
    // Sitemap still works with static routes if ESPN is unavailable.
  }

  return entries;
}
