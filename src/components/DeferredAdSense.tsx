"use client";

import { useEffect } from "react";
import { ADSENSE_CLIENT_ID } from "@/lib/adsense";

export function DeferredAdSense() {
  useEffect(() => {
    if (document.querySelector(`script[data-adsense="${ADSENSE_CLIENT_ID}"]`)) return;

    const load = () => {
      const script = document.createElement("script");
      script.async = true;
      script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT_ID}`;
      script.crossOrigin = "anonymous";
      script.setAttribute("data-adsense", ADSENSE_CLIENT_ID);
      document.head.appendChild(script);
    };

    if ("requestIdleCallback" in window) {
      const id = window.requestIdleCallback(load, { timeout: 2500 });
      return () => window.cancelIdleCallback(id);
    }
    const t = setTimeout(load, 1500);
    return () => clearTimeout(t);
  }, []);

  return null;
}
