import type { MetadataRoute } from "next";
import { fetchEspnScoreboard } from "@/lib/espn/client";
import { getAllGroupLetters } from "@/lib/espn/groups";
import { getIndexablePlayerSlugs } from "@/lib/espn/player-profile";
import { getOwnNews } from "@/lib/own-news";
import { TEAMS } from "@/lib/data";
import { getSiteUrl } from "@/lib/site";
import { getAllVenues, getVenueSlug } from "@/lib/venues";
import { getAllCityGuides } from "@/lib/city-guides";
import { getAllWatchCountryIds } from "@/lib/watch-by-country";
import { getAllRivalryPages } from "@/lib/rivalry-pages";
import { localePath } from "@/lib/i18n";

export const revalidate = 1800;

const STATIC_ROUTES: Array<{
  path: string;
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
  priority: number;
}> = [
  { path: "/", changeFrequency: "always", priority: 1 },
  { path: "/daily", changeFrequency: "hourly", priority: 0.9 },
  { path: "/my", changeFrequency: "hourly", priority: 0.92 },
  { path: "/fixtures", changeFrequency: "always", priority: 0.97 },
  { path: "/bracket", changeFrequency: "hourly", priority: 0.98 },
  { path: "/standings", changeFrequency: "daily", priority: 0.75 },
  { path: "/knockout", changeFrequency: "weekly", priority: 0.4 },
  { path: "/scenarios", changeFrequency: "weekly", priority: 0.4 },
  { path: "/watch", changeFrequency: "hourly", priority: 0.9 },
  { path: "/leaders", changeFrequency: "hourly", priority: 0.9 },
  { path: "/history", changeFrequency: "weekly", priority: 0.92 },
  { path: "/news", changeFrequency: "hourly", priority: 0.9 },
  { path: "/teams", changeFrequency: "hourly", priority: 0.9 },
  { path: "/hosts", changeFrequency: "weekly", priority: 0.85 },
  { path: "/cities", changeFrequency: "weekly", priority: 0.85 },
  { path: "/stadiums", changeFrequency: "weekly", priority: 0.85 },
  { path: "/groups", changeFrequency: "hourly", priority: 0.9 },
  { path: "/players", changeFrequency: "hourly", priority: 0.85 },
  { path: "/puzzles", changeFrequency: "daily", priority: 0.7 },
  { path: "/puzzles/guess-player", changeFrequency: "daily", priority: 0.6 },
  { path: "/puzzles/scramble", changeFrequency: "daily", priority: 0.6 },
  { path: "/puzzles/quiz", changeFrequency: "daily", priority: 0.6 },
  { path: "/puzzles/stats", changeFrequency: "daily", priority: 0.55 },
  { path: "/rivalries", changeFrequency: "weekly", priority: 0.8 },
  { path: "/wallpapers", changeFrequency: "weekly", priority: 0.75 },
  { path: "/install", changeFrequency: "monthly", priority: 0.7 },
  { path: "/about", changeFrequency: "yearly", priority: 0.5 },
  { path: "/contact", changeFrequency: "yearly", priority: 0.35 },
  { path: "/privacy", changeFrequency: "yearly", priority: 0.3 },
  { path: "/terms", changeFrequency: "yearly", priority: 0.3 },
  { path: "/es", changeFrequency: "always", priority: 0.9 },
  { path: "/es/fixtures", changeFrequency: "always", priority: 0.9 },
  { path: "/fr", changeFrequency: "always", priority: 0.9 },
  { path: "/fr/fixtures", changeFrequency: "always", priority: 0.9 },
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

  for (const rivalry of getAllRivalryPages()) {
    entries.push({
      url: `${siteUrl}/rivalries/${rivalry.slug}`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.75,
    });
  }

  entries.push({
    url: `${siteUrl}${localePath("es")}`,
    lastModified: now,
    changeFrequency: "always",
    priority: 0.9,
  });
  entries.push({
    url: `${siteUrl}${localePath("es", "/fixtures")}`,
    lastModified: now,
    changeFrequency: "always",
    priority: 0.9,
  });
  entries.push({
    url: `${siteUrl}${localePath("fr")}`,
    lastModified: now,
    changeFrequency: "always",
    priority: 0.9,
  });
  entries.push({
    url: `${siteUrl}${localePath("fr", "/fixtures")}`,
    lastModified: now,
    changeFrequency: "always",
    priority: 0.9,
  });

  for (const letter of getAllGroupLetters()) {
    entries.push({
      url: `${siteUrl}/groups/${letter}`,
      lastModified: now,
      changeFrequency: "hourly",
      priority: 0.85,
    });
  }

  try {
    const ownNews = await getOwnNews(50);
    for (const article of ownNews) {
      if (!article.isOriginal) continue;
      entries.push({
        url: `${siteUrl}/news/${article.id}`,
        lastModified: article.publishedAt ? new Date(article.publishedAt) : now,
        changeFrequency: "weekly",
        priority: 0.88,
      });
    }
  } catch {
    // Original news omitted if MongoDB is unavailable.
  }

  try {
    const players = await getIndexablePlayerSlugs();
    for (const player of players) {
      entries.push({
        url: `${siteUrl}/players/${player.id}`,
        lastModified: now,
        changeFrequency: "weekly",
        priority: 0.75,
      });
    }
  } catch {
    // Featured player URLs omitted if index build fails.
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
