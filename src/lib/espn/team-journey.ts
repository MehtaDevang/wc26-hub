import { fetchEspnScoreboard } from "./client";
import { transformEvents } from "./transform";
import { fetchAllGroupStandings } from "./standings";
import { getTeamDisplay, resolveTeamCode, teamsMatch } from "../team-lookup";
import type { GroupStandings, Match, TeamJourney, TeamJourneyMatch, TeamMatchResult } from "../types";

const TOURNAMENT_DATES = "20260611-20260719";

async function withTimeout<T>(promise: Promise<T>, ms = 8_000): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error("Request timed out")), ms)
    ),
  ]);
}

function parseStage(group: string, matchName?: string): string {
  if (group !== "?") return "Group Stage";
  const name = (matchName ?? "").toLowerCase();
  if (name.includes("final")) return "Final";
  if (name.includes("semi")) return "Semi-Final";
  if (name.includes("quarter")) return "Quarter-Final";
  if (name.includes("round of 16") || name.includes("round of sixteen")) return "Round of 16";
  if (name.includes("third place")) return "Third Place";
  return "Knockout";
}

function getMatchResult(
  isHome: boolean,
  homeScore: number,
  awayScore: number
): TeamMatchResult {
  const gf = isHome ? homeScore : awayScore;
  const ga = isHome ? awayScore : homeScore;
  if (gf > ga) return "W";
  if (gf < ga) return "L";
  return "D";
}

function matchToJourneyEntry(match: Match, teamCode: string, teamName: string): TeamJourneyMatch | null {
  const isHome = teamsMatch(match.home, match.homeName, teamCode, teamName);
  const isAway = teamsMatch(match.away, match.awayName, teamCode, teamName);
  if (!isHome && !isAway) return null;

  const opponentCode = isHome ? match.away : match.home;
  const opponentName = isHome ? match.awayName : match.homeName;
  const opponentLogo = isHome ? match.awayLogo : match.homeLogo;

  let result: TeamMatchResult = "upcoming";
  let goalsFor: number | undefined;
  let goalsAgainst: number | undefined;

  if (match.status === "live") {
    result = "live";
    goalsFor = isHome ? match.homeScore : match.awayScore;
    goalsAgainst = isHome ? match.awayScore : match.homeScore;
  } else if (match.status === "finished" && match.homeScore !== undefined && match.awayScore !== undefined) {
    goalsFor = isHome ? match.homeScore : match.awayScore;
    goalsAgainst = isHome ? match.awayScore : match.homeScore;
    result = getMatchResult(isHome, match.homeScore, match.awayScore);
  }

  return {
    matchId: match.id,
    date: match.date,
    time: match.time,
    kickoffAt: match.kickoffAt,
    opponent: opponentName,
    opponentCode,
    opponentLogo,
    isHome,
    goalsFor,
    goalsAgainst,
    result,
    venue: match.venue,
    venueCity: match.venueCity,
    group: match.group,
    stage: parseStage(match.group),
    displayClock: match.displayClock,
  };
}

function findStanding(
  standings: GroupStandings[],
  teamCode: string,
  teamName: string
): { group: string; row: GroupStandings["rows"][0] } | undefined {
  for (const group of standings) {
    const row = group.rows.find(
      (r) =>
        teamsMatch(r.teamCode ?? "", r.team, teamCode, teamName) ||
        resolveTeamCode(r.team) === teamCode
    );
    if (row) return { group: group.group, row };
  }
  return undefined;
}

function buildForm(matches: TeamJourneyMatch[]): string {
  return matches
    .filter((m) => m.result === "W" || m.result === "D" || m.result === "L")
    .sort((a, b) => a.date.localeCompare(b.date))
    .map((m) => m.result)
    .join("");
}

export async function getTeamJourney(
  teamKey: string,
  timeZone = "UTC"
): Promise<TeamJourney | null> {
  const teamCode = resolveTeamCode(teamKey) ?? teamKey.toUpperCase();
  const teamName = getTeamDisplay(teamCode).name;

  const [scoreboard, standings] = await Promise.all([
    withTimeout(fetchEspnScoreboard({ dates: TOURNAMENT_DATES })),
    fetchAllGroupStandings(),
  ]);

  const allMatches = transformEvents(scoreboard.events ?? [], timeZone);
  const journeyMatches = allMatches
    .map((m) => matchToJourneyEntry(m, teamCode, teamName))
    .filter((m): m is TeamJourneyMatch => m !== null)
    .sort((a, b) => a.date.localeCompare(b.date) || a.time.localeCompare(b.time));

  if (journeyMatches.length === 0) {
    const standingOnly = findStanding(standings, teamCode, teamName);
    if (!standingOnly) return null;
  }

  const standing = findStanding(standings, teamCode, teamName);
  const finished = journeyMatches.filter((m) => m.result !== "upcoming");
  const upcoming = journeyMatches.filter((m) => m.result === "upcoming");
  const live = journeyMatches.filter((m) => m.result === "live");

  const goalsFor = finished.reduce((sum, m) => sum + (m.goalsFor ?? 0), 0);
  const goalsAgainst = finished.reduce((sum, m) => sum + (m.goalsAgainst ?? 0), 0);

  const teamLogo = allMatches.find(
    (m) =>
      teamsMatch(m.home, m.homeName, teamCode, teamName) ||
      teamsMatch(m.away, m.awayName, teamCode, teamName)
  );
  const logo = teamLogo
    ? teamsMatch(teamLogo.home, teamLogo.homeName, teamCode, teamName)
      ? teamLogo.homeLogo
      : teamLogo.awayLogo
    : undefined;

  const display = getTeamDisplay(teamCode, teamName, logo);

  return {
    teamCode: display.code,
    teamName: standing?.row.team ?? display.name,
    flag: display.flag,
    logo: display.logo,
    group: standing?.group ?? (journeyMatches[0]?.group !== "?" ? `Group ${journeyMatches[0]?.group}` : "Tournament"),
    rank: standing?.row.rank,
    standing: standing?.row,
    matches: journeyMatches,
    stats: standing
      ? {
          played: standing.row.played,
          won: standing.row.won,
          drawn: standing.row.drawn,
          lost: standing.row.lost,
          goalsFor,
          goalsAgainst,
          goalDiff: parseInt(standing.row.goalDiff, 10) || goalsFor - goalsAgainst,
          points: standing.row.points,
        }
      : {
          played: finished.length,
          won: finished.filter((m) => m.result === "W").length,
          drawn: finished.filter((m) => m.result === "D").length,
          lost: finished.filter((m) => m.result === "L").length,
          goalsFor,
          goalsAgainst,
          goalDiff: goalsFor - goalsAgainst,
          points:
            finished.filter((m) => m.result === "W").length * 3 +
            finished.filter((m) => m.result === "D").length,
        },
    form: buildForm(journeyMatches),
    nextMatch: live[0] ?? upcoming[0],
  };
}
