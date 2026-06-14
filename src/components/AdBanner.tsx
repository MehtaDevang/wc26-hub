"use client";

import { useEffect, useRef } from "react";
import clsx from "clsx";
import { getAdSenseClientId, getAdSlotId, type AdPlacement } from "@/lib/adsense";

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

const PLACEHOLDER_HEIGHT: Record<AdPlacement, string> = {
  top: "min-h-[90px]",
  footer: "min-h-[90px]",
  inline: "min-h-[100px]",
  sidebar: "min-h-[250px]",
  match: "min-h-[100px]",
  fixtures: "min-h-[100px]",
  standings: "min-h-[100px]",
  history: "min-h-[100px]",
  puzzles: "min-h-[100px]",
};

function AdPlaceholder({
  placement,
  label,
  className,
  hint,
}: {
  placement: AdPlacement;
  label: string;
  className?: string;
  hint?: string;
}) {
  return (
    <div
      className={clsx(
        "flex w-full items-center justify-center rounded-xl border border-dashed border-zinc-200 bg-zinc-50/80 text-center",
        PLACEHOLDER_HEIGHT[placement],
        className
      )}
      data-ad-placement={placement}
      aria-label={`${label} placeholder`}
    >
      <div className="px-4 py-3">
        <p className="mb-0.5 text-[10px] uppercase tracking-widest text-zinc-300">{label}</p>
        <p className="text-xs text-zinc-400">
          {hint ?? "Google AdSense slot"}
        </p>
      </div>
    </div>
  );
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
  const pushed = useRef(false);
  const insRef = useRef<HTMLModElement>(null);

  useEffect(() => {
    if (!clientId || !adSlotId || pushed.current) return;
    pushed.current = true;
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch {
      pushed.current = false;
    }
  }, [clientId, adSlotId, resolvedPlacement]);

  if (!clientId) {
    return (
      <AdPlaceholder
        placement={resolvedPlacement}
        label={label}
        className={className}
        hint="AdSense client ID missing"
      />
    );
  }

  if (!adSlotId) {
    return (
      <AdPlaceholder
        placement={resolvedPlacement}
        label={label}
        className={className}
        hint={`Set NEXT_PUBLIC_ADSENSE_SLOT_${resolvedPlacement.toUpperCase()}`}
      />
    );
  }

  return (
    <div
      className={clsx("ad-container w-full overflow-hidden", className)}
      data-ad-placement={resolvedPlacement}
    >
      <p className="mb-1 text-center text-[10px] uppercase tracking-widest text-zinc-300">
        {label}
      </p>
      <ins
        ref={insRef}
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
