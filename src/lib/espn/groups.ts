import { fetchEspnScoreboard } from "./client";
import { transformEvents } from "./transform";
import { fetchAllGroupStandings } from "./standings";
import type { GroupPageData, Match } from "../types";

const TOURNAMENT_DATES = "20260611-20260719";
const GROUP_LETTERS = "ABCDEFGHIJKL".split("");

export function isValidGroupLetter(value: string): boolean {
  return GROUP_LETTERS.includes(value.toUpperCase());
}

export function normalizeGroupLetter(value: string): string {
  return value.toUpperCase();
}

export async function getGroupPageData(
  letter: string,
  timeZone = "UTC"
): Promise<GroupPageData | null> {
  const groupLetter = normalizeGroupLetter(letter);
  if (!isValidGroupLetter(groupLetter)) return null;

  const [scoreboard, standings] = await Promise.all([
    fetchEspnScoreboard({ dates: TOURNAMENT_DATES }),
    fetchAllGroupStandings(),
  ]);

  const table = standings.find((g) => g.group === `Group ${groupLetter}`);
  if (!table) return null;

  const allMatches = transformEvents(scoreboard.events ?? [], timeZone);
  const matches = allMatches
    .filter((m) => m.group === groupLetter)
    .sort((a, b) => a.date.localeCompare(b.date) || a.time.localeCompare(b.time));

  return {
    letter: groupLetter,
    label: `Group ${groupLetter}`,
    standings: table,
    matches,
  };
}

export function getAllGroupLetters(): string[] {
  return [...GROUP_LETTERS];
}

export function filterMatchesByGroup(matches: Match[], letter: string): Match[] {
  return matches.filter((m) => m.group === letter.toUpperCase());
}
