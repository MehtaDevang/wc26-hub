"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Loader2, Radio } from "lucide-react";
import { fetchMatchDetail } from "@/lib/matches";
import { getTeam } from "@/lib/data";
import {
  buildMatchFeed,
  feedItemPlayerHref,
  type MatchFeedItem,
} from "@/lib/match-feed";
import type { Match, MatchDetail, PlayerProfile } from "@/lib/types";

const LIVE_REFRESH_MS = 30_000;

const TYPE_STYLES: Record<string, { dot: string; label: string }> = {
  goal: { dot: "bg-emerald-500", label: "Goal" },
  penalty: { dot: "bg-amber-500", label: "Penalty" },
  yellow: { dot: "bg-yellow-400", label: "Card" },
  red: { dot: "bg-red-600", label: "Red card" },
  sub: { dot: "bg-blue-500", label: "Sub" },
  save: { dot: "bg-sky-500", label: "Save" },
  chance: { dot: "bg-zinc-400", label: "Chance" },
  whistle: { dot: "bg-zinc-600", label: "Whistle" },
};

function FeedRow({
  item,
  homeFlag,
  awayFlag,
  players,
}: {
  item: MatchFeedItem;
  homeFlag: string;
  awayFlag: string;
  players: Record<string, PlayerProfile>;
}) {
  const style = item.type ? TYPE_STYLES[item.type] : null;
  const playerHref = feedItemPlayerHref(item, players);
  const teamFlag =
    item.team === "home" ? homeFlag : item.team === "away" ? awayFlag : null;

  return (
    <article
      className={`flex gap-3 px-4 py-3 border-b border-zinc-50 last:border-0 ${
        item.isHighlight ? "bg-amber-50/40" : ""
      }`}
    >
      <div className="shrink-0 w-10 text-right">
        <span className="text-[11px] font-bold tabular-nums text-zinc-400">{item.minute}</span>
      </div>
      <div className="shrink-0 pt-1">
        <span
          className={`block h-2 w-2 rounded-full ${style?.dot ?? "bg-zinc-300"}`}
          aria-hidden
        />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-1.5 mb-0.5">
          {teamFlag && <span className="text-sm leading-none">{teamFlag}</span>}
          <span className="text-xs font-bold uppercase tracking-wide text-zinc-500">
            {style?.label ?? item.title}
          </span>
        </div>
        <p className="text-sm text-zinc-800 leading-snug">
          {item.playerName && playerHref ? (
            <>
              <Link href={playerHref} className="font-semibold text-blue-600 hover:underline">
                {item.playerName}
              </Link>
              {item.body.replace(item.playerName, "").trim() && (
                <span> {item.body.replace(item.playerName, "").trim()}</span>
              )}
            </>
          ) : (
            item.body
          )}
        </p>
      </div>
    </article>
  );
}

export function MatchLiveFeed({
  matchId,
  initialMatch,
  initialEvents,
  initialCommentary = [],
  initialPlayers = {},
}: {
  matchId: string;
  initialMatch: Match;
  initialEvents: MatchDetail["events"];
  initialCommentary?: MatchDetail["commentary"];
  initialPlayers?: Record<string, PlayerProfile>;
}) {
  const [match, setMatch] = useState(initialMatch);
  const [events, setEvents] = useState(initialEvents);
  const [commentary, setCommentary] = useState(initialCommentary ?? []);
  const [players, setPlayers] = useState(initialPlayers);
  const [refreshing, setRefreshing] = useState(false);

  const home = getTeam(match.home, match.homeName, match.homeLogo);
  const away = getTeam(match.away, match.awayName, match.awayLogo);

  const feed = useMemo(
    () => buildMatchFeed(match, events, commentary),
    [match, events, commentary]
  );

  const refresh = useCallback(async () => {
    if (match.status !== "live") return;
    setRefreshing(true);
    try {
      const data = await fetchMatchDetail(matchId);
      setMatch(data.match);
      setEvents(data.detail.events);
      setCommentary(data.detail.commentary ?? []);
      setPlayers(data.detail.players ?? {});
    } catch {
      // keep last good data
    } finally {
      setRefreshing(false);
    }
  }, [match.status, matchId]);

  useEffect(() => {
    if (match.status !== "live") return;
    const interval = setInterval(() => {
      if (document.visibilityState === "visible") refresh();
    }, LIVE_REFRESH_MS);
    return () => clearInterval(interval);
  }, [match.status, refresh]);

  if (feed.length === 0) {
    return (
      <div className="card-surface rounded-2xl p-8 text-center">
        <Radio size={28} className="mx-auto text-zinc-300 mb-2" />
        <p className="font-semibold text-zinc-700">Live feed starting soon</p>
        <p className="text-sm text-zinc-500 mt-1">
          Commentary and key moments will appear here once the match kicks off.
        </p>
      </div>
    );
  }

  return (
    <section className="card-surface rounded-2xl overflow-hidden">
      <div className="flex items-center justify-between gap-3 px-4 py-3 border-b border-zinc-100 bg-zinc-50/80">
        <h2 className="text-sm font-bold text-zinc-900 flex items-center gap-2">
          {match.status === "live" && (
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-500 opacity-60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-red-600" />
            </span>
          )}
          Live match feed
        </h2>
        {match.status === "live" && (
          <button
            type="button"
            onClick={() => refresh()}
            disabled={refreshing}
            className="inline-flex items-center gap-1 text-[11px] font-semibold text-zinc-500 hover:text-blue-600 disabled:opacity-50"
          >
            {refreshing && <Loader2 size={11} className="animate-spin" />}
            Auto-updates every 30s
          </button>
        )}
      </div>
      <div className="max-h-[32rem] overflow-y-auto">
        {feed.map((item) => (
          <FeedRow
            key={item.id}
            item={item}
            homeFlag={home.flag}
            awayFlag={away.flag}
            players={players}
          />
        ))}
      </div>
    </section>
  );
}
