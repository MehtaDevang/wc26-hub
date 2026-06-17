import type { MatchEvent } from "./types";
import { buildMatchTimeline, type EnrichedTimelineEvent } from "./match-timeline";
import type { Match, MatchDetail, PlayerProfile } from "./types";

export type FeedItemKind = "event" | "commentary";

export interface MatchFeedItem {
  id: string;
  kind: FeedItemKind;
  minute: string;
  title: string;
  body: string;
  type?: MatchEvent["type"];
  team?: MatchEvent["team"];
  playerName?: string;
  playerId?: string;
  sortKey: number;
  isHighlight?: boolean;
}

const HIGHLIGHT_TYPES = new Set<MatchEvent["type"]>([
  "goal",
  "penalty",
  "red",
  "yellow",
  "sub",
]);

function eventToFeedItem(event: EnrichedTimelineEvent): MatchFeedItem {
  return {
    id: event.id,
    kind: "event",
    minute: event.minute > 0 ? `${event.minute}${event.extraTime ? `+${event.extraTime}` : ""}'` : "—",
    title: event.title,
    body: event.summary,
    type: event.type,
    team: event.team,
    playerName: event.playerName,
    playerId: event.playerId,
    sortKey: event.sortKey,
    isHighlight: HIGHLIGHT_TYPES.has(event.type) || Boolean(event.milestone),
  };
}

/** Build a unified chronological feed from timeline events and raw commentary. */
export function buildMatchFeed(
  match: Match,
  events: MatchEvent[],
  commentary: Array<{ minute: string; text: string }> = []
): MatchFeedItem[] {
  const timeline = buildMatchTimeline(events, match);
  const feed: MatchFeedItem[] = [];

  for (const period of timeline) {
    for (const event of period.events) {
      feed.push(eventToFeedItem(event));
    }
  }

  const eventBodies = new Set(
    feed.map((f) => f.body.toLowerCase().slice(0, 60))
  );

  for (const [index, line] of commentary.entries()) {
    const text = line.text?.trim();
    if (!text || text.length < 4) continue;
    const snippet = text.toLowerCase().slice(0, 60);
    if (eventBodies.has(snippet)) continue;

    feed.push({
      id: `commentary-${index}-${line.minute}`,
      kind: "commentary",
      minute: line.minute || "—",
      title: "Live update",
      body: text,
      sortKey: 900_000 + index,
    });
  }

  return feed.sort((a, b) => b.sortKey - a.sortKey);
}

export function feedItemPlayerHref(
  item: MatchFeedItem,
  players: Record<string, PlayerProfile>
): string | null {
  if (!item.playerId) return null;
  const espnId = players[item.playerId]?.espnId;
  return espnId ? `/players/${espnId}` : null;
}

export type LiveFeedSnapshot = {
  match: Match;
  events: MatchEvent[];
  commentary: MatchDetail["commentary"];
  players: Record<string, PlayerProfile>;
};
