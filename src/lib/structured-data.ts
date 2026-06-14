import type { Match } from "./types";
import { getSiteUrl, SITE_DESCRIPTION, SITE_NAME, SITE_TAGLINE } from "./site";

export function buildOrganizationJsonLd() {
  const siteUrl = getSiteUrl();

  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${siteUrl}/#organization`,
    name: SITE_NAME,
    url: siteUrl,
    logo: `${siteUrl}/favicon.svg`,
    email: "hello@thegoalposts.in",
    description: SITE_TAGLINE,
  };
}

export function buildWebsiteJsonLd() {
  const siteUrl = getSiteUrl();

  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${siteUrl}/#website`,
    name: SITE_NAME,
    url: siteUrl,
    description: SITE_DESCRIPTION,
    inLanguage: "en-US",
    publisher: { "@id": `${siteUrl}/#organization` },
    about: {
      "@type": "SportsEvent",
      name: "FIFA World Cup 2026",
      sport: "Association Football",
      location: {
        "@type": "Place",
        name: "United States, Mexico, and Canada",
      },
    },
    potentialAction: {
      "@type": "ReadAction",
      target: [
        `${siteUrl}/fixtures`,
        `${siteUrl}/standings`,
        `${siteUrl}/teams`,
        `${siteUrl}/players`,
      ],
    },
  };
}

export function buildWebPageJsonLd({
  path,
  title,
  description,
}: {
  path: string;
  title: string;
  description: string;
}) {
  const siteUrl = getSiteUrl();
  const url = `${siteUrl}${path.startsWith("/") ? path : `/${path}`}`;

  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${url}#webpage`,
    url,
    name: title,
    description,
    isPartOf: { "@id": `${siteUrl}/#website` },
    inLanguage: "en-US",
    publisher: { "@id": `${siteUrl}/#organization` },
  };
}

export function buildBreadcrumbJsonLd(
  items: Array<{ name: string; path: string }>
) {
  const siteUrl = getSiteUrl();

  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `${siteUrl}${item.path.startsWith("/") ? item.path : `/${item.path}`}`,
    })),
  };
}

export function buildSportsEventJsonLd(match: Match, matchId: string) {
  const siteUrl = getSiteUrl();
  const url = `${siteUrl}/match/${matchId}`;

  const event: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "SportsEvent",
    "@id": `${url}#event`,
    name: `${match.homeName} vs ${match.awayName} — FIFA World Cup 2026`,
    sport: "Association Football",
    startDate: match.kickoffAt || `${match.date}T00:00:00Z`,
    url,
    description: `Live score, stats, lineups, highlights, and head-to-head history for ${match.homeName} vs ${match.awayName} at the FIFA World Cup 2026.`,
    location: {
      "@type": "Place",
      name: match.venue,
      address: {
        "@type": "PostalAddress",
        addressLocality: match.venueCity,
        addressCountry: match.venueCountry,
      },
    },
    homeTeam: {
      "@type": "SportsTeam",
      name: match.homeName,
      sport: "Association Football",
    },
    awayTeam: {
      "@type": "SportsTeam",
      name: match.awayName,
      sport: "Association Football",
    },
    competitor: [
      { "@type": "SportsTeam", name: match.homeName },
      { "@type": "SportsTeam", name: match.awayName },
    ],
    organizer: {
      "@type": "Organization",
      name: "FIFA World Cup 2026",
    },
    isPartOf: {
      "@type": "SportsEvent",
      name: "FIFA World Cup 2026",
    },
  };

  if (match.status === "upcoming") {
    event.eventStatus = "https://schema.org/EventScheduled";
  } else if (match.status === "live") {
    event.eventStatus = "https://schema.org/EventScheduled";
    event.eventAttendanceMode = "https://schema.org/OfflineEventAttendanceMode";
  } else if (match.status === "finished") {
    event.eventStatus = "https://schema.org/EventCompleted";
  }

  if (match.status !== "upcoming" && match.homeScore != null && match.awayScore != null) {
    event.description = `${match.homeName} ${match.homeScore}-${match.awayScore} ${match.awayName}. Stats, scorers, highlights, and head-to-head at FIFA World Cup 2026.`;
  }

  return event;
}

export function buildSportsTeamJsonLd({
  name,
  code,
  path,
}: {
  name: string;
  code: string;
  path: string;
}) {
  const siteUrl = getSiteUrl();
  const url = `${siteUrl}${path}`;

  return {
    "@context": "https://schema.org",
    "@type": "SportsTeam",
    name,
    sport: "Association Football",
    url,
    identifier: code,
    memberOf: {
      "@type": "SportsEvent",
      name: "FIFA World Cup 2026",
    },
  };
}

export function buildItemListJsonLd({
  name,
  path,
  items,
}: {
  name: string;
  path: string;
  items: Array<{ name: string; url: string }>;
}) {
  const siteUrl = getSiteUrl();

  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name,
    url: `${siteUrl}${path}`,
    numberOfItems: items.length,
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      url: item.url.startsWith("http") ? item.url : `${siteUrl}${item.url}`,
    })),
  };
}
