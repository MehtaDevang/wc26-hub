"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import clsx from "clsx";
import { Star, Filter } from "lucide-react";
import { FixturesList } from "@/components/FixturesList";
import { getMyTeams } from "@/lib/my-teams";
import { useTimezone } from "@/components/TimezoneProvider";
import {
  formatKickoffDateKey,
  formatKickoffDateLabel,
  todayDateKey,
} from "@/lib/timezone";
import type { Match } from "@/lib/types";

const GROUPS = "ABCDEFGHIJKL".split("");

interface FixturesExplorerProps {
  matches: Match[];
}

function teamInMatch(match: Match, code: string): boolean {
  const u = code.toUpperCase();
  return match.home.toUpperCase() === u || match.away.toUpperCase() === u;
}

/** Prefer today; otherwise the next day with fixtures, then the most recent past day. */
function defaultFixtureDateKey(dateKeys: string[], timeZone: string): string {
  const today = todayDateKey(timeZone);
  if (dateKeys.includes(today)) return today;
  const upcoming = dateKeys.find((key) => key >= today);
  if (upcoming) return upcoming;
  return dateKeys[dateKeys.length - 1] ?? today;
}

export function FixturesExplorer({ matches }: FixturesExplorerProps) {
  const timezone = useTimezone();
  const dateStripRef = useRef<HTMLDivElement>(null);
  const [group, setGroup] = useState<string | "all">("all");
  const [myTeamsOnly, setMyTeamsOnly] = useState(false);
  const [hideFinished, setHideFinished] = useState(false);
  const [dateKey, setDateKey] = useState<string | "all">("all");
  const [myTeams, setMyTeams] = useState<string[]>([]);
  const [dateInitialized, setDateInitialized] = useState(false);

  const today = useMemo(() => todayDateKey(timezone), [timezone]);

  useEffect(() => {
    setMyTeams(getMyTeams());
    const refresh = () => setMyTeams(getMyTeams());
    window.addEventListener("wc26-my-teams-changed", refresh);
    window.addEventListener("storage", refresh);
    return () => {
      window.removeEventListener("wc26-my-teams-changed", refresh);
      window.removeEventListener("storage", refresh);
    };
  }, []);

  const dateKeys = useMemo(() => {
    const keys = new Set<string>();
    for (const m of matches) {
      keys.add(m.kickoffAt ? formatKickoffDateKey(m.kickoffAt, timezone) : m.date);
    }
    return [...keys].sort();
  }, [matches, timezone]);

  useEffect(() => {
    if (dateKeys.length === 0) return;
    setDateKey(defaultFixtureDateKey(dateKeys, timezone));
    setDateInitialized(true);
  }, [dateKeys, timezone]);

  useEffect(() => {
    if (!dateInitialized || dateKey === "all") return;
    const strip = dateStripRef.current;
    if (!strip) return;
    const active = strip.querySelector<HTMLElement>(`[data-date-key="${dateKey}"]`);
    active?.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
  }, [dateKey, dateInitialized]);

  const filtered = useMemo(() => {
    let list = matches;
    if (group !== "all") list = list.filter((m) => m.group === group);
    if (myTeamsOnly && myTeams.length > 0) {
      list = list.filter((m) => myTeams.some((c) => teamInMatch(m, c)));
    }
    if (hideFinished) list = list.filter((m) => m.status !== "finished");
    if (dateKey !== "all") {
      list = list.filter((m) => {
        const k = m.kickoffAt ? formatKickoffDateKey(m.kickoffAt, timezone) : m.date;
        return k === dateKey;
      });
    }
    return list;
  }, [matches, group, myTeamsOnly, myTeams, hideFinished, dateKey, timezone]);

  return (
    <div className="space-y-4">
      <div
        ref={dateStripRef}
        className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1 scrollbar-thin"
      >
        <button
          type="button"
          onClick={() => setDateKey("all")}
          className={clsx(
            "shrink-0 rounded-full px-3 py-1.5 text-xs font-semibold transition-colors",
            dateKey === "all"
              ? "bg-[var(--wc-usa)] text-white"
              : "bg-white border border-zinc-200 text-zinc-600 hover:bg-zinc-50"
          )}
        >
          All dates
        </button>
        {dateKeys.map((key) => (
          <button
            key={key}
            type="button"
            data-date-key={key}
            onClick={() => setDateKey(key)}
            className={clsx(
              "shrink-0 rounded-full px-3 py-1.5 text-xs font-semibold transition-colors whitespace-nowrap",
              dateKey === key
                ? "bg-[var(--wc-usa)] text-white"
                : key === today
                  ? "bg-emerald-50 border border-emerald-200 text-emerald-800 hover:bg-emerald-100"
                  : "bg-white border border-zinc-200 text-zinc-600 hover:bg-zinc-50"
            )}
          >
            {key === today ? "Today" : formatKickoffDateLabel(key, timezone)}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-1">
          <Filter size={12} />
          Group
        </span>
        <button
          type="button"
          onClick={() => setGroup("all")}
          className={clsx(
            "rounded-full px-2.5 py-1 text-xs font-semibold border transition-colors",
            group === "all"
              ? "bg-zinc-900 text-white border-zinc-900"
              : "bg-white border-zinc-200 text-zinc-600"
          )}
        >
          All
        </button>
        {GROUPS.map((g) => (
          <button
            key={g}
            type="button"
            onClick={() => setGroup(g)}
            className={clsx(
              "rounded-full w-8 h-8 text-xs font-bold border transition-colors",
              group === g
                ? "bg-[var(--wc-usa)] text-white border-[var(--wc-usa)]"
                : "bg-white border-zinc-200 text-zinc-600 hover:border-zinc-300"
            )}
          >
            {g}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setMyTeamsOnly((v) => !v)}
          className={clsx(
            "inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold border transition-colors",
            myTeamsOnly
              ? "bg-amber-50 border-amber-300 text-amber-800"
              : "bg-white border-zinc-200 text-zinc-600 hover:bg-zinc-50"
          )}
        >
          <Star size={12} className={myTeamsOnly ? "fill-amber-500 text-amber-500" : ""} />
          My teams only
        </button>
        <button
          type="button"
          onClick={() => setHideFinished((v) => !v)}
          className={clsx(
            "rounded-full px-3 py-1.5 text-xs font-semibold border transition-colors",
            hideFinished
              ? "bg-zinc-900 text-white border-zinc-900"
              : "bg-white border-zinc-200 text-zinc-600 hover:bg-zinc-50"
          )}
        >
          Hide finished
        </button>
        <span className="text-xs text-zinc-400 self-center ml-auto tabular-nums">
          {filtered.length} of {matches.length} matches
        </span>
      </div>

      <FixturesList matches={filtered} />
    </div>
  );
}
