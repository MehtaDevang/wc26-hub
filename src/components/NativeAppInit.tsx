"use client";

import { useEffect } from "react";

/**
 * Native-only startup: style the status bar and dismiss the splash screen once
 * the web layer is interactive. Plugins are imported dynamically so they never
 * enter the web bundle. Rendered only inside the Capacitor shell.
 */
export function NativeAppInit() {
  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const [{ StatusBar, Style }, { SplashScreen }] = await Promise.all([
          import("@capacitor/status-bar"),
          import("@capacitor/splash-screen"),
        ]);
        if (cancelled) return;
        await StatusBar.setStyle({ style: Style.Light }).catch(() => {});
        await SplashScreen.hide().catch(() => {});
      } catch {
        // Plugins unavailable (e.g. running on web) - no-op.
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  return null;
}
