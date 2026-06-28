import type {
  Highlight, Match, MatchDetail, MatchEvent, MatchLeader, MatchPhoto, MatchStats,
  MatchVideo, GroupStandings, LineupPlayer, TeamLineup, TeamRecord,
  VenueInfo, BroadcastInfo, StandingsRow,
} from "../types";
import { getTeamFlag } from "../teams";
import { resolveTeamCode } from "../team-lookup";
import { lookupVenue } from "../venues";
import { getCoach } from "../coaches";
import { formatKickoffDateKey, formatKickoffTime } from "../timezone";
import type {
  EspnCompetition, EspnEvent, EspnKeyEvent, EspnSummary, EspnRoster, EspnCompetitor,
} from "./client";
import { buildGoalHighlights, extractMomentHighlights, extractScorerName } from "./highlight-images";
import { buildHeadToHead } from "./head-to-head";
import { getRivalryInfo } from "../rivalries";
import { parseSubstitution } from "../match-timeline";
import {
  mergeTimelineEvents,
  parseCommentaryToEvents,
} from "../commentary-timeline";

const DEFAULT_TRANSFORM_TZ = "UTC";

function parseGroup(note?: string): string {
  if (!note) return "?";
  const match = note.match(/Group\s+([A-L])/i);
  return match ? match[1].toUpperCase() : "?";
}

function parseStatus(comp: EspnCompetition): Match["status"] {
  const state = comp.status.type.state;
  if (state === "in") return "live";
  if (state === "post" || comp.status.type.completed) return "finished";
  return "upcoming";
}

function parseMinute(displayClock?: string): number | undefined {
  if (!displayClock) return undefined;
  const match = displayClock.match(/(\d+)/);
  return match ? parseInt(match[1], 10) : undefined;
}

function parseEventClock(displayClock?: string): { minute: number; extraTime?: number } {
  if (!displayClock) return { minute: 0 };
  const stoppage = displayClock.match(/^(\d+)'\+(\d+)'?$/);
  if (stoppage) {
    return {
      minute: parseInt(stoppage[1]!, 10),
      extraTime: parseInt(stoppage[2]!, 10),
    };
  }
  return { minute: parseMinute(displayClock) ?? 0 };
}

function formatTime(isoDate: string, timeZone: string): string {
  return formatKickoffTime(isoDate, timeZone);
}

function formatDate(isoDate: string, timeZone: string): string {
  return formatKickoffDateKey(isoDate, timeZone);
}

function getRecord(competitor: EspnCompetitor): string | undefined {
  const total = competitor.record?.find((r) => r.type === "total");
  return total?.displayValue ?? total?.summary;
}

export function transformEvent(
  event: EspnEvent,
  timeZone: string = DEFAULT_TRANSFORM_TZ
): Match {
  const comp = event.competitions[0];
  const home = comp.competitors.find((c) => c.homeAway === "home")!;
  const away = comp.competitors.find((c) => c.homeAway === "away")!;
  const status = parseStatus(comp);
  const venue = comp.venue;
  const kickoffAt = comp.date || event.date;

  return {
    id: String(event.id),
    group: parseGroup(comp.altGameNote),
    home: home.team.abbreviation,
    away: away.team.abbreviation,
    homeName: home.team.displayName,
    awayName: away.team.displayName,
    homeLogo: home.team.logo,
    awayLogo: away.team.logo,
    kickoffAt,
    date: formatDate(kickoffAt, timeZone),
    time: formatTime(kickoffAt, timeZone),
    venue: venue?.fullName ?? "TBD",
    venueCity: venue?.address?.city,
    venueCountry: venue?.address?.country,
    homeScore: status !== "upcoming" ? parseInt(home.score ?? "0", 10) : undefined,
    awayScore: status !== "upcoming" ? parseInt(away.score ?? "0", 10) : undefined,
    minute: status === "live" ? parseMinute(comp.status.displayClock) : undefined,
    displayClock: comp.status.displayClock,
    status,
    attendance: comp.attendance,
    homeRecord: getRecord(home),
    awayRecord: getRecord(away),
    stageLabel: event.name,
  };
}

export function transformEvents(
  events: EspnEvent[],
  timeZone: string = DEFAULT_TRANSFORM_TZ
): Match[] {
  return events.map((e) => transformEvent(e, timeZone));
}

function eventType(espnType: string, scoringPlay?: boolean): MatchEvent["type"] {
  if (scoringPlay || espnType.includes("goal") || espnType.includes("penalty")) {
    if (espnType.includes("own-goal")) return "goal";
    if (espnType.includes("penalty")) return "penalty";
    return "goal";
  }

  const map: Record<string, MatchEvent["type"]> = {
    goal: "goal",
    "yellow-card": "yellow",
    "red-card": "red",
    substitution: "sub",
    kickoff: "whistle",
    "end-period": "whistle",
    "start-period": "whistle",
    save: "save",
    "penalty-goal": "penalty",
    "own-goal": "goal",
  };
  return map[espnType] ?? "chance";
}

function parseAssist(text?: string): string | undefined {
  if (!text) return undefined;
  const match = text.match(/Assisted by ([^.]+)/i);
  return match ? match[1].trim() : undefined;
}

function buildPlayerFromGoal(event: EspnKeyEvent, teamCode: string): import("../types").PlayerProfile | undefined {
  const name =
    event.athlete?.displayName ??
    extractScorerName(event) ??
    event.shortText?.replace(/\s+Goal$/i, "").trim();
  if (!name) return undefined;

  const id = event.athlete?.id ?? `scorer-${name.toLowerCase().replace(/\s+/g, "-")}`;
  return {
    id,
    name,
    team: teamCode,
    number: parseInt(event.athlete?.jersey ?? "0", 10) || 0,
    position: event.athlete?.position?.displayName ?? "Player",
    age: 0,
    club: "",
    nationality: "",
    flag: getTeamFlag(teamCode),
    worldCupGoals: 0,
    caps: 0,
    bio: event.text ?? `${name} featured in this World Cup 2026 match.`,
    espnId: event.athlete?.id,
  };
}

function getTeamSide(
  teamName: string | undefined,
  homeCode: string,
  awayCode: string,
  homeName: string,
  awayName: string
): "home" | "away" | "neutral" {
  if (!teamName) return "neutral";
  if (teamName === homeName || teamName.includes(homeCode)) return "home";
  if (teamName === awayName || teamName.includes(awayCode)) return "away";
  return "neutral";
}

function transformKeyEvents(
  keyEvents: EspnKeyEvent[],
  homeCode: string,
  awayCode: string,
  homeName: string,
  awayName: string
): { events: MatchEvent[]; players: Record<string, import("../types").PlayerProfile> } {
  const players: Record<string, import("../types").PlayerProfile> = {};
  const skipTypes = new Set(["start-delay", "end-delay"]);
  const timelineTypes = new Set([
    "goal",
    "own-goal",
    "penalty-goal",
    "yellow-card",
    "red-card",
    "substitution",
    "kickoff",
    "halftime",
    "start-period",
    "end-regular-time",
  ]);

  const events: MatchEvent[] = keyEvents
    .filter((e) => {
      if (e.type.type === "start-delay") {
        const text = (e.text ?? e.shortText ?? "").trim();
        return text.length > 0 && /injury|drinks break|var/i.test(text);
      }
      if (skipTypes.has(e.type.type)) return false;
      return true;
    })
    .filter(
      (e) =>
        timelineTypes.has(e.type.type) ||
        e.scoringPlay ||
        (e.type.type === "start-delay" &&
          /injury|drinks break|var/i.test(e.text ?? e.shortText ?? ""))
    )
    .map((e) => {
      const side = getTeamSide(e.team?.displayName, homeCode, awayCode, homeName, awayName);
      const teamCode = side === "home" ? homeCode : side === "away" ? awayCode : homeCode;
      const isOwnGoal =
        e.type.type === "own-goal" || /own goal/i.test(e.text ?? e.shortText ?? "");

      let milestone: MatchEvent["milestone"];
      if (e.type.type === "kickoff") milestone = "kickoff";
      else if (e.type.type === "halftime") milestone = "halftime";
      else if (e.type.type === "start-period" && e.period?.number === 2) milestone = "second-half";
      else if (e.type.type === "end-regular-time") milestone = "fulltime";

      const isInjuryDelay = e.type.type === "start-delay";

      let subIn: string | undefined;
      let subOut: string | undefined;
      if (e.type.type === "substitution") {
        const parsed = parseSubstitution(e.text);
        subIn = parsed.subIn ?? e.participants?.[0]?.athlete?.displayName;
        subOut = parsed.subOut ?? e.participants?.[1]?.athlete?.displayName;
      }

      let playerId: string | undefined;
      let playerName =
        extractScorerName(e) ??
        subIn ??
        e.participants?.[0]?.athlete?.displayName ??
        e.shortText?.replace(/\s+(Goal|Yellow Card|Red Card)$/i, "").trim() ??
        e.shortText ??
        e.type.text;

      if (milestone) {
        playerName = e.type.text;
      }

      if (isInjuryDelay) {
        const delayText = e.text ?? e.shortText ?? "";
        const injury = delayText.match(/injury\s+(.+?)\./i);
        if (injury) {
          playerName = injury[1]!.trim();
        } else if (/drinks break/i.test(delayText)) {
          playerName = "Drinks break";
        } else {
          playerName = "Stoppage";
        }
      }

      if (e.scoringPlay || /goal|penalty/i.test(e.type.type)) {
        const player = buildPlayerFromGoal(e, teamCode);
        if (player) {
          players[player.id] = players[player.id] ?? player;
          playerId = player.id;
          playerName = player.name;
        }
      }

      const clock = parseEventClock(e.clock?.displayValue);

      return {
        id: e.id,
        minute: clock.minute,
        extraTime: clock.extraTime,
        period: e.period?.number,
        type: isInjuryDelay ? "whistle" : eventType(e.type.type, e.scoringPlay),
        team: milestone ? "neutral" : side,
        playerId,
        playerName,
        description: e.text ?? e.shortText ?? e.type.text,
        assist: parseAssist(e.text),
        subIn,
        subOut,
        isOwnGoal,
        milestone,
      } as MatchEvent;
    });

  return { events, players };
}

function extractStats(summary: EspnSummary, homeCode: string): MatchStats | undefined {
  const teams = summary.boxscore?.teams;
  if (!teams || teams.length < 2) return undefined;

  const home = teams.find((t) => t.homeAway === "home") ?? teams.find((t) => t.team.abbreviation === homeCode);
  const away = teams.find((t) => t.homeAway === "away") ?? teams.find((t) => t !== home);
  if (!home || !away) return undefined;

  const get = (team: typeof home, name: string) => {
    const stat = team.statistics.find((s) => s.name === name);
    return stat ? parseFloat(stat.displayValue) : 0;
  };

  return {
    possession: [get(home, "possessionPct"), get(away, "possessionPct")],
    shots: [get(home, "totalShots"), get(away, "totalShots")],
    shotsOnTarget: [get(home, "shotsOnTarget"), get(away, "shotsOnTarget")],
    corners: [get(home, "wonCorners"), get(away, "wonCorners")],
    fouls: [get(home, "foulsCommitted"), get(away, "foulsCommitted")],
    yellowCards: [get(home, "yellowCards"), get(away, "yellowCards")],
    redCards: [get(home, "redCards"), get(away, "redCards")],
    saves: [get(home, "saves"), get(away, "saves")],
    passes: [get(home, "totalPasses"), get(away, "totalPasses")],
    passAccuracy: [get(home, "passPct"), get(away, "passPct")],
    offsides: [get(home, "offsides"), get(away, "offsides")],
    tackles: [get(home, "effectiveTackles"), get(away, "effectiveTackles")],
    interceptions: [get(home, "interceptions"), get(away, "interceptions")],
  };
}

function transformLineup(roster: EspnRoster): TeamLineup {
  const players: LineupPlayer[] = (roster.roster ?? []).map((p) => ({
    id: p.athlete?.id ?? p.athlete?.displayName ?? "",
    name: p.athlete?.displayName ?? "Unknown",
    number: parseInt(p.jersey ?? "0", 10) || 0,
    position: p.position?.abbreviation ?? p.position?.displayName ?? "",
    starter: !!p.starter,
    espnId: p.athlete?.id,
  }));

  return {
    teamCode: roster.team.abbreviation,
    teamName: roster.team.displayName,
    formation: roster.formation ?? "",
    starters: players.filter((p) => p.starter),
    substitutes: players.filter((p) => !p.starter),
  };
}

function transformVideos(summary: EspnSummary): MatchVideo[] {
  return (summary.videos ?? []).map((v) => ({
    id: String(v.id),
    title: v.headline ?? "Highlight",
    description: v.description ?? "",
    thumbnail: v.thumbnail ?? "",
    videoUrl:
      v.links?.source?.href ??
      v.links?.mobile?.source?.href ??
      undefined,
    duration: v.duration,
    webUrl: v.links?.web?.href,
  }));
}

function transformPhotos(summary: EspnSummary): MatchPhoto[] {
  const photos: MatchPhoto[] = [];
  const seen = new Set<string>();

  for (const img of summary.article?.images ?? []) {
    if (img.url && !seen.has(img.url)) {
      seen.add(img.url);
      photos.push({
        id: String(img.id ?? photos.length),
        url: img.url,
        caption: img.caption ?? img.name,
        credit: img.credit,
      });
    }
  }

  for (const v of summary.videos ?? []) {
    if (v.thumbnail && !seen.has(v.thumbnail)) {
      seen.add(v.thumbnail);
      photos.push({
        id: `thumb-${v.id}`,
        url: v.thumbnail,
        caption: v.headline,
      });
    }
  }

  return photos;
}

export function transformStandings(summary: EspnSummary, group: string): GroupStandings | undefined {
  const entries = summary.standings?.groups?.[0]?.standings?.entries;
  if (!entries?.length) return undefined;

  const rows: StandingsRow[] = entries.map((e) => {
    const stats = Object.fromEntries(e.stats.map((s) => [s.abbreviation, s.displayValue]));
    const total = stats.Total ?? "0-0-0";
    const [w, d, l] = total.split("-").map((n) => parseInt(n, 10) || 0);
    return {
      rank: parseInt(stats.R ?? "0", 10),
      team: e.team,
      teamCode: resolveTeamCode(e.team) ?? e.id?.toUpperCase(),
      played: parseInt(stats.GP ?? "0", 10),
      won: parseInt(stats.W ?? String(w), 10),
      drawn: parseInt(stats.D ?? String(d), 10),
      lost: parseInt(stats.L ?? String(l), 10),
      goalDiff: stats.GD ?? "0",
      points: parseInt(stats.P ?? "0", 10),
      form: total,
    };
  });

  return { group: group !== "?" ? `Group ${group}` : "Group", rows };
}

function transformLeaders(summary: EspnSummary): MatchLeader[] {
  const result: MatchLeader[] = [];
  for (const group of summary.leaders ?? []) {
    for (const cat of group.leaders ?? []) {
      const top = cat.leaders?.[0];
      if (top) {
        result.push({
          category: cat.displayName,
          playerName: top.athlete.displayName,
          team: group.team.displayName,
          value: top.displayValue,
        });
      }
    }
  }
  return result;
}

function transformBroadcasts(summary: EspnSummary): BroadcastInfo[] {
  const raw = summary.broadcasts ?? summary.header?.competitions?.[0]?.broadcasts ?? [];
  return raw.map((b) => ({
    network: b.media?.name ?? b.media?.shortName ?? b.media?.callLetters ?? "TV",
    type: b.type?.shortName ?? "TV",
  }));
}

function buildVenue(summary: EspnSummary, match: Match): VenueInfo {
  const venue = summary.gameInfo?.venue ?? summary.header?.competitions?.[0]?.venue;
  const meta = lookupVenue(
    venue?.fullName ?? match.venue,
    venue?.address?.city ?? match.venueCity,
    venue?.address?.country ?? match.venueCountry
  );
  return {
    name: meta.name,
    city: meta.city || venue?.address?.city || match.venueCity || "",
    country: meta.country || venue?.address?.country || match.venueCountry || "",
    capacity: venue?.capacity ?? meta.capacity,
  };
}

function buildTeamRecord(competitor?: EspnCompetitor): TeamRecord | undefined {
  if (!competitor) return undefined;
  const total = competitor.record?.find((r) => r.type === "total");
  const points = competitor.record?.find((r) => r.type === "points");
  if (!total) return undefined;
  return {
    summary: total.displayValue ?? total.summary,
    points: points?.displayValue ?? points?.summary,
  };
}

export function transformSummary(summary: EspnSummary, match: Match): MatchDetail {
  const comp = summary.header?.competitions?.[0];
  const homeComp = comp?.competitors?.find((c) => c.homeAway === "home");
  const awayComp = comp?.competitors?.find((c) => c.homeAway === "away");
  const homeCode = match.home;
  const awayCode = match.away;

  const { events: keyEventsTransformed, players } = transformKeyEvents(
    summary.keyEvents ?? [],
    homeCode,
    awayCode,
    match.homeName,
    match.awayName
  );

  const commentaryLines = (summary.commentary ?? []).filter((line) => line.text?.trim());
  const commentaryEvents = parseCommentaryToEvents(
    commentaryLines.map((line, index) => ({
      minute: line.time?.displayValue,
      text: line.text,
      sequence: line.sequence ?? index,
    })),
    homeCode,
    awayCode,
    match.homeName,
    match.awayName
  );

  const events = mergeTimelineEvents(keyEventsTransformed, commentaryEvents);

  const referee = summary.gameInfo?.officials?.[0]?.displayName;
  const rosters = summary.rosters ?? [];
  const homeRoster = rosters.find((r) => r.homeAway === "home");
  const awayRoster = rosters.find((r) => r.homeAway === "away");
  const h2h = buildHeadToHead(match, summary);
  const rivalry = getRivalryInfo(homeCode, awayCode);

  return {
    matchId: match.id,
    summary:
      summary.article?.description ??
      summary.article?.headline ??
      `${match.homeName} vs ${match.awayName} at the 2026 FIFA World Cup.`,
    attendance: comp?.attendance?.toLocaleString() ?? summary.gameInfo?.attendance?.toLocaleString(),
    referee: referee ? `${referee}` : undefined,
    events,
    players,
    stats: extractStats(summary, homeCode),
    homeLineup: homeRoster ? transformLineup(homeRoster) : undefined,
    awayLineup: awayRoster ? transformLineup(awayRoster) : undefined,
    homeManager: getCoach(homeCode),
    awayManager: getCoach(awayCode),
    homeRecord: buildTeamRecord(homeComp),
    awayRecord: buildTeamRecord(awayComp),
    venue: buildVenue(summary, match),
    videos: transformVideos(summary),
    photos: transformPhotos(summary),
    groupStandings: transformStandings(summary, match.group),
    leaders: transformLeaders(summary),
    headToHead: h2h.meetings,
    headToHeadRecord: h2h.record,
    rivalryNote: rivalry?.context,
    rivalryName: rivalry?.name,
    rivalryFunFact: rivalry?.funFact,
    broadcasts: transformBroadcasts(summary),
    commentary: commentaryLines
      .filter((c) => c.text && c.time?.displayValue)
      .slice(-20)
      .map((c) => ({
        minute: c.time?.displayValue ?? "",
        text: c.text,
      })),
  };
}

export function buildMinimalMatchDetail(match: Match): MatchDetail {
  const meta = lookupVenue(match.venue, match.venueCity, match.venueCountry);
  const rivalry = getRivalryInfo(match.home, match.away);
  return {
    matchId: match.id,
    summary: `${match.homeName} vs ${match.awayName} at the 2026 FIFA World Cup.`,
    events: [],
    players: {},
    stats: {
      possession: [0, 0],
      shots: [0, 0],
      shotsOnTarget: [0, 0],
      corners: [0, 0],
      fouls: [0, 0],
      yellowCards: [0, 0],
      redCards: [0, 0],
      saves: [0, 0],
      passes: [0, 0],
      passAccuracy: [0, 0],
      offsides: [0, 0],
      tackles: [0, 0],
      interceptions: [0, 0],
    },
    venue: {
      name: meta.name,
      city: meta.city || match.venueCity || "",
      country: meta.country || match.venueCountry || "",
      capacity: meta.capacity,
    },
    rivalryNote: rivalry?.context,
    rivalryName: rivalry?.name,
    rivalryFunFact: rivalry?.funFact,
  };
}

export function goalsToHighlights(match: Match, summary: EspnSummary): Highlight[] {
  return buildGoalHighlights(match, summary);
}

export function buildAllMatchHighlights(
  match: Match,
  summary: EspnSummary,
  options?: { momentLimit?: number }
): Highlight[] {
  const goals = buildGoalHighlights(match, summary);
  if (match.status === "upcoming") return goals;

  const defaultLimit = match.status === "finished" ? 12 : 8;
  const usedUrls = new Set(
    goals.map((g) => g.imageUrl).filter((url): url is string => Boolean(url))
  );
  const moments = extractMomentHighlights(
    match,
    summary,
    usedUrls,
    options?.momentLimit ?? defaultLimit
  );

  return [...goals, ...moments];
}

export function transformAllStandings(summary: EspnSummary): GroupStandings[] {
  const groups = summary.standings?.groups ?? [];
  return groups.map((g, i) => {
    const entries = g.standings?.entries ?? [];
    const rows: StandingsRow[] = entries.map((e) => {
      const stats = Object.fromEntries(e.stats.map((s) => [s.abbreviation, s.displayValue]));
      const total = stats.Total ?? "0-0-0";
      const [w, d, l] = total.split("-").map((n) => parseInt(n, 10) || 0);
      return {
        rank: parseInt(stats.R ?? "0", 10),
        team: e.team,
        teamCode: resolveTeamCode(e.team) ?? e.id?.toUpperCase(),
        played: parseInt(stats.GP ?? "0", 10),
        won: parseInt(stats.W ?? String(w), 10),
        drawn: parseInt(stats.D ?? String(d), 10),
        lost: parseInt(stats.L ?? String(l), 10),
        goalDiff: stats.GD ?? "0",
        points: parseInt(stats.P ?? "0", 10),
        form: total,
      };
    });
    return {
      group: g.header ?? `Group ${String.fromCharCode(65 + i)}`,
      rows,
    };
  });
}
