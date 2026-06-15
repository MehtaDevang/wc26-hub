"use client";

import { useState, useRef, useEffect } from "react";
import { CalendarPlus, ChevronDown } from "lucide-react";
import type { Match } from "@/lib/types";
import { buildGoogleCalendarUrl, buildMatchICS, downloadICS } from "@/lib/calendar";

interface AddToCalendarProps {
  match: Match;
  className?: string;
  compact?: boolean;
}

export function AddToCalendar({ match, className = "", compact = false }: AddToCalendarProps) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const close = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, [open]);

  const googleUrl = buildGoogleCalendarUrl(match);
  const ics = buildMatchICS(match);

  if (!googleUrl && !ics) return null;

  const label = compact ? "Calendar" : "Add to Calendar";

  return (
    <div ref={rootRef} className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-3 py-2 text-xs font-semibold text-zinc-700 hover:bg-zinc-50 hover:border-zinc-300 transition-colors"
      >
        <CalendarPlus size={14} />
        {label}
        <ChevronDown size={12} className={`opacity-60 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="absolute left-0 top-full z-50 mt-1 min-w-[11rem] rounded-xl border border-zinc-200 bg-white py-1 shadow-lg">
          {googleUrl && (
            <a
              href={googleUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="block px-3 py-2.5 text-sm font-medium text-zinc-700 hover:bg-zinc-50"
              onClick={() => setOpen(false)}
            >
              Google Calendar
            </a>
          )}
          {ics && (
            <button
              type="button"
              className="w-full text-left px-3 py-2.5 text-sm font-medium text-zinc-700 hover:bg-zinc-50"
              onClick={() => {
                downloadICS(ics, `wc26-${match.id}.ics`);
                setOpen(false);
              }}
            >
              Apple / Outlook (.ics)
            </button>
          )}
        </div>
      )}
    </div>
  );
}
