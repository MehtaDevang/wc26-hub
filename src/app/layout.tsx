import type { Metadata } from "next";
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
import { rootMetadata } from "@/lib/seo";
import { buildSiteStructuredDataGraph } from "@/lib/structured-data";
import { getServerTimezone } from "@/lib/timezone";
import {
  SITE_ADS_EMAIL,
  SITE_CONTACT_EMAIL,
  SITE_NAME,
} from "@/lib/site";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
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

  return (
    <html
      lang="en"
      className={`${outfit.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head />
      <body className="min-h-full flex flex-col cup-bg text-zinc-900">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-[200] focus:rounded-lg focus:bg-[var(--wc-usa)] focus:px-4 focus:py-2 focus:text-white focus:text-sm focus:font-semibold"
        >
          Skip to content
        </a>
        <DeferredAdSense />
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
                {SITE_NAME} © 2026 — Not affiliated with FIFA. Live data via ESPN.
              </p>
              <div className="mt-2 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-xs text-zinc-400">
                <span>Hosted across Mexico, USA & Canada</span>
                <span>·</span>
                <LocaleSwitcher />
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
              </div>
            </footer>
            <Analytics />
            <LiveNowStickyBar />
          </AppProviders>
        </TimezoneProvider>
      </body>
    </html>
  );
}
