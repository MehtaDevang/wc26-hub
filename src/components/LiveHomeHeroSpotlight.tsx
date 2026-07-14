"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ChevronRight, Clock, Trophy } from "lucide-react";
import { getTeam } from "@/lib/data";
import { getTeamColors } from "@/lib/team-colors";
import { FifaRankBadge } from "@/components/FifaRankBadge";
import { fetchMatches } from "@/lib/matches";
import { MatchKickoffTime } from "@/components/MatchKickoffTime";
import { useTimezone } from "@/components/TimezoneProvider";
import {
  applyTimezoneToMatches,
  filterMatchesForScoreboardToday,
  todayDateKey,
} from "@/lib/timezone";
import { CdnImage } from "@/components/CdnImage";
import {
  mergeMatchesById,
  pickNextUpcomingMatches,
} from "@/lib/upcoming-matches";
import type { Match } from "@/lib/types";

type SpotlightVariant = "live" | "upcoming" | "finished";

function LiveBadge() {
  return (
    <span className="home-spotlight-live-badge">
      <span className="home-spotlight-live-dot" />
      Live
    </span>
  );
}

function roundLabel(match: Match): string {
  if (match.group === "?") return "Knockout";
  if (match.roundSlug && match.roundSlug !== "group-stage") {
    return match.roundSlug.replace(/-/g, " ");
  }
  return `Group ${match.group}`;
}

function MatchSpotlightCard({
  match,
  variant,
  liveMinute,
}: {
  match: Match;
  variant: SpotlightVariant;
  liveMinute?: number;
}) {
  const home = getTeam(match.home, match.homeName, match.homeLogo);
  const away = getTeam(match.away, match.awayName, match.awayLogo);
  const homeColors = getTeamColors(match.home);
  const awayColors = getTeamColors(match.away);
  const isLive = variant === "live";
  const isFinished = variant === "finished";
  const label = roundLabel(match);

  return (
    <Link href={`/match/${match.id}`} className="home-spotlight-card group">
      <div
        className="home-spotlight-card-bar"
        style={{
          background: `linear-gradient(90deg, ${homeColors.primary} 0%, ${homeColors.primary} 48%, ${awayColors.primary} 52%, ${awayColors.primary} 100%)`,
        }}
      />
      <div className="home-spotlight-card-body">
        <div className="flex items-center justify-between gap-2 mb-3">
          <p className="home-spotlight-eyebrow">
            {isLive ? "Live now" : isFinished ? "Latest result" : "Next knockout match"} · {label}
          </p>
          {isLive ? (
            <LiveBadge />
          ) : isFinished ? (
            <span className="home-spotlight-ft-badge">FT</span>
          ) : (
            <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-zinc-500">
              <Clock size={10} />
              <MatchKickoffTime match={match} />
            </span>
          )}
        </div>

        <div className="flex items-center justify-between gap-3">
          <TeamColumn team={home} code={match.home} />
          <ScoreCenter
            match={match}
            variant={variant}
            liveMinute={liveMinute}
          />
          <TeamColumn team={away} code={match.away} />
        </div>

        <p className="home-spotlight-cta">
          {isLive ? "Follow live" : isFinished ? "Match recap" : "Match preview"}
          <ChevronRight size={14} />
        </p>
      </div>
    </Link>
  );
}

function TeamColumn({
  team,
  code,
}: {
  team: ReturnType<typeof getTeam>;
  code: string;
}) {
  return (
    <div className="flex flex-col items-center gap-1.5 min-w-0 flex-1 text-center">
      {team.logo ? (
        <CdnImage src={team.logo} alt="" width={40} height={40} className="h-10 w-10 object-contain" />
      ) : (
        <span className="text-3xl">{team.flag}</span>
      )}
      <span className="font-bold text-sm sm:text-base text-zinc-900 truncate w-full">
        {team.name}
      </span>
      <FifaRankBadge code={code} variant="compact" />
    </div>
  );
}

function ScoreCenter({
  match,
  variant,
  liveMinute,
}: {
  match: Match;
  variant: SpotlightVariant;
  liveMinute?: number;
}) {
  if (variant === "live" || variant === "finished") {
    return (
      <div className="shrink-0 text-center px-2">
        <p className="text-3xl sm:text-4xl font-extrabold text-zinc-900 tabular-nums leading-none">
          {match.homeScore}
          <span className="mx-1.5 text-zinc-300">–</span>
          {match.awayScore}
        </p>
        {variant === "live" && (
          <p className="mt-1 text-xs font-bold text-[var(--wc-canada)]">
            {match.displayClock ?? `${liveMinute ?? match.minute ?? 0}'`}
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="shrink-0 flex flex-col items-center px-2">
      <span className="text-xl font-extrabold text-zinc-300">vs</span>
    </div>
  );
}

function OffDayCard({ nextMatch }: { nextMatch: Match }) {
  return (
    <div className="home-spotlight-offday">
      <Trophy size={18} className="text-amber-600 shrink-0" />
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-zinc-900">No matches today</p>
        <p className="text-xs text-zinc-500 mt-0.5">
          Next up: {getTeam(nextMatch.home).name} vs {getTeam(nextMatch.away).name}
        </p>
      </div>
      <Link href={`/match/${nextMatch.id}`} className="home-spotlight-offday-link">
        View <ChevronRight size={14} />
      </Link>
    </div>
  );
}

interface LiveHomeHeroSpotlightProps {
  initialTodayMatches: Match[];
  initialUpcomingMatches: Match[];
  initialRecentFinished?: Match[];
}

export function LiveHomeHeroSpotlight({
  initialTodayMatches,
  initialUpcomingMatches,
  initialRecentFinished = [],
}: LiveHomeHeroSpotlightProps) {
  const timezone = useTimezone();
  const [todayMatches, setTodayMatches] = useState(initialTodayMatches);
  const [upcomingMatches, setUpcomingMatches] = useState(initialUpcomingMatches);
  const [recentFinished, setRecentFinished] = useState(initialRecentFinished);
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
  const displayUpcoming = pickNextUpcomingMatches(
    mergeMatchesById(localizedToday, upcomingMatches),
    1
  );
  const nextKnockout = pickNextUpcomingMatches(upcomingMatches, 1);

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
      const next = pickNextUpcomingMatches(all, 3);
      if (next.length > 0) setUpcomingMatches(next);
      const finished = all
        .filter((m) => m.status === "finished")
        .sort(
          (a, b) =>
            new Date(b.kickoffAt!).getTime() - new Date(a.kickoffAt!).getTime()
        )
        .slice(0, 1);
      if (finished.length > 0) setRecentFinished(finished);
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

  let variant: SpotlightVariant = "upcoming";
  let cards: Match[] = [];

  if (liveMatches.length > 0) {
    variant = "live";
    cards = liveMatches.slice(0, 2);
  } else if (displayUpcoming.length > 0) {
    variant = "upcoming";
    cards = displayUpcoming;
  } else if (recentFinished.length > 0) {
    variant = "finished";
    cards = recentFinished;
  }

  const showOffDay = cards.length === 0 && nextKnockout.length > 0;

  if (cards.length === 0 && !showOffDay) return null;

  return (
    <div className={`home-spotlight-wrap ${cards.length > 1 ? "home-spotlight-wrap--multi" : ""}`}>
      {showOffDay && <OffDayCard nextMatch={nextKnockout[0]} />}
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
