"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  ArrowLeft, MapPin, Users, User, Clock, Trophy,
  Cloud, Building2, Tv, BarChart3, ImageIcon, LayoutGrid, Play, ExternalLink, Globe, Radio,
} from "lucide-react";
import { getTeam, isKnownTeam } from "@/lib/data";
import { getTeamColors } from "@/lib/team-colors";
import type { Match, MatchDetail, Highlight, NewsArticle } from "@/lib/types";
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
import { FifaRankBadge, FifaRankMatchup } from "@/components/FifaRankBadge";
import { MatchWinPredictor } from "@/components/MatchWinPredictor";
import { MatchTimeline } from "@/components/MatchTimeline";
import { MatchLiveFeed } from "@/components/MatchLiveFeed";
import { RivalryMatchdayHub } from "@/components/RivalryMatchdayHub";
import { MatchRelatedNews } from "@/components/MatchRelatedNews";
import { predictMatchOutcome } from "@/lib/win-predictor";

const BASE_TABS = [
  { id: "live", label: "Live", icon: Radio },
  { id: "overview", label: "Overview", icon: Trophy },
  { id: "highlights", label: "Highlights", icon: Play },
  { id: "media", label: "Media", icon: ImageIcon },
  { id: "lineups", label: "Lineups", icon: LayoutGrid },
  { id: "stats", label: "Stats", icon: BarChart3 },
  { id: "table", label: "Table", icon: Users },
  { id: "timeline", label: "Timeline", icon: Clock },
] as const;

type TabId = (typeof BASE_TABS)[number]["id"];

function getTabs(match: Match, hasHighlights: boolean, hasFeed: boolean) {
  return BASE_TABS.filter((tab) => {
    if (tab.id === "live" && !hasFeed) return false;
    if (tab.id === "highlights" && match.status === "upcoming" && !hasHighlights) {
      return false;
    }
    return true;
  });
}

function parseTab(
  value: string | null,
  match: Match,
  hasHighlights: boolean,
  hasFeed: boolean
): TabId {
  const tabs = getTabs(match, hasHighlights, hasFeed);
  const normalized = value === "history" ? "overview" : value;
  if (normalized && tabs.some((t) => t.id === normalized)) return normalized as TabId;
  if (match.status === "live" && tabs.some((t) => t.id === "live")) return "live";
  return "overview";
}

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

export function MatchDetailView(props: {
  match: Match;
  detail: MatchDetail;
  highlights: Highlight[];
  liveMatches?: Match[];
  relatedMatches?: Match[];
  relatedNews?: NewsArticle[];
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
  relatedNews = [],
}: {
  match: Match;
  detail: MatchDetail;
  highlights: Highlight[];
  liveMatches?: Match[];
  relatedMatches?: Match[];
  relatedNews?: NewsArticle[];
}) {
  const timezone = useTimezone();
  const home = getTeam(match.home, match.homeName, match.homeLogo);
  const away = getTeam(match.away, match.awayName, match.awayLogo);
  const searchParams = useSearchParams();
  const hasHighlights =
    highlights.length > 0 ||
    (detail.videos?.length ?? 0) > 0 ||
    (detail.photos?.length ?? 0) > 0;
  const hasFeed =
    match.status === "live" ||
    match.status === "finished" ||
    (detail.events?.length ?? 0) > 0 ||
    (detail.commentary?.length ?? 0) > 0;
  const tabs = getTabs(match, hasHighlights, hasFeed);
  const tab = parseTab(searchParams.get("tab"), match, hasHighlights, hasFeed);
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

  const share = buildMatchSharePayload(match, liveMinute);
  const winPrediction =
    match.status === "live" || match.status === "upcoming"
      ? predictMatchOutcome({
          homeCode: match.home,
          awayCode: match.away,
          homeName: home.name,
          awayName: away.name,
          status: match.status,
          homeScore: match.homeScore,
          awayScore: match.awayScore,
          minute: match.status === "live" ? liveMinute : match.minute,
          displayClock: match.displayClock,
          stats: detail.stats,
          events: detail.events,
        })
      : null;

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
                    <FifaRankBadge code={match.home} />
                  </div>
                  <div className="flex justify-center">
                    <TeamJourneyButton teamCode={match.home} />
                  </div>
                </div>
              ) : (
                <div className="space-y-1">
                  <p className="text-lg sm:text-xl font-bold text-zinc-900">{home.name}</p>
                  <div className="flex justify-center">
                    <FifaRankBadge code={match.home} />
                  </div>
                </div>
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
                    <FifaRankBadge code={match.away} />
                  </div>
                  <div className="flex justify-center">
                    <TeamJourneyButton teamCode={match.away} />
                  </div>
                </div>
              ) : (
                <div className="space-y-1">
                  <p className="text-lg sm:text-xl font-bold text-zinc-900">{away.name}</p>
                  <div className="flex justify-center">
                    <FifaRankBadge code={match.away} />
                  </div>
                </div>
              )}
              {detail.awayManager && detail.awayManager !== "TBD" && (
                <p className="text-xs text-zinc-400 mt-0.5">{detail.awayManager}</p>
              )}
            </div>
          </div>

          {match.status !== "finished" && (
            <div className="flex flex-wrap items-center justify-center gap-3 mt-4">
              <AddToCalendar match={match} />
            </div>
          )}

          <ShareButtons
            url={share.url}
            title={share.title}
            text={share.text}
            label={share.label}
            className="mt-6"
          />

          <div className="flex flex-wrap items-center justify-center gap-4 mt-6 text-sm text-zinc-500">
            <FifaRankMatchup homeCode={match.home} awayCode={match.away} />
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

      {winPrediction && match.status === "live" && (
        <MatchWinPredictor
          homeName={home.name}
          awayName={away.name}
          matchId={match.id}
          homeScore={match.homeScore}
          awayScore={match.awayScore}
          status="live"
          prediction={winPrediction}
        />
      )}

      {(detail.rivalryName || detail.rivalryNote) && (
        <RivalryMatchdayHub
          match={match}
          rivalryName={detail.rivalryName}
          rivalryNote={detail.rivalryNote}
          rivalryFunFact={detail.rivalryFunFact}
        />
      )}

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
            {id === "live" && match.status === "live" && (
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-500 opacity-60" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-red-600" />
              </span>
            )}
          </Link>
        ))}
      </div>

      {tab === "live" && (
        <MatchLiveFeed
          matchId={match.id}
          initialMatch={match}
          initialEvents={detail.events}
          initialCommentary={detail.commentary}
          initialPlayers={detail.players}
        />
      )}

      {tab === "overview" && (
        <>
      {winPrediction && match.status === "upcoming" && (
        <MatchWinPredictor
          homeName={home.name}
          awayName={away.name}
          matchId={match.id}
          homeScore={match.homeScore}
          awayScore={match.awayScore}
          status="upcoming"
          prediction={winPrediction}
        />
      )}

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

      <MatchRelatedNews
        articles={relatedNews}
        homeName={home.name}
        awayName={away.name}
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
        <MatchMedia videos={detail.videos} photos={detail.photos} match={match} />
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
        <MatchTimeline match={match} events={detail.events} players={detail.players} />
      )}

      {tab === "table" && !detail.groupStandings && (
        <p className="text-sm text-zinc-400 text-center py-8">Group table not available yet.</p>
      )}
    </div>
  );
}
