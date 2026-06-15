"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  ArrowLeft, MapPin, Users, User, Clock, Trophy,
  Cloud, Building2, Tv, BarChart3, ImageIcon, LayoutGrid, Play, ExternalLink, Globe,
} from "lucide-react";
import { getTeam, isKnownTeam } from "@/lib/data";
import { getTeamColors } from "@/lib/team-colors";
import type { Match, MatchDetail, MatchEvent, PlayerProfile, Highlight } from "@/lib/types";
import { MatchMedia } from "./MatchMedia";
import { MatchLineups } from "./MatchLineups";
import { GroupStandingsTable } from "./GroupStandingsTable";
import { AdBanner } from "./AdBanner";
import { MatchKickoffTime } from "./MatchKickoffTime";
import { MatchHeadToHead } from "./MatchHeadToHead";
import { MatchHighlightsPanel } from "./MatchHighlightsPanel";
import { MatchStatsPanel } from "./MatchStatsPanel";
import { MatchRelatedMatches } from "./MatchRelatedMatches";
import { ShareButtons } from "./ShareButtons";
import { buildMatchSharePayload } from "@/lib/share";
import { useTimezone } from "@/components/TimezoneProvider";
import { formatKickoffDateLabel } from "@/lib/timezone";
import { MatchNarrative } from "./MatchNarrative";
import { AddToCalendar } from "./AddToCalendar";
import { TeamJourneyButton } from "./TeamJourneyProvider";
import { resolveNetworkUrl } from "@/lib/watch-by-country";

const BASE_TABS = [
  { id: "overview", label: "Overview", icon: Trophy },
  { id: "highlights", label: "Highlights", icon: Play },
  { id: "media", label: "Media", icon: ImageIcon },
  { id: "lineups", label: "Lineups", icon: LayoutGrid },
  { id: "stats", label: "Stats", icon: BarChart3 },
  { id: "table", label: "Table", icon: Users },
  { id: "timeline", label: "Timeline", icon: Clock },
] as const;

type TabId = (typeof BASE_TABS)[number]["id"];

function getTabs(match: Match, hasHighlights: boolean) {
  return BASE_TABS.filter((tab) => {
    if (tab.id === "highlights" && match.status === "upcoming" && !hasHighlights) {
      return false;
    }
    return true;
  });
}

function parseTab(value: string | null, match: Match, hasHighlights: boolean): TabId {
  const tabs = getTabs(match, hasHighlights);
  const normalized = value === "history" ? "overview" : value;
  if (normalized && tabs.some((t) => t.id === normalized)) return normalized as TabId;
  return "overview";
}

function parseScorerName(raw: string): string {
  return raw
    .replace(/\s+Goal\b.*$/i, "")
    .replace(/\s+Penalty\b.*$/i, "")
    .trim() || raw;
}

function formatEventMinute(event: MatchEvent): string {
  if (event.extraTime) return `${event.minute}+${event.extraTime}'`;
  if (event.minute === 0) return "—";
  return `${event.minute}'`;
}

function resolveGoalScorer(
  event: MatchEvent,
  players: Record<string, PlayerProfile>,
  homeFlag: string,
  awayFlag: string,
  homeCode: string,
  awayCode: string
): PlayerProfile {
  if (event.playerId && players[event.playerId]) {
    return players[event.playerId];
  }

  const name = parseScorerName(event.playerName);
  const flag =
    event.team === "home" ? homeFlag : event.team === "away" ? awayFlag : "⚽";
  const team = event.team === "home" ? homeCode : event.team === "away" ? awayCode : "";

  return {
    id: event.playerId ?? `goal-${event.id}`,
    name,
    team,
    number: 0,
    position: "Player",
    age: 0,
    club: "",
    nationality: "",
    flag,
    worldCupGoals: 0,
    caps: 0,
    bio: `${name} scored in this match.`,
    espnId: event.playerId,
  };
}

const EVENT_ICONS: Record<MatchEvent["type"], string> = {
  goal: "⚽", yellow: "🟨", red: "🟥", sub: "🔄", chance: "💨",
  whistle: "📣", save: "🧤", penalty: "🎯",
};

const EVENT_COLORS: Record<MatchEvent["type"], string> = {
  goal: "border-emerald-200 bg-emerald-50",
  yellow: "border-yellow-200 bg-yellow-50",
  red: "border-red-200 bg-red-50",
  sub: "border-zinc-200 bg-zinc-50",
  chance: "border-blue-200 bg-blue-50",
  whistle: "border-zinc-200 bg-zinc-50",
  save: "border-blue-200 bg-blue-50",
  penalty: "border-yellow-200 bg-yellow-50",
};

function LiveBadge() {
  return (
    <span className="badge-live">
      <span className="relative flex h-2 w-2">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-500 opacity-75" />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-red-600" />
      </span>
      Live
    </span>
  );
}

function PlayerCard({ player, minuteLabel, assist }: {
  player: PlayerProfile; minuteLabel?: string; assist?: string;
}) {
  const playerHref = player.espnId ? `/players/${player.espnId}` : null;

  const inner = (
    <>
      <div className="flex h-11 w-11 items-center justify-center rounded-full bg-blue-50 text-lg shrink-0">
        {player.flag}
      </div>
      <div className="flex-1 min-w-0 text-left">
        <p className={`font-semibold text-zinc-900 ${playerHref ? "group-hover:text-blue-600 transition-colors" : ""}`}>
          {player.name}
        </p>
        <p className="text-xs text-zinc-500">
          {player.number > 0 ? `#${player.number} · ` : ""}{player.position}
        </p>
        {assist && <p className="text-xs text-zinc-400 mt-0.5">Assist: {assist}</p>}
      </div>
      {minuteLabel && (
        <span className="text-sm font-bold text-blue-600 shrink-0">{minuteLabel}</span>
      )}
    </>
  );

  const className =
    "w-full flex items-center gap-3 rounded-xl card-surface p-3 text-left hover:border-blue-200 hover:shadow-sm transition-all group";

  if (playerHref) {
    return (
      <Link href={playerHref} className={className}>
        {inner}
      </Link>
    );
  }

  return <div className={className}>{inner}</div>;
}


export function MatchDetailView(props: {
  match: Match;
  detail: MatchDetail;
  highlights: Highlight[];
  liveMatches?: Match[];
  relatedMatches?: Match[];
}) {
  return (
    <Suspense
      fallback={
        <div className="space-y-6">
          <div className="h-4 w-32 rounded bg-zinc-100 animate-pulse" />
          <div className="card-surface rounded-2xl h-48 animate-pulse" />
          <div className="flex gap-2">
            {BASE_TABS.slice(0, 6).map((t) => (
              <div key={t.id} className="h-9 w-20 rounded-lg bg-zinc-100 animate-pulse" />
            ))}
          </div>
        </div>
      }
    >
      <MatchDetailContent {...props} />
    </Suspense>
  );
}

function MatchDetailContent({
  match,
  detail,
  highlights,
  liveMatches = [],
  relatedMatches = [],
}: {
  match: Match;
  detail: MatchDetail;
  highlights: Highlight[];
  liveMatches?: Match[];
  relatedMatches?: Match[];
}) {
  const timezone = useTimezone();
  const home = getTeam(match.home, match.homeName, match.homeLogo);
  const away = getTeam(match.away, match.awayName, match.awayLogo);
  const searchParams = useSearchParams();
  const hasHighlights =
    highlights.length > 0 ||
    (detail.videos?.length ?? 0) > 0 ||
    (detail.photos?.length ?? 0) > 0;
  const tabs = getTabs(match, hasHighlights);
  const tab = parseTab(searchParams.get("tab"), match, hasHighlights);
  const [liveMinute, setLiveMinute] = useState(match.minute ?? 0);
  const kickoffDateLabel = match.kickoffAt
    ? formatKickoffDateLabel(match.kickoffAt, timezone)
    : match.date;
  const isKnockout = match.group === "?";
  const knockoutLabel = match.stageLabel?.replace(/ FIFA World Cup$/i, "") ?? "Knockout Stage";
  const homeColors = getTeamColors(match.home);
  const awayColors = getTeamColors(match.away);

  useEffect(() => {
    if (match.status !== "live") return;
    const interval = setInterval(() => {
      setLiveMinute((m) => (m >= 90 ? 90 : m + 1));
    }, 8000);
    return () => clearInterval(interval);
  }, [match.status]);

  const goalEvents = detail.events.filter(
    (e) => e.type === "goal" || e.type === "penalty"
  );
  const goalScorers = goalEvents.map((event) => ({
    event,
    player: resolveGoalScorer(
      event,
      detail.players,
      home.flag,
      away.flag,
      match.home,
      match.away
    ),
  }));

  const share = buildMatchSharePayload(match, liveMinute);

  return (
    <div className="space-y-8">
      <Link href="/" className="inline-flex items-center gap-2 text-sm text-zinc-500 hover:text-zinc-900 transition-colors">
        <ArrowLeft size={16} />
        Back to Live Scores
      </Link>

      <div
        className="card-surface rounded-2xl overflow-hidden relative"
        style={
          {
            "--home-primary": homeColors.primary,
            "--away-primary": awayColors.primary,
          } as React.CSSProperties
        }
      >
        <div className="match-detail-accent" aria-hidden>
          <span className="match-detail-accent-home" />
          <span className="match-detail-accent-away" />
        </div>
        <div className="host-stripe" />
        <div className="p-6 sm:p-8">
          <div className="flex flex-wrap items-center justify-center gap-3 mb-6">
            <span className="text-xs text-zinc-500 uppercase tracking-wider">
              {isKnockout ? (
                <Link href="/bracket" className="hover:text-blue-600">
                  {knockoutLabel}
                </Link>
              ) : (
                <Link href={`/groups/${match.group}`} className="hover:text-blue-600">
                  Group {match.group}
                </Link>
              )}
              {" · "}{kickoffDateLabel} ·{" "}
              <MatchKickoffTime match={match} />
            </span>
            {match.status === "live" && <LiveBadge />}
            {match.status === "finished" && <span className="text-xs font-bold text-zinc-400 uppercase">Full Time</span>}
            {match.status === "upcoming" && <span className="badge-upcoming">Upcoming</span>}
            {match.status === "upcoming" && (
              <Link href={`/match/${match.id}/preview`} className="text-xs font-semibold text-blue-600 hover:underline">
                Read preview →
              </Link>
            )}
            {match.status === "finished" && (
              <Link href={`/match/${match.id}/recap`} className="text-xs font-semibold text-emerald-600 hover:underline">
                Read recap →
              </Link>
            )}
          </div>

          <div className="flex items-center justify-center gap-6 sm:gap-12">
            <div className="flex-1 text-center">
              {home.logo ? <img src={home.logo} alt="" className="h-14 w-14 mx-auto mb-2 object-contain" /> : <span className="text-5xl block mb-2">{home.flag}</span>}
              {isKnownTeam(match.home) ? (
                <div className="space-y-1">
                  <Link href={`/teams/${match.home}`} className="text-lg sm:text-xl font-bold text-zinc-900 hover:text-blue-600 transition-colors">
                    {home.name}
                  </Link>
                  <div className="flex justify-center">
                    <TeamJourneyButton teamCode={match.home} />
                  </div>
                </div>
              ) : (
                <p className="text-lg sm:text-xl font-bold text-zinc-900">{home.name}</p>
              )}
              {detail.homeManager && detail.homeManager !== "TBD" && (
                <p className="text-xs text-zinc-400 mt-0.5">{detail.homeManager}</p>
              )}
            </div>
            <div className="text-center shrink-0 min-w-[7rem]">
              {match.status !== "upcoming" ? (
                <>
                  <p className="text-4xl sm:text-5xl font-extrabold text-zinc-900 tabular-nums tracking-tight">
                    <span className="inline-block min-w-[2.5rem] text-right">{match.homeScore}</span>
                    <span className="mx-2 sm:mx-3 text-zinc-300">–</span>
                    <span className="inline-block min-w-[2.5rem] text-left">{match.awayScore}</span>
                  </p>
                  {match.status === "live" && (
                    <p className="text-red-600 font-bold mt-1">{match.displayClock ?? `${liveMinute}'`}</p>
                  )}
                </>
              ) : (
                <p className="text-2xl font-bold text-zinc-300">vs</p>
              )}
            </div>
            <div className="flex-1 text-center">
              {away.logo ? <img src={away.logo} alt="" className="h-14 w-14 mx-auto mb-2 object-contain" /> : <span className="text-5xl block mb-2">{away.flag}</span>}
              {isKnownTeam(match.away) ? (
                <div className="space-y-1">
                  <Link href={`/teams/${match.away}`} className="text-lg sm:text-xl font-bold text-zinc-900 hover:text-blue-600 transition-colors">
                    {away.name}
                  </Link>
                  <div className="flex justify-center">
                    <TeamJourneyButton teamCode={match.away} />
                  </div>
                </div>
              ) : (
                <p className="text-lg sm:text-xl font-bold text-zinc-900">{away.name}</p>
              )}
              {detail.awayManager && detail.awayManager !== "TBD" && (
                <p className="text-xs text-zinc-400 mt-0.5">{detail.awayManager}</p>
              )}
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 mt-4">
            <AddToCalendar match={match} />
          </div>

          <ShareButtons
            url={share.url}
            title={share.title}
            text={share.text}
            label={share.label}
            className="mt-6"
          />

          <div className="flex flex-wrap items-center justify-center gap-4 mt-6 text-sm text-zinc-500">
            <span className="flex items-center gap-1.5"><MapPin size={14} />{detail.venue?.name ?? match.venue}</span>
            {detail.venue?.city && (
              <span className="text-zinc-400">{detail.venue.city}, {detail.venue.country}</span>
            )}
            {detail.venue?.capacity ? (
              <span className="flex items-center gap-1.5"><Building2 size={14} />{detail.venue.capacity.toLocaleString()} capacity</span>
            ) : null}
            {detail.attendance && <span className="flex items-center gap-1.5"><Users size={14} />{detail.attendance} attendance</span>}
            {detail.weather && (
              <span className="flex items-center gap-1.5">
                <Cloud size={14} />
                {detail.weather.icon} {detail.weather.temperature != null ? `${detail.weather.temperature}°C` : ""} {detail.weather.condition}
              </span>
            )}
            {detail.referee && <span className="flex items-center gap-1.5"><User size={14} />Ref: {detail.referee}</span>}
          </div>

          {(detail.broadcasts?.length || detail.homeRecord || detail.awayRecord) && (
            <div className="flex flex-wrap justify-center gap-3 mt-4">
              {detail.broadcasts?.map((b) => {
                const url = resolveNetworkUrl(b.network);
                const className = "inline-flex items-center gap-1 rounded-full bg-blue-50 text-blue-700 px-3 py-1 text-xs font-medium hover:bg-blue-100 transition-colors";
                return url ? (
                  <a
                    key={b.network}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={className}
                  >
                    <Tv size={12} /> {b.network} <ExternalLink size={10} className="opacity-60" />
                  </a>
                ) : (
                  <span key={b.network} className={className}>
                    <Tv size={12} /> {b.network}
                  </span>
                );
              })}
              <Link
                href="/watch"
                className="inline-flex items-center gap-1 rounded-full bg-zinc-100 text-zinc-600 px-3 py-1 text-xs font-medium hover:bg-zinc-200 transition-colors"
              >
                <Globe size={12} /> Watch by country
              </Link>
              {detail.homeRecord && (
                <span className="text-xs text-zinc-500">{home.name}: {detail.homeRecord.summary} ({detail.homeRecord.points} pts)</span>
              )}
              {detail.awayRecord && (
                <span className="text-xs text-zinc-500">{away.name}: {detail.awayRecord.summary} ({detail.awayRecord.points} pts)</span>
              )}
            </div>
          )}
        </div>
      </div>

      <div
        className="flex gap-1 overflow-x-auto pb-1 -mx-1 px-1 scroll-smooth"
        role="tablist"
        aria-label="Match sections"
      >
        {tabs.map(({ id, label, icon: Icon }) => (
          <Link
            key={id}
            href={`/match/${match.id}?tab=${id}`}
            scroll={false}
            replace
            role="tab"
            aria-selected={tab === id}
            className={`flex items-center gap-1.5 shrink-0 rounded-lg px-3 py-2.5 text-sm font-medium whitespace-nowrap transition-colors touch-manipulation ${
              tab === id
                ? "bg-blue-50 text-blue-700 ring-1 ring-blue-200"
                : "text-zinc-500 hover:text-zinc-900 hover:bg-zinc-50"
            }`}
          >
            <Icon size={14} />
            {label}
            {id === "highlights" && hasHighlights && (
              <span className="rounded-full bg-red-500 text-white text-[9px] font-bold px-1.5 py-0.5 leading-none">
                {highlights.length || (detail.videos?.length ?? 0)}
              </span>
            )}
          </Link>
        ))}
      </div>

      {tab === "overview" && (
        <>
      <MatchNarrative match={match} detail={detail} />

      <section className="card-surface rounded-2xl p-6">
        <h2 className="section-title mb-3 flex items-center gap-2 text-base">
          <Trophy size={18} className="text-amber-500" />
          Match Summary
        </h2>
        <p className="text-zinc-600 leading-relaxed">{detail.summary}</p>
      </section>

      <AdBanner placement="match" />

      {hasHighlights && match.status === "finished" && (
        <section className="card-surface rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="font-bold text-zinc-900">Match highlights available</h2>
            <p className="text-sm text-zinc-500 mt-1">
              Goals, video clips, and photos from this match
            </p>
          </div>
          <Link
            href={`/match/${match.id}?tab=highlights`}
            scroll={false}
            replace
            className="btn-primary inline-flex items-center justify-center gap-2 px-5 py-2.5 text-sm shrink-0"
          >
            <Play size={16} />
            View Highlights
          </Link>
        </section>
      )}

      <MatchHeadToHead
        match={match}
        meetings={detail.headToHead}
        record={detail.headToHeadRecord}
        rivalryName={detail.rivalryName}
        rivalryNote={detail.rivalryNote}
        rivalryFunFact={detail.rivalryFunFact}
      />

      <MatchRelatedMatches
        currentMatch={match}
        liveMatches={liveMatches}
        relatedMatches={relatedMatches}
      />
        </>
      )}

      {tab === "highlights" && (
        <>
          <MatchHighlightsPanel
            match={match}
            highlights={highlights}
            videos={detail.videos}
            photos={detail.photos}
          />
          <AdBanner placement="match" />
        </>
      )}

      {tab === "media" && (
        <MatchMedia videos={detail.videos} photos={detail.photos} />
      )}

      {tab === "lineups" && (
        <MatchLineups
          home={detail.homeLineup}
          away={detail.awayLineup}
          homeManager={detail.homeManager}
          awayManager={detail.awayManager}
        />
      )}

      {tab === "stats" && (
        <MatchStatsPanel
          match={match}
          stats={detail.stats}
          leaders={detail.leaders}
          homeRecord={detail.homeRecord}
          awayRecord={detail.awayRecord}
          homeLineup={detail.homeLineup}
          awayLineup={detail.awayLineup}
          events={detail.events}
          attendance={detail.attendance}
          referee={detail.referee}
          groupStandings={detail.groupStandings}
          venue={detail.venue}
        />
      )}

      {tab === "table" && detail.groupStandings && (
        <GroupStandingsTable standings={detail.groupStandings} />
      )}

      {tab === "timeline" && (
        <>
      {goalScorers.length > 0 && (
        <section>
          <h2 className="section-title mb-4 text-base">
            ⚽ Goal Scorers <span className="text-xs text-zinc-400 font-normal">— tap for profile</span>
          </h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {goalScorers.map(({ event, player }) => (
              <PlayerCard
                key={`${event.id}-${event.minute}-${event.extraTime ?? 0}`}
                player={player}
                minuteLabel={formatEventMinute(event)}
                assist={event.assist}
              />
            ))}
          </div>
        </section>
      )}

      {detail.events.length > 0 ? (
        <section>
          <h2 className="section-title mb-4 flex items-center gap-2 text-base">
            <Clock size={18} className="text-blue-600" />
            Minute-by-Minute
          </h2>
          <div className="card-surface rounded-2xl overflow-hidden divide-y divide-zinc-50">
            {[...detail.events].reverse().map((event) => (
              <div key={event.id} className="flex gap-4 px-4 py-3.5">
                <div className="w-10 shrink-0 text-center">
                  <span className="text-xs font-bold text-zinc-400">
                    {formatEventMinute(event)}
                  </span>
                </div>
                <div className={`flex-1 rounded-lg border px-3 py-2.5 ${EVENT_COLORS[event.type]}`}>
                  <div className="flex items-start gap-2">
                    <span className="text-base shrink-0">{EVENT_ICONS[event.type]}</span>
                    <div className="min-w-0">
                      {event.playerId && detail.players[event.playerId]?.espnId ? (
                        <Link href={`/players/${detail.players[event.playerId!].espnId}`} className="font-semibold text-zinc-900 hover:text-blue-600 transition-colors text-sm">
                          {parseScorerName(event.playerName)}
                        </Link>
                      ) : (
                        <p className="font-semibold text-zinc-900 text-sm">{parseScorerName(event.playerName)}</p>
                      )}
                      <p className="text-xs text-zinc-500 mt-0.5 leading-relaxed">{event.description}</p>
                      {event.assist && <p className="text-xs text-zinc-400 mt-1">Assist: {event.assist}</p>}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      ) : (
        <p className="text-sm text-zinc-400 text-center py-8">No events yet.</p>
      )}
        </>
      )}

      {tab === "table" && !detail.groupStandings && (
        <p className="text-sm text-zinc-400 text-center py-8">Group table not available yet.</p>
      )}
    </div>
  );
}
