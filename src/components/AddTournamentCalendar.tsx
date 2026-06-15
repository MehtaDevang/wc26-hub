"use client";

import { useEffect, useState } from "react";
import { CalendarPlus } from "lucide-react";
import type { Match } from "@/lib/types";
import { buildTournamentICS, buildTeamICS, downloadICS } from "@/lib/calendar";
import { getMyTeams } from "@/lib/my-teams";

export function AddTournamentCalendar({ matches }: { matches: Match[] }) {
  const [open, setOpen] = useState(false);
  const [hasMyTeams, setHasMyTeams] = useState(false);

  useEffect(() => {
    setHasMyTeams(getMyTeams().length > 0);
    const onChange = () => setHasMyTeams(getMyTeams().length > 0);
    window.addEventListener("wc26-my-teams-changed", onChange);
    return () => window.removeEventListener("wc26-my-teams-changed", onChange);
  }, []);

  function downloadAll() {
    const ics = buildTournamentICS(matches);
    downloadICS(ics, "world-cup-2026-fixtures.ics");
    setOpen(false);
  }

  function downloadMyTeams() {
    const teams = getMyTeams();
    if (teams.length === 0) return;
    const ics = teams.length === 1
      ? buildTeamICS(matches, teams[0])
      : buildTournamentICS(
          matches.filter((m) => teams.includes(m.home) || teams.includes(m.away))
        );
    downloadICS(ics, "my-teams-wc26.ics");
    setOpen(false);
  }

  return (
    <div className="relative shrink-0">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="inline-flex items-center gap-2 rounded-xl border border-zinc-200 bg-white px-4 py-2 text-sm font-semibold text-zinc-700 hover:bg-zinc-50 hover:border-blue-200 hover:text-blue-700 transition-colors"
      >
        <CalendarPlus size={16} />
        Add to Calendar
      </button>

      {open && (
        <>
          <button
            type="button"
            className="fixed inset-0 z-40"
            aria-label="Close"
            onClick={() => setOpen(false)}
          />
          <div className="absolute right-0 top-full z-50 mt-2 min-w-[13rem] rounded-xl border border-zinc-200 bg-white py-1 shadow-lg">
            <button
              type="button"
              className="w-full text-left px-4 py-2.5 text-sm font-medium text-zinc-700 hover:bg-zinc-50"
              onClick={downloadAll}
            >
              All remaining fixtures
            </button>
            {hasMyTeams && (
              <button
                type="button"
                className="w-full text-left px-4 py-2.5 text-sm font-medium text-zinc-700 hover:bg-zinc-50"
                onClick={downloadMyTeams}
              >
                My teams only
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
}
