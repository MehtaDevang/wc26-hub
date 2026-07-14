import { withSentryConfig } from "@sentry/nextjs";
import type { NextConfig } from "next";
import os from "os";

function getLanOrigins(): string[] {
  const origins: string[] = [];
  const nets = os.networkInterfaces();
  for (const iface of Object.values(nets)) {
    for (const net of iface ?? []) {
      if (net.family === "IPv4" && !net.internal) {
        origins.push(net.address);
      }
    }
  }
  return origins;
}

const securityHeaders = [
  { key: "X-DNS-Prefetch-Control", value: "on" },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Cross-Origin-Opener-Policy", value: "same-origin-allow-popups" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
  },
];

const cspBase = [
  "default-src 'self'",
  "object-src 'none'",
  "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://pagead2.googlesyndication.com https://www.googletagmanager.com https://www.google-analytics.com",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https: http:",
  "font-src 'self' data:",
  "connect-src 'self' https://site.api.espn.com https://content.core.api.espn.com https://api.open-meteo.com https://pagead2.googlesyndication.com https://googleads.g.doubleclick.net https://www.google-analytics.com",
  "media-src 'self' https:",
  "frame-src 'self' https: https://googleads.g.doubleclick.net https://tpc.googlesyndication.com",
  "base-uri 'self'",
  "form-action 'self'",
];

const siteCsp = [
  ...cspBase,
  "frame-ancestors 'self'",
].join("; ");

const embedCsp = [
  ...cspBase,
  "frame-ancestors *",
].join("; ");

const nextConfig: NextConfig = {
  // Allow phone/tablet testing on LAN (e.g. http://192.168.x.x:3000)
  allowedDevOrigins: getLanOrigins(),
  poweredByHeader: false,
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      { protocol: "https", hostname: "a.espncdn.com", pathname: "/**" },
      { protocol: "https", hostname: "media.licdn.com", pathname: "/**" },
    ],
  },
  async redirects() {
    return [
      { source: "/bracket/pool", destination: "/bracket", permanent: true },
      { source: "/pool", destination: "/bracket", permanent: true },
    ];
  },
  async headers() {
    return [
      {
        source: "/ads.txt",
        headers: [
          { key: "Content-Type", value: "text/plain; charset=utf-8" },
          { key: "Cache-Control", value: "public, max-age=86400" },
        ],
      },
      {
        source: "/embed/:path*",
        headers: [
          ...securityHeaders.filter((h) => h.key !== "X-Frame-Options"),
          { key: "Content-Security-Policy", value: embedCsp },
        ],
      },
      {
        source: "/((?!ads\\.txt$).*)",
        headers: [
          ...securityHeaders,
          { key: "Content-Security-Policy", value: siteCsp },
        ],
      },
    ];
  },
};

export default withSentryConfig(nextConfig, {
  // For all available options, see:
  // https://www.npmjs.com/package/@sentry/webpack-plugin#options

  org: "thegoalposts",

  project: "sentry-carmine-zebra",

  // Only print logs for uploading source maps in CI
  silent: !process.env.CI,

  // For all available options, see:
  // https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/

  // Upload a larger set of source maps for prettier stack traces (increases build time)
  widenClientFileUpload: true,

  // Sentry tunnel can hang on small EC2 instances with strict egress — disable via env.
  ...(process.env.DISABLE_SENTRY_TUNNEL === "1"
    ? {}
    : { tunnelRoute: "/monitoring" }),

  webpack: {
    // Enables automatic instrumentation of Vercel Cron Monitors. (Does not yet work with App Router route handlers.)
    // See the following for more information:
    // https://docs.sentry.io/product/crons/
    // https://vercel.com/docs/cron-jobs
    automaticVercelMonitors: true,

    // Tree-shaking options for reducing bundle size
    treeshake: {
      // Automatically tree-shake Sentry logger statements to reduce bundle size
      removeDebugLogging: true,
    },
  },
});
