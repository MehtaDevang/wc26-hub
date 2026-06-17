"use client";

import { useState, useEffect, useCallback } from "react";
import { Play, Loader2, RefreshCw } from "lucide-react";
import { fetchHighlights } from "@/lib/matches";
import { HighlightCard } from "@/components/HighlightCard";
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
    }
  }, [initialHighlights, loadHighlights]);

  useEffect(() => {
    if (initialHighlights === undefined) return;
    const interval = setInterval(() => loadHighlights(false), 120_000);
    return () => clearInterval(interval);
  }, [initialHighlights, loadHighlights]);

  const showSpinner = loading && highlights.length === 0;

  return (
    <section>
      <div className="mb-4 flex items-end justify-between gap-4">
        <div>
          <h2 className="section-title flex items-center gap-2">
            <Play size={20} className="text-amber-500" />
            Goal Highlights
          </h2>
          <p className="mt-1 text-sm text-zinc-500">
            Goals, players, stadium shots, and iconic moments from recent matches.
          </p>
        </div>
      </div>

      {showSpinner && (
        <div className="flex items-center justify-center gap-2 py-12 text-sm text-zinc-400">
          <Loader2 size={18} className="animate-spin" />
          Loading highlights...
        </div>
      )}

      {error && highlights.length === 0 && (
        <div className="py-8 text-center">
          <p className="mb-3 text-sm text-red-600">{error}</p>
          <button
            onClick={() => loadHighlights(true)}
            className="btn-secondary inline-flex items-center gap-2 px-4 py-2 text-sm"
          >
            <RefreshCw size={14} /> Retry
          </button>
        </div>
      )}

      {!showSpinner && highlights.length === 0 && !error && (
        <p className="py-8 text-center text-sm text-zinc-400">No highlights yet</p>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {highlights.map((h) => (
          <HighlightCard
            key={h.id}
            highlight={h}
            href={`/match/${h.matchId}`}
          />
        ))}
      </div>
    </section>
  );
}
