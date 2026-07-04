"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";

export function RouteProgress() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [active, setActive] = useState(false);
  const [width, setWidth] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const hideRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setActive(true);
    setWidth(12);

    if (timerRef.current) clearInterval(timerRef.current);
    if (hideRef.current) clearTimeout(hideRef.current);

    timerRef.current = setInterval(() => {
      setWidth((w) => (w >= 92 ? w : w + Math.random() * 10));
    }, 280);

    hideRef.current = setTimeout(() => {
      if (timerRef.current) clearInterval(timerRef.current);
      setWidth(100);
      setTimeout(() => {
        setActive(false);
        setWidth(0);
      }, 220);
    }, 420);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (hideRef.current) clearTimeout(hideRef.current);
    };
  }, [pathname, searchParams]);

  if (!active && width === 0) return null;

  return (
    <div
      className="pointer-events-none fixed inset-x-0 top-0 z-[300] h-0.5 bg-transparent"
      aria-hidden
    >
      <div
        className="h-full bg-gradient-to-r from-[var(--wc-usa)] via-[var(--wc-mexico)] to-[var(--wc-gold)] transition-[width] duration-200 ease-out shadow-[0_0_8px_rgba(0,40,104,0.35)]"
        style={{ width: `${width}%` }}
      />
    </div>
  );
}
