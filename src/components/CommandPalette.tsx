"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Search, X, Loader2 } from "lucide-react";
import clsx from "clsx";
import {
  buildStaticSearchIndex,
  filterSearchItems,
  type SearchItem,
} from "@/lib/site-search";
import { fetchMatches } from "@/lib/matches";
import { useTimezone } from "@/components/TimezoneProvider";
import type { Match } from "@/lib/types";

function matchSearchItem(match: Match): SearchItem {
  return {
    id: `match-${match.id}`,
    label: `${match.homeName} vs ${match.awayName}`,
    href: `/match/${match.id}`,
    group: match.status === "live" ? "Live matches" : "Matches",
    keywords: `${match.home} ${match.away} ${match.group} ${match.date}`,
  };
}

export function CommandPalette() {
  const router = useRouter();
  const timezone = useTimezone();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const [matchIndex, setMatchIndex] = useState<Match[]>([]);
  const [matchesLoading, setMatchesLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const staticIndex = useMemo(() => buildStaticSearchIndex(), []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen((v) => !v);
      }
      if (e.key === "Escape") setOpen(false);
    };
    const onOpen = () => setOpen(true);
    window.addEventListener("keydown", onKey);
    window.addEventListener("wc26-open-search", onOpen);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("wc26-open-search", onOpen);
    };
  }, []);

  useEffect(() => {
    if (open) {
      setQuery("");
      setActiveIndex(0);
      requestAnimationFrame(() => inputRef.current?.focus());
    }
  }, [open]);

  useEffect(() => {
    if (!open || matchIndex.length > 0) return;
    setMatchesLoading(true);
    fetchMatches({ range: "full", timeZone: timezone })
      .then(setMatchIndex)
      .catch(() => {})
      .finally(() => setMatchesLoading(false));
  }, [open, matchIndex.length, timezone]);

  const results = useMemo(() => {
    const staticResults = filterSearchItems(query, staticIndex);
    if (!query.trim()) return staticResults;

    const matchItems = filterSearchItems(
      query,
      matchIndex.map(matchSearchItem)
    );
    const seen = new Set(staticResults.map((r) => r.href));
    const merged = [...staticResults];
    for (const m of matchItems) {
      if (!seen.has(m.href)) merged.push(m);
    }
    return merged.slice(0, 14);
  }, [query, staticIndex, matchIndex]);

  useEffect(() => setActiveIndex(0), [query]);

  const go = useCallback(
    (href: string) => {
      setOpen(false);
      router.push(href);
    },
    [router]
  );

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter" && results[activeIndex]) {
      e.preventDefault();
      go(results[activeIndex].href);
    }
  };

  return (
    <>
      {open && (
        <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[12vh] px-4">
          <button
            type="button"
            className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"
            aria-label="Close search"
            onClick={() => setOpen(false)}
          />
          <div
            className="relative w-full max-w-lg rounded-2xl border border-zinc-200 bg-white shadow-2xl overflow-hidden"
            role="dialog"
            aria-modal="true"
            aria-label="Search"
          >
            <div className="flex items-center gap-2 border-b border-zinc-100 px-4 py-3">
              <Search size={18} className="text-zinc-400 shrink-0" />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={onKeyDown}
                placeholder="Teams, matches, pages…"
                className="flex-1 bg-transparent text-sm text-zinc-900 placeholder:text-zinc-400 outline-none"
              />
              {matchesLoading && <Loader2 size={16} className="animate-spin text-zinc-300" />}
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="text-zinc-400 hover:text-zinc-600"
                aria-label="Close"
              >
                <X size={18} />
              </button>
            </div>
            <ul className="max-h-[min(50vh,360px)] overflow-y-auto py-2">
              {results.length === 0 ? (
                <li className="px-4 py-8 text-center text-sm text-zinc-400">No results</li>
              ) : (
                results.map((item, i) => (
                  <li key={item.id}>
                    <button
                      type="button"
                      onClick={() => go(item.href)}
                      className={clsx(
                        "w-full flex items-center gap-3 px-4 py-2.5 text-left text-sm transition-colors",
                        i === activeIndex ? "bg-[var(--wc-usa-light)]" : "hover:bg-zinc-50"
                      )}
                    >
                      {item.icon && <span className="text-lg shrink-0">{item.icon}</span>}
                      <div className="min-w-0 flex-1">
                        <p className="font-medium text-zinc-900 truncate">{item.label}</p>
                        <p className="text-xs text-zinc-400">{item.group}</p>
                      </div>
                    </button>
                  </li>
                ))
              )}
            </ul>
            <p className="border-t border-zinc-100 px-4 py-2 text-[10px] text-zinc-400">
              ↑↓ navigate · Enter open · Esc close
            </p>
          </div>
        </div>
      )}
    </>
  );
}
