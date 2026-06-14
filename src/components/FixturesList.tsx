"use client";

import { useMemo } from "react";
import { Calendar } from "lucide-react";
import type { Match } from "@/lib/types";
import { AdBanner } from "@/components/AdBanner";
import { MatchClashRow } from "@/components/MatchBattleGraphic";
import { TimezoneBadge } from "@/components/TimezoneBadge";
import { useTimezone } from "@/components/TimezoneProvider";
import { formatKickoffDateKey, formatKickoffDateLabel } from "@/lib/timezone";

export function FixturesList({ matches }: { matches: Match[] }) {
  const timezone = useTimezone();

  const byDate = useMemo(() => {
    const map = new Map<string, Match[]>();
    for (const m of matches) {
      const dateKey = m.kickoffAt
        ? formatKickoffDateKey(m.kickoffAt, timezone)
        : m.date;
      const list = map.get(dateKey) ?? [];
      list.push(m);
      map.set(dateKey, list);
    }
    return [...map.entries()].sort(([a], [b]) => a.localeCompare(b));
  }, [matches, timezone]);

  if (!matches.length) {
    return <p className="text-sm text-zinc-400 text-center py-12">No fixtures available.</p>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <TimezoneBadge />
      </div>
      {byDate.map(([date, dayMatches], index) => (
        <div key={date}>
          <div className="card-surface rounded-2xl overflow-hidden">
            <div className="px-4 py-3 border-b border-zinc-100 flex items-center gap-2 bg-zinc-50/50">
              <Calendar size={14} className="text-blue-600" />
              <h3 className="font-semibold text-zinc-900 text-sm">
                {formatKickoffDateLabel(date, timezone)}
              </h3>
              <span className="text-xs text-zinc-400 ml-auto">{dayMatches.length} matches</span>
            </div>
            <div className="match-clash-list">
              {dayMatches.map((m) => (
                <MatchClashRow key={m.id} match={m} />
              ))}
            </div>
          </div>
          {(index + 1) % 3 === 0 && index < byDate.length - 1 && (
            <div className="mt-6">
              <AdBanner placement="fixtures" />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
