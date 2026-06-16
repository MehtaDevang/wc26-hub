import { getSiteUrl, SITE_NAME } from "./site";
import type { Highlight, Match, MatchPhoto, MatchVideo, NewsArticle } from "./types";

export function absoluteUrl(path: string): string {
  return `${getSiteUrl()}${path.startsWith("/") ? path : `/${path}`}`;
}

export interface SharePayload {
  url: string;
  title: string;
  text: string;
  label: string;
}

export function buildMatchSharePayload(
  match: Pick<
    Match,
    "id" | "homeName" | "awayName" | "homeScore" | "awayScore" | "status" | "displayClock" | "minute"
  >,
  liveMinute?: number
): SharePayload {
  const url = absoluteUrl(`/match/${match.id}`);
  const home = match.homeName;
  const away = match.awayName;
  const score = `${match.homeScore}–${match.awayScore}`;

  if (match.status === "live") {
    const clock = match.displayClock ?? (liveMinute ? `${liveMinute}'` : "");
    return {
      url,
      title: `${home} ${score} ${away} (Live)`,
      text: `🔴 LIVE: ${home} ${score} ${away}${clock ? ` (${clock})` : ""} — World Cup 2026 on ${SITE_NAME}`,
      label: "Share live score",
    };
  }

  if (match.status === "finished") {
    return {
      url,
      title: `${home} ${score} ${away}`,
      text: `⚽ ${home} ${score} ${away} — World Cup 2026 result on ${SITE_NAME}`,
      label: "Share result",
    };
  }

  return {
    url,
    title: `${home} vs ${away}`,
    text: `📅 ${home} vs ${away} — World Cup 2026 preview on ${SITE_NAME}`,
    label: "Share match",
  };
}

export function buildTeamSharePayload(teamCode: string, teamName: string): SharePayload {
  const url = absoluteUrl(`/teams/${teamCode}`);
  return {
    url,
    title: `${teamName} — World Cup 2026`,
    text: `🏆 ${teamName} at FIFA World Cup 2026 — fixtures, results, squad & stats on ${SITE_NAME}`,
    label: "Share team",
  };
}

export function buildGroupSharePayload(group: string, label: string): SharePayload {
  const url = absoluteUrl(`/groups/${group}`);
  return {
    url,
    title: `World Cup 2026 ${label}`,
    text: `📊 ${label} — live standings, fixtures & results on ${SITE_NAME}`,
    label: "Share group",
  };
}

export function buildPuzzlesSharePayload(): SharePayload {
  const url = absoluteUrl("/puzzles");
  return {
    url,
    title: `Daily World Cup Puzzles — ${SITE_NAME}`,
    text: `🧩 Daily World Cup puzzles on ${SITE_NAME} — guess the player, name scramble & trivia quiz. Can you solve today's set?`,
    label: "Share puzzles",
  };
}

export function buildNewsSharePayload(
  article: Pick<NewsArticle, "id" | "headline" | "summary" | "type">
): SharePayload {
  const url = absoluteUrl(`/news/${article.id}`);
  const emoji = article.type === "video" ? "🎬" : "📰";
  const snippet = article.summary?.trim();
  const text = snippet
    ? `${emoji} ${article.headline} — ${snippet} · World Cup 2026 on ${SITE_NAME}`
    : `${emoji} ${article.headline} — World Cup 2026 on ${SITE_NAME}`;

  return {
    url,
    title: article.headline,
    text,
    label: "Share story",
  };
}

export function buildTwitterShareUrl(text: string, url: string): string {
  return `https://twitter.com/intent/tweet?${new URLSearchParams({
    text,
    url,
  })}`;
}

export function buildWhatsAppShareUrl(text: string, url: string): string {
  return `https://wa.me/?text=${encodeURIComponent(`${text}\n${url}`)}`;
}

export function buildHighlightSharePayload(
  match: Pick<Match, "id" | "homeName" | "awayName" | "homeScore" | "awayScore" | "status">,
  highlight: Pick<
    Highlight,
    "type" | "title" | "minute" | "playerName" | "imageUrl" | "imageType" | "videoUrl" | "webUrl"
  >
): SharePayload {
  const url = absoluteUrl(`/match/${match.id}?tab=highlights`);
  const score =
    match.status !== "upcoming" && match.homeScore != null && match.awayScore != null
      ? ` (${match.homeScore}–${match.awayScore})`
      : "";
  const liveTag = match.status === "live" ? " LIVE" : "";

  if (highlight.type === "goal") {
    const scorer = highlight.playerName ?? highlight.title.replace(/\s+Goal\b.*$/i, "").trim();
    const minute = highlight.minute && highlight.minute !== "Clip" ? ` ${highlight.minute}` : "";
    return {
      url,
      title: `Goal — ${match.homeName} vs ${match.awayName}`,
      text: `⚽ GOAL! ${scorer}${minute} — ${match.homeName} vs ${match.awayName}${score}${liveTag} · World Cup 2026 on ${SITE_NAME}`,
      label: "Share goal",
    };
  }

  if (highlight.imageType === "player" && highlight.playerName) {
    return {
      url,
      title: highlight.title,
      text: `📸 ${highlight.playerName} — ${match.homeName} vs ${match.awayName}${score} on ${SITE_NAME}`,
      label: "Share moment",
    };
  }

  const emoji = highlight.videoUrl || highlight.webUrl ? "🎬" : "📸";
  return {
    url,
    title: highlight.title,
    text: `${emoji} ${highlight.title} — ${match.homeName} vs ${match.awayName}${score} on ${SITE_NAME}`,
    label: highlight.videoUrl || highlight.webUrl ? "Share clip" : "Share photo",
  };
}

export function buildVideoSharePayload(
  match: Pick<Match, "id" | "homeName" | "awayName" | "homeScore" | "awayScore" | "status">,
  video: Pick<MatchVideo, "title" | "webUrl" | "videoUrl">
): SharePayload {
  const url = absoluteUrl(`/match/${match.id}?tab=highlights`);
  const score =
    match.status !== "upcoming" && match.homeScore != null && match.awayScore != null
      ? ` (${match.homeScore}–${match.awayScore})`
      : "";
  return {
    url: video.webUrl ?? url,
    title: video.title,
    text: `🎬 ${video.title} — ${match.homeName} vs ${match.awayName}${score} on ${SITE_NAME}`,
    label: "Share video",
  };
}

export function buildPhotoSharePayload(
  match: Pick<Match, "id" | "homeName" | "awayName" | "homeScore" | "awayScore" | "status">,
  photo: Pick<MatchPhoto, "caption" | "url">
): SharePayload {
  const url = absoluteUrl(`/match/${match.id}?tab=highlights`);
  const score =
    match.status !== "upcoming" && match.homeScore != null && match.awayScore != null
      ? ` (${match.homeScore}–${match.awayScore})`
      : "";
  const caption = photo.caption?.trim() || `${match.homeName} vs ${match.awayName}`;
  return {
    url,
    title: caption,
    text: `📸 ${caption}${score} — World Cup 2026 on ${SITE_NAME}`,
    label: "Share photo",
  };
}
