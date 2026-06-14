"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ChevronRight, Clock } from "lucide-react";
import { getTeam } from "@/lib/data";
import { getTeamColors } from "@/lib/team-colors";
import { fetchMatches } from "@/lib/matches";
import { MatchKickoffTime } from "@/components/MatchKickoffTime";
import { useTimezone } from "@/components/TimezoneProvider";
import {
  applyTimezoneToMatches,
  filterMatchesForScoreboardToday,
  todayDateKey,
} from "@/lib/timezone";
import type { Match } from "@/lib/types";

function pickUpcoming(matches: Match[], limit = 2): Match[] {
  const now = Date.now();
  return matches
    .filter(
      (m) =>
        m.status === "upcoming" &&
        m.kickoffAt &&
        new Date(m.kickoffAt).getTime() > now
    )
    .sort((a, b) => new Date(a.kickoffAt).getTime() - new Date(b.kickoffAt).getTime())
    .slice(0, limit);
}

function LiveBadge() {
  return (
    <span className="home-hero-live-badge">
      <span className="home-hero-live-dot" />
      Live
    </span>
  );
}

function MatchSpotlightCard({
  match,
  variant,
  liveMinute,
}: {
  match: Match;
  variant: "live" | "upcoming";
  liveMinute?: number;
}) {
  const home = getTeam(match.home, match.homeName, match.homeLogo);
  const away = getTeam(match.away, match.awayName, match.awayLogo);
  const homeColors = getTeamColors(match.home);
  const awayColors = getTeamColors(match.away);
  const isLive = variant === "live";
  const groupLabel = match.group === "?" ? "Knockout" : `Group ${match.group}`;

  return (
    <Link
      href={`/match/${match.id}`}
      className="home-hero-teaser group block"
    >
      <div
        className="home-hero-teaser-bar"
        style={{
          background: `linear-gradient(90deg, ${homeColors.primary} 0%, ${homeColors.primary} 48%, ${awayColors.primary} 52%, ${awayColors.primary} 100%)`,
        }}
      />
      <div className="home-hero-teaser-body">
        <div className="flex items-center justify-between gap-2 mb-3">
          <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">
            {isLive ? "Live now" : "Up next"} · {groupLabel}
          </p>
          {isLive ? (
            <LiveBadge />
          ) : (
            <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-zinc-500">
              <Clock size={10} />
              <MatchKickoffTime match={match} />
            </span>
          )}
        </div>

        <div className="flex items-center justify-between gap-3">
          <div className="flex flex-col items-center gap-1.5 min-w-0 flex-1">
            {home.logo ? (
              <img src={home.logo} alt="" className="h-9 w-9 object-contain" />
            ) : (
              <span className="text-3xl">{home.flag}</span>
            )}
            <span className="font-bold text-sm text-zinc-900 text-center truncate w-full">
              {home.name}
            </span>
          </div>

          <div className="shrink-0 text-center px-2">
            {isLive ? (
              <>
                <p className="text-3xl sm:text-4xl font-extrabold text-zinc-900 tabular-nums leading-none">
                  {match.homeScore}
                  <span className="mx-1.5 text-zinc-300">–</span>
                  {match.awayScore}
                </p>
                <p className="mt-1 text-xs font-bold text-[var(--wc-canada)]">
                  {match.displayClock ?? `${liveMinute ?? match.minute ?? 0}'`}
                </p>
              </>
            ) : (
              <span className="text-lg font-extrabold text-zinc-300">vs</span>
            )}
          </div>

          <div className="flex flex-col items-center gap-1.5 min-w-0 flex-1">
            {away.logo ? (
              <img src={away.logo} alt="" className="h-9 w-9 object-contain" />
            ) : (
              <span className="text-3xl">{away.flag}</span>
            )}
            <span className="font-bold text-sm text-zinc-900 text-center truncate w-full">
              {away.name}
            </span>
          </div>
        </div>

        <p className="mt-3 flex items-center justify-center gap-1 text-xs font-semibold text-[var(--wc-usa)] opacity-0 group-hover:opacity-100 transition-opacity">
          {isLive ? "Follow live" : "View match"}
          <ChevronRight size={12} />
        </p>
      </div>
    </Link>
  );
}

interface LiveHomeHeroSpotlightProps {
  initialTodayMatches: Match[];
  initialUpcomingMatches: Match[];
}

export function LiveHomeHeroSpotlight({
  initialTodayMatches,
  initialUpcomingMatches,
}: LiveHomeHeroSpotlightProps) {
  const timezone = useTimezone();
  const [todayMatches, setTodayMatches] = useState(initialTodayMatches);
  const [upcomingMatches, setUpcomingMatches] = useState(initialUpcomingMatches);
  const [liveMinute, setLiveMinute] = useState(0);

  const localizedToday = useMemo(() => {
    const localized = applyTimezoneToMatches(todayMatches, timezone);
    return filterMatchesForScoreboardToday(
      localized,
      todayDateKey(timezone),
      timezone
    );
  }, [todayMatches, timezone]);

  const liveMatches = localizedToday.filter((m) => m.status === "live");
  const upcomingToday = pickUpcoming(localizedToday, 2);
  const displayUpcoming =
    upcomingToday.length > 0 ? upcomingToday : pickUpcoming(upcomingMatches, 2);

  const refreshToday = useCallback(async () => {
    try {
      const data = await fetchMatches({ date: "today", timeZone: timezone });
      setTodayMatches(data);
    } catch {
      // keep last good data
    }
  }, [timezone]);

  const refreshUpcoming = useCallback(async () => {
    try {
      const all = await fetchMatches({ range: "full", timeZone: timezone });
      const next = pickUpcoming(all, 2);
      if (next.length > 0) setUpcomingMatches(next);
    } catch {
      // keep last good data
    }
  }, [timezone]);

  useEffect(() => {
    const hasLive = liveMatches.length > 0;
    const interval = setInterval(refreshToday, hasLive ? 30_000 : 60_000);
    return () => clearInterval(interval);
  }, [liveMatches.length, refreshToday]);

  useEffect(() => {
    const interval = setInterval(refreshUpcoming, 120_000);
    return () => clearInterval(interval);
  }, [refreshUpcoming]);

  useEffect(() => {
    if (liveMatches.length === 0) return;
    setLiveMinute(liveMatches[0].minute ?? 0);
    const interval = setInterval(() => {
      setLiveMinute((m) => (m >= 90 ? 90 : m + 1));
    }, 8000);
    return () => clearInterval(interval);
  }, [liveMatches.length, liveMatches[0]?.minute]);

  if (liveMatches.length === 0 && displayUpcoming.length === 0) {
    return null;
  }

  const cards = liveMatches.length > 0 ? liveMatches : displayUpcoming;
  const variant = liveMatches.length > 0 ? "live" : "upcoming";

  return (
    <div
      className={`home-hero-spotlight mt-10 mx-auto max-w-lg ${
        cards.length > 1 ? "home-hero-spotlight--multi" : ""
      }`}
    >
      {cards.map((match) => (
        <MatchSpotlightCard
          key={match.id}
          match={match}
          variant={variant}
          liveMinute={liveMatches[0]?.id === match.id ? liveMinute : match.minute}
        />
      ))}
    </div>
  );
}
