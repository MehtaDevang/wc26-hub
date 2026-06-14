"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Clock, ChevronRight } from "lucide-react";
import { getTeam } from "@/lib/data";
import { useTimezone } from "@/components/TimezoneProvider";
import { applyTimezoneToMatch, formatKickoffDateLabel } from "@/lib/timezone";
import type { Match } from "@/lib/types";

interface CountdownParts {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  complete: boolean;
}

function getCountdownParts(targetMs: number, nowMs: number): CountdownParts {
  const diff = Math.max(0, targetMs - nowMs);
  return {
    days: Math.floor(diff / 86_400_000),
    hours: Math.floor((diff % 86_400_000) / 3_600_000),
    minutes: Math.floor((diff % 3_600_000) / 60_000),
    seconds: Math.floor((diff % 60_000) / 1_000),
    complete: diff === 0,
  };
}

function CountdownUnit({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center min-w-[2.75rem] sm:min-w-[3.25rem]">
      <span className="text-xl sm:text-2xl font-extrabold tabular-nums text-zinc-900 leading-none">
        {String(value).padStart(2, "0")}
      </span>
      <span className="text-[9px] sm:text-[10px] font-semibold uppercase tracking-wider text-zinc-400 mt-1">
        {label}
      </span>
    </div>
  );
}

function CountdownTimer({ kickoffAt }: { kickoffAt: string }) {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 1_000);
    return () => clearInterval(timer);
  }, []);

  const parts = useMemo(
    () => getCountdownParts(new Date(kickoffAt).getTime(), now),
    [kickoffAt, now]
  );

  if (parts.complete) {
    return (
      <p className="text-sm font-semibold text-[var(--wc-usa)]">Kickoff imminent</p>
    );
  }

  return (
    <div className="flex items-center justify-center gap-2 sm:gap-3">
      {parts.days > 0 && <CountdownUnit value={parts.days} label="Days" />}
      <CountdownUnit value={parts.hours} label="Hrs" />
      <CountdownUnit value={parts.minutes} label="Min" />
      <CountdownUnit value={parts.seconds} label="Sec" />
    </div>
  );
}

function CountdownCard({ match, order }: { match: Match; order: number }) {
  const timezone = useTimezone();
  const localized = applyTimezoneToMatch(match, timezone);
  const home = getTeam(localized.home, localized.homeName, localized.homeLogo);
  const away = getTeam(localized.away, localized.awayName, localized.awayLogo);
  const kickoffLabel = localized.kickoffAt
    ? formatKickoffDateLabel(localized.kickoffAt, timezone)
    : localized.date;

  return (
    <Link
      href={`/match/${match.id}`}
      className="card-surface rounded-2xl p-4 sm:p-5 hover:border-blue-200 hover:shadow-md transition-all group"
    >
      <div className="flex items-center justify-between gap-2 mb-3">
        <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">
          {order === 1 ? "Next match" : "Then"}
        </span>
        <span className="text-[10px] font-semibold text-zinc-400">
          Group {localized.group}
        </span>
      </div>

      <div className="flex items-center justify-between gap-3 mb-3">
        <div className="flex items-center gap-2 min-w-0 flex-1">
          {home.logo ? (
            <img src={home.logo} alt="" className="h-6 w-6 object-contain shrink-0" />
          ) : (
            <span className="text-lg shrink-0">{home.flag}</span>
          )}
          <span className="font-bold text-sm text-zinc-900 truncate">{home.name}</span>
        </div>
        <span className="text-[10px] font-bold text-zinc-300 uppercase shrink-0">vs</span>
        <div className="flex items-center gap-2 min-w-0 flex-1 justify-end">
          <span className="font-bold text-sm text-zinc-900 truncate text-right">{away.name}</span>
          {away.logo ? (
            <img src={away.logo} alt="" className="h-6 w-6 object-contain shrink-0" />
          ) : (
            <span className="text-lg shrink-0">{away.flag}</span>
          )}
        </div>
      </div>

      <p className="text-xs text-zinc-500 text-center mb-4">
        {kickoffLabel}
        {localized.time && (
          <>
            {" · "}
            <span className="font-semibold text-zinc-700">{localized.time}</span>
          </>
        )}
      </p>

      <CountdownTimer kickoffAt={match.kickoffAt} />

      <div className="mt-3 flex items-center justify-center gap-1 text-xs text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity">
        Match preview
        <ChevronRight size={12} />
      </div>
    </Link>
  );
}

interface NextMatchCountdownProps {
  matches: Match[];
}

export function NextMatchCountdown({ matches }: NextMatchCountdownProps) {
  if (matches.length === 0) return null;

  return (
    <section>
      <div className="mb-4 flex items-center gap-2">
        <Clock size={20} className="text-[var(--wc-usa)]" />
        <h2 className="section-title text-base">Countdown to Kickoff</h2>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        {matches.map((match, index) => (
          <CountdownCard key={match.id} match={match} order={index + 1} />
        ))}
      </div>
    </section>
  );
}
