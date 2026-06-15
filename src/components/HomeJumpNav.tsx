"use client";

import { useEffect, useState } from "react";
import clsx from "clsx";

const SECTIONS = [
  { id: "my-teams", label: "My teams" },
  { id: "live", label: "Live" },
  { id: "highlights", label: "Highlights" },
  { id: "bracket", label: "Bracket" },
  { id: "explore", label: "Explore" },
] as const;

export function HomeJumpNav() {
  const [active, setActive] = useState<string>("my-teams");

  useEffect(() => {
    const observers: IntersectionObserver[] = [];

    for (const { id } of SECTIONS) {
      const el = document.getElementById(id);
      if (!el) continue;
      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry?.isIntersecting) setActive(id);
        },
        { rootMargin: "-30% 0px -55% 0px", threshold: 0 }
      );
      obs.observe(el);
      observers.push(obs);
    }

    return () => observers.forEach((o) => o.disconnect());
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <nav
      className="sticky top-14 z-30 -mx-4 sm:-mx-6 px-4 sm:px-6 py-2 bg-white/90 backdrop-blur-md border-b border-zinc-100"
      aria-label="Page sections"
    >
      <div className="flex gap-1 overflow-x-auto scrollbar-thin max-w-6xl mx-auto">
        {SECTIONS.map(({ id, label }) => (
          <button
            key={id}
            type="button"
            onClick={() => scrollTo(id)}
            className={clsx(
              "shrink-0 rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors",
              active === id
                ? "bg-[var(--wc-usa)] text-white shadow-sm"
                : "text-zinc-600 hover:bg-zinc-100"
            )}
          >
            {label}
          </button>
        ))}
      </div>
    </nav>
  );
}
