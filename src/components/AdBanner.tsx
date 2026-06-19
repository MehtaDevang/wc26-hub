"use client";

import { useEffect, useRef } from "react";
import clsx from "clsx";
import { getAdSenseClientId, getAdSlotId, type AdPlacement } from "@/lib/adsense";
import { useIsNativeApp } from "@/components/NativeAppProvider";

declare global {
  interface Window {
    adsbygoogle?: Array<Record<string, unknown>>;
  }
}

interface AdBannerProps {
  placement?: AdPlacement;
  /** @deprecated Use `placement` instead */
  slot?: AdPlacement;
  label?: string;
  className?: string;
}

function ensureAdSenseScript(clientId: string, onLoad: () => void) {
  const existing = document.querySelector<HTMLScriptElement>(
    `script[data-adsense="${clientId}"]`
  );
  if (existing) {
    if (existing.dataset.loaded === "true") onLoad();
    else existing.addEventListener("load", onLoad, { once: true });
    return;
  }

  const script = document.createElement("script");
  script.async = true;
  script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${clientId}`;
  script.crossOrigin = "anonymous";
  script.setAttribute("data-adsense", clientId);
  script.addEventListener(
    "load",
    () => {
      script.dataset.loaded = "true";
      onLoad();
    },
    { once: true }
  );
  document.head.appendChild(script);
}

export function AdBanner({
  placement,
  slot,
  label = "Advertisement",
  className,
}: AdBannerProps) {
  const resolvedPlacement = placement ?? slot ?? "inline";
  const clientId = getAdSenseClientId();
  const adSlotId = getAdSlotId(resolvedPlacement);
  const isNativeApp = useIsNativeApp();
  const pushed = useRef(false);

  useEffect(() => {
    if (isNativeApp || !clientId || !adSlotId || pushed.current) return;

    const pushAd = () => {
      if (pushed.current) return;
      pushed.current = true;
      try {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      } catch {
        pushed.current = false;
      }
    };

    ensureAdSenseScript(clientId, pushAd);
  }, [clientId, adSlotId, isNativeApp]);

  if (isNativeApp || !clientId || !adSlotId) return null;

  return (
    <div
      className={clsx("ad-container w-full overflow-hidden", className)}
      data-ad-placement={resolvedPlacement}
    >
      <p className="mb-1 text-center text-[10px] uppercase tracking-widest text-zinc-300">
        {label}
      </p>
      <ins
        className="adsbygoogle block w-full"
        style={{ display: "block" }}
        data-ad-client={clientId}
        data-ad-slot={adSlotId}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  );
}
