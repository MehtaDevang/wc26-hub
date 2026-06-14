"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { Play, Loader2, RefreshCw } from "lucide-react";
import { fetchHighlights } from "@/lib/matches";
import type { Highlight } from "@/lib/types";

interface MatchHighlightsProps {
  initialHighlights?: Highlight[];
}

export function MatchHighlights({ initialHighlights }: MatchHighlightsProps) {
  const [highlights, setHighlights] = useState<Highlight[]>(initialHighlights ?? []);
  const [loading, setLoading] = useState(initialHighlights === undefined);
  const [error, setError] = useState("");

  const loadHighlights = useCallback(async (showSpinner = false) => {
    if (showSpinner) setLoading(true);
    setError("");
    try {
      const data = await fetchHighlights();
      setHighlights(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load highlights");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (initialHighlights === undefined) {
      loadHighlights(true);
    } else {
      loadHighlights(false);
    }
  }, [initialHighlights, loadHighlights]);

  const showSpinner = loading && highlights.length === 0;

  return (
    <section>
      <h2 className="section-title mb-4 flex items-center gap-2">
        <Play size={20} className="text-amber-500" />
        Goal Highlights
      </h2>

      {showSpinner && (
        <div className="flex items-center justify-center gap-2 py-12 text-zinc-400 text-sm">
          <Loader2 size={18} className="animate-spin" />
          Loading highlights...
        </div>
      )}

      {error && highlights.length === 0 && (
        <div className="text-center py-8">
          <p className="text-red-600 text-sm mb-3">{error}</p>
          <button
            onClick={() => loadHighlights(true)}
            className="btn-secondary inline-flex items-center gap-2 px-4 py-2 text-sm"
          >
            <RefreshCw size={14} /> Retry
          </button>
        </div>
      )}

      {!showSpinner && highlights.length === 0 && !error && (
        <p className="text-center text-zinc-400 py-8 text-sm">No highlights yet</p>
      )}

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {highlights.map((h) => (
          <Link
            key={h.id}
            href={`/match/${h.matchId}`}
            className="group card-surface rounded-xl overflow-hidden hover:shadow-md transition-all hover:-translate-y-0.5"
          >
            <div className="flex items-center gap-3 p-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-zinc-50 text-2xl border border-zinc-100">
                {h.emoji}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded">
                    {h.minute}
                  </span>
                  <span className="text-[10px] text-zinc-400 truncate">{h.teams}</span>
                </div>
                <p className="font-semibold text-zinc-900 text-sm leading-snug group-hover:text-blue-600 transition-colors">
                  {h.title}
                </p>
                <p className="text-xs text-zinc-400 mt-0.5 line-clamp-1">{h.description}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
