import { TEAMS } from "./data";

export const MY_TEAMS_KEY = "wc26_my_teams";
export const MAX_MY_TEAMS = 3;

function read(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(MY_TEAMS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter((code): code is string => typeof code === "string")
      .map((code) => code.toUpperCase())
      .filter((code) => code in TEAMS)
      .slice(0, MAX_MY_TEAMS);
  } catch {
    return [];
  }
}

function write(codes: string[]): void {
  localStorage.setItem(MY_TEAMS_KEY, JSON.stringify(codes));
}

export function getMyTeams(): string[] {
  return read();
}

export function isMyTeam(code: string): boolean {
  return read().includes(code.toUpperCase());
}

export function setMyTeams(codes: string[]): string[] {
  const clean = [...new Set(codes.map((c) => c.toUpperCase()))]
    .filter((code) => code in TEAMS)
    .slice(0, MAX_MY_TEAMS);
  write(clean);
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event("wc26-my-teams-changed"));
  }
  return clean;
}

export function toggleMyTeam(code: string): string[] {
  const upper = code.toUpperCase();
  if (!(upper in TEAMS)) return read();

  const current = read();
  let next: string[];

  if (current.includes(upper)) {
    next = current.filter((c) => c !== upper);
  } else if (current.length >= MAX_MY_TEAMS) {
    next = [...current.slice(1), upper];
  } else {
    next = [...current, upper];
  }

  write(next);
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event("wc26-my-teams-changed"));
  }
  return next;
}
