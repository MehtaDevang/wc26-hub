"use client";

import { WC26MascotIcon } from "@/components/mascots/WC26Mascots";

interface MascotStackLogoProps {
  /** sm = mobile header, md = desktop header */
  size?: "sm" | "md";
  className?: string;
}

/**
 * Three host-nation mascots (Zayu · Clutch · Maple) — used as the site logo everywhere.
 * Static SVG stack; no JS animation so it works reliably on web + PWA.
 */
export function MascotStackLogo({ size = "md", className = "" }: MascotStackLogoProps) {
  const isSm = size === "sm";
  const side = isSm ? 22 : 26;
  const center = isSm ? 26 : 30;
  const boxSide = isSm ? "h-6 w-6" : "h-7 w-7";
  const boxCenter = isSm ? "h-7 w-7" : "h-8 w-8";

  return (
    <div
      className={`flex shrink-0 items-center -space-x-1.5 ${className}`}
      aria-hidden
    >
      <div
        className={`relative z-10 flex ${boxSide} items-center justify-center rounded-lg bg-[var(--wc-mexico-light)] border border-[var(--wc-mexico)]/15 overflow-hidden`}
      >
        <WC26MascotIcon id="zayu" size={side} />
      </div>
      <div
        className={`relative z-20 flex ${boxCenter} items-center justify-center rounded-lg bg-[var(--wc-usa-light)] border border-[var(--wc-usa)]/15 shadow-sm overflow-hidden`}
      >
        <WC26MascotIcon id="clutch" size={center} />
      </div>
      <div
        className={`relative z-10 flex ${boxSide} items-center justify-center rounded-lg bg-[var(--wc-canada-light)] border border-[var(--wc-canada)]/15 overflow-hidden`}
      >
        <WC26MascotIcon id="maple" size={side} />
      </div>
    </div>
  );
}
