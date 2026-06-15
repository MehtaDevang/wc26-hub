"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Calculator, ChevronRight } from "lucide-react";
import { MatchClashRow } from "@/components/MatchBattleGraphic";
import { getTeam } from "@/lib/data";
import {
  analyzeTeamScenario,
  getAllTeamsFromStandings,
  type TeamScenarioResult,
} from "@/lib/group-scenarios";
import type { GroupStandings, Match } from "@/lib/types";

interface GroupScenarioCalculatorProps {
  standings: GroupStandings[];
  matches: Match[];
}

function ScenarioPanel({ result }: { result: TeamScenarioResult }) {
  const team = getTeam(result.teamCode, result.teamName);

  return (
    <div className="space-y-6">
      <div className="card-elevated rounded-2xl p-5 sm:p-6">
        <div className="flex items-center gap-3 mb-4">
          {team.logo ? (
            <img src={team.logo} alt="" className="h-10 w-10 object-contain" />
          ) : (
            <span className="text-3xl">{team.flag}</span>
          )}
          <div>
            <h2 className="font-bold text-xl text-zinc-900">{result.teamName}</h2>
            <p className="text-sm text-zinc-500">{result.group}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
          <div className="rounded-xl bg-zinc-50 px-3 py-2.5">
            <p className="text-xs text-zinc-400">Position</p>
            <p className="font-bold text-zinc-900">{result.current.rank}</p>
          </div>
          <div className="rounded-xl bg-zinc-50 px-3 py-2.5">
            <p className="text-xs text-zinc-400">Points</p>
            <p className="font-bold text-zinc-900">{result.current.points}</p>
          </div>
          <div className="rounded-xl bg-zinc-50 px-3 py-2.5">
            <p className="text-xs text-zinc-400">Played</p>
            <p className="font-bold text-zinc-900">{result.played}/3</p>
          </div>
          <div className="rounded-xl bg-zinc-50 px-3 py-2.5">
            <p className="text-xs text-zinc-400">Pts range</p>
            <p className="font-bold text-zinc-900">
              {result.minPoints}–{result.maxPoints}
            </p>
          </div>
        </div>

        <ul className="mt-5 space-y-2">
          {result.summary.map((line) => (
            <li key={line} className="text-sm text-zinc-600 leading-relaxed flex gap-2">
              <ChevronRight size={14} className="shrink-0 mt-0.5 text-blue-500" />
              {line}
            </li>
          ))}
        </ul>

        {result.thirdPlaceNote && (
          <p className="mt-4 text-xs text-amber-800 bg-amber-50 border border-amber-100 rounded-xl px-4 py-3 leading-relaxed">
            {result.thirdPlaceNote}
          </p>
        )}
      </div>

      {result.remainingMatches.length > 0 && (
        <section>
          <h3 className="section-title text-base mb-3">Remaining fixtures</h3>
          <div className="card-elevated rounded-2xl overflow-hidden">
            <div className="host-stripe" />
            <div className="match-clash-list">
              {result.remainingMatches.map((m) => (
                <MatchClashRow key={m.id} match={m} />
              ))}
            </div>
          </div>
        </section>
      )}

      <section>
        <h3 className="section-title text-base mb-3">Possible outcomes</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm card-surface rounded-2xl overflow-hidden">
            <thead>
              <tr className="border-b border-zinc-100 text-left text-xs uppercase tracking-wide text-zinc-400">
                <th className="px-4 py-3 font-semibold">Scenario</th>
                <th className="px-4 py-3 font-semibold">Pts</th>
                <th className="px-4 py-3 font-semibold">Rank</th>
                <th className="px-4 py-3 font-semibold">Knockout</th>
              </tr>
            </thead>
            <tbody>
              {result.outcomes.map((outcome) => (
                <tr key={outcome.label} className="border-b border-zinc-50 last:border-0">
                  <td className="px-4 py-3 font-medium text-zinc-800">{outcome.label}</td>
                  <td className="px-4 py-3 tabular-nums">{outcome.points}</td>
                  <td className="px-4 py-3 tabular-nums">{outcome.rank}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`text-xs font-bold uppercase px-2 py-0.5 rounded-full ${
                        outcome.qualifies === "yes"
                          ? "bg-emerald-50 text-emerald-700"
                          : outcome.qualifies === "maybe"
                            ? "bg-amber-50 text-amber-700"
                            : "bg-zinc-100 text-zinc-500"
                      }`}
                    >
                      {outcome.qualifies === "yes"
                        ? "Top 2"
                        : outcome.qualifies === "maybe"
                          ? "3rd / maybe"
                          : "Out"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <p className="text-xs text-zinc-400 text-center">
        Scenarios assume other teams can still reach their maximum points.{" "}
        <Link href="/standings" className="text-blue-600 hover:underline">
          View live standings →
        </Link>
      </p>
    </div>
  );
}

export function GroupScenarioCalculator({ standings, matches }: GroupScenarioCalculatorProps) {
  const teams = useMemo(() => getAllTeamsFromStandings(standings), [standings]);
  const [selected, setSelected] = useState(teams[0]?.code ?? "");

  const result = useMemo(() => {
    if (!selected) return null;
    return analyzeTeamScenario({ teamCode: selected, standings, matches });
  }, [selected, standings, matches]);

  return (
    <div className="space-y-6">
      <div className="card-surface rounded-2xl p-5">
        <label htmlFor="scenario-team" className="flex items-center gap-2 text-sm font-bold text-zinc-800 mb-2">
          <Calculator size={16} className="text-blue-600" />
          Select a team
        </label>
        <select
          id="scenario-team"
          value={selected}
          onChange={(e) => setSelected(e.target.value)}
          className="w-full sm:max-w-md rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-sm font-medium text-zinc-800 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
        >
          {teams.map((team) => (
            <option key={team.code} value={team.code}>
              {team.name} ({team.group})
            </option>
          ))}
        </select>
        <p className="text-xs text-zinc-400 mt-2">
          See what your team needs to qualify — top two advance, plus eight best third-place teams.
        </p>
      </div>

      {result ? (
        <ScenarioPanel result={result} />
      ) : (
        <p className="text-sm text-zinc-400 text-center py-12 card-surface rounded-2xl">
          Standings not available yet — check back once the group stage begins.
        </p>
      )}
    </div>
  );
}
