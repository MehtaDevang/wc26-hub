"use client";

import Link from "next/link";
import { Clock, Flag } from "lucide-react";
import { getTeam } from "@/lib/data";
import {
  buildMatchTimeline,
  formatTimelineMinute,
  type EnrichedTimelineEvent,
  type TimelinePeriod,
} from "@/lib/match-timeline";
import type { Match, MatchEvent, PlayerProfile } from "@/lib/types";

const EVENT_STYLES: Record<
  MatchEvent["type"] | "milestone",
  { ring: string; badge: string; icon: string }
> = {
  goal: { ring: "ring-emerald-200", badge: "bg-emerald-600 text-white", icon: "⚽" },
  penalty: { ring: "ring-amber-200", badge: "bg-amber-500 text-white", icon: "🎯" },
  yellow: { ring: "ring-yellow-200", badge: "bg-yellow-400 text-yellow-950", icon: "🟨" },
  red: { ring: "ring-red-200", badge: "bg-red-600 text-white", icon: "🟥" },
  sub: { ring: "ring-blue-200", badge: "bg-blue-600 text-white", icon: "🔄" },
  save: { ring: "ring-sky-200", badge: "bg-sky-600 text-white", icon: "🧤" },
  chance: { ring: "ring-zinc-200", badge: "bg-zinc-500 text-white", icon: "💨" },
  whistle: { ring: "ring-zinc-200", badge: "bg-zinc-700 text-white", icon: "📣" },
  milestone: { ring: "ring-zinc-200", badge: "bg-zinc-800 text-white", icon: "⏱" },
};

function styleFor(event: EnrichedTimelineEvent) {
  if (event.milestone) return EVENT_STYLES.milestone;
  return EVENT_STYLES[event.type] ?? EVENT_STYLES.chance;
}

function PlayerLink({
  name,
  playerId,
  players,
  className = "",
}: {
  name: string;
  playerId?: string;
  players: Record<string, PlayerProfile>;
  className?: string;
}) {
  const espnId = playerId ? players[playerId]?.espnId : undefined;
  if (espnId) {
    return (
      <Link href={`/players/${espnId}`} className={`font-bold hover:text-blue-600 transition-colors ${className}`}>
        {name}
      </Link>
    );
  }
  return <span className={`font-bold ${className}`}>{name}</span>;
}

function MilestoneBanner({ period }: { period: TimelinePeriod }) {
  return (
    <div className="relative flex items-center justify-center py-2">
      <div className="absolute inset-x-0 top-1/2 h-px bg-zinc-200" />
      <div className="relative inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white px-4 py-1.5 shadow-sm">
        <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">
          {period.label}
        </span>
        {period.scoreLabel && (
          <span className="rounded-full bg-zinc-900 px-2 py-0.5 text-[11px] font-extrabold tabular-nums text-white">
            {period.scoreLabel}
          </span>
        )}
      </div>
    </div>
  );
}

function TimelineEventCard({
  event,
  homeName,
  awayName,
  homeFlag,
  awayFlag,
  players,
  align,
}: {
  event: EnrichedTimelineEvent;
  homeName: string;
  awayName: string;
  homeFlag: string;
  awayFlag: string;
  players: Record<string, PlayerProfile>;
  align: "left" | "right" | "center";
}) {
  const styles = styleFor(event);
  const isCenter = align === "center";
  const teamFlag =
    event.team === "home" ? homeFlag : event.team === "away" ? awayFlag : "⚽";
  const teamName =
    event.team === "home" ? homeName : event.team === "away" ? awayName : "";

  const card = (
    <div
      className={`rounded-xl border bg-white p-3.5 shadow-sm ring-1 ${styles.ring} ${
        isCenter ? "text-center" : align === "left" ? "text-left" : "text-right"
      }`}
    >
      <div
        className={`mb-2 flex items-center gap-2 ${
          isCenter ? "justify-center" : align === "right" ? "flex-row-reverse" : ""
        }`}
      >
        <span className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${styles.badge}`}>
          <span>{styles.icon}</span>
          {event.title}
        </span>
        {!isCenter && (
          <span className="text-sm leading-none">{teamFlag}</span>
        )}
      </div>

      {!event.milestone && (
        <PlayerLink
          name={event.playerName}
          playerId={event.playerId}
          players={players}
          className="text-sm text-zinc-900"
        />
      )}

      {event.milestone && (
        <p className="text-sm font-semibold text-zinc-800">{event.title}</p>
      )}

      {!isCenter && teamName && (
        <p className="mt-0.5 text-[11px] font-medium text-zinc-400">{teamName}</p>
      )}

      {event.summary && (
        <p className={`mt-2 text-xs leading-relaxed text-zinc-600 ${isCenter ? "" : ""}`}>
          {event.summary}
        </p>
      )}

      {event.type === "sub" && event.subIn && event.subOut && (
        <div className="mt-2 flex flex-wrap gap-1.5 text-[10px]">
          <span className="rounded-full bg-emerald-50 px-2 py-0.5 font-semibold text-emerald-700">
            ↑ {event.subIn}
          </span>
          <span className="rounded-full bg-red-50 px-2 py-0.5 font-semibold text-red-600">
            ↓ {event.subOut}
          </span>
        </div>
      )}

      {event.scoreAfter && (
        <p className="mt-2 inline-flex rounded-full bg-zinc-900 px-2.5 py-1 text-[11px] font-extrabold tabular-nums text-white">
          {event.scoreAfter.home}–{event.scoreAfter.away}
        </p>
      )}
    </div>
  );

  if (isCenter) {
    return (
      <div className="col-span-3 flex justify-center">
        <div className="w-full max-w-sm">{card}</div>
      </div>
    );
  }

  if (align === "left") {
    return (
      <>
        <div className="pr-2">{card}</div>
        <div className="flex flex-col items-center pt-3">
          <span className="rounded-full bg-zinc-900 px-2 py-1 text-[10px] font-bold tabular-nums text-white shadow-sm">
            {formatTimelineMinute(event)}
          </span>
        </div>
        <div />
      </>
    );
  }

  return (
    <>
      <div />
      <div className="flex flex-col items-center pt-3">
        <span className="rounded-full bg-zinc-900 px-2 py-1 text-[10px] font-bold tabular-nums text-white shadow-sm">
          {formatTimelineMinute(event)}
        </span>
      </div>
      <div className="pl-2">{card}</div>
    </>
  );
}

function TimelineLegend() {
  const items = [
    { icon: "⚽", label: "Goal" },
    { icon: "🟨", label: "Yellow" },
    { icon: "🟥", label: "Red" },
    { icon: "🔄", label: "Sub" },
    { icon: "⏱", label: "Period" },
  ];

  return (
    <div className="flex flex-wrap justify-center gap-2">
      {items.map((item) => (
        <span
          key={item.label}
          className="inline-flex items-center gap-1 rounded-full bg-zinc-100 px-2.5 py-1 text-[10px] font-semibold text-zinc-600"
        >
          <span>{item.icon}</span>
          {item.label}
        </span>
      ))}
    </div>
  );
}

export function MatchTimeline({
  match,
  events,
  players,
}: {
  match: Match;
  events: MatchEvent[];
  players: Record<string, PlayerProfile>;
}) {
  const home = getTeam(match.home, match.homeName, match.homeLogo);
  const away = getTeam(match.away, match.awayName, match.awayLogo);
  const periods = buildMatchTimeline(events, match);

  if (events.length === 0) {
    return (
      <div className="card-surface rounded-2xl p-10 text-center">
        <Clock size={32} className="mx-auto text-zinc-300 mb-3" />
        <p className="text-sm text-zinc-500">Match events will appear here once play gets underway.</p>
      </div>
    );
  }

  const goalCount = events.filter((e) => e.type === "goal" || e.type === "penalty").length;
  const cardCount = events.filter((e) => e.type === "yellow" || e.type === "red").length;
  const subCount = events.filter((e) => e.type === "sub").length;

  return (
    <div className="space-y-5">
      <section className="card-surface rounded-2xl overflow-hidden">
        <div className="host-stripe" />
        <div className="p-5 sm:p-6">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
            <div>
              <h2 className="section-title flex items-center gap-2 text-base">
                <Clock size={18} className="text-blue-600" />
                Match Timeline
              </h2>
              <p className="text-xs text-zinc-500 mt-1">
                Key moments in order — home ({home.name}) on the left, away ({away.name}) on the right
              </p>
            </div>
            <div className="flex items-center gap-3 text-center text-xs">
              <div>
                <p className="font-extrabold text-zinc-900 tabular-nums">{goalCount}</p>
                <p className="text-zinc-400">Goals</p>
              </div>
              <div>
                <p className="font-extrabold text-zinc-900 tabular-nums">{cardCount}</p>
                <p className="text-zinc-400">Cards</p>
              </div>
              <div>
                <p className="font-extrabold text-zinc-900 tabular-nums">{subCount}</p>
                <p className="text-zinc-400">Subs</p>
              </div>
            </div>
          </div>

          <div className="mb-5 flex items-center justify-center gap-4 rounded-xl bg-zinc-50 px-4 py-3">
            <div className="flex items-center gap-2 min-w-0">
              <span className="text-xl">{home.flag}</span>
              <span className="font-bold text-sm text-zinc-900 truncate">{home.name}</span>
            </div>
            <span className="text-2xl font-extrabold tabular-nums text-zinc-900">
              {match.status === "upcoming" ? (
                <span className="text-zinc-300">vs</span>
              ) : (
                <>
                  {match.homeScore}
                  <span className="mx-2 text-zinc-300">–</span>
                  {match.awayScore}
                </>
              )}
            </span>
            <div className="flex items-center gap-2 min-w-0">
              <span className="font-bold text-sm text-zinc-900 truncate">{away.name}</span>
              <span className="text-xl">{away.flag}</span>
            </div>
          </div>

          <TimelineLegend />
        </div>
      </section>

      <div className="space-y-6">
        {periods.map((period) => {
          if (period.events.length === 0) {
            return <MilestoneBanner key={period.id} period={period} />;
          }

          return (
            <section key={period.id} className="card-surface rounded-2xl p-4 sm:p-5">
              <div className="mb-4 flex items-center gap-2">
                <Flag size={14} className="text-zinc-400" />
                <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-500">
                  {period.label}
                </h3>
              </div>

              <div className="relative space-y-4">
                <div
                  className="pointer-events-none absolute left-1/2 top-0 bottom-0 w-px -translate-x-1/2 bg-gradient-to-b from-zinc-200 via-zinc-300 to-zinc-200"
                  aria-hidden
                />

                {period.events.map((event) => {
                  const align: "left" | "right" | "center" = event.milestone
                    ? "center"
                    : event.team === "home"
                      ? "left"
                      : event.team === "away"
                        ? "right"
                        : "center";

                  return (
                    <div
                      key={event.id}
                      className="relative grid grid-cols-[1fr_auto_1fr] gap-x-2 items-start"
                    >
                      <TimelineEventCard
                        event={event}
                        homeName={home.name}
                        awayName={away.name}
                        homeFlag={home.flag}
                        awayFlag={away.flag}
                        players={players}
                        align={align}
                      />
                    </div>
                  );
                })}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
