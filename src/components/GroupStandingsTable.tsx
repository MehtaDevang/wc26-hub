import type { GroupStandings, StandingsRow } from "@/lib/types";
import { getTeam } from "@/lib/data";
import { resolveTeamCode } from "@/lib/team-lookup";

export function StandingsTeamCell({ row }: { row: StandingsRow }) {
  const code = row.teamCode ?? resolveTeamCode(row.team) ?? "";
  const team = getTeam(code, row.team);

  return (
    <div className="flex items-center gap-2 min-w-0">
      <span className="text-base shrink-0 leading-none" aria-hidden>
        {team.flag}
      </span>
      <span className="truncate">{row.team}</span>
    </div>
  );
}

function StandingsTable({ rows }: { rows: StandingsRow[] }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-[10px] uppercase tracking-wider text-zinc-400 border-b border-zinc-100">
            <th className="text-left py-2 pr-2 font-semibold">#</th>
            <th className="text-left py-2 font-semibold">Team</th>
            <th className="text-center py-2 px-1 font-semibold">P</th>
            <th className="text-center py-2 px-1 font-semibold">W</th>
            <th className="text-center py-2 px-1 font-semibold">D</th>
            <th className="text-center py-2 px-1 font-semibold">L</th>
            <th className="text-center py-2 px-1 font-semibold">GD</th>
            <th className="text-center py-2 pl-1 font-semibold">Pts</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.team} className="border-b border-zinc-50 hover:bg-zinc-50/50">
              <td className="py-2.5 pr-2 text-zinc-400 font-bold">{row.rank}</td>
              <td className="py-2.5 font-medium text-zinc-900">
                <StandingsTeamCell row={row} />
              </td>
              <td className="py-2.5 text-center text-zinc-600">{row.played}</td>
              <td className="py-2.5 text-center text-zinc-600">{row.won}</td>
              <td className="py-2.5 text-center text-zinc-600">{row.drawn}</td>
              <td className="py-2.5 text-center text-zinc-600">{row.lost}</td>
              <td className="py-2.5 text-center text-zinc-600">{row.goalDiff}</td>
              <td className="py-2.5 text-center font-bold text-blue-600">{row.points}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function GroupStandingsTable({ standings }: { standings: GroupStandings }) {
  return (
    <div className="card-surface rounded-2xl overflow-hidden">
      <div className="px-4 py-3 border-b border-zinc-100">
        <h3 className="font-semibold text-zinc-900">{standings.group}</h3>
      </div>
      <div className="px-4 pb-2">
        <StandingsTable rows={standings.rows} />
      </div>
    </div>
  );
}
