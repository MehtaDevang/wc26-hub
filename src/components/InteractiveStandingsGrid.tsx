"use client";

import { useState, useCallback } from "react";
import { ChevronRight } from "lucide-react";
import type { GroupStandings, StandingsRow } from "@/lib/types";
import { resolveTeamCode } from "@/lib/team-lookup";
import { TeamJourneyPanel } from "./TeamJourneyPanel";
import { GroupStandingsTable, StandingsTeamCell } from "./GroupStandingsTable";

function ClickableStandingsTable({
  rows,
  onTeamClick,
}: {
  rows: StandingsRow[];
  onTeamClick: (team: string, teamCode?: string) => void;
}) {
  const handleRow = useCallback(
    (row: StandingsRow) => {
      onTeamClick(row.team, row.teamCode ?? resolveTeamCode(row.team));
    },
    [onTeamClick]
  );

  return (
    <div className="overflow-x-auto -mx-1">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-[10px] uppercase tracking-wider text-zinc-400 border-b border-zinc-100">
            <th className="text-left py-2 pl-1 pr-2 font-semibold w-8">#</th>
            <th className="text-left py-2 font-semibold">Team</th>
            <th className="text-center py-2 px-1 font-semibold w-8">P</th>
            <th className="text-center py-2 px-1 font-semibold w-8">W</th>
            <th className="text-center py-2 px-1 font-semibold w-8">D</th>
            <th className="text-center py-2 px-1 font-semibold w-8">L</th>
            <th className="text-center py-2 px-1 font-semibold w-10">GD</th>
            <th className="text-center py-2 px-1 font-semibold w-10">Pts</th>
            <th className="w-7" aria-hidden />
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr
              key={row.team}
              role="button"
              tabIndex={0}
              onClick={() => handleRow(row)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  handleRow(row);
                }
              }}
              className="standings-row group"
              aria-label={`View ${row.team} World Cup journey`}
            >
              <td className="py-3 pl-1 pr-2 text-zinc-400 font-bold tabular-nums">{row.rank}</td>
              <td className="py-3 font-semibold text-zinc-900 group-hover:text-[var(--wc-usa)] transition-colors">
                <StandingsTeamCell row={row} />
              </td>
              <td className="py-3 text-center text-zinc-600 tabular-nums">{row.played}</td>
              <td className="py-3 text-center text-zinc-600 tabular-nums">{row.won}</td>
              <td className="py-3 text-center text-zinc-600 tabular-nums">{row.drawn}</td>
              <td className="py-3 text-center text-zinc-600 tabular-nums">{row.lost}</td>
              <td className="py-3 text-center text-zinc-600 tabular-nums">{row.goalDiff}</td>
              <td className="py-3 text-center font-bold text-[var(--wc-usa)] tabular-nums">{row.points}</td>
              <td className="py-3 pr-1 text-right">
                <ChevronRight size={15} className="standings-row-arrow inline-block" strokeWidth={2.5} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function InteractiveStandingsGrid({ groups }: { groups: GroupStandings[] }) {
  const [selectedTeam, setSelectedTeam] = useState<string | null>(null);

  if (!groups.length) {
    return <p className="text-sm text-zinc-400 text-center py-12">Standings not available yet.</p>;
  }

  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {groups.map((g) => (
          <div key={g.group} className="wc26-group-card">
            <div className="wc26-group-header">
              <h3 className="font-bold text-zinc-900">{g.group}</h3>
              <p className="text-[10px] text-zinc-500 mt-0.5">Tap any row to see a team&apos;s full journey</p>
            </div>
            <div className="px-3 pb-2 pt-1">
              <ClickableStandingsTable
                rows={g.rows}
                onTeamClick={(team, code) => setSelectedTeam(code ?? team)}
              />
            </div>
          </div>
        ))}
      </div>

      <TeamJourneyPanel teamKey={selectedTeam} onClose={() => setSelectedTeam(null)} />
    </>
  );
}

/** Non-interactive grid for match detail etc. */
export function AllStandingsGrid({ groups }: { groups: GroupStandings[] }) {
  if (!groups.length) {
    return <p className="text-sm text-zinc-400 text-center py-12">Standings not available yet.</p>;
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {groups.map((g) => (
        <GroupStandingsTable key={g.group} standings={g} />
      ))}
    </div>
  );
}
