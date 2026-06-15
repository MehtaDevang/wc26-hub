export const MY_TEAMS_ONBOARDING_KEY = "wc26_my_teams_onboarding_done";

export function hasSeenMyTeamsOnboarding(): boolean {
  if (typeof window === "undefined") return true;
  return localStorage.getItem(MY_TEAMS_ONBOARDING_KEY) === "1";
}

export function markMyTeamsOnboardingSeen(): void {
  localStorage.setItem(MY_TEAMS_ONBOARDING_KEY, "1");
}
