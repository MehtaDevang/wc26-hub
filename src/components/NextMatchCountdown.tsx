"use client";

import { useEffect, useMemo, useState } from "react";
import { useMounted } from "@/hooks/useMounted";
import Link from "next/link";
import { Clock, ChevronRight, Swords } from "lucide-react";
import { getTeam } from "@/lib/data";
import { getTeamColors } from "@/lib/team-colors";
import { BattleLiveBackground } from "@/components/MatchBattleGraphic";
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

function CountdownUnit({
  value,
  label,
  homeColor,
  awayColor,
  blend,
}: {
  value: number;
  label: string;
  homeColor: string;
  awayColor: string;
  blend?: "home" | "away" | "mix";
}) {
  const bg =
    blend === "home"
      ? `linear-gradient(145deg, color-mix(in srgb, ${homeColor} 88%, #000), color-mix(in srgb, ${homeColor} 55%, #111))`
      : blend === "away"
        ? `linear-gradient(145deg, color-mix(in srgb, ${awayColor} 88%, #000), color-mix(in srgb, ${awayColor} 55%, #111))`
        : `linear-gradient(145deg, color-mix(in srgb, ${homeColor} 45%, #111), color-mix(in srgb, ${awayColor} 45%, #111))`;

  return (
    <div className="countdown-unit flex flex-col items-center min-w-[2.85rem] sm:min-w-[3.5rem] rounded-xl px-2 py-2" style={{ background: bg }}>
      <span className="text-xl sm:text-3xl font-extrabold tabular-nums leading-none text-white drop-shadow-sm">
        {String(value).padStart(2, "0")}
      </span>
      <span className="text-[8px] sm:text-[9px] font-bold uppercase tracking-wider text-white/85 mt-1">
        {label}
      </span>
    </div>
  );
}

function CountdownTimer({
  kickoffAt,
  homeColor,
  awayColor,
}: {
  kickoffAt: string;
  homeColor: string;
  awayColor: string;
}) {
  const mounted = useMounted();
  const [now, setNow] = useState<number | null>(null);

  useEffect(() => {
    setNow(Date.now());
    const timer = setInterval(() => setNow(Date.now()), 1_000);
    return () => clearInterval(timer);
  }, []);

  const parts = useMemo(
    () => (now === null ? null : getCountdownParts(new Date(kickoffAt).getTime(), now)),
    [kickoffAt, now]
  );

  if (!mounted || parts === null) {
    return (
      <div
        className="flex items-center justify-center gap-2 sm:gap-2.5 min-h-[3.25rem]"
        aria-hidden
      >
        {["Days", "Hrs", "Min", "Sec"].map((label) => (
          <div
            key={label}
            className="countdown-unit flex flex-col items-center min-w-[2.85rem] sm:min-w-[3.5rem] rounded-xl px-2 py-2 opacity-50"
            style={{
              background: `linear-gradient(145deg, color-mix(in srgb, ${homeColor} 45%, #111), color-mix(in srgb, ${awayColor} 45%, #111))`,
            }}
          >
            <span className="text-xl sm:text-3xl font-extrabold tabular-nums leading-none text-white">
              --
            </span>
            <span className="text-[8px] sm:text-[9px] font-bold uppercase tracking-wider text-white/85 mt-1">
              {label}
            </span>
          </div>
        ))}
      </div>
    );
  }

  if (parts.complete) {
    return (
      <p className="text-sm font-extrabold uppercase tracking-wider text-white drop-shadow animate-pulse">
        Kickoff imminent ⚽
      </p>
    );
  }

  return (
    <div className="flex items-center justify-center gap-2 sm:gap-2.5">
      {parts.days > 0 && (
        <CountdownUnit value={parts.days} label="Days" homeColor={homeColor} awayColor={awayColor} blend="home" />
      )}
      <CountdownUnit
        value={parts.hours}
        label="Hrs"
        homeColor={homeColor}
        awayColor={awayColor}
        blend={parts.days === 0 ? "home" : "mix"}
      />
      <CountdownUnit value={parts.minutes} label="Min" homeColor={homeColor} awayColor={awayColor} blend="mix" />
      <CountdownUnit value={parts.seconds} label="Sec" homeColor={homeColor} awayColor={awayColor} blend="away" />
    </div>
  );
}

function CountdownCard({ match, order }: { match: Match; order: number }) {
  const timezone = useTimezone();
  const localized = applyTimezoneToMatch(match, timezone);
  const home = getTeam(localized.home, localized.homeName, localized.homeLogo);
  const away = getTeam(localized.away, localized.awayName, localized.awayLogo);
  const homeColors = getTeamColors(localized.home);
  const awayColors = getTeamColors(localized.away);
  const kickoffLabel = localized.kickoffAt
    ? formatKickoffDateLabel(localized.kickoffAt, timezone)
    : localized.date;

  return (
    <Link
      href={`/match/${match.id}`}
      className="countdown-battle-card group relative block overflow-hidden rounded-2xl transition-all hover:-translate-y-1 hover:shadow-xl"
      style={{
        "--home-primary": homeColors.primary,
        "--away-primary": awayColors.primary,
      } as React.CSSProperties}
    >
      <BattleLiveBackground homeCode={localized.home} awayCode={localized.away} />

      <span
        className="countdown-battle-watermark countdown-battle-watermark-home"
        style={{ color: homeColors.primary }}
      >
        {home.flag}
      </span>
      <span
        className="countdown-battle-watermark countdown-battle-watermark-away"
        style={{ color: awayColors.primary }}
      >
        {away.flag}
      </span>

      <div className="relative z-10 p-4 sm:p-5">
        <div className="flex items-center justify-between gap-2 mb-4">
          <span className="inline-flex items-center gap-1 rounded-full bg-black/35 backdrop-blur-sm px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white border border-white/10">
            <Swords size={11} />
            {order === 1 ? "Next battle" : "Up next"}
          </span>
          <span
            className="rounded-full backdrop-blur-sm px-2 py-0.5 text-[10px] font-bold text-white border border-white/20"
            style={{ background: `color-mix(in srgb, ${homeColors.primary} 40%, transparent)` }}
          >
            Group {localized.group}
          </span>
        </div>

        <div className="flex items-center justify-between gap-2 mb-4">
          <div className="countdown-team-block flex flex-col items-center gap-1.5 min-w-0 flex-1">
            <div
              className="countdown-team-crest"
              style={{
                borderColor: homeColors.primary,
                boxShadow: `0 0 20px color-mix(in srgb, ${homeColors.primary} 50%, transparent)`,
              }}
            >
              {home.logo ? (
                <img src={home.logo} alt="" className="h-10 w-10 object-contain" />
              ) : (
                <span className="text-4xl">{home.flag}</span>
              )}
            </div>
            <span className="font-extrabold text-sm sm:text-base text-white text-center truncate w-full drop-shadow">
              {home.name}
            </span>
          </div>

          <div
            className="countdown-vs-badge shrink-0 flex flex-col items-center"
            style={{
              background: `linear-gradient(135deg, ${homeColors.secondary}, ${awayColors.secondary})`,
              borderColor: homeColors.accent,
            }}
          >
            <span className="countdown-vs-text">VS</span>
            <span className="text-[8px] font-bold uppercase tracking-widest text-white/90 mt-0.5">Clash</span>
          </div>

          <div className="countdown-team-block flex flex-col items-center gap-1.5 min-w-0 flex-1">
            <div
              className="countdown-team-crest"
              style={{
                borderColor: awayColors.primary,
                boxShadow: `0 0 20px color-mix(in srgb, ${awayColors.primary} 50%, transparent)`,
              }}
            >
              {away.logo ? (
                <img src={away.logo} alt="" className="h-10 w-10 object-contain" />
              ) : (
                <span className="text-4xl">{away.flag}</span>
              )}
            </div>
            <span className="font-extrabold text-sm sm:text-base text-white text-center truncate w-full drop-shadow">
              {away.name}
            </span>
          </div>
        </div>

        <p className="text-xs text-white/90 text-center mb-4 font-medium">
          {kickoffLabel}
          {localized.time && (
            <>
              {" · "}
              <span className="font-bold text-white">{localized.time}</span>
            </>
          )}
        </p>

        <CountdownTimer
          kickoffAt={match.kickoffAt}
          homeColor={homeColors.primary}
          awayColor={awayColors.primary}
        />

        <div className="mt-4 flex items-center justify-center gap-1 text-xs font-semibold text-white/90 opacity-0 group-hover:opacity-100 transition-opacity">
          Match preview
          <ChevronRight size={12} />
        </div>
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
        <Clock size={20} className="text-[var(--wc-canada)]" />
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
