"use client";

import { useCallback, useEffect, useState } from "react";
import { KnockoutBracket } from "@/components/KnockoutBracket";
import { useTimezone } from "@/components/TimezoneProvider";
import type { KnockoutBracketData } from "@/lib/types";

interface LiveKnockoutBracketProps {
  initialData: KnockoutBracketData;
  compact?: boolean;
  showLink?: boolean;
}

async function fetchBracket(timeZone: string): Promise<KnockoutBracketData> {
  const params = new URLSearchParams({ tz: timeZone });
  const res = await fetch(`/api/bracket?${params}`, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to refresh bracket");
  const data = await res.json();
  return data.bracket as KnockoutBracketData;
}

export function LiveKnockoutBracket({
  initialData,
  compact = false,
  showLink = false,
}: LiveKnockoutBracketProps) {
  const timezone = useTimezone();
  const [data, setData] = useState(initialData);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const refresh = useCallback(async () => {
    setRefreshing(true);
    setError("");
    try {
      const next = await fetchBracket(timezone);
      setData(next);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to refresh bracket");
    } finally {
      setRefreshing(false);
    }
  }, [timezone]);

  useEffect(() => {
    setData(initialData);
  }, [initialData]);

  useEffect(() => {
    const interval = setInterval(() => {
      refresh();
    }, 120_000);
    return () => clearInterval(interval);
  }, [refresh]);

  const hasLive = data.rounds.some((round) =>
    round.matches.some((match) => match.status === "live")
  );

  useEffect(() => {
    if (!hasLive) return;
    const interval = setInterval(() => {
      refresh();
    }, 60_000);
    return () => clearInterval(interval);
  }, [hasLive, refresh]);

  return (
    <div className="space-y-2">
      <KnockoutBracket data={data} compact={compact} showLink={showLink} refreshing={refreshing} />
      {error && (
        <p className="text-center text-xs text-amber-700">
          Couldn&apos;t refresh bracket — showing last loaded data
        </p>
      )}
    </div>
  );
}
