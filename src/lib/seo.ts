import type { Metadata } from "next";
import { getSiteUrl, SITE_DESCRIPTION, SITE_KEYWORDS, SITE_NAME } from "./site";

const OG_IMAGE = {
  url: "/opengraph-image",
  width: 1200,
  height: 630,
  alt: `${SITE_NAME} — World Cup 2026 Live Scores & Puzzles`,
};

export function createPageMetadata({
  title,
  description = SITE_DESCRIPTION,
  path = "/",
  noIndex = false,
}: {
  title: string;
  description?: string;
  path?: string;
  noIndex?: boolean;
}): Metadata {
  const pageTitle = title.includes(SITE_NAME) ? title : `${title} — ${SITE_NAME}`;
  const canonical = `${getSiteUrl()}${path.startsWith("/") ? path : `/${path}`}`;

  return {
    title: pageTitle,
    description,
    keywords: SITE_KEYWORDS,
    alternates: { canonical },
    openGraph: {
      title: pageTitle,
      description,
      url: canonical,
      siteName: SITE_NAME,
      type: "website",
      locale: "en_US",
      images: [OG_IMAGE],
    },
    twitter: {
      card: "summary_large_image",
      title: pageTitle,
      description,
      images: [OG_IMAGE.url],
    },
    robots: noIndex
      ? { index: false, follow: false }
      : { index: true, follow: true },
  };
}

export function rootMetadata(): Metadata {
  const url = getSiteUrl();

  return {
    metadataBase: new URL(url),
    title: {
      default: `${SITE_NAME} — World Cup 2026 Live Scores & Daily Puzzles`,
      template: `%s — ${SITE_NAME}`,
    },
    description: SITE_DESCRIPTION,
    keywords: SITE_KEYWORDS,
    applicationName: SITE_NAME,
    alternates: { canonical: url },
    openGraph: {
      title: `${SITE_NAME} — World Cup 2026`,
      description: SITE_DESCRIPTION,
      url,
      siteName: SITE_NAME,
      type: "website",
      locale: "en_US",
      images: [OG_IMAGE],
    },
    twitter: {
      card: "summary_large_image",
      title: `${SITE_NAME} — World Cup 2026`,
      description: SITE_DESCRIPTION,
      images: [OG_IMAGE.url],
    },
    robots: { index: true, follow: true },
    icons: {
      icon: [{ url: "/favicon.svg", type: "image/svg+xml" }],
      apple: [{ url: "/apple-touch-icon.svg", type: "image/svg+xml" }],
    },
  };
}
