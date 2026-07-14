import type { Metadata } from "next";
import Link from "next/link";
import Script from "next/script";
import { Suspense } from "react";
import { headers } from "next/headers";
import { Outfit, Geist_Mono, Oswald } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { Navbar } from "@/components/Navbar";
import { LocaleSwitcher } from "@/components/LocaleSwitcher";
import { SiteFooterAd } from "@/components/SiteAds";
import { LiveNowStickyBar } from "@/components/LiveNowStickyBar";
import { WC26MascotStrip } from "@/components/WC26Brand";
import { JsonLd } from "@/components/JsonLd";
import { TimezoneProvider } from "@/components/TimezoneProvider";
import { AppProviders } from "@/components/AppProviders";
import { CookieConsent } from "@/components/CookieConsent";
import { NativeAppProvider } from "@/components/NativeAppProvider";
import { CONSENT_DEFAULT_SCRIPT } from "@/lib/consent";
import { ADSENSE_CLIENT_ID } from "@/lib/adsense";
import { isNativeUserAgent } from "@/lib/native";
import { rootMetadata } from "@/lib/seo";
import { buildSiteStructuredDataGraph } from "@/lib/structured-data";
import { getServerTimezone } from "@/lib/timezone";
import {
  SITE_ADS_EMAIL,
  SITE_NAME,
  SITE_TWITTER_HANDLE,
  SITE_TWITTER_URL,
} from "@/lib/site";
import { FollowOnX } from "@/components/FollowOnX";
import { RouteProgress } from "@/components/RouteProgress";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const oswald = Oswald({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

export const metadata: Metadata = rootMetadata();

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const initialTimezone = await getServerTimezone();
  const userAgent = (await headers()).get("user-agent");
  const isNativeApp = isNativeUserAgent(userAgent);

  return (
    <html
      lang="en"
      className={`${outfit.variable} ${geistMono.variable} ${oswald.variable} h-full antialiased`}
    >
      <head>
        {!isNativeApp && (
          <meta name="google-adsense-account" content={ADSENSE_CLIENT_ID} />
        )}
        <link rel="preconnect" href="https://a.espncdn.com" crossOrigin="anonymous" />
      </head>
      <body className="min-h-full flex flex-col cup-bg text-zinc-900">
        {/* Consent defaults must run before any ad/analytics script loads. */}
        <Script
          id="consent-default"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{ __html: CONSENT_DEFAULT_SCRIPT }}
        />
        {!isNativeApp && (
          <Script
            id="adsbygoogle-init"
            strategy="afterInteractive"
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT_ID}`}
            crossOrigin="anonymous"
          />
        )}
        <Suspense fallback={null}>
          <RouteProgress />
        </Suspense>
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-[200] focus:rounded-lg focus:bg-[var(--wc-usa)] focus:px-4 focus:py-2 focus:text-white focus:text-sm focus:font-semibold"
        >
          Skip to content
        </a>
        <NativeAppProvider initialIsNative={isNativeApp}>
        <TimezoneProvider initialTimezone={initialTimezone}>
          <AppProviders>
            <JsonLd data={buildSiteStructuredDataGraph()} />
            <Navbar />
            <main id="main-content" className="site-main flex-1 mx-auto w-full max-w-6xl px-4 sm:px-6 py-8">
              {children}
            </main>
            <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 pb-4">
              <SiteFooterAd />
            </div>
            <footer className="border-t border-white/10 bg-[var(--stadium-navy)] py-8 text-white">
              <WC26MascotStrip variant="footer" className="mb-4" />
              <p className="text-center text-xs text-white/50">
                {SITE_NAME} © 2026 - Not affiliated with FIFA. Live data via ESPN.
              </p>
              <div className="mt-4 flex justify-center">
                <FollowOnX variant="footer" />
              </div>
              <div className="mt-3 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-xs text-white/50">
                <span>Hosted across Mexico, USA & Canada</span>
                <span>·</span>
                <LocaleSwitcher />
                <span>·</span>
                <Link href="/install" className="hover:text-[var(--wc-gold)] transition-colors">
                  Get the app
                </Link>
                <span>·</span>
                <Link href="/wallpapers" className="hover:text-[var(--wc-gold)] transition-colors">
                  Wallpapers
                </Link>
                <span>·</span>
                <Link href="/about" className="hover:text-[var(--wc-gold)] transition-colors">
                  About
                </Link>
                <span>·</span>
                <Link href="/contact" className="hover:text-[var(--wc-gold)] transition-colors">
                  Contact
                </Link>
                <span>·</span>
                <Link href="/privacy" className="hover:text-[var(--wc-gold)] transition-colors">
                  Privacy
                </Link>
                <span>·</span>
                <Link href="/terms" className="hover:text-[var(--wc-gold)] transition-colors">
                  Terms
                </Link>
                <span>·</span>
                <a
                  href={`mailto:${SITE_ADS_EMAIL}`}
                  className="hover:text-[var(--wc-gold)] transition-colors"
                >
                  Advertise
                </a>
                <span>·</span>
                <a
                  href={SITE_TWITTER_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[var(--wc-gold)] transition-colors"
                >
                  @{SITE_TWITTER_HANDLE}
                </a>
              </div>
            </footer>
            <Analytics />
            <LiveNowStickyBar />
            {!isNativeApp && <CookieConsent />}
          </AppProviders>
        </TimezoneProvider>
        </NativeAppProvider>
      </body>
    </html>
  );
}
