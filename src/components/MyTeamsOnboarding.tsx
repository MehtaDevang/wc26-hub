"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Star, X } from "lucide-react";
import clsx from "clsx";
import { TEAMS } from "@/lib/data";
import { getMyTeams, setMyTeams, MAX_MY_TEAMS } from "@/lib/my-teams";
import {
  hasSeenMyTeamsOnboarding,
  markMyTeamsOnboardingSeen,
} from "@/lib/my-teams-onboarding";

const POPULAR = ["USA", "MEX", "ARG", "BRA", "ENG", "FRA", "GER", "ESP", "POR", "NED"];

export function MyTeamsOnboarding() {
  const [visible, setVisible] = useState(false);
  const [picked, setPicked] = useState<string[]>([]);

  useEffect(() => {
    if (hasSeenMyTeamsOnboarding()) return;
    if (getMyTeams().length > 0) {
      markMyTeamsOnboardingSeen();
      return;
    }
    const t = window.setTimeout(() => setVisible(true), 1200);
    return () => window.clearTimeout(t);
  }, []);

  const toggle = (code: string) => {
    setPicked((prev) => {
      const upper = code.toUpperCase();
      if (prev.includes(upper)) return prev.filter((c) => c !== upper);
      if (prev.length >= MAX_MY_TEAMS) return [...prev.slice(1), upper];
      return [...prev, upper];
    });
  };

  const finish = (save: boolean) => {
    if (save && picked.length > 0) setMyTeams(picked);
    markMyTeamsOnboardingSeen();
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-[90] flex items-end sm:items-center justify-center p-4">
      <button
        type="button"
        className="absolute inset-0 bg-black/50"
        aria-label="Dismiss"
        onClick={() => finish(false)}
      />
      <div className="relative w-full max-w-md rounded-2xl bg-white shadow-2xl overflow-hidden">
        <div className="host-stripe" />
        <div className="p-5 sm:p-6">
          <div className="flex items-start justify-between gap-3 mb-4">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-amber-600 mb-1 flex items-center gap-1">
                <Star size={12} className="fill-amber-500 text-amber-500" />
                Personalize
              </p>
              <h2 className="text-lg font-bold text-zinc-900">Pick your teams</h2>
              <p className="text-sm text-zinc-500 mt-1">
                Follow up to {MAX_MY_TEAMS} nations — we&apos;ll surface their matches first across the site.
              </p>
            </div>
            <button
              type="button"
              onClick={() => finish(false)}
              className="text-zinc-400 hover:text-zinc-600 shrink-0"
              aria-label="Close"
            >
              <X size={18} />
            </button>
          </div>

          <div className="flex flex-wrap gap-2 mb-4">
            {POPULAR.map((code) => {
              const team = TEAMS[code];
              if (!team) return null;
              const selected = picked.includes(code);
              return (
                <button
                  key={code}
                  type="button"
                  onClick={() => toggle(code)}
                  className={clsx(
                    "inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium border transition-colors",
                    selected
                      ? "bg-amber-50 border-amber-300 text-amber-800"
                      : "bg-zinc-50 border-zinc-200 text-zinc-700 hover:border-zinc-300"
                  )}
                >
                  <span>{team.flag}</span>
                  {team.name}
                </button>
              );
            })}
          </div>

          <p className="text-xs text-zinc-400 mb-4">
            {picked.length}/{MAX_MY_TEAMS} selected ·{" "}
            <Link href="/teams" className="text-blue-600 hover:underline" onClick={() => finish(false)}>
              Browse all teams
            </Link>
          </p>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => finish(true)}
              disabled={picked.length === 0}
              className="btn-primary flex-1 py-2.5 text-sm disabled:opacity-40"
            >
              Save & continue
            </button>
            <button
              type="button"
              onClick={() => finish(false)}
              className="btn-secondary px-4 py-2.5 text-sm"
            >
              Skip
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
