"use client";

import { createContext, useCallback, useContext, useState } from "react";
import { Route } from "lucide-react";
import clsx from "clsx";
import { TeamJourneyPanel } from "./TeamJourneyPanel";

interface TeamJourneyContextValue {
  openJourney: (teamCode: string) => void;
}

const TeamJourneyContext = createContext<TeamJourneyContextValue | null>(null);

export function TeamJourneyProvider({ children }: { children: React.ReactNode }) {
  const [teamKey, setTeamKey] = useState<string | null>(null);
  const openJourney = useCallback((teamCode: string) => {
    if (teamCode) setTeamKey(teamCode);
  }, []);

  return (
    <TeamJourneyContext.Provider value={{ openJourney }}>
      {children}
      <TeamJourneyPanel teamKey={teamKey} onClose={() => setTeamKey(null)} />
    </TeamJourneyContext.Provider>
  );
}

export function useTeamJourney(): TeamJourneyContextValue {
  const ctx = useContext(TeamJourneyContext);
  if (!ctx) {
    throw new Error("useTeamJourney must be used within TeamJourneyProvider");
  }
  return ctx;
}

export function TeamJourneyButton({
  teamCode,
  className,
  label = "Journey",
  compact = false,
}: {
  teamCode: string;
  className?: string;
  label?: string;
  compact?: boolean;
}) {
  const { openJourney } = useTeamJourney();

  if (!teamCode) return null;

  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        openJourney(teamCode);
      }}
      className={clsx(
        "inline-flex items-center gap-1 rounded-lg text-xs font-semibold transition-colors",
        compact
          ? "p-1.5 text-violet-600 hover:bg-violet-50"
          : "px-2.5 py-1.5 text-violet-700 bg-violet-50 hover:bg-violet-100 border border-violet-100",
        className
      )}
      title={`${label} - tournament path`}
    >
      <Route size={compact ? 14 : 13} />
      {!compact && label}
    </button>
  );
}
