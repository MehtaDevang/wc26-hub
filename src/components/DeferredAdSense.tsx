"use client";

import { useEffect } from "react";
import { ADSENSE_CLIENT_ID } from "@/lib/adsense";

export function DeferredAdSense() {
  useEffect(() => {
    if (document.querySelector(`script[data-adsense="${ADSENSE_CLIENT_ID}"]`)) return;

    let loaded = false;
    let idleId: number | null = null;
    let timeoutId: ReturnType<typeof setTimeout> | null = null;

    const cleanup = () => {
      window.removeEventListener("scroll", onInteraction);
      window.removeEventListener("pointerdown", onInteraction);
      window.removeEventListener("keydown", onInteraction);
      if (idleId !== null && "cancelIdleCallback" in window) {
        window.cancelIdleCallback(idleId);
      }
      if (timeoutId !== null) {
        clearTimeout(timeoutId);
      }
    };

    const load = () => {
      if (loaded) return;
      loaded = true;
      cleanup();

      const script = document.createElement("script");
      script.async = true;
      script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT_ID}`;
      script.crossOrigin = "anonymous";
      script.setAttribute("data-adsense", ADSENSE_CLIENT_ID);
      document.head.appendChild(script);
    };

    const onInteraction = () => load();

    window.addEventListener("scroll", onInteraction, { once: true, passive: true });
    window.addEventListener("pointerdown", onInteraction, { once: true });
    window.addEventListener("keydown", onInteraction, { once: true });

    if ("requestIdleCallback" in window) {
      idleId = window.requestIdleCallback(load, { timeout: 8000 });
    } else {
      timeoutId = setTimeout(load, 5000);
    }

    return cleanup;
  }, []);

  return null;
}
