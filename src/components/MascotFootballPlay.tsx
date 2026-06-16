"use client";

import { MascotStackLogo } from "@/components/MascotStackLogo";

/** @deprecated Use MascotStackLogo - kept for imports that expect this name */
export function MascotFootballPlay({ className = "" }: { className?: string }) {
  return <MascotStackLogo className={className} />;
}
