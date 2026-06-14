import { getSiteUrl, SITE_NAME } from "./site";
import type { Match } from "./types";

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

export function buildTwitterShareUrl(text: string, url: string): string {
  return `https://twitter.com/intent/tweet?${new URLSearchParams({
    text,
    url,
  })}`;
}

export function buildWhatsAppShareUrl(text: string, url: string): string {
  return `https://wa.me/?text=${encodeURIComponent(`${text}\n${url}`)}`;
}
