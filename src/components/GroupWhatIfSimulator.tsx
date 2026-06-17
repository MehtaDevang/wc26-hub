"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { FlaskConical, RotateCcw, Minus, Plus } from "lucide-react";
import { getTeam } from "@/lib/data";
import {
  getGroupStageMatches,
  getRemainingGroupMatches,
  isGroupFullySimulated,
  simulateGroup,
  type SimulatedResults,
  type SimulatedRow,
} from "@/lib/group-simulator";
import type { GroupStandings, Match } from "@/lib/types";

interface GroupWhatIfSimulatorProps {
  standings: GroupStandings[];
  matches: Match[];
}

const QUAL_STYLES: Record<SimulatedRow["qualification"], string> = {
  qualified: "border-l-emerald-500",
  third: "border-l-amber-400",
  out: "border-l-zinc-200",
};

function ScoreStepper({
  value,
  onChange,
  label,
}: {
  value: number;
  onChange: (next: number) => void;
  label: string;
}) {
  return (
    <div className="flex items-center gap-1">
      <button
        type="button"
        aria-label={`Decrease ${label}`}
        onClick={() => onChange(Math.max(0, value - 1))}
        className="flex h-7 w-7 items-center justify-center rounded-lg border border-zinc-200 text-zinc-500 hover:bg-zinc-50 disabled:opacity-40"
        disabled={value <= 0}
      >
        <Minus size={13} />
      </button>
      <span className="w-6 text-center text-base font-bold tabular-nums text-zinc-900">{value}</span>
      <button
        type="button"
        aria-label={`Increase ${label}`}
        onClick={() => onChange(Math.min(15, value + 1))}
        className="flex h-7 w-7 items-center justify-center rounded-lg border border-zinc-200 text-zinc-500 hover:bg-zinc-50"
      >
        <Plus size={13} />
      </button>
    </div>
  );
}

function FixtureEditor({
  match,
  result,
  onChange,
}: {
  match: Match;
  result: { homeScore: number; awayScore: number } | undefined;
  onChange: (homeScore: number, awayScore: number) => void;
}) {
  const home = getTeam(match.home, match.homeName, match.homeLogo);
  const away = getTeam(match.away, match.awayName, match.awayLogo);
  const finished = match.status === "finished";
  const set = Boolean(result);
  const h = result?.homeScore ?? 0;
  const a = result?.awayScore ?? 0;

  return (
    <div
      className={`flex items-center gap-3 px-4 py-3 ${
        finished ? "bg-zinc-50/60" : set ? "bg-blue-50/40" : ""
      }`}
    >
      <div className="flex flex-1 items-center justify-end gap-2 min-w-0">
        <span className="truncate text-sm font-semibold text-zinc-800 text-right">{home.name}</span>
        <span className="text-lg shrink-0">{home.flag}</span>
      </div>

      {finished ? (
        <div className="flex flex-col items-center shrink-0 w-[88px]">
          <span className="text-base font-extrabold tabular-nums text-zinc-900 leading-none">
            {match.homeScore ?? 0} : {match.awayScore ?? 0}
          </span>
          <span className="mt-1 text-[9px] font-bold uppercase tracking-wide text-zinc-400">
            Full time
          </span>
        </div>
      ) : (
        <div className="flex items-center gap-2 shrink-0">
          <ScoreStepper value={h} label={`${home.name} goals`} onChange={(next) => onChange(next, a)} />
          <span className="text-zinc-300 font-bold">:</span>
          <ScoreStepper value={a} label={`${away.name} goals`} onChange={(next) => onChange(h, next)} />
        </div>
      )}

      <div className="flex flex-1 items-center gap-2 min-w-0">
        <span className="text-lg shrink-0">{away.flag}</span>
        <span className="truncate text-sm font-semibold text-zinc-800">{away.name}</span>
      </div>
    </div>
  );
}

function SimulatedTable({ rows }: { rows: SimulatedRow[] }) {
  return (
    <div className="overflow-hidden rounded-2xl card-surface">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-zinc-100 text-left text-[10px] uppercase tracking-wider text-zinc-400">
            <th className="px-3 py-2.5 font-semibold w-8">#</th>
            <th className="px-2 py-2.5 font-semibold">Team</th>
            <th className="px-2 py-2.5 font-semibold text-center w-9">P</th>
            <th className="px-2 py-2.5 font-semibold text-center w-9">GD</th>
            <th className="px-2 py-2.5 font-semibold text-center w-9">Pts</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => {
            const team = getTeam(row.teamCode, row.teamName);
            return (
              <tr
                key={row.teamCode}
                className={`border-b border-zinc-50 last:border-0 border-l-4 ${QUAL_STYLES[row.qualification]}`}
              >
                <td className="px-3 py-2.5 font-bold tabular-nums text-zinc-400">{row.rank}</td>
                <td className="px-2 py-2.5">
                  <span className="flex items-center gap-2 min-w-0">
                    <span className="text-base shrink-0">{team.flag}</span>
                    <span className="truncate font-semibold text-zinc-900">{team.name}</span>
                    {row.projected && (
                      <span className="text-[9px] font-bold uppercase text-blue-500 shrink-0">sim</span>
                    )}
                  </span>
                </td>
                <td className="px-2 py-2.5 text-center tabular-nums text-zinc-600">{row.played}</td>
                <td className="px-2 py-2.5 text-center tabular-nums text-zinc-600">
                  {row.goalDiff > 0 ? `+${row.goalDiff}` : row.goalDiff}
                </td>
                <td className="px-2 py-2.5 text-center font-extrabold tabular-nums text-zinc-900">{row.points}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export function GroupWhatIfSimulator({ standings, matches }: GroupWhatIfSimulatorProps) {
  const groups = useMemo(
    () => standings.filter((g) => g.rows.length > 0),
    [standings]
  );
  const [groupName, setGroupName] = useState(groups[0]?.group ?? "");
  const [results, setResults] = useState<SimulatedResults>({});

  const group = groups.find((g) => g.group === groupName) ?? groups[0];
  const groupLetter = group?.group.replace(/Group\s+/i, "").trim() ?? "";

  const allFixtures = useMemo(
    () => (group ? getGroupStageMatches(groupLetter, matches) : []),
    [group, groupLetter, matches]
  );

  const remaining = useMemo(
    () => (group ? getRemainingGroupMatches(groupLetter, matches) : []),
    [group, groupLetter, matches]
  );

  const rows = useMemo(
    () => (group ? simulateGroup(group, matches, results) : []),
    [group, matches, results]
  );

  const fullySimulated = isGroupFullySimulated(remaining, results);

  function setResult(matchId: string, homeScore: number, awayScore: number) {
    setResults((prev) => ({ ...prev, [matchId]: { homeScore, awayScore } }));
  }

  function reset() {
    setResults({});
  }

  if (groups.length === 0) {
    return (
      <p className="text-sm text-zinc-400 text-center py-12 card-surface rounded-2xl">
        Group tables aren&apos;t available yet - the simulator unlocks once the group stage begins.
      </p>
    );
  }

  return (
    <div className="space-y-6">
      <div className="card-surface rounded-2xl p-5">
        <label htmlFor="sim-group" className="flex items-center gap-2 text-sm font-bold text-zinc-800 mb-2">
          <FlaskConical size={16} className="text-violet-600" />
          Pick a group to simulate
        </label>
        <div className="flex flex-wrap items-center gap-3">
          <select
            id="sim-group"
            value={group?.group ?? ""}
            onChange={(e) => {
              setGroupName(e.target.value);
              setResults({});
            }}
            className="rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-sm font-medium text-zinc-800 focus:outline-none focus:ring-2 focus:ring-violet-500/30"
          >
            {groups.map((g) => (
              <option key={g.group} value={g.group}>
                {g.group}
              </option>
            ))}
          </select>
          {Object.keys(results).length > 0 && (
            <button
              type="button"
              onClick={reset}
              className="inline-flex items-center gap-1.5 rounded-xl border border-zinc-200 px-3 py-2 text-xs font-semibold text-zinc-600 hover:bg-zinc-50"
            >
              <RotateCcw size={13} />
              Reset scores
            </button>
          )}
        </div>
        <p className="text-xs text-zinc-400 mt-2">
          Set hypothetical scores for the remaining fixtures and watch the table reshuffle live.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <section>
          <h3 className="section-title text-base mb-3">Group fixtures</h3>
          {allFixtures.length === 0 ? (
            <p className="text-sm text-zinc-400 card-surface rounded-2xl px-4 py-6 text-center">
              Fixtures aren&apos;t available for this group yet.
            </p>
          ) : (
            <>
              <div className="card-surface rounded-2xl overflow-hidden divide-y divide-zinc-50">
                {allFixtures.map((match) => (
                  <FixtureEditor
                    key={match.id}
                    match={match}
                    result={results[match.id]}
                    onChange={(h, a) => setResult(match.id, h, a)}
                  />
                ))}
              </div>
              {remaining.length === 0 && (
                <p className="text-xs text-zinc-400 mt-2 text-center">
                  All fixtures complete - this group is final.
                </p>
              )}
            </>
          )}
        </section>

        <section>
          <h3 className="section-title text-base mb-3 flex items-center gap-2">
            Projected table
            {fullySimulated && (
              <span className="text-[10px] font-bold uppercase rounded-full bg-emerald-50 text-emerald-700 px-2 py-0.5">
                Complete
              </span>
            )}
          </h3>
          <SimulatedTable rows={rows} />
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-3 text-[11px] text-zinc-500">
            <span className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-sm bg-emerald-500" /> Top 2 - qualify
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-sm bg-amber-400" /> 3rd - best-third race
            </span>
          </div>
        </section>
      </div>

      <p className="text-xs text-zinc-400 text-center">
        Eight of twelve third-place teams advance in 2026.{" "}
        <Link href="/standings" className="text-blue-600 hover:underline">
          Live standings →
        </Link>
      </p>
    </div>
  );
}
