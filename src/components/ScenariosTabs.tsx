"use client";

import { useState } from "react";
import { Calculator, FlaskConical } from "lucide-react";
import { GroupScenarioCalculator } from "@/components/GroupScenarioCalculator";
import { GroupWhatIfSimulator } from "@/components/GroupWhatIfSimulator";
import type { GroupStandings, Match } from "@/lib/types";

type Mode = "team" | "simulator";

export function ScenariosTabs({
  standings,
  matches,
}: {
  standings: GroupStandings[];
  matches: Match[];
}) {
  const [mode, setMode] = useState<Mode>("team");

  const tabs: { id: Mode; label: string; icon: typeof Calculator }[] = [
    { id: "team", label: "What does my team need?", icon: Calculator },
    { id: "simulator", label: "Group simulator", icon: FlaskConical },
  ];

  return (
    <div className="space-y-6">
      <div className="flex gap-1 rounded-2xl bg-zinc-100/70 p-1 w-fit max-w-full overflow-x-auto">
        {tabs.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            type="button"
            onClick={() => setMode(id)}
            className={`inline-flex items-center gap-1.5 shrink-0 rounded-xl px-4 py-2 text-sm font-semibold transition-colors ${
              mode === id
                ? "bg-white text-zinc-900 shadow-sm"
                : "text-zinc-500 hover:text-zinc-800"
            }`}
          >
            <Icon size={15} />
            {label}
          </button>
        ))}
      </div>

      {mode === "team" ? (
        <GroupScenarioCalculator standings={standings} matches={matches} />
      ) : (
        <GroupWhatIfSimulator standings={standings} matches={matches} />
      )}
    </div>
  );
}
