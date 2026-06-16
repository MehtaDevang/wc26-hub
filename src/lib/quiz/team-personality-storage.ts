import { isQuizTeam } from "./team-personality";

const KEY = "wc26_team_personality";

export interface SavedTeamResult {
  code: string;
  answers: number[];
  completedAt: string;
}

export function getSavedTeamResult(): SavedTeamResult | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<SavedTeamResult>;
    if (
      !parsed ||
      typeof parsed.code !== "string" ||
      !isQuizTeam(parsed.code) ||
      !Array.isArray(parsed.answers)
    ) {
      return null;
    }
    return {
      code: parsed.code.toUpperCase(),
      answers: parsed.answers.filter((n) => Number.isInteger(n)),
      completedAt: typeof parsed.completedAt === "string" ? parsed.completedAt : "",
    };
  } catch {
    return null;
  }
}

export function saveTeamResult(code: string, answers: number[]): void {
  if (typeof window === "undefined") return;
  try {
    const payload: SavedTeamResult = {
      code: code.toUpperCase(),
      answers,
      completedAt: new Date().toISOString(),
    };
    localStorage.setItem(KEY, JSON.stringify(payload));
    window.dispatchEvent(new Event("wc26-team-personality-changed"));
  } catch {
    /* ignore quota / serialization errors */
  }
}

export function clearTeamResult(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(KEY);
    window.dispatchEvent(new Event("wc26-team-personality-changed"));
  } catch {
    /* ignore */
  }
}
