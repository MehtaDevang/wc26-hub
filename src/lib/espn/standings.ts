import { fetchEspnScoreboard, fetchEspnSummary } from "./client";
import { transformEvent, transformStandings } from "./transform";
import type { GroupStandings } from "../types";

const GROUP_ORDER = "ABCDEFGHIJKL".split("");

export async function fetchAllGroupStandings(): Promise<GroupStandings[]> {
  const scoreboard = await fetchEspnScoreboard({ dates: "20260611-20260719" });
  const events = scoreboard.events ?? [];

  const eventByGroup = new Map<string, string>();
  for (const event of events) {
    const match = transformEvent(event);
    if (match.group !== "?" && !eventByGroup.has(match.group)) {
      eventByGroup.set(match.group, event.id);
    }
  }

  const tables: GroupStandings[] = [];

  await Promise.all(
    GROUP_ORDER.map(async (group) => {
      const eventId = eventByGroup.get(group);
      if (!eventId) return;
      try {
        const summary = await fetchEspnSummary(eventId);
        const table = transformStandings(summary, group);
        if (table) tables.push(table);
      } catch {
        // skip unavailable group
      }
    })
  );

  tables.sort((a, b) => a.group.localeCompare(b.group));
  return tables;
}
