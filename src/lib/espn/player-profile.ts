import { cache } from "react";
import {
  fetchEspnAthlete,
  fetchEspnAthleteGamelog,
  fetchEspnScoreboard,
  fetchEspnSummary,
  fetchEspnTeamRoster,
  fetchEspnTeams,
} from "./client";
import { transformEvent } from "./transform";
import { getTeamName, resolveTeamCode } from "../team-lookup";
import { getTeamFlag } from "../teams";
import type {
  PlayerCountrySection,
  PlayerGoal,
  PlayerListItem,
  PlayerRecentMatch,
  PlayerSeasonStat,
  PlayerWorldCupProfile,
  PlayerAppearance,
} from "../types";

const TOURNAMENT_DATES = "20260611-20260719";
const ROSTER_CONCURRENCY = 10;
const SUMMARY_CONCURRENCY = 6;
const POSITION_ORDER: Record<string, number> = {
  G: 0,
  Goalkeeper: 0,
  D: 1,
  Defender: 1,
  M: 2,
  Midfielder: 2,
  F: 3,
  Forward: 3,
};

export function slugifyPlayerName(name: string): string {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

async function mapWithConcurrency<T, R>(
  items: T[],
  limit: number,
  fn: (item: T) => Promise<R>
): Promise<R[]> {
  const results: R[] = new Array(items.length);
  let index = 0;

  async function worker() {
    while (index < items.length) {
      const current = index++;
      results[current] = await fn(items[current]);
    }
  }

  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, () => worker()));
  return results;
}

interface PlayerAccumulator {
  id: string;
  espnId: string;
  slug: string;
  name: string;
  teamCode: string;
  teamName: string;
  number: number;
  position: string;
  flag: string;
  headshot?: string;
  age: number;
  club: string;
  clubLogo?: string;
  nationality: string;
  displayHeight?: string;
  displayWeight?: string;
  dateOfBirth?: string;
  birthPlace?: string;
  goals: PlayerGoal[];
  yellowCards: number;
  redCards: number;
  appearances: Map<string, PlayerAppearance>;
}

function formatBirthPlace(place?: { city?: string; state?: string; country?: string }): string | undefined {
  if (!place) return undefined;
  const parts = [place.city, place.state, place.country].filter(Boolean);
  return parts.length > 0 ? parts.join(", ") : undefined;
}

function getOrCreatePlayer(
  map: Map<string, PlayerAccumulator>,
  athleteId: string,
  name: string,
  teamCode: string,
  teamName: string,
  fields: Partial<PlayerAccumulator> = {}
): PlayerAccumulator {
  const existing = map.get(athleteId);
  if (existing) {
    if (fields.headshot && !existing.headshot) existing.headshot = fields.headshot;
    if (fields.number && !existing.number) existing.number = fields.number;
    if (fields.position && existing.position === "Player") existing.position = fields.position;
    if (fields.club && !existing.club) existing.club = fields.club;
    if (fields.clubLogo && !existing.clubLogo) existing.clubLogo = fields.clubLogo;
    if (fields.age && !existing.age) existing.age = fields.age;
    if (fields.displayHeight && !existing.displayHeight) existing.displayHeight = fields.displayHeight;
    if (fields.displayWeight && !existing.displayWeight) existing.displayWeight = fields.displayWeight;
    if (fields.dateOfBirth && !existing.dateOfBirth) existing.dateOfBirth = fields.dateOfBirth;
    if (fields.birthPlace && !existing.birthPlace) existing.birthPlace = fields.birthPlace;
    if (fields.nationality && !existing.nationality) existing.nationality = fields.nationality;
    return existing;
  }

  const code = resolveTeamCode(teamCode) ?? teamCode.toUpperCase();
  const entry: PlayerAccumulator = {
    id: athleteId,
    espnId: athleteId,
    slug: slugifyPlayerName(name),
    name,
    teamCode: code,
    teamName: teamName || getTeamName(code),
    number: fields.number ?? 0,
    position: fields.position ?? "Player",
    flag: getTeamFlag(code),
    headshot: fields.headshot,
    age: fields.age ?? 0,
    club: fields.club ?? "",
    clubLogo: fields.clubLogo,
    nationality: fields.nationality ?? (teamName || getTeamName(code)),
    displayHeight: fields.displayHeight,
    displayWeight: fields.displayWeight,
    dateOfBirth: fields.dateOfBirth,
    birthPlace: fields.birthPlace,
    goals: [],
    yellowCards: 0,
    redCards: 0,
    appearances: new Map(),
  };
  map.set(athleteId, entry);
  return entry;
}

function parseAssist(text?: string): string | undefined {
  if (!text) return undefined;
  const match = text.match(/Assisted by ([^.]+)/i);
  return match ? match[1].trim() : undefined;
}

function parseMinute(clock?: string): number {
  if (!clock) return 0;
  const match = clock.match(/(\d+)/);
  return match ? parseInt(match[1], 10) : 0;
}

function sortPlayers(a: PlayerListItem, b: PlayerListItem): number {
  const posA = POSITION_ORDER[a.position] ?? POSITION_ORDER[a.position.split(" ")[0]] ?? 9;
  const posB = POSITION_ORDER[b.position] ?? POSITION_ORDER[b.position.split(" ")[0]] ?? 9;
  if (posA !== posB) return posA - posB;
  if (a.number && b.number) return a.number - b.number;
  return a.name.localeCompare(b.name);
}

async function buildSquadIndex(): Promise<Map<string, PlayerAccumulator>> {
  const teamsResponse = await fetchEspnTeams();
  const teams =
    teamsResponse.sports?.[0]?.leagues?.[0]?.teams?.map((entry) => entry.team) ?? [];
  const players = new Map<string, PlayerAccumulator>();

  await mapWithConcurrency(teams, ROSTER_CONCURRENCY, async (team) => {
    try {
      const roster = await fetchEspnTeamRoster(team.id);
      const teamCode = resolveTeamCode(team.abbreviation) ?? team.abbreviation.toUpperCase();
      const teamName = getTeamName(teamCode) || team.displayName;

      for (const athlete of roster.athletes ?? []) {
        if (!athlete.id || !athlete.displayName) continue;

        getOrCreatePlayer(players, athlete.id, athlete.displayName, teamCode, teamName, {
          number: parseInt(athlete.jersey ?? "0", 10) || 0,
          position:
            athlete.position?.displayName ??
            athlete.position?.name ??
            athlete.position?.abbreviation ??
            "Player",
          headshot: athlete.headshot?.href,
          age: athlete.age ?? 0,
          club: athlete.team?.displayName ?? "",
          clubLogo: athlete.team?.logos?.[0]?.href,
          nationality: athlete.citizenship ?? teamName,
          displayHeight: athlete.displayHeight,
          displayWeight: athlete.displayWeight,
          dateOfBirth: athlete.dateOfBirth,
          birthPlace: formatBirthPlace(athlete.birthPlace),
        });
      }
    } catch {
      // Skip teams with unavailable rosters.
    }
  });

  return players;
}

async function overlayMatchStats(players: Map<string, PlayerAccumulator>): Promise<void> {
  const scoreboard = await fetchEspnScoreboard({ dates: TOURNAMENT_DATES });
  const events = scoreboard.events ?? [];

  await mapWithConcurrency(events, SUMMARY_CONCURRENCY, async (event) => {
    try {
      const summary = await fetchEspnSummary(event.id);
      const match = transformEvent(event);
      const homeCode = match.home;
      const awayCode = match.away;

      const opponentFor = (side: "home" | "away") =>
        side === "home"
          ? { name: match.awayName, code: awayCode }
          : { name: match.homeName, code: homeCode };

      for (const roster of summary.rosters ?? []) {
        const side = roster.homeAway;
        const teamCode = side === "home" ? homeCode : awayCode;
        const teamName = side === "home" ? match.homeName : match.awayName;
        const opponent = opponentFor(side);

        for (const entry of roster.roster ?? []) {
          const athlete = entry.athlete;
          if (!athlete?.displayName || !athlete.id) continue;

          const player = getOrCreatePlayer(
            players,
            athlete.id,
            athlete.displayName,
            teamCode,
            teamName,
            {
              number: parseInt(entry.jersey ?? "0", 10) || 0,
              position: entry.position?.displayName ?? entry.position?.abbreviation ?? "Player",
              headshot: athlete.headshot?.href,
            }
          );

          player.appearances.set(event.id, {
            matchId: event.id,
            opponent: opponent.name,
            opponentCode: opponent.code,
            started: !!entry.starter,
            date: match.date,
          });
        }
      }

      for (const keyEvent of summary.keyEvents ?? []) {
        const athlete = keyEvent.athlete;
        if (!athlete?.displayName || !athlete.id) continue;

        const teamName = keyEvent.team?.displayName ?? "";
        const teamCode =
          resolveTeamCode(teamName) ??
          (teamName === match.homeName ? homeCode : awayCode);
        const side =
          teamCode === homeCode || teamName === match.homeName ? "home" : "away";
        const opponent = opponentFor(side);

        const player = getOrCreatePlayer(
          players,
          athlete.id,
          athlete.displayName,
          teamCode,
          teamName || getTeamName(teamCode),
          {
            number: parseInt(athlete.jersey ?? "0", 10) || 0,
            position: athlete.position?.displayName ?? "Player",
          }
        );

        const minute = parseMinute(keyEvent.clock?.displayValue);
        const eventType = keyEvent.type?.type ?? "";

        if (keyEvent.scoringPlay || eventType === "goal" || eventType === "penalty-goal") {
          player.goals.push({
            matchId: event.id,
            minute,
            opponent: opponent.name,
            opponentCode: opponent.code,
            assist: parseAssist(keyEvent.text),
            description: keyEvent.text ?? keyEvent.shortText ?? "Goal",
          });
        }

        if (eventType === "yellow-card") player.yellowCards += 1;
        if (eventType === "red-card") player.redCards += 1;
      }
    } catch {
      // Skip unavailable match summaries.
    }
  });
}

async function buildPlayerIndex(): Promise<Map<string, PlayerAccumulator>> {
  const players = await buildSquadIndex();
  await overlayMatchStats(players);
  return players;
}

const getPlayerIndex = cache(buildPlayerIndex);

function toListItem(entry: PlayerAccumulator): PlayerListItem {
  return {
    id: entry.espnId,
    slug: entry.slug,
    name: entry.name,
    teamCode: entry.teamCode,
    teamName: entry.teamName,
    flag: entry.flag,
    goals: entry.goals.length,
    position: entry.position,
    number: entry.number,
    headshot: entry.headshot,
  };
}

function buildBio(entry: PlayerAccumulator, goalCount: number): string {
  const parts = [
    `${entry.name} is representing ${entry.teamName} at the FIFA World Cup 2026`,
  ];
  if (entry.position !== "Player") parts.push(`as a ${entry.position.toLowerCase()}`);
  if (entry.club) parts.push(`and plays club football for ${entry.club}`);
  if (goalCount > 0) {
    parts.push(
      `with ${goalCount} goal${goalCount === 1 ? "" : "s"} in the tournament so far`
    );
  }
  return `${parts.join(" ")}.`;
}

function toProfile(
  entry: PlayerAccumulator,
  extras?: {
    recentMatches?: PlayerRecentMatch[];
    seasonStats?: PlayerSeasonStat[];
    club?: string;
    clubLogo?: string;
    displayHeight?: string;
    displayWeight?: string;
    dateOfBirth?: string;
    birthPlace?: string;
    age?: number;
  }
): PlayerWorldCupProfile {
  const appearances = [...entry.appearances.values()].sort((a, b) =>
    a.date.localeCompare(b.date)
  );
  const goalCount = entry.goals.length;

  return {
    id: entry.id,
    espnId: entry.espnId,
    slug: entry.slug,
    name: entry.name,
    teamCode: entry.teamCode,
    teamName: entry.teamName,
    number: entry.number,
    position: entry.position,
    flag: entry.flag,
    headshot: entry.headshot,
    age: extras?.age ?? entry.age,
    club: extras?.club ?? entry.club,
    clubLogo: extras?.clubLogo ?? entry.clubLogo,
    nationality: entry.nationality,
    caps: appearances.length,
    bio: buildBio(entry, goalCount),
    displayHeight: extras?.displayHeight ?? entry.displayHeight,
    displayWeight: extras?.displayWeight ?? entry.displayWeight,
    dateOfBirth: extras?.dateOfBirth ?? entry.dateOfBirth,
    birthPlace: extras?.birthPlace ?? entry.birthPlace,
    worldCupGoals: goalCount,
    goals: entry.goals.sort((a, b) => a.minute - b.minute),
    yellowCards: entry.yellowCards,
    redCards: entry.redCards,
    matchesPlayed: appearances.length,
    appearances,
    recentMatches: extras?.recentMatches ?? [],
    seasonStats: extras?.seasonStats ?? [],
  };
}

function parseRecentMatches(gamelog: Awaited<ReturnType<typeof fetchEspnAthleteGamelog>>): PlayerRecentMatch[] {
  const events = gamelog.events ?? {};
  const labels = gamelog.labels ?? [];
  const names = gamelog.names ?? [];
  const goalsIdx = names.indexOf("totalGoals");
  const assistsIdx = names.indexOf("goalAssists");

  const entries: Array<{ eventId: string; stats: string[] }> = [];
  for (const seasonType of gamelog.seasonTypes ?? []) {
    for (const category of seasonType.categories ?? []) {
      for (const evt of category.events ?? []) {
        entries.push({ eventId: evt.eventId, stats: evt.stats ?? [] });
      }
    }
  }

  return entries
    .map(({ eventId, stats }) => {
      const meta = events[eventId];
      if (!meta?.gameDate) return null;

      const date = meta.gameDate.slice(0, 10);
      const goals = goalsIdx >= 0 ? parseInt(stats[goalsIdx] ?? "0", 10) || 0 : 0;
      const assists = assistsIdx >= 0 ? parseInt(stats[assistsIdx] ?? "0", 10) || 0 : 0;

      return {
        eventId,
        date,
        opponent: meta.opponent?.displayName ?? "TBD",
        score: meta.score ?? "",
        result: meta.gameResult ?? "",
        competition: meta.leagueName ?? "",
        goals,
        assists,
      };
    })
    .filter((m): m is PlayerRecentMatch => m !== null)
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 8);
}

async function enrichPlayerProfile(entry: PlayerAccumulator): Promise<PlayerWorldCupProfile> {
  if (!entry.espnId) return toProfile(entry);

  try {
    const [athleteRes, gamelog] = await Promise.all([
      fetchEspnAthlete(entry.espnId),
      fetchEspnAthleteGamelog(entry.espnId).catch(() => null),
    ]);

    const athlete = athleteRes.athlete;
    if (!athlete) return toProfile(entry);

    const seasonStats =
      athlete.statsSummary?.statistics?.map((stat) => ({
        name: stat.displayName ?? stat.name,
        displayValue: stat.displayValue,
      })) ?? [];

    return toProfile(entry, {
      club: athlete.team?.displayName ?? entry.club,
      clubLogo: athlete.team?.logos?.[0]?.href ?? entry.clubLogo,
      displayHeight: athlete.displayHeight ?? entry.displayHeight,
      displayWeight: athlete.displayWeight ?? entry.displayWeight,
      dateOfBirth: athlete.displayDOB ?? entry.dateOfBirth,
      birthPlace: formatBirthPlace(athlete.birthPlace ?? undefined) ?? entry.birthPlace,
      age: athlete.age ?? entry.age,
      seasonStats,
      recentMatches: gamelog ? parseRecentMatches(gamelog) : [],
    });
  } catch {
    return toProfile(entry);
  }
}

function findPlayer(
  index: Map<string, PlayerAccumulator>,
  playerKey: string
): PlayerAccumulator | undefined {
  const key = playerKey.trim();
  const direct = index.get(key);
  if (direct) return direct;

  const normalized = key.toLowerCase();
  for (const entry of index.values()) {
    if (entry.slug === normalized || entry.espnId === key) {
      return entry;
    }
  }

  return undefined;
}

export async function getPlayerWorldCupProfile(
  playerKey: string
): Promise<PlayerWorldCupProfile | null> {
  const index = await getPlayerIndex();
  const entry = findPlayer(index, playerKey);
  if (!entry) return null;
  return enrichPlayerProfile(entry);
}

export async function getTopScorers(limit = 48): Promise<PlayerListItem[]> {
  const { getTournamentLeaders } = await import("./tournament-stats");
  const leaders = await getTournamentLeaders();
  return leaders.scorers.slice(0, limit).map((p) => ({
    id: p.id,
    slug: p.slug,
    name: p.name,
    teamCode: p.teamCode,
    teamName: p.teamName,
    flag: p.flag,
    goals: p.goals,
    position: p.position,
    number: p.number,
    headshot: p.headshot,
  }));
}

export { getTournamentLeaders } from "./tournament-stats";
export type { TournamentLeaderEntry, TournamentLeaders } from "./tournament-stats";

export async function getPlayersByCountry(): Promise<PlayerCountrySection[]> {
  const index = await getPlayerIndex();
  const byCountry = new Map<string, PlayerCountrySection>();

  for (const entry of index.values()) {
    const code = entry.teamCode;
    let section = byCountry.get(code);
    if (!section) {
      section = {
        teamCode: code,
        teamName: entry.teamName,
        flag: entry.flag,
        players: [],
      };
      byCountry.set(code, section);
    }
    section.players.push(toListItem(entry));
  }

  return [...byCountry.values()]
    .map((section) => ({
      ...section,
      players: section.players.sort(sortPlayers),
    }))
    .sort((a, b) => a.teamName.localeCompare(b.teamName));
}

export async function getPlayersByTeamCode(teamCode: string): Promise<PlayerListItem[]> {
  const code = resolveTeamCode(teamCode) ?? teamCode.toUpperCase();
  const index = await getPlayerIndex();
  return [...index.values()]
    .filter((entry) => entry.teamCode === code)
    .map(toListItem)
    .sort(sortPlayers);
}

/** Fast squad list for a single nation - roster + tournament goal counts */
export async function fetchTeamSquadPlayers(teamCode: string): Promise<PlayerListItem[]> {
  const code = resolveTeamCode(teamCode) ?? teamCode.toUpperCase();
  const teamsResponse = await fetchEspnTeams();
  const teams = teamsResponse.sports?.[0]?.leagues?.[0]?.teams ?? [];
  const teamEntry = teams.find((t) => {
    const abbrev = resolveTeamCode(t.team.abbreviation) ?? t.team.abbreviation.toUpperCase();
    return abbrev === code;
  });
  if (!teamEntry) return [];

  const roster = await fetchEspnTeamRoster(teamEntry.team.id);
  const teamName = getTeamName(code) || teamEntry.team.displayName;
  const flag = getTeamFlag(code);

  return (roster.athletes ?? [])
    .filter((a) => a.id && a.displayName)
    .map((a) => ({
      id: a.id!,
      slug: slugifyPlayerName(a.displayName!),
      name: a.displayName!,
      teamCode: code,
      teamName,
      flag,
      goals: 0,
      position:
        a.position?.displayName ??
        a.position?.abbreviation ??
        a.position?.name ??
        "Player",
      number: parseInt(a.jersey ?? "0", 10) || 0,
      headshot: a.headshot?.href,
    }))
    .sort(sortPlayers);
}

export async function getTeamSquadPlayers(teamCode: string): Promise<PlayerListItem[]> {
  const code = resolveTeamCode(teamCode) ?? teamCode.toUpperCase();

  const [fromIndex, fromRoster, leaders] = await Promise.all([
    getPlayersByTeamCode(code).catch(() => [] as PlayerListItem[]),
    fetchTeamSquadPlayers(code).catch(() => [] as PlayerListItem[]),
    import("./tournament-stats")
      .then((m) => m.getTournamentLeaders())
      .catch(() => null),
  ]);

  const base = fromIndex.length > 0 ? fromIndex : fromRoster;
  if (base.length === 0) return [];

  if (!leaders) return base;

  const statsById = new Map(
    leaders.scorers
      .filter((p) => p.teamCode === code)
      .map((p) => [p.id, { goals: p.goals, headshot: p.headshot }])
  );

  return base.map((player) => {
    const stats = statsById.get(player.id);
    if (!stats) return player;
    return {
      ...player,
      goals: stats.goals > 0 ? stats.goals : player.goals,
      headshot: player.headshot ?? stats.headshot,
    };
  });
}

export async function getAllPlayerSlugs(): Promise<Array<{ id: string; slug: string }>> {
  const index = await getPlayerIndex();
  return [...index.values()].map((p) => ({
    id: p.espnId,
    slug: p.slug,
  }));
}

export function getPlayerPath(player: { id: string; slug?: string; espnId?: string }): string {
  return `/players/${player.espnId ?? player.id}`;
}
