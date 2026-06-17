import { unstable_cache } from "next/cache";
import { fetchEspnScoreboard, fetchEspnSummary } from "./client";
import { transformEvent } from "./transform";
import { extractScorerName } from "./highlight-images";
import { resolveTeamCode } from "../team-lookup";
import { getTeamFlag } from "../teams";

const ESPN_STATS_URL = "https://site.api.espn.com/apis/site/v2/sports/soccer/fifa.world/statistics";
const TOURNAMENT_DATES = "20260611-20260719";

function slugifyPlayerName(name: string): string {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export interface TournamentLeaderEntry {
  id: string;
  slug: string;
  name: string;
  teamCode: string;
  teamName: string;
  flag: string;
  goals: number;
  assists: number;
  appearances: number;
  yellowCards: number;
  redCards: number;
  position: string;
  number: number;
  headshot?: string;
  teamLogo?: string;
}

export interface TournamentLeaders {
  scorers: TournamentLeaderEntry[];
  assists: TournamentLeaderEntry[];
  appearances: TournamentLeaderEntry[];
  yellowCards: TournamentLeaderEntry[];
  redCards: TournamentLeaderEntry[];
  updatedAt: string;
}

interface EspnStatLeader {
  displayValue: string;
  shortDisplayValue?: string;
  value: number;
  athlete: {
    id: string;
    displayName: string;
    shortName?: string;
    jersey?: string;
    team?: {
      abbreviation?: string;
      displayName?: string;
      logos?: Array<{ href?: string; rel?: string[] }>;
    };
    statistics?: Array<{
      name: string;
      value: number;
      displayValue: string;
    }>;
  };
}

interface EspnTournamentStatisticsResponse {
  stats?: Array<{
    name: string;
    displayName: string;
    leaders?: EspnStatLeader[];
  }>;
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

function statValue(
  athlete: EspnStatLeader["athlete"],
  name: string
): number {
  const row = athlete.statistics?.find((s) => s.name === name);
  return row?.value ?? 0;
}

function teamLogoUrl(team?: EspnStatLeader["athlete"]["team"]): string | undefined {
  const logo = team?.logos?.find((l) => l.rel?.includes("full") && l.rel?.includes("default"));
  return logo?.href;
}

function leaderToEntry(
  leader: EspnStatLeader,
  stat: "goals" | "assists"
): TournamentLeaderEntry {
  const athlete = leader.athlete;
  const teamCode =
    resolveTeamCode(athlete.team?.abbreviation ?? "") ??
    (athlete.team?.abbreviation ?? "").toUpperCase();
  const teamName = athlete.team?.displayName ?? teamCode;
  const goals = stat === "goals" ? leader.value : statValue(athlete, "totalGoals");
  const assists = stat === "assists" ? leader.value : statValue(athlete, "goalAssists");
  const appearances = statValue(athlete, "appearances");

  return {
    id: athlete.id,
    slug: slugifyPlayerName(athlete.displayName),
    name: athlete.displayName,
    teamCode,
    teamName,
    flag: getTeamFlag(teamCode),
    goals: Math.round(goals),
    assists: Math.round(assists),
    appearances: Math.round(appearances),
    yellowCards: 0,
    redCards: 0,
    position: "Player",
    number: parseInt(athlete.jersey ?? "0", 10) || 0,
    teamLogo: teamLogoUrl(athlete.team),
  };
}

function parseAssist(text?: string): string | undefined {
  if (!text) return undefined;
  const match = text.match(/Assisted by ([^.]+)/i);
  return match ? match[1].trim() : undefined;
}

function isScoringEvent(eventType: string, scoringPlay?: boolean): boolean {
  if (eventType === "own-goal") return false;
  return (
    scoringPlay === true ||
    eventType === "goal" ||
    eventType === "penalty-goal"
  );
}

function sortScorers(entries: TournamentLeaderEntry[]): TournamentLeaderEntry[] {
  return [...entries]
    .filter((e) => e.goals > 0)
    .sort(
      (a, b) =>
        b.goals - a.goals ||
        b.assists - a.assists ||
        a.name.localeCompare(b.name)
    );
}

function sortAssists(entries: TournamentLeaderEntry[]): TournamentLeaderEntry[] {
  return [...entries]
    .filter((e) => e.assists > 0)
    .sort(
      (a, b) =>
        b.assists - a.assists ||
        b.goals - a.goals ||
        a.name.localeCompare(b.name)
    );
}

async function fetchEspnTournamentStatistics(): Promise<EspnTournamentStatisticsResponse> {
  const res = await fetch(ESPN_STATS_URL, {
    next: { revalidate: 120 },
    signal: AbortSignal.timeout(10_000),
  });
  if (!res.ok) throw new Error(`ESPN tournament statistics failed: ${res.status}`);
  return res.json();
}

function leadersFromCategory(
  data: EspnTournamentStatisticsResponse,
  category: string,
  stat: "goals" | "assists",
  limit = 25
): TournamentLeaderEntry[] {
  const group = data.stats?.find((s) => s.name === category);
  return (group?.leaders ?? [])
    .slice(0, limit)
    .map((leader) => leaderToEntry(leader, stat));
}

async function fetchMatchDerivedLeaders(): Promise<{
  scorers: TournamentLeaderEntry[];
  assists: TournamentLeaderEntry[];
  yellowCards: TournamentLeaderEntry[];
  redCards: TournamentLeaderEntry[];
  appearances: TournamentLeaderEntry[];
  headshots: Map<string, string>;
}> {
  const scoreboard = await fetchEspnScoreboard({ dates: TOURNAMENT_DATES });
  const finished = (scoreboard.events ?? []).filter(
    (e) => e.competitions[0]?.status.type.state === "post"
  );

  const byId = new Map<
    string,
    TournamentLeaderEntry & { _apps: Set<string> }
  >();
  const nameIndex = new Map<string, string>();

  function nameKey(teamCode: string, name: string): string {
    return `${teamCode}:${slugifyPlayerName(name)}`;
  }

  function resolvePlayerId(
    athleteId: string | undefined,
    name: string,
    teamCode: string
  ): string {
    if (athleteId) return athleteId;
    const indexed = nameIndex.get(nameKey(teamCode, name));
    if (indexed) return indexed;
    return nameKey(teamCode, name);
  }

  function upsert(
    athleteId: string,
    name: string,
    teamAbbrev: string,
    teamDisplay: string,
    jersey?: string
  ) {
    const teamCode = resolveTeamCode(teamAbbrev) ?? teamAbbrev.toUpperCase();
    let row = byId.get(athleteId);
    if (!row) {
      row = {
        id: athleteId,
        slug: slugifyPlayerName(name),
        name,
        teamCode,
        teamName: teamDisplay || teamCode,
        flag: getTeamFlag(teamCode),
        goals: 0,
        assists: 0,
        appearances: 0,
        yellowCards: 0,
        redCards: 0,
        position: "Player",
        number: parseInt(jersey ?? "0", 10) || 0,
        _apps: new Set(),
      };
      byId.set(athleteId, row);
    } else {
      row.name = name;
      if (jersey && row.number === 0) {
        row.number = parseInt(jersey, 10) || 0;
      }
    }
    nameIndex.set(nameKey(teamCode, name), athleteId);
    return row;
  }

  await mapWithConcurrency(finished, 8, async (event) => {
    try {
      const summary = await fetchEspnSummary(event.id);
      const match = transformEvent(event);

      for (const roster of summary.rosters ?? []) {
        const side = roster.homeAway;
        const teamAbbrev = side === "home" ? match.home : match.away;
        const teamDisplay = side === "home" ? match.homeName : match.awayName;

        for (const entry of roster.roster ?? []) {
          const athlete = entry.athlete;
          if (!athlete?.id || !athlete.displayName) continue;
          const row = upsert(
            athlete.id,
            athlete.displayName,
            teamAbbrev,
            teamDisplay,
            entry.jersey
          );
          row._apps.add(event.id);
          if (athlete.headshot?.href) row.headshot = athlete.headshot.href;
        }
      }

      for (const keyEvent of summary.keyEvents ?? []) {
        const eventType = keyEvent.type?.type ?? "";

        if (isScoringEvent(eventType, keyEvent.scoringPlay)) {
          const scorerName =
            keyEvent.athlete?.displayName ?? extractScorerName(keyEvent);
          if (scorerName) {
            const teamName = keyEvent.team?.displayName ?? "";
            const teamAbbrev =
              resolveTeamCode(teamName) ??
              (teamName === match.homeName ? match.home : match.away);
            const scorerId = resolvePlayerId(
              keyEvent.athlete?.id,
              scorerName,
              resolveTeamCode(teamAbbrev) ?? teamAbbrev.toUpperCase()
            );
            const row = upsert(
              scorerId,
              scorerName,
              teamAbbrev,
              teamName,
              keyEvent.athlete?.jersey
            );
            row.goals += 1;

            const assistName = parseAssist(keyEvent.text);
            if (assistName) {
              const assistId = resolvePlayerId(
                undefined,
                assistName,
                resolveTeamCode(teamAbbrev) ?? teamAbbrev.toUpperCase()
              );
              const assistRow = upsert(
                assistId,
                assistName,
                teamAbbrev,
                teamName
              );
              assistRow.assists += 1;
            }
          }
        }

        const athlete = keyEvent.athlete;
        if (!athlete?.displayName) continue;
        const teamName = keyEvent.team?.displayName ?? "";
        const teamAbbrev =
          resolveTeamCode(teamName) ??
          (teamName === match.homeName ? match.home : match.away);
        const athleteId = resolvePlayerId(
          athlete.id,
          athlete.displayName,
          resolveTeamCode(teamAbbrev) ?? teamAbbrev.toUpperCase()
        );
        const row = upsert(
          athleteId,
          athlete.displayName,
          teamAbbrev,
          teamName,
          athlete.jersey
        );
        if (eventType === "yellow-card") row.yellowCards += 1;
        if (eventType === "red-card") row.redCards += 1;
      }
    } catch {
      // skip unavailable summaries
    }
  });

  const entries = [...byId.values()].map(({ _apps, ...row }) => ({
    ...row,
    appearances: _apps.size,
  }));

  const headshots = new Map<string, string>();
  for (const [id, row] of byId) {
    if (row.headshot) headshots.set(id, row.headshot);
  }

  return {
    scorers: sortScorers(entries).slice(0, 25),
    assists: sortAssists(entries).slice(0, 25),
    yellowCards: entries
      .filter((e) => e.yellowCards > 0)
      .sort((a, b) => b.yellowCards - a.yellowCards || a.name.localeCompare(b.name))
      .slice(0, 15),
    redCards: entries
      .filter((e) => e.redCards > 0)
      .sort((a, b) => b.redCards - a.redCards || a.name.localeCompare(b.name))
      .slice(0, 15),
    appearances: entries
      .filter((e) => e.appearances > 0)
      .sort((a, b) => b.appearances - a.appearances || a.name.localeCompare(b.name))
      .slice(0, 15),
    headshots,
  };
}

export async function computeTournamentLeaders(): Promise<TournamentLeaders> {
  const [stats, derived] = await Promise.all([
    fetchEspnTournamentStatistics().catch(() => ({ stats: [] } as EspnTournamentStatisticsResponse)),
    fetchMatchDerivedLeaders().catch(() => ({
      scorers: [] as TournamentLeaderEntry[],
      assists: [] as TournamentLeaderEntry[],
      yellowCards: [] as TournamentLeaderEntry[],
      redCards: [] as TournamentLeaderEntry[],
      appearances: [] as TournamentLeaderEntry[],
      headshots: new Map<string, string>(),
    })),
  ]);

  const espnScorers = leadersFromCategory(stats, "goalsLeaders", "goals", 25);
  const espnAssists = leadersFromCategory(stats, "assistsLeaders", "assists", 25);

  // Match summaries update faster than ESPN's aggregate statistics feed.
  const scorers = derived.scorers.length > 0 ? derived.scorers : espnScorers;
  const assists = derived.assists.length > 0 ? derived.assists : espnAssists;

  const disciplineMap = new Map(
    [
      ...derived.yellowCards,
      ...derived.redCards,
      ...derived.appearances,
      ...espnScorers,
      ...espnAssists,
    ].map((e) => [e.id, e])
  );

  for (const list of [scorers, assists]) {
    for (const row of list) {
      const extra = disciplineMap.get(row.id);
      if (!extra) continue;
      if (row.yellowCards === 0) row.yellowCards = extra.yellowCards;
      if (row.redCards === 0) row.redCards = extra.redCards;
      if (row.appearances === 0) row.appearances = extra.appearances;
      if (!row.headshot && extra.headshot) row.headshot = extra.headshot;
    }
  }

  for (const list of [
    scorers,
    assists,
    derived.appearances,
    derived.yellowCards,
    derived.redCards,
  ]) {
    for (const row of list) {
      if (!row.headshot && derived.headshots.has(row.id)) {
        row.headshot = derived.headshots.get(row.id);
      }
    }
  }

  return {
    scorers,
    assists,
    appearances: derived.appearances,
    yellowCards: derived.yellowCards,
    redCards: derived.redCards,
    updatedAt: new Date().toISOString(),
  };
}

/** Cached across requests — aggregates goals from finished match summaries. */
export const getTournamentLeaders = unstable_cache(
  computeTournamentLeaders,
  ["wc26-tournament-leaders"],
  { revalidate: 60, tags: ["tournament-leaders"] }
);
