"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export function EmbedMode() {
  const pathname = usePathname();

  useEffect(() => {
    if (!pathname?.startsWith("/embed/live-scores")) return;
    document.body.classList.add("embed-mode");
    return () => document.body.classList.remove("embed-mode");
  }, [pathname]);

  return null;
}
