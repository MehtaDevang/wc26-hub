import type { Metadata } from "next";
import { Outfit, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { Navbar } from "@/components/Navbar";
import { AdBanner } from "@/components/AdBanner";
import { WC26MascotStrip } from "@/components/WC26Brand";
import { JsonLd } from "@/components/JsonLd";
import { TimezoneProvider } from "@/components/TimezoneProvider";
import { rootMetadata } from "@/lib/seo";
import { ADSENSE_CLIENT_ID } from "@/lib/adsense";
import { getServerTimezone } from "@/lib/timezone";
import { getSiteUrl, SITE_DESCRIPTION, SITE_NAME } from "@/lib/site";
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

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: SITE_NAME,
  url: getSiteUrl(),
  description: SITE_DESCRIPTION,
  inLanguage: "en-US",
};

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
      <head>
        <script
          async
          src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT_ID}`}
          crossOrigin="anonymous"
        />
      </head>
      <body className="min-h-full flex flex-col cup-bg text-zinc-900">
        <TimezoneProvider initialTimezone={initialTimezone}>
        <JsonLd data={websiteJsonLd} />
        <Navbar />
        <AdBanner placement="top" />
        <main className="flex-1 mx-auto w-full max-w-6xl px-4 sm:px-6 py-8">
          {children}
        </main>
        <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 pb-4">
          <AdBanner placement="footer" />
        </div>
        <footer className="border-t border-zinc-200 bg-white py-8">
          <WC26MascotStrip variant="footer" className="mb-4" />
          <p className="text-center text-xs text-zinc-400">
            WC26 Hub © 2026 — Not affiliated with FIFA. Live data via ESPN.
          </p>
          <p className="mt-2 flex items-center justify-center gap-3 text-xs text-zinc-400">
            <span>Hosted across Mexico, USA & Canada</span>
            <span>·</span>
            <a href="mailto:ads@wc26hub.com" className="hover:text-[var(--wc-usa)] transition-colors">Advertise</a>
            <span>·</span>
            <a href="mailto:hello@wc26hub.com" className="hover:text-[var(--wc-usa)] transition-colors">Contact</a>
          </p>
        </footer>
        <Analytics />
        </TimezoneProvider>
      </body>
    </html>
  );
}
