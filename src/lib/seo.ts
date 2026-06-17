import type { Metadata } from "next";
import { getSiteUrl, SITE_DESCRIPTION, SITE_KEYWORDS, SITE_NAME, SITE_TWITTER_HANDLE } from "./site";

const OG_IMAGE = {
  url: "/opengraph-image",
  width: 1200,
  height: 630,
  alt: `${SITE_NAME} - FIFA World Cup 2026 Live Scores, Teams & Stats`,
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
  keywords,
  ogImagePath,
}: {
  title: string;
  description?: string;
  path?: string;
  noIndex?: boolean;
  keywords?: string[];
  /** Route to page-specific opengraph-image (e.g. `/match/123/opengraph-image`). */
  ogImagePath?: string;
}): Metadata {
  // Keep the brand suffix only when the title stays within Google's ~60-char
  // SERP cap; on long, keyword-rich titles we drop it so the keywords survive.
  const suffix = ` - ${SITE_NAME}`;
  const pageTitle = title.includes(SITE_NAME)
    ? title
    : title.length + suffix.length <= 60
      ? `${title}${suffix}`
      : title;
  // Social cards always carry the brand for recognisability.
  const socialTitle = pageTitle.includes(SITE_NAME) ? pageTitle : `${pageTitle}${suffix}`;
  const canonical = `${getSiteUrl()}${path.startsWith("/") ? path : `/${path}`}`;
  const pageKeywords = keywords?.length
    ? [...new Set([...keywords, ...SITE_KEYWORDS])]
    : SITE_KEYWORDS;
  const ogImage = ogImagePath
    ? {
        url: ogImagePath,
        width: OG_IMAGE.width,
        height: OG_IMAGE.height,
        alt: pageTitle,
      }
    : OG_IMAGE;

  return {
    title: pageTitle,
    description,
    keywords: pageKeywords,
    alternates: { canonical },
    category: "sports",
    openGraph: {
      title: socialTitle,
      description,
      url: canonical,
      siteName: SITE_NAME,
      type: "website",
      locale: "en_US",
      images: [ogImage],
    },
    twitter: {
      card: "summary_large_image",
      site: `@${SITE_TWITTER_HANDLE}`,
      creator: `@${SITE_TWITTER_HANDLE}`,
      title: socialTitle,
      description,
      images: [ogImage.url],
    },
    robots: noIndex
      ? { index: false, follow: false }
      : {
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
  };
}

export function rootMetadata(): Metadata {
  const url = getSiteUrl();

  return {
    metadataBase: new URL(url),
    title: {
      default: `FIFA World Cup 2026 Live Scores Today - ${SITE_NAME}`,
      template: `%s - ${SITE_NAME}`,
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
      title: `FIFA World Cup 2026 Live Scores - ${SITE_NAME}`,
      description: SITE_DESCRIPTION,
      url,
      siteName: SITE_NAME,
      type: "website",
      locale: "en_US",
      images: [OG_IMAGE],
    },
    twitter: {
      card: "summary_large_image",
      site: `@${SITE_TWITTER_HANDLE}`,
      creator: `@${SITE_TWITTER_HANDLE}`,
      title: `World Cup 2026 Live Scores - ${SITE_NAME}`,
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
      icon: [
        { url: "/favicon.svg", type: "image/svg+xml" },
        { url: "/icon-maskable.svg", type: "image/svg+xml", sizes: "512x512" },
      ],
      apple: [{ url: "/apple-touch-icon.svg", type: "image/svg+xml", sizes: "180x180" }],
    },
  };
}
