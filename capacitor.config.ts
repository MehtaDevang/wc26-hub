import type { CapacitorConfig } from "@capacitor/cli";

/**
 * The Goal Posts is a server-rendered Next.js app, so the iOS shell loads the
 * live production site rather than a bundled static build. `webDir` is only
 * required by the CLI and is unused at runtime when `server.url` is set.
 *
 * Override the production URL with CAP_SERVER_URL when building (e.g. to point
 * a TestFlight build at a staging deploy).
 */
const SERVER_URL = process.env.CAP_SERVER_URL ?? "https://www.thegoalposts.in";

const config: CapacitorConfig = {
  appId: "in.thegoalposts.app",
  appName: "The Goal Posts",
  webDir: "public",
  // A custom UA token lets the server detect the native shell (to suppress
  // AdSense, which is not permitted inside app webviews, and the web install
  // prompt). Keep the default UA so the site still works normally.
  appendUserAgent: "TheGoalPostsApp",
  server: {
    url: SERVER_URL,
    // Keep navigation to our own domain inside the app; external links are
    // opened in the system browser from the web layer.
    allowNavigation: ["www.thegoalposts.in", "thegoalposts.in"],
    cleartext: false,
  },
  backgroundColor: "#002868",
  ios: {
    contentInset: "always",
    backgroundColor: "#002868",
    // Honour the site's own scroll/zoom behaviour.
    scrollEnabled: true,
    limitsNavigationsToAppBoundDomains: false,
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 1200,
      launchAutoHide: true,
      backgroundColor: "#002868",
      showSpinner: false,
      iosSpinnerStyle: "large",
    },
    StatusBar: {
      style: "LIGHT",
      backgroundColor: "#002868",
    },
  },
};

export default config;
