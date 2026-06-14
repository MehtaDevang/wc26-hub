"use client";

import { useTimezone } from "@/components/TimezoneProvider";
import { formatKickoffTime } from "@/lib/timezone";

export function MatchKickoffTime({
  match,
  className,
}: {
  match: { kickoffAt?: string; time: string };
  className?: string;
}) {
  const timezone = useTimezone();
  const label = match.kickoffAt
    ? formatKickoffTime(match.kickoffAt, timezone)
    : match.time;

  return <span className={className}>{label}</span>;
}
