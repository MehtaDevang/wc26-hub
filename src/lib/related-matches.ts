import type { Match } from "./types";

export function getLiveMatchesExcluding(
  all: Match[],
  currentId: string,
  limit = 6
): Match[] {
  return all
    .filter((m) => m.id !== currentId && m.status === "live")
    .slice(0, limit);
}

export function getRelatedMatchesForMatch(
  current: Match,
  all: Match[],
  limit = 5
): Match[] {
  const others = all.filter((m) => m.id !== current.id);
  const seen = new Set<string>();
  const result: Match[] = [];

  const add = (list: Match[]) => {
    for (const m of list) {
      if (result.length >= limit || seen.has(m.id)) continue;
      seen.add(m.id);
      result.push(m);
    }
  };

  if (current.group && current.group !== "?") {
    add(
      others.filter((m) => m.group === current.group).sort((a, b) => {
        const order = { live: 0, upcoming: 1, finished: 2 };
        return order[a.status] - order[b.status];
      })
    );
  }

  add(
    others.filter(
      (m) =>
        m.home === current.home ||
        m.away === current.home ||
        m.home === current.away ||
        m.away === current.away
    )
  );

  add(others.filter((m) => m.status === "live"));
  add(others.filter((m) => m.status === "upcoming"));

  return result.slice(0, limit);
}
