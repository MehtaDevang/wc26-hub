"use client";

import { TeamJourneyProvider } from "./TeamJourneyProvider";
import { PwaRegister } from "./PwaRegister";
import { InstallProvider } from "./InstallProvider";
import { InstallPrompt } from "./InstallPrompt";
import { MyTeamsOnboarding } from "./MyTeamsOnboarding";

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <InstallProvider>
      <TeamJourneyProvider>
        <PwaRegister />
        {children}
        <InstallPrompt />
        <MyTeamsOnboarding />
      </TeamJourneyProvider>
    </InstallProvider>
  );
}
