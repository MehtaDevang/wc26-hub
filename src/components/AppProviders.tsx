"use client";

import { TeamJourneyProvider } from "./TeamJourneyProvider";

export function AppProviders({ children }: { children: React.ReactNode }) {
  return <TeamJourneyProvider>{children}</TeamJourneyProvider>;
}
