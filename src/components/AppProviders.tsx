"use client";

import { TeamJourneyProvider } from "./TeamJourneyProvider";
import { PwaRegister } from "./PwaRegister";
import { InstallPrompt } from "./InstallPrompt";

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <TeamJourneyProvider>
      <PwaRegister />
      {children}
      <InstallPrompt />
    </TeamJourneyProvider>
  );
}
