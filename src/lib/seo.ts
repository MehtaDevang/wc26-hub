import type { Metadata } from "next";
import { getSiteUrl, SITE_DESCRIPTION, SITE_KEYWORDS, SITE_NAME } from "./site";

const OG_IMAGE = {
  url: "/opengraph-image",
  width: 1200,
  height: 630,
  alt: `${SITE_NAME} — World Cup 2026 Live Scores & Puzzles`,
};

function buildVerification(): Metadata["verification"] | undefined {
  const google = process.env.GOOGLE_SITE_VERIFICATION?.trim();
  if (!google) return undefined;
  return { google };
}

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
      : { index: true, follow: true, googleBot: { index: true, follow: true } },
    verification: buildVerification(),
  };
}

export function rootMetadata(): Metadata {
  const url = getSiteUrl();

  return {
    metadataBase: new URL(url),
    title: {
      default: `${SITE_NAME} — World Cup 2026 Live Scores, Fixtures & Puzzles`,
      template: `%s — ${SITE_NAME}`,
    },
    description: SITE_DESCRIPTION,
    keywords: SITE_KEYWORDS,
    applicationName: SITE_NAME,
    authors: [{ name: SITE_NAME, url }],
    creator: SITE_NAME,
    publisher: SITE_NAME,
    category: "sports",
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: `${SITE_NAME} — World Cup 2026 Live Scores`,
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
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },
    verification: buildVerification(),
    icons: {
      icon: [{ url: "/favicon.svg", type: "image/svg+xml" }],
      apple: [{ url: "/apple-touch-icon.svg", type: "image/svg+xml" }],
    },
  };
}
