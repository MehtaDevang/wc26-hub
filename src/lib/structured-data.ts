import { getSiteUrl, SITE_DESCRIPTION, SITE_NAME } from "./site";

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
  };
}
