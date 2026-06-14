"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { getTeam } from "@/lib/data";
import { getTeamColors } from "@/lib/team-colors";
import { MatchKickoffTime } from "@/components/MatchKickoffTime";
import type { Match } from "@/lib/types";

export function BattleLiveBackground({
  homeCode,
  awayCode,
  variant = "full",
}: {
  homeCode: string;
  awayCode: string;
  variant?: "full" | "compact";
}) {
  const home = getTeamColors(homeCode);
  const away = getTeamColors(awayCode);

  return (
    <div
      className={`countdown-battle-bg ${variant === "compact" ? "countdown-battle-bg-compact" : ""}`}
      aria-hidden
      style={
        {
          "--home-primary": home.primary,
          "--home-secondary": home.secondary,
          "--away-primary": away.primary,
          "--away-secondary": away.secondary,
        } as React.CSSProperties
      }
    >
      <div className="countdown-battle-live-gradient" />
      <div className="countdown-battle-side countdown-battle-side-home" />
      <div className="countdown-battle-side countdown-battle-side-away" />
      {variant === "full" && (
        <>
          <div className="countdown-battle-particles">
            {Array.from({ length: 12 }).map((_, i) => (
              <span key={i} className="countdown-battle-particle" style={{ "--i": i } as React.CSSProperties} />
            ))}
          </div>
          <div className="countdown-battle-rays" />
          <div className="countdown-battle-sparks" />
          <div className="countdown-battle-scanline" />
        </>
      )}
      <div className="countdown-battle-clash-line" />
    </div>
  );
}

function LiveBadge() {
  return (
    <span className="badge-live">
      <span className="relative flex h-1.5 w-1.5">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-500 opacity-60" />
        <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-red-500" />
      </span>
      Live
    </span>
  );
}

export function MatchClashRow({
  match,
  liveMinute,
  showGroup = true,
}: {
  match: Match;
  liveMinute?: number;
  showGroup?: boolean;
}) {
  const home = getTeam(match.home, match.homeName, match.homeLogo);
  const away = getTeam(match.away, match.awayName, match.awayLogo);
  const homeColors = getTeamColors(match.home);
  const awayColors = getTeamColors(match.away);
  const isLive = match.status === "live";
  const isFinished = match.status === "finished";
  const hasScore = isLive || isFinished;
  const homeWins = hasScore && match.homeScore! > match.awayScore!;
  const awayWins = hasScore && match.awayScore! > match.homeScore!;

  return (
    <Link
      href={`/match/${match.id}`}
      className={`match-clash-row group ${isLive ? "match-clash-row-live" : ""}`}
      style={
        {
          "--home-primary": homeColors.primary,
          "--away-primary": awayColors.primary,
        } as React.CSSProperties
      }
    >
      <div className="match-clash-accent" aria-hidden>
        <span className="match-clash-accent-home" />
        <span className="match-clash-accent-away" />
      </div>

      <div className="match-clash-time shrink-0 text-center">
        {isLive ? (
          <span className="text-xs font-bold text-red-600 tabular-nums">
            {match.displayClock ?? `${liveMinute}'`}
          </span>
        ) : isFinished ? (
          <span className="text-[10px] font-semibold text-zinc-400 uppercase">FT</span>
        ) : (
          <MatchKickoffTime match={match} className="text-[11px] text-zinc-400 tabular-nums" />
        )}
      </div>

      <div className="match-clash-teams min-w-0 flex-1">
        <div className="flex items-center gap-2 min-w-0">
          {home.logo ? (
            <img src={home.logo} alt="" className="h-5 w-5 object-contain shrink-0" />
          ) : (
            <span className="text-sm shrink-0">{home.flag}</span>
          )}
          <span
            className={`text-sm truncate ${homeWins ? "font-bold text-zinc-900" : hasScore ? "font-medium text-zinc-700" : "text-zinc-600"}`}
          >
            {home.name}
          </span>
        </div>
        <div className="flex items-center gap-2 min-w-0 mt-1.5">
          {away.logo ? (
            <img src={away.logo} alt="" className="h-5 w-5 object-contain shrink-0" />
          ) : (
            <span className="text-sm shrink-0">{away.flag}</span>
          )}
          <span
            className={`text-sm truncate ${awayWins ? "font-bold text-zinc-900" : hasScore ? "font-medium text-zinc-700" : "text-zinc-600"}`}
          >
            {away.name}
          </span>
        </div>
      </div>

      {hasScore && (
        <span className="match-clash-score tabular-nums shrink-0">
          {match.homeScore}–{match.awayScore}
        </span>
      )}

      <div className="match-clash-meta shrink-0 flex flex-col items-end gap-1">
        {isLive && <LiveBadge />}
        {showGroup && (
          <span className="text-[10px] text-zinc-400 font-medium">
            {match.group === "?" ? "KO" : `Grp ${match.group}`}
          </span>
        )}
        <ChevronRight size={14} className="text-zinc-300 group-hover:text-blue-500 transition-colors" />
      </div>
    </Link>
  );
}
