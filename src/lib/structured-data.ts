import type { Match } from "./types";
import { getSiteUrl, SITE_DESCRIPTION, SITE_NAME, SITE_TAGLINE, SITE_TWITTER_URL } from "./site";
import { lookupVenue } from "./venues";

const FIFA_ORGANIZER_URL = "https://www.fifa.com/";
const FIFA_TOURNAMENT_URL =
  "https://www.fifa.com/fifaplus/en/tournaments/mens/worldcup/canadamexicousa2026";

/** Stable @id for the tournament — referenced from WebSite, teams, and matches */
export function worldCup2026EventId(siteUrl?: string): string {
  return `${siteUrl ?? getSiteUrl()}/#wc2026`;
}

function countryToIso(country?: string): string {
  if (!country) return "US";
  const c = country.toLowerCase();
  if (c.includes("mexico") || c === "mx") return "MX";
  if (c.includes("canada") || c === "ca") return "CA";
  return "US";
}

function normalizeIsoDate(iso: string): string {
  const ms = Date.parse(iso);
  if (Number.isNaN(ms)) return "2026-06-11T19:00:00.000Z";
  return new Date(ms).toISOString();
}

function ensureIsoStartDate(kickoffAt?: string, fallbackDate?: string): string {
  if (kickoffAt && !Number.isNaN(Date.parse(kickoffAt))) {
    return normalizeIsoDate(kickoffAt);
  }
  if (fallbackDate?.match(/^\d{4}-\d{2}-\d{2}$/)) {
    return normalizeIsoDate(`${fallbackDate}T18:00:00Z`);
  }
  return "2026-06-11T19:00:00.000Z";
}

function matchEndDate(kickoffAt: string): string {
  const start = Date.parse(kickoffAt);
  if (Number.isNaN(start)) return normalizeIsoDate(kickoffAt);
  // Typical match window: 105 minutes (90 + stoppage)
  return new Date(start + 105 * 60 * 1000).toISOString();
}

/** Minimal tournament reference — use when nesting under SportsTeam.memberOf */
export function buildWorldCup2026EventRef(siteUrl?: string) {
  const base = siteUrl ?? getSiteUrl();
  return {
    "@type": "SportsEvent" as const,
    "@id": worldCup2026EventId(base),
    name: "FIFA World Cup 2026",
    startDate: "2026-06-11T19:00:00.000Z",
    endDate: "2026-07-19T23:59:59.000Z",
  };
}

function buildFifaOrganizer() {
  return {
    "@type": "Organization",
    name: "Fédération Internationale de Football Association",
    alternateName: "FIFA",
    url: FIFA_ORGANIZER_URL,
  };
}

function buildMatchEventLocation(match: Match) {
  const venueMeta = lookupVenue(match.venue, match.venueCity, match.venueCountry);
  const city = match.venueCity ?? venueMeta?.city;
  const country = match.venueCountry ?? venueMeta?.country;
  const streetAddress = match.venue !== "TBD" ? match.venue : venueMeta?.name;

  const address: Record<string, string> = {
    "@type": "PostalAddress",
    addressCountry: countryToIso(country),
  };
  if (streetAddress) address.streetAddress = streetAddress;
  if (city) address.addressLocality = city;

  const place: Record<string, unknown> = {
    "@type": "Place",
    name: match.venue !== "TBD" ? match.venue : (city ?? "World Cup 2026 host venue"),
    address,
  };
  if (venueMeta?.imageUrl) place.image = venueMeta.imageUrl;

  return place;
}

/** Full tournament SportsEvent — emitted once sitewide in layout */
export function buildWorldCup2026EventJsonLd() {
  const siteUrl = getSiteUrl();

  return {
    "@context": "https://schema.org",
    "@type": "SportsEvent",
    "@id": worldCup2026EventId(siteUrl),
    name: "FIFA World Cup 2026",
    alternateName: "World Cup 2026",
    sport: "Association Football",
    startDate: "2026-06-11T19:00:00.000Z",
    endDate: "2026-07-19T23:59:59.000Z",
    eventStatus: "https://schema.org/EventScheduled",
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    url: FIFA_TOURNAMENT_URL,
    image: `${siteUrl}/opengraph-image`,
    location: {
      "@type": "Place",
      name: "United States, Mexico, and Canada",
      address: {
        "@type": "PostalAddress",
        addressLocality: "USA, Mexico, Canada",
        addressCountry: "US",
      },
    },
    organizer: buildFifaOrganizer(),
    offers: {
      "@type": "Offer",
      url: FIFA_TOURNAMENT_URL,
      availability: "https://schema.org/InStock",
      validFrom: "2026-01-01T00:00:00.000Z",
      description: "Official FIFA World Cup 2026 tournament information",
    },
  };
}

/** Single @graph block so @id references (WebSite.about, team memberOf) always resolve */
export function buildSiteStructuredDataGraph() {
  const organization = buildOrganizationJsonLd();
  const website = buildWebsiteJsonLd();
  const tournament = buildWorldCup2026EventJsonLd();

  return {
    "@context": "https://schema.org",
    "@graph": [organization, website, tournament],
  };
}

export function buildOrganizationJsonLd() {
  const siteUrl = getSiteUrl();

  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${siteUrl}/#organization`,
    name: SITE_NAME,
    url: siteUrl,
    logo: `${siteUrl}/apple-touch-icon.svg`,
    email: "hello@thegoalposts.in",
    description: SITE_TAGLINE,
    sameAs: [SITE_TWITTER_URL],
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
    about: { "@id": worldCup2026EventId(siteUrl) },
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
  const startDate = ensureIsoStartDate(match.kickoffAt, match.date);
  const endDate = matchEndDate(startDate);

  const event: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "SportsEvent",
    "@id": `${url}#event`,
    name: `${match.homeName} vs ${match.awayName} — FIFA World Cup 2026`,
    sport: "Association Football",
    startDate,
    endDate,
    url,
    image: `${siteUrl}/match/${matchId}/opengraph-image`,
    description: `Live score, stats, lineups, highlights, and head-to-head history for ${match.homeName} vs ${match.awayName} at the FIFA World Cup 2026.`,
    location: buildMatchEventLocation(match),
    homeTeam: {
      "@type": "SportsTeam",
      name: match.homeName,
      sport: "Association Football",
      ...(match.homeLogo ? { logo: match.homeLogo } : {}),
    },
    awayTeam: {
      "@type": "SportsTeam",
      name: match.awayName,
      sport: "Association Football",
      ...(match.awayLogo ? { logo: match.awayLogo } : {}),
    },
    competitor: [
      { "@type": "SportsTeam", name: match.homeName },
      { "@type": "SportsTeam", name: match.awayName },
    ],
    organizer: buildFifaOrganizer(),
    isPartOf: buildWorldCup2026EventRef(siteUrl),
    offers: {
      "@type": "Offer",
      url: `${siteUrl}/watch`,
      availability: "https://schema.org/InStock",
      validFrom: startDate,
      description: "Where to watch this match on TV and streaming",
    },
  };

  if (match.status === "upcoming") {
    event.eventStatus = "https://schema.org/EventScheduled";
    event.eventAttendanceMode = "https://schema.org/OfflineEventAttendanceMode";
  } else if (match.status === "live") {
    event.eventStatus = "https://schema.org/EventScheduled";
    event.eventAttendanceMode = "https://schema.org/OfflineEventAttendanceMode";
  } else if (match.status === "finished") {
    event.eventStatus = "https://schema.org/EventCompleted";
    event.eventAttendanceMode = "https://schema.org/OfflineEventAttendanceMode";
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
    memberOf: buildWorldCup2026EventRef(siteUrl),
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
