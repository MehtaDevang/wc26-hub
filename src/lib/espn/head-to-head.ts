import type { EspnSummary } from "./client";
import type { HeadToHeadMatch, HeadToHeadRecord, Match } from "../types";

interface ParsedMeeting {
  id: string;
  date: string;
  homeTeam: string;
  awayTeam: string;
  homeScore: number;
  awayScore: number;
  competition: string;
  round?: string;
  isWorldCup: boolean;
}

function normalizeTeamName(name: string): string {
  return name
    .toLowerCase()
    .replace(/\s+/g, " ")
    .replace(/[^a-z0-9\s]/g, "")
    .trim();
}

function namesMatch(a: string, b: string): boolean {
  const na = normalizeTeamName(a);
  const nb = normalizeTeamName(b);
  if (!na || !nb) return false;
  if (na === nb) return true;
  if (na.includes(nb) || nb.includes(na)) return true;
  return false;
}

function isFixtureHome(teamName: string, match: Match): boolean {
  return namesMatch(teamName, match.homeName) || namesMatch(teamName, match.home);
}

function parseMeetingTeams(
  perspectiveTeam: string,
  perspectiveId: string | undefined,
  ev: NonNullable<NonNullable<EspnSummary["headToHeadGames"]>[number]["events"]>[number]
): { homeTeam: string; awayTeam: string } {
  const opponent = ev.opponent?.displayName ?? "Opponent";
  const homeId = ev.homeTeamId;
  const awayId = ev.awayTeamId;

  if (perspectiveId && homeId && awayId) {
    if (String(perspectiveId) === String(homeId)) {
      return { homeTeam: perspectiveTeam, awayTeam: opponent };
    }
    if (String(perspectiveId) === String(awayId)) {
      return { homeTeam: opponent, awayTeam: perspectiveTeam };
    }
  }

  if (ev.atVs === "@") {
    return { homeTeam: opponent, awayTeam: perspectiveTeam };
  }

  return { homeTeam: perspectiveTeam, awayTeam: opponent };
}

function parseMeetings(summary: EspnSummary): ParsedMeeting[] {
  const byId = new Map<string, ParsedMeeting>();

  for (const block of summary.headToHeadGames ?? []) {
    const perspectiveTeam = block.team?.displayName ?? "";
    const perspectiveId = block.team?.id;

    for (const ev of block.events ?? []) {
      const id = ev.id ?? `${ev.gameDate}-${ev.score}-${perspectiveTeam}`;
      if (byId.has(id)) continue;

      const { homeTeam, awayTeam } = parseMeetingTeams(
        perspectiveTeam,
        perspectiveId,
        ev
      );
      const homeScore = parseInt(ev.homeTeamScore ?? "0", 10) || 0;
      const awayScore = parseInt(ev.awayTeamScore ?? "0", 10) || 0;
      const competition =
        ev.competitionName ?? ev.leagueName ?? "International";
      const leagueText = `${ev.leagueName ?? ""} ${ev.competitionName ?? ""}`;

      byId.set(id, {
        id,
        date: ev.gameDate?.slice(0, 10) ?? "",
        homeTeam,
        awayTeam,
        homeScore,
        awayScore,
        competition,
        round: ev.roundName,
        isWorldCup: /world cup/i.test(leagueText) || /world cup/i.test(competition),
      });
    }
  }

  return [...byId.values()].sort((a, b) => b.date.localeCompare(a.date));
}

function goalsForFixtureHome(meeting: ParsedMeeting, match: Match): {
  homeGoals: number;
  awayGoals: number;
  resultForHome: "W" | "D" | "L";
} {
  if (isFixtureHome(meeting.homeTeam, match)) {
    const homeGoals = meeting.homeScore;
    const awayGoals = meeting.awayScore;
    return {
      homeGoals,
      awayGoals,
      resultForHome:
        homeGoals > awayGoals ? "W" : homeGoals < awayGoals ? "L" : "D",
    };
  }

  if (isFixtureHome(meeting.awayTeam, match)) {
    const homeGoals = meeting.awayScore;
    const awayGoals = meeting.homeScore;
    return {
      homeGoals,
      awayGoals,
      resultForHome:
        homeGoals > awayGoals ? "W" : homeGoals < awayGoals ? "L" : "D",
    };
  }

  return { homeGoals: 0, awayGoals: 0, resultForHome: "D" };
}

function formatMeetingDate(dateKey: string): string {
  if (!dateKey) return "";
  try {
    return new Date(`${dateKey}T12:00:00`).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return dateKey;
  }
}

function buildNarrative(
  match: Match,
  record: Omit<HeadToHeadRecord, "summary">
): string {
  if (record.totalMeetings === 0) {
    return `No previous meetings on record between ${match.homeName} and ${match.awayName}.`;
  }

  const parts: string[] = [];
  const leader =
    record.homeWins > record.awayWins
      ? match.homeName
      : record.awayWins > record.homeWins
        ? match.awayName
        : null;

  if (leader && record.draws === 0) {
    const leaderWins =
      record.homeWins > record.awayWins ? record.homeWins : record.awayWins;
    const trailerWins =
      record.homeWins > record.awayWins ? record.awayWins : record.homeWins;
    parts.push(
      `${leader} lead the all-time head-to-head ${leaderWins}–${trailerWins} across ${record.totalMeetings} meetings.`
    );
  } else if (leader) {
    const leaderWins =
      record.homeWins > record.awayWins ? record.homeWins : record.awayWins;
    const trailerWins =
      record.homeWins > record.awayWins ? record.awayWins : record.homeWins;
    parts.push(
      `${leader} edge the head-to-head ${leaderWins}–${trailerWins} with ${record.draws} draw${record.draws === 1 ? "" : "s"} in ${record.totalMeetings} meetings.`
    );
  } else {
    parts.push(
      `These sides are level in the head-to-head with ${record.homeWins} win${record.homeWins === 1 ? "" : "s"} apiece and ${record.draws} draw${record.draws === 1 ? "" : "s"} from ${record.totalMeetings} meetings.`
    );
  }

  if (record.homeGoals + record.awayGoals > 0) {
    parts.push(
      `Overall goals: ${match.homeName} ${record.homeGoals}, ${match.awayName} ${record.awayGoals}.`
    );
  }

  if (record.worldCupMeetings > 0) {
    if (record.worldCupMeetings === 1 && record.worldCupDraws === 1) {
      parts.push("Their only previous World Cup meeting ended in a draw.");
    } else {
      parts.push(
        `At the World Cup: ${record.worldCupMeetings} meeting${record.worldCupMeetings === 1 ? "" : "s"} (${match.homeName} ${record.worldCupHomeWins}W, ${record.worldCupDraws}D, ${match.awayName} ${record.worldCupAwayWins}W).`
      );
    }
  }

  return parts.join(" ");
}

export function buildHeadToHead(
  match: Match,
  summary: EspnSummary
): { meetings: HeadToHeadMatch[]; record: HeadToHeadRecord } {
  const parsed = parseMeetings(summary);

  let homeWins = 0;
  let awayWins = 0;
  let draws = 0;
  let homeGoals = 0;
  let awayGoals = 0;
  let worldCupMeetings = 0;
  let worldCupHomeWins = 0;
  let worldCupAwayWins = 0;
  let worldCupDraws = 0;

  const meetings: HeadToHeadMatch[] = parsed.map((m) => {
    const { homeGoals: hg, awayGoals: ag, resultForHome } = goalsForFixtureHome(
      m,
      match
    );

    homeGoals += hg;
    awayGoals += ag;

    if (resultForHome === "W") homeWins++;
    else if (resultForHome === "L") awayWins++;
    else draws++;

    if (m.isWorldCup) {
      worldCupMeetings++;
      if (resultForHome === "W") worldCupHomeWins++;
      else if (resultForHome === "L") worldCupAwayWins++;
      else worldCupDraws++;
    }

    const opponent = isFixtureHome(m.homeTeam, match) ? m.awayTeam : m.homeTeam;

    return {
      id: m.id,
      date: formatMeetingDate(m.date),
      score: `${m.homeScore}-${m.awayScore}`,
      homeTeam: m.homeTeam,
      awayTeam: m.awayTeam,
      homeScore: m.homeScore,
      awayScore: m.awayScore,
      competition: m.competition,
      round: m.round,
      isWorldCup: m.isWorldCup,
      resultForHome,
      opponent,
      result: resultForHome,
    };
  });

  const recordBase = {
    totalMeetings: meetings.length,
    homeWins,
    awayWins,
    draws,
    homeGoals,
    awayGoals,
    worldCupMeetings,
    worldCupHomeWins,
    worldCupAwayWins,
    worldCupDraws,
  };

  return {
    meetings,
    record: {
      ...recordBase,
      summary: buildNarrative(match, recordBase),
    },
  };
}
