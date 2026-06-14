"use client";

import { Globe } from "lucide-react";
import { useTimezone } from "@/components/TimezoneProvider";
import { formatTimezoneLabel } from "@/lib/timezone";

interface TimezoneBadgeProps {
  className?: string;
  showIcon?: boolean;
}

export function TimezoneBadge({
  className = "",
  showIcon = true,
}: TimezoneBadgeProps) {
  const timezone = useTimezone();

  return (
    <span
      className={`inline-flex items-center gap-1 text-[10px] font-medium text-zinc-400 ${className}`}
      title={`Times shown in your timezone (${timezone})`}
    >
      {showIcon && <Globe size={11} className="shrink-0" />}
      {formatTimezoneLabel(timezone)}
    </span>
  );
}
