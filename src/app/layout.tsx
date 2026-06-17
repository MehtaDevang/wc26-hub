import type { Metadata } from "next";
import Link from "next/link";
import { headers } from "next/headers";
import { Outfit, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { Navbar } from "@/components/Navbar";
import { LocaleSwitcher } from "@/components/LocaleSwitcher";
import { SiteTopAd, SiteFooterAd } from "@/components/SiteAds";
import { LiveNowStickyBar } from "@/components/LiveNowStickyBar";
import { WC26MascotStrip } from "@/components/WC26Brand";
import { JsonLd } from "@/components/JsonLd";
import { TimezoneProvider } from "@/components/TimezoneProvider";
import { AppProviders } from "@/components/AppProviders";
import { DeferredAdSense } from "@/components/DeferredAdSense";
import { CookieConsent } from "@/components/CookieConsent";
import { NativeAppProvider } from "@/components/NativeAppProvider";
import { CONSENT_DEFAULT_SCRIPT } from "@/lib/consent";
import { isNativeUserAgent } from "@/lib/native";
import { rootMetadata } from "@/lib/seo";
import { buildSiteStructuredDataGraph } from "@/lib/structured-data";
import { getServerTimezone } from "@/lib/timezone";
import {
  SITE_ADS_EMAIL,
  SITE_CONTACT_EMAIL,
  SITE_NAME,
  SITE_TWITTER_HANDLE,
  SITE_TWITTER_URL,
} from "@/lib/site";
import { FollowOnX } from "@/components/FollowOnX";
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
      className={`${outfit.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: CONSENT_DEFAULT_SCRIPT }} />
        <link rel="preconnect" href="https://a.espncdn.com" crossOrigin="anonymous" />
      </head>
      <body className="min-h-full flex flex-col cup-bg text-zinc-900">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-[200] focus:rounded-lg focus:bg-[var(--wc-usa)] focus:px-4 focus:py-2 focus:text-white focus:text-sm focus:font-semibold"
        >
          Skip to content
        </a>
        {!isNativeApp && <DeferredAdSense />}
        <NativeAppProvider initialIsNative={isNativeApp}>
        <TimezoneProvider initialTimezone={initialTimezone}>
          <AppProviders>
            <JsonLd data={buildSiteStructuredDataGraph()} />
            <Navbar />
            <SiteTopAd />
            <main id="main-content" className="site-main flex-1 mx-auto w-full max-w-6xl px-4 sm:px-6 py-8">
              {children}
            </main>
            <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 pb-4">
              <SiteFooterAd />
            </div>
            <footer className="border-t border-zinc-200 bg-white py-8">
              <WC26MascotStrip variant="footer" className="mb-4" />
              <p className="text-center text-xs text-zinc-400">
                {SITE_NAME} © 2026 - Not affiliated with FIFA. Live data via ESPN.
              </p>
              <div className="mt-4 flex justify-center">
                <FollowOnX variant="footer" />
              </div>
              <div className="mt-3 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-xs text-zinc-400">
                <span>Hosted across Mexico, USA & Canada</span>
                <span>·</span>
                <LocaleSwitcher />
                <span>·</span>
                <Link href="/install" className="hover:text-[var(--wc-usa)] transition-colors">
                  Get the app
                </Link>
                <span>·</span>
                <Link href="/privacy" className="hover:text-[var(--wc-usa)] transition-colors">
                  Privacy
                </Link>
                <span>·</span>
                <Link href="/terms" className="hover:text-[var(--wc-usa)] transition-colors">
                  Terms
                </Link>
                <span>·</span>
                <a
                  href={`mailto:${SITE_ADS_EMAIL}`}
                  className="hover:text-[var(--wc-usa)] transition-colors"
                >
                  Advertise
                </a>
                <span>·</span>
                <a
                  href={`mailto:${SITE_CONTACT_EMAIL}`}
                  className="hover:text-[var(--wc-usa)] transition-colors"
                >
                  Contact
                </a>
                <span>·</span>
                <a
                  href={SITE_TWITTER_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[var(--wc-usa)] transition-colors"
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
