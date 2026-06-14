import type { TeamLineup } from "@/lib/types";
import { getTeam } from "@/lib/data";

function LineupColumn({ lineup, side }: { lineup: TeamLineup; side: "home" | "away" }) {
  const team = getTeam(lineup.teamCode, lineup.teamName);

  return (
    <div className="card-surface rounded-2xl overflow-hidden">
      <div className="px-4 py-3 border-b border-zinc-100 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {team.logo ? (
            <img src={team.logo} alt="" className="h-6 w-6 object-contain" />
          ) : (
            <span className="text-lg">{team.flag}</span>
          )}
          <span className="font-semibold text-zinc-900 text-sm">{lineup.teamName}</span>
        </div>
        {lineup.formation && (
          <span className="text-xs font-mono text-blue-600 bg-blue-50 px-2 py-0.5 rounded">{lineup.formation}</span>
        )}
      </div>

      <div className="p-4 space-y-4">
        <div>
          <p className="text-[10px] uppercase tracking-wider text-zinc-400 font-semibold mb-2">Starting XI</p>
          <div className="space-y-1">
            {lineup.starters.map((p) => (
              <div key={p.id} className="flex items-center gap-2 text-sm py-1">
                <span className="w-6 text-center font-bold text-zinc-400 text-xs">{p.number}</span>
                <span className="flex-1 text-zinc-900">{p.name}</span>
                <span className="text-[10px] text-zinc-400 uppercase">{p.position}</span>
              </div>
            ))}
          </div>
        </div>

        {lineup.substitutes.length > 0 && (
          <div>
            <p className="text-[10px] uppercase tracking-wider text-zinc-400 font-semibold mb-2">Substitutes</p>
            <div className="space-y-1">
              {lineup.substitutes.map((p) => (
                <div key={p.id} className="flex items-center gap-2 text-sm py-1 text-zinc-600">
                  <span className="w-6 text-center font-bold text-zinc-300 text-xs">{p.number}</span>
                  <span className="flex-1">{p.name}</span>
                  <span className="text-[10px] text-zinc-400 uppercase">{p.position}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export function MatchLineups({
  home,
  away,
  homeManager,
  awayManager,
}: {
  home?: TeamLineup;
  away?: TeamLineup;
  homeManager?: string;
  awayManager?: string;
}) {
  if (!home && !away) {
    return (
      <p className="text-sm text-zinc-400 text-center py-8">
        Lineups will be announced closer to kickoff.
      </p>
    );
  }

  return (
    <div className="space-y-4">
      {(homeManager || awayManager) && (
        <div className="grid gap-3 sm:grid-cols-2">
          {homeManager && (
            <div className="card-surface rounded-xl px-4 py-3">
              <p className="text-[10px] uppercase text-zinc-400 font-semibold">Home Manager</p>
              <p className="text-sm font-semibold text-zinc-900 mt-0.5">{homeManager}</p>
            </div>
          )}
          {awayManager && (
            <div className="card-surface rounded-xl px-4 py-3">
              <p className="text-[10px] uppercase text-zinc-400 font-semibold">Away Manager</p>
              <p className="text-sm font-semibold text-zinc-900 mt-0.5">{awayManager}</p>
            </div>
          )}
        </div>
      )}

      <div className="grid gap-4 lg:grid-cols-2">
        {home && <LineupColumn lineup={home} side="home" />}
        {away && <LineupColumn lineup={away} side="away" />}
      </div>
    </div>
  );
}
