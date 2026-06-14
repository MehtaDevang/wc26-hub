"use client";

import { Globe } from "lucide-react";
import { useTimezone } from "@/components/TimezoneProvider";
import { useMounted } from "@/hooks/useMounted";
import { formatTimezoneLabel } from "@/lib/timezone";

function timezoneShortName(timeZone: string): string {
  try {
    return (
      new Intl.DateTimeFormat("en-US", {
        timeZone,
        timeZoneName: "short",
      })
        .formatToParts(new Date("2026-06-15T12:00:00"))
        .find((p) => p.type === "timeZoneName")?.value ?? timeZone
    );
  } catch {
    return timeZone;
  }
}

interface TimezoneBadgeProps {
  className?: string;
  showIcon?: boolean;
}

export function TimezoneBadge({
  className = "",
  showIcon = true,
}: TimezoneBadgeProps) {
  const timezone = useTimezone();
  const mounted = useMounted();
  const label = mounted ? formatTimezoneLabel(timezone) : timezoneShortName(timezone);

  return (
    <span
      className={`inline-flex items-center gap-1 text-[10px] font-medium text-zinc-400 ${className}`}
      title={`Times shown in your timezone (${timezone})`}
    >
      {showIcon && <Globe size={11} className="shrink-0" />}
      {label}
    </span>
  );
}
