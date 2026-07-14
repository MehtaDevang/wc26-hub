"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ChevronRight, Sparkles, Swords, Trophy } from "lucide-react";
import { getTeam } from "@/lib/data";
import { getTeamColors } from "@/lib/team-colors";
import { FifaRankBadge } from "@/components/FifaRankBadge";
import { BattleLiveBackground } from "@/components/MatchBattleGraphic";
import { CdnImage } from "@/components/CdnImage";
import { useMounted } from "@/hooks/useMounted";
import { useTimezone } from "@/components/TimezoneProvider";
import { fetchMatches } from "@/lib/matches";
import {
  applyTimezoneToMatch,
  applyTimezoneToMatches,
  filterMatchesForScoreboardToday,
  formatKickoffDateLabel,
  todayDateKey,
} from "@/lib/timezone";
import { mergeMatchesById, pickNextUpcomingMatches } from "@/lib/upcoming-matches";
import type { FinaleStage } from "@/lib/tournament-stage";
import type { BracketMatch, BracketTeam, Match } from "@/lib/types";

interface HomeFinaleHeroProps {
  stage: FinaleStage;
  stageLabel: string;
  initialTodayMatches: Match[];
  initialUpcomingMatches: Match[];
  initialRecentFinished: Match[];
  semiFinals: BracketMatch[];
  finalMatch: BracketMatch | null;
  champion: BracketTeam | null;
}

type FeaturedVariant = "live" | "upcoming" | "finished";

function roundHeadline(match: Match): string {
  const slug = match.roundSlug ?? "";
  if (slug === "final") return "The Final";
  if (slug.includes("third")) return "Third-Place Playoff";
  if (slug.includes("semi")) return "Semi-Final";
  if (match.stageLabel) {
    if (/final/i.test(match.stageLabel) && !/semi|quarter/i.test(match.stageLabel)) return "The Final";
    if (/semi/i.test(match.stageLabel)) return "Semi-Final";
  }
  return "Knockout";
}

interface CountdownParts {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  done: boolean;
}

function getCountdownParts(targetMs: number, nowMs: number): CountdownParts {
  const diff = Math.max(0, targetMs - nowMs);
  return {
    days: Math.floor(diff / 86_400_000),
    hours: Math.floor((diff % 86_400_000) / 3_600_000),
    minutes: Math.floor((diff % 3_600_000) / 60_000),
    seconds: Math.floor((diff % 60_000) / 1_000),
    done: diff === 0,
  };
}

function CountdownUnit({ value, label }: { value: number; label: string }) {
  return (
    <div className="countdown-unit flex min-w-[3rem] flex-col items-center rounded-xl bg-white/10 px-2.5 py-2 sm:min-w-[3.75rem]">
      <span className="text-2xl font-extrabold leading-none text-white tabular-nums drop-shadow sm:text-3xl">
        {String(value).padStart(2, "0")}
      </span>
      <span className="mt-1 text-[8px] font-bold uppercase tracking-wider text-white/80 sm:text-[9px]">
        {label}
      </span>
    </div>
  );
}

function Countdown({ kickoffAt }: { kickoffAt: string }) {
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
      <div className="flex items-center justify-center gap-2 sm:gap-2.5" aria-hidden>
        {["Days", "Hrs", "Min", "Sec"].map((label) => (
          <div
            key={label}
            className="countdown-unit flex min-w-[3rem] flex-col items-center rounded-xl bg-white/10 px-2.5 py-2 opacity-50 sm:min-w-[3.75rem]"
          >
            <span className="text-2xl font-extrabold leading-none text-white tabular-nums sm:text-3xl">--</span>
            <span className="mt-1 text-[8px] font-bold uppercase tracking-wider text-white/80 sm:text-[9px]">
              {label}
            </span>
          </div>
        ))}
      </div>
    );
  }

  if (parts.done) {
    return (
      <p className="animate-pulse text-center text-sm font-extrabold uppercase tracking-wider text-white drop-shadow">
        Kickoff imminent
      </p>
    );
  }

  return (
    <div className="flex items-center justify-center gap-2 sm:gap-2.5">
      {parts.days > 0 && <CountdownUnit value={parts.days} label="Days" />}
      <CountdownUnit value={parts.hours} label="Hrs" />
      <CountdownUnit value={parts.minutes} label="Min" />
      <CountdownUnit value={parts.seconds} label="Sec" />
    </div>
  );
}

function HeroTeam({ code, name, logo }: { code: string; name?: string; logo?: string }) {
  const team = getTeam(code, name, logo);
  const colors = getTeamColors(code);
  return (
    <div className="flex min-w-0 flex-1 flex-col items-center gap-2 text-center">
      <div
        className="countdown-team-crest"
        style={{
          borderColor: colors.primary,
          boxShadow: `0 0 22px color-mix(in srgb, ${colors.primary} 55%, transparent)`,
        }}
      >
        {team.logo ? (
          <CdnImage src={team.logo} alt="" width={44} height={44} className="h-11 w-11 object-contain" />
        ) : (
          <span className="text-4xl">{team.flag}</span>
        )}
      </div>
      <span className="w-full truncate text-sm font-extrabold text-white drop-shadow sm:text-base">
        {team.name}
      </span>
      <FifaRankBadge code={code} variant="compact" className="!text-white/70" />
    </div>
  );
}

function FeaturedMatchCard({
  match,
  variant,
  liveMinute,
  isFinal,
}: {
  match: Match;
  variant: FeaturedVariant;
  liveMinute?: number;
  isFinal: boolean;
}) {
  const timezone = useTimezone();
  const localized = applyTimezoneToMatch(match, timezone);
  const homeColors = getTeamColors(localized.home);
  const kickoffLabel = localized.kickoffAt
    ? formatKickoffDateLabel(localized.kickoffAt, timezone)
    : localized.date;
  const headline = roundHeadline(localized);

  return (
    <Link
      href={`/match/${match.id}`}
      className="group relative z-10 block"
      style={
        {
          "--home-primary": homeColors.primary,
          "--away-primary": getTeamColors(localized.away).primary,
        } as React.CSSProperties
      }
    >
      <div className="mb-4 flex items-center justify-center gap-2">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-black/35 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-white backdrop-blur-sm">
          {isFinal ? <Trophy size={12} /> : <Swords size={12} />}
          {headline}
        </span>
        {variant === "live" && (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[var(--wc-canada)] px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-white">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-white" />
            Live
          </span>
        )}
      </div>

      <div className="flex items-center justify-between gap-2 sm:gap-4">
        <HeroTeam code={localized.home} name={localized.homeName} logo={localized.homeLogo} />

        <div className="shrink-0 px-1 text-center">
          {variant === "upcoming" ? (
            <span className="text-2xl font-black text-white/40">VS</span>
          ) : (
            <>
              <p className="text-4xl font-black leading-none text-white tabular-nums drop-shadow sm:text-5xl">
                {localized.homeScore}
                <span className="mx-1.5 text-white/30">–</span>
                {localized.awayScore}
              </p>
              <p className="mt-1.5 text-xs font-bold text-white/80">
                {variant === "live"
                  ? localized.displayClock ?? `${liveMinute ?? localized.minute ?? 0}'`
                  : "Full time"}
              </p>
            </>
          )}
        </div>

        <HeroTeam code={localized.away} name={localized.awayName} logo={localized.awayLogo} />
      </div>

      {variant === "upcoming" && (
        <>
          <p className="my-4 text-center text-xs font-medium text-white/85">
            {kickoffLabel}
            {localized.time && (
              <>
                {" · "}
                <span className="font-bold text-white">{localized.time}</span>
              </>
            )}
          </p>
          <Countdown kickoffAt={match.kickoffAt} />
        </>
      )}

      <div className="mt-4 flex items-center justify-center gap-1 text-xs font-semibold text-white/85 transition-opacity group-hover:text-white">
        {variant === "live" ? "Follow live" : variant === "finished" ? "Match recap" : "Match preview"}
        <ChevronRight size={13} />
      </div>
    </Link>
  );
}

function PathTeam({ team }: { team: BracketTeam }) {
  const resolved = Boolean(team.code) && !team.placeholder;
  const display = resolved ? getTeam(team.code!, team.name) : null;
  return (
    <span
      className={`flex min-w-0 items-center gap-1.5 ${
        team.winner ? "font-bold text-white" : resolved ? "text-white/85" : "text-white/45"
      }`}
    >
      {display ? <span className="shrink-0 text-sm leading-none">{display.flag}</span> : null}
      <span className="truncate">{resolved ? display!.name : team.name}</span>
    </span>
  );
}

function PathNode({
  label,
  match,
  highlight = false,
}: {
  label: string;
  match: BracketMatch | null;
  highlight?: boolean;
}) {
  const hasScore = match?.status === "finished" || match?.status === "live";
  return (
    <div
      className={`rounded-xl border px-3 py-2.5 backdrop-blur-sm ${
        highlight
          ? "border-amber-300/40 bg-amber-400/10"
          : "border-white/10 bg-white/[0.06]"
      }`}
    >
      <p
        className={`mb-1.5 flex items-center gap-1 text-[9px] font-bold uppercase tracking-wider ${
          highlight ? "text-amber-200/90" : "text-white/50"
        }`}
      >
        {highlight && <Trophy size={9} />}
        {label}
      </p>
      {match ? (
        <div className="space-y-1 text-xs">
          <div className="flex items-center justify-between gap-2">
            <PathTeam team={match.home} />
            {hasScore && <span className="shrink-0 font-bold text-white tabular-nums">{match.home.score ?? 0}</span>}
          </div>
          <div className="flex items-center justify-between gap-2">
            <PathTeam team={match.away} />
            {hasScore && <span className="shrink-0 font-bold text-white tabular-nums">{match.away.score ?? 0}</span>}
          </div>
        </div>
      ) : (
        <p className="text-xs text-white/45">To be decided</p>
      )}
    </div>
  );
}

function RoadToTheFinal({
  semiFinals,
  finalMatch,
}: {
  semiFinals: BracketMatch[];
  finalMatch: BracketMatch | null;
}) {
  if (semiFinals.length === 0 && !finalMatch) return null;
  return (
    <div className="rounded-2xl border border-white/10 bg-black/25 p-4 backdrop-blur-sm">
      <p className="mb-3 flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-white/70">
        <Sparkles size={12} /> The path to glory
      </p>
      <div className="space-y-2">
        <PathNode label="Semi-Final 1" match={semiFinals[0] ?? null} />
        <PathNode label="Semi-Final 2" match={semiFinals[1] ?? null} />
        <PathNode label="Final" match={finalMatch} highlight />
      </div>
    </div>
  );
}

function ChampionHero({ champion }: { champion: BracketTeam }) {
  const team = getTeam(champion.code ?? "", champion.name);
  return (
    <section className="home-finale-hero home-finale-hero--champion">
      <div className="host-stripe rounded-t-2xl" />
      <div className="relative z-10 flex flex-col items-center px-4 py-8 text-center sm:py-10">
        <span className="mb-3 inline-flex items-center gap-1.5 rounded-full border border-amber-200/40 bg-black/25 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.2em] text-amber-100 backdrop-blur-sm">
          <Trophy size={12} /> World Champions 2026
        </span>
        <div className="mb-3 flex h-20 w-20 items-center justify-center rounded-full border-2 border-amber-200/60 bg-white/10 shadow-lg backdrop-blur-sm">
          {team.logo ? (
            <CdnImage src={team.logo} alt="" width={56} height={56} className="h-14 w-14 object-contain" />
          ) : (
            <span className="text-5xl">{team.flag}</span>
          )}
        </div>
        <h1 className="text-3xl font-black tracking-tight text-white drop-shadow sm:text-4xl">{team.name}</h1>
        <p className="mt-2 text-sm font-medium text-amber-100/90">Champions of the FIFA World Cup 2026</p>
        <Link
          href="/bracket"
          className="mt-5 inline-flex items-center gap-1.5 rounded-full bg-white/90 px-4 py-2 text-sm font-bold text-zinc-900 transition-colors hover:bg-white"
        >
          See the full bracket <ChevronRight size={14} />
        </Link>
      </div>
    </section>
  );
}

export function HomeFinaleHero({
  stage,
  stageLabel,
  initialTodayMatches,
  initialUpcomingMatches,
  initialRecentFinished,
  semiFinals,
  finalMatch,
  champion,
}: HomeFinaleHeroProps) {
  const timezone = useTimezone();
  const [todayMatches, setTodayMatches] = useState(initialTodayMatches);
  const [upcomingMatches, setUpcomingMatches] = useState(initialUpcomingMatches);
  const [recentFinished, setRecentFinished] = useState(initialRecentFinished);
  const [liveMinute, setLiveMinute] = useState(0);

  const localizedToday = useMemo(() => {
    const localized = applyTimezoneToMatches(todayMatches, timezone);
    return filterMatchesForScoreboardToday(localized, todayDateKey(timezone), timezone);
  }, [todayMatches, timezone]);

  const liveMatches = localizedToday.filter((m) => m.status === "live");
  const displayUpcoming = pickNextUpcomingMatches(
    mergeMatchesById(localizedToday, upcomingMatches),
    1
  );

  const refreshToday = useCallback(async () => {
    try {
      setTodayMatches(await fetchMatches({ date: "today", timeZone: timezone }));
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
        .sort((a, b) => new Date(b.kickoffAt!).getTime() - new Date(a.kickoffAt!).getTime())
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
    const interval = setInterval(() => setLiveMinute((m) => (m >= 90 ? 90 : m + 1)), 8000);
    return () => clearInterval(interval);
  }, [liveMatches.length, liveMatches[0]?.minute]);

  if (stage === "champions" && champion) {
    return <ChampionHero champion={champion} />;
  }

  let variant: FeaturedVariant = "upcoming";
  let featured: Match | null = null;
  if (liveMatches.length > 0) {
    variant = "live";
    featured = liveMatches[0];
  } else if (displayUpcoming.length > 0) {
    variant = "upcoming";
    featured = displayUpcoming[0];
  } else if (recentFinished.length > 0) {
    variant = "finished";
    featured = recentFinished[0];
  }

  const isFinal = stage === "final";

  return (
    <section className={`home-finale-hero ${isFinal ? "home-finale-hero--final" : ""}`}>
      {featured && (
        <BattleLiveBackground homeCode={featured.home} awayCode={featured.away} />
      )}
      <div className="host-stripe relative z-10 rounded-t-2xl" />
      <div className="relative z-10 px-4 py-6 sm:px-6 lg:px-8 lg:py-9">
        <div className="mb-5 flex flex-col gap-1 text-center lg:mb-7">
          <span className="text-[11px] font-bold uppercase tracking-[0.16em] text-white/70">
            FIFA World Cup 2026 · {stageLabel}
          </span>
          <h1 className="font-display text-[1.75rem] leading-[0.95] text-white drop-shadow-lg sm:text-5xl lg:text-6xl">
            {isFinal ? "The Final is here" : "Road to the Final"}
          </h1>
        </div>

        <div className="mx-auto grid max-w-md gap-6 lg:max-w-4xl lg:grid-cols-[minmax(0,24rem)_20rem] lg:items-center lg:justify-center lg:gap-10">
          <div className="min-w-0">
            {featured ? (
              <FeaturedMatchCard
                match={featured}
                variant={variant}
                liveMinute={liveMinute}
                isFinal={isFinal || roundHeadline(featured) === "The Final"}
              />
            ) : (
              <p className="py-4 text-center text-sm text-white/70">
                The {stageLabel.toLowerCase()} lineup is being finalised.
              </p>
            )}
          </div>

          <RoadToTheFinal semiFinals={semiFinals} finalMatch={finalMatch} />
        </div>
      </div>
    </section>
  );
}
