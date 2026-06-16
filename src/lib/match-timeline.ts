import type { Match, MatchEvent } from "./types";

export interface EnrichedTimelineEvent extends MatchEvent {
  sortKey: number;
  title: string;
  summary: string;
  scoreAfter?: { home: number; away: number };
}

export interface TimelinePeriod {
  id: string;
  label: string;
  scoreLabel?: string;
  events: EnrichedTimelineEvent[];
}

function eventSortKey(event: MatchEvent): number {
  const period = event.period ?? (event.minute > 45 ? 2 : 1);
  const extra = event.extraTime ?? 0;
  return period * 10_000 + event.minute * 100 + extra;
}

function parseSubstitution(text?: string): { subIn?: string; subOut?: string } {
  if (!text) return {};
  const match = text.match(/Substitution,\s*[^.]+\.\s*(.+?)\s+replaces\s+(.+?)\./i);
  if (!match) return {};
  return { subIn: match[1]?.trim(), subOut: match[2]?.trim() };
}

function cleanGoalDescription(text: string, playerName: string): string {
  const stripped = text
    .replace(/^Goal!\s*[^.]+\.\s*/i, "")
    .replace(new RegExp(`^${escapeRegex(playerName)}\\s*\\([^)]+\\)\\s*`, "i"), "")
    .trim();
  if (!stripped || stripped.length < 8) return "";
  return stripped.charAt(0).toUpperCase() + stripped.slice(1);
}

function escapeRegex(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export function getEventTitle(event: MatchEvent): string {
  if (event.milestone === "kickoff") return "Kick-off";
  if (event.milestone === "halftime") return "Half-time";
  if (event.milestone === "second-half") return "Second half";
  if (event.milestone === "fulltime") return "Full time";

  switch (event.type) {
    case "goal":
      return event.isOwnGoal ? "Own goal" : "Goal";
    case "penalty":
      return "Penalty goal";
    case "yellow":
      return "Yellow card";
    case "red":
      return "Red card";
    case "sub":
      return "Substitution";
    case "save":
      return "Save";
    default:
      return "Key moment";
  }
}

export function getEventSummary(event: MatchEvent): string {
  if (event.milestone) {
    if (event.milestone === "halftime" || event.milestone === "fulltime") {
      return event.description.replace(/^[^:]+:\s*/i, "").trim();
    }
    return event.description;
  }

  if (event.type === "sub") {
    if (event.subIn && event.subOut) {
      return `${event.subIn} replaces ${event.subOut}`;
    }
    return event.description.replace(/^Substitution,\s*[^.]+\.\s*/i, "").replace(/\.$/, "");
  }

  if (event.type === "yellow" || event.type === "red") {
    const card = event.description.match(/is shown the (?:yellow|red) card[^.]*\.?\s*(.*)/i);
    if (card?.[1]?.trim()) return card[1].trim();
    return event.description.replace(/^[^:]+:\s*/i, "").trim();
  }

  if (event.type === "goal" || event.type === "penalty") {
    const detail = cleanGoalDescription(event.description, event.playerName);
    if (event.assist) {
      return detail ? `${detail} · Assist: ${event.assist}` : `Assist: ${event.assist}`;
    }
    return detail || (event.isOwnGoal ? "Into their own net" : "Finds the net");
  }

  return event.description;
}

export function formatTimelineMinute(event: MatchEvent): string {
  if (event.milestone === "kickoff") return "0′";
  if (event.milestone === "second-half") return "46′";
  if (event.minute === 0 && !event.extraTime) return " - ";
  if (event.extraTime) return `${event.minute}+${event.extraTime}′`;
  return `${event.minute}′`;
}

function enrichEvent(event: MatchEvent): EnrichedTimelineEvent {
  return {
    ...event,
    sortKey: eventSortKey(event),
    title: getEventTitle(event),
    summary: getEventSummary(event),
  };
}

export function buildMatchTimeline(
  events: MatchEvent[],
  match: Pick<Match, "homeScore" | "awayScore" | "status">
): TimelinePeriod[] {
  const sorted = [...events]
    .map(enrichEvent)
    .sort((a, b) => a.sortKey - b.sortKey);

  let homeGoals = 0;
  let awayGoals = 0;

  for (const event of sorted) {
    if (event.type !== "goal" && event.type !== "penalty") continue;
    if (event.team === "home") {
      if (event.isOwnGoal) awayGoals += 1;
      else homeGoals += 1;
    } else if (event.team === "away") {
      if (event.isOwnGoal) homeGoals += 1;
      else awayGoals += 1;
    }
    event.scoreAfter = { home: homeGoals, away: awayGoals };
  }

  const firstHalf: EnrichedTimelineEvent[] = [];
  const secondHalf: EnrichedTimelineEvent[] = [];
  let sawHalftime = false;
  let halftimeScore: string | undefined;

  for (const event of sorted) {
    if (event.milestone === "halftime") {
      sawHalftime = true;
      if (event.description) {
        const scoreMatch = event.description.match(/(\d+)\s*,\s*[^,]+?\s+(\d+)/i);
        if (scoreMatch) halftimeScore = `${scoreMatch[1]}–${scoreMatch[2]}`;
      }
      continue;
    }
    if (event.milestone === "fulltime") continue;

    if (
      sawHalftime ||
      event.milestone === "second-half" ||
      (event.period ?? 0) >= 2 ||
      (event.minute > 45 && !event.milestone)
    ) {
      secondHalf.push(event);
    } else {
      firstHalf.push(event);
      if (event.scoreAfter) {
        halftimeScore = `${event.scoreAfter.home}–${event.scoreAfter.away}`;
      }
    }
  }

  const periods: TimelinePeriod[] = [
    { id: "first", label: "First half", events: firstHalf },
  ];

  if (sawHalftime || secondHalf.length > 0) {
    periods.push({
      id: "halftime",
      label: "Half-time",
      scoreLabel: halftimeScore,
      events: [],
    });
    periods.push({ id: "second", label: "Second half", events: secondHalf });
  }

  if (match.status === "finished") {
    periods.push({
      id: "fulltime",
      label: "Full time",
      scoreLabel:
        match.homeScore != null && match.awayScore != null
          ? `${match.homeScore}–${match.awayScore}`
          : undefined,
      events: [],
    });
  }

  return periods;
}

export { parseSubstitution };
