import Link from "next/link";
import { Calculator } from "lucide-react";
import type { Match, GroupStandings } from "@/lib/types";
import { analyzeTeamScenario } from "@/lib/group-scenarios";
import { getTeamName } from "@/lib/team-lookup";

interface MatchQualificationContextProps {
  match: Match;
  standings?: GroupStandings;
  allMatches: Match[];
}

export function MatchQualificationContext({
  match,
  standings,
  allMatches,
}: MatchQualificationContextProps) {
  if (!standings || match.group === "?" || match.status === "finished") return null;

  const standingsList = [standings];
  const teams = [match.home, match.away];

  const scenarios = teams
    .map((code) =>
      analyzeTeamScenario({
        teamCode: code,
        standings: standingsList,
        matches: allMatches,
      })
    )
    .filter(Boolean);

  if (scenarios.length === 0) return null;

  return (
    <div className="card-surface rounded-xl p-4 border-l-4 border-l-violet-500 bg-violet-50/30">
      <p className="text-[10px] font-bold uppercase tracking-wider text-violet-600 mb-2 flex items-center gap-1.5">
        <Calculator size={12} />
        Group {match.group} picture
      </p>
      <ul className="space-y-2">
        {scenarios.map((s) => (
          <li key={s!.teamCode} className="text-sm text-zinc-700">
            <span className="font-semibold text-zinc-900">{getTeamName(s!.teamCode)}</span>
            {": "}
            {s!.summary[0]}
          </li>
        ))}
      </ul>
      <Link
        href="/bracket"
        className="inline-block text-xs font-semibold text-violet-700 hover:underline mt-3"
      >
        View live knockout bracket →
      </Link>
    </div>
  );
}
