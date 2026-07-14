import Link from "next/link";
import { ChevronRight, Trophy, Users } from "lucide-react";
import { getTeam } from "@/lib/data";
import { getTeamColors } from "@/lib/team-colors";
import { CdnImage } from "@/components/CdnImage";
import { FifaRankBadge } from "@/components/FifaRankBadge";
import { HomeDashboardPanel } from "@/components/home/HomeDashboardPanel";
import type { FinaleState } from "@/lib/tournament-stage";
import type { TournamentLeaderEntry } from "@/lib/espn/tournament-stats";
import type { BracketMatch, BracketTeam } from "@/lib/types";

function semiFor(code: string, semiFinals: BracketMatch[]) {
  for (const match of semiFinals) {
    if (match.home.code === code)
      return { match, opponent: match.away, self: match.home };
    if (match.away.code === code)
      return { match, opponent: match.home, self: match.away };
  }
  return null;
}

function pathLine(code: string, state: FinaleState): string {
  const finalTeam = state.finalists.some((t) => t.code === code);
  if (finalTeam) return "Through to the Final";

  const semi = semiFor(code, state.semiFinals);
  if (!semi) return "Semi-finalist";

  const opp = semi.opponent;
  const oppName = opp.code && !opp.placeholder ? getTeam(opp.code, opp.name).name : "TBD";

  if (semi.match.status === "finished") {
    const won = semi.self.winner;
    return `${won ? "Beat" : "Lost to"} ${oppName} ${semi.self.score ?? 0}-${semi.opponent.score ?? 0}`;
  }
  if (semi.match.status === "live") {
    return `Live vs ${oppName} · ${semi.self.score ?? 0}-${semi.opponent.score ?? 0}`;
  }
  return `Semi-Final vs ${oppName}`;
}

function TeamCard({
  team,
  state,
  topScorer,
}: {
  team: BracketTeam;
  state: FinaleState;
  topScorer?: TournamentLeaderEntry;
}) {
  const info = getTeam(team.code!, team.name);
  const colors = getTeamColors(team.code!);
  const inFinal = state.finalists.some((t) => t.code === team.code);

  return (
    <Link
      href={`/teams/${team.code}`}
      className="group flex items-center gap-3 rounded-xl border border-zinc-200 bg-white px-3 py-2.5 transition-all hover:border-zinc-300 hover:shadow-md"
    >
      <span
        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full"
        style={{ boxShadow: `inset 0 0 0 2px ${colors.primary}33`, background: `${colors.primary}0f` }}
      >
        {info.logo ? (
          <CdnImage src={info.logo} alt="" width={32} height={32} className="h-8 w-8 object-contain" />
        ) : (
          <span className="text-2xl">{info.flag}</span>
        )}
      </span>

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className="truncate text-sm font-bold text-zinc-900 group-hover:text-[var(--wc-usa)]">
            {info.name}
          </span>
          <FifaRankBadge code={team.code!} variant="compact" />
          {inFinal && (
            <span className="shrink-0 rounded-full bg-amber-100 px-1.5 py-0.5 text-[9px] font-extrabold uppercase tracking-wider text-amber-700">
              Finalist
            </span>
          )}
        </div>
        <p className="truncate text-[11px] text-zinc-500">{pathLine(team.code!, state)}</p>
        {topScorer && (
          <p className="mt-0.5 truncate text-[11px] font-medium text-amber-700">
            {topScorer.name} · {topScorer.goals} {topScorer.goals === 1 ? "goal" : "goals"}
          </p>
        )}
      </div>

      <ChevronRight size={15} className="shrink-0 text-zinc-300 group-hover:text-[var(--wc-usa)]" />
    </Link>
  );
}

export function HomeFinalFour({
  state,
  scorers,
}: {
  state: FinaleState;
  scorers: TournamentLeaderEntry[];
}) {
  const teams = state.semifinalists.filter((t) => t.code);

  const topScorerFor = (code: string): TournamentLeaderEntry | undefined =>
    scorers.find((s) => s.teamCode === code);

  const subtitle =
    state.stage === "final"
      ? "The two teams one win from glory"
      : `${teams.length || 4} teams left standing`;

  return (
    <HomeDashboardPanel
      title="The Final Four"
      subtitle={subtitle}
      icon={Users}
      accent="bracket"
      href="/bracket"
      hrefLabel="Full bracket"
      fill={false}
      className="home-dash-panel--auto"
    >
      {teams.length > 0 ? (
        <>
          <div className="flex flex-col gap-2.5">
            {teams.map((team) => (
              <TeamCard
                key={team.code}
                team={team}
                state={state}
                topScorer={topScorerFor(team.code!)}
              />
            ))}
          </div>
          <div className="mt-3 flex items-center gap-2.5 rounded-xl border border-amber-200 bg-gradient-to-r from-amber-50 to-orange-50/60 px-3.5 py-3">
            <Trophy size={18} className="shrink-0 text-amber-600" />
            <p className="text-xs font-semibold text-amber-900">
              {state.stage === "final"
                ? "90 minutes from lifting the trophy."
                : "One of these four will be crowned World Champions."}
            </p>
          </div>
        </>
      ) : (
        <div className="flex flex-1 flex-col items-center justify-center py-8 text-center">
          <p className="text-sm font-semibold text-zinc-700">Semi-finalists to be confirmed</p>
          <p className="mt-1 text-xs text-zinc-500">
            The quarter-finals decide the final four. Follow the bracket for live updates.
          </p>
          <Link
            href="/bracket"
            className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-[var(--wc-usa)] px-3.5 py-2 text-xs font-semibold text-white hover:opacity-90"
          >
            Open the bracket <ChevronRight size={13} />
          </Link>
        </div>
      )}
    </HomeDashboardPanel>
  );
}
