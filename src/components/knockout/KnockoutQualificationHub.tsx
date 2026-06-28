"use client";

import Link from "next/link";
import clsx from "clsx";
import { getTeam } from "@/lib/data";
import type { KnockoutQualificationSnapshot, QualifiedTeam } from "@/lib/knockout-qualification";
import { statusLabel } from "@/lib/knockout-qualification";

function StatusPill({
  status,
  groupComplete,
}: {
  status: QualifiedTeam["status"];
  groupComplete: boolean;
}) {
  const label = statusLabel(status, groupComplete);
  const styles: Record<QualifiedTeam["status"], string> = {
    "qualified-top2": groupComplete
      ? "bg-emerald-100 text-emerald-800"
      : "bg-emerald-50 text-emerald-700 border border-emerald-200",
    "third-advancing": "bg-blue-100 text-blue-800",
    "third-eliminated": "bg-zinc-100 text-zinc-500",
    "third-pending": "bg-amber-50 text-amber-800 border border-amber-200",
    alive: "bg-zinc-100 text-zinc-600",
    eliminated: "bg-red-50 text-red-700",
  };

  return (
    <span
      className={clsx(
        "inline-flex shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide",
        styles[status]
      )}
    >
      {label}
    </span>
  );
}

function TeamChip({ team }: { team: QualifiedTeam }) {
  const t = getTeam(team.teamCode, team.teamName);
  return (
    <Link
      href={`/teams/${team.teamCode.toLowerCase()}`}
      className="flex items-center gap-2 rounded-xl border border-zinc-100 bg-white px-3 py-2 hover:border-blue-200 hover:bg-blue-50/40 transition-colors min-w-0"
    >
      <span className="text-lg shrink-0">{t.flag}</span>
      <div className="min-w-0">
        <p className="text-sm font-semibold text-zinc-900 truncate">{team.teamName}</p>
        <p className="text-[10px] text-zinc-400">
          Group {team.group} · {team.points} pts · GD {team.goalDiff > 0 ? `+${team.goalDiff}` : team.goalDiff}
        </p>
      </div>
    </Link>
  );
}

export function GroupStageProgress({ snapshot }: { snapshot: KnockoutQualificationSnapshot }) {
  const pct = Math.round((snapshot.groupsComplete / snapshot.groupsTotal) * 100);

  return (
    <section className="card-surface overflow-hidden rounded-2xl">
      <div className="host-stripe" />
      <div className="p-5 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">
              Road to the Round of 32
            </p>
            <h2 className="text-2xl font-extrabold text-zinc-900 mt-1">
              {snapshot.spotsFilled}
              <span className="text-zinc-400 font-semibold"> / 32</span>{" "}
              <span className="text-base font-bold text-zinc-600">knockout spots filled</span>
            </h2>
            <p className="text-sm text-zinc-500 mt-1">
              {snapshot.groupsComplete} of {snapshot.groupsTotal} groups finished · Top two per group
              plus eight best third-placed teams
            </p>
          </div>
          <div className="text-right">
            <p className="text-3xl font-extrabold text-[var(--wc-usa)] tabular-nums">{pct}%</p>
            <p className="text-xs text-zinc-400">groups complete</p>
          </div>
        </div>
        <div className="mt-4 h-2.5 rounded-full bg-zinc-100 overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-[var(--wc-mexico)] via-[var(--wc-usa)] to-[var(--wc-canada)] transition-all"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>
    </section>
  );
}

export function KnockoutQualificationBoard({
  snapshot,
}: {
  snapshot: KnockoutQualificationSnapshot;
}) {
  const emptySlots = Math.max(0, 32 - snapshot.knockoutField.length);

  return (
    <section className="card-surface rounded-2xl overflow-hidden">
      <div className="px-5 py-4 border-b border-zinc-100">
        <h2 className="font-bold text-zinc-900">Who&apos;s in the Round of 32?</h2>
        <p className="text-sm text-zinc-500 mt-0.5">
          Live projection from group tables — updates as results come in
        </p>
      </div>
      <div className="p-5">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
          {snapshot.knockoutField.map((team) => (
            <TeamChip key={team.teamCode} team={team} />
          ))}
          {Array.from({ length: emptySlots }).map((_, i) => (
            <div
              key={`empty-${i}`}
              className="flex items-center justify-center rounded-xl border border-dashed border-zinc-200 bg-zinc-50/80 px-3 py-6 text-xs text-zinc-400"
            >
              Open spot
            </div>
          ))}
        </div>
        <p className="mt-4 text-[11px] text-zinc-400 text-center">
          {snapshot.autoQualifiedCount} from top-two places · up to {snapshot.thirdAdvancingCount}{" "}
          confirmed best thirds
        </p>
      </div>
    </section>
  );
}

export function ThirdPlaceTracker({ snapshot }: { snapshot: KnockoutQualificationSnapshot }) {
  return (
    <section className="card-surface rounded-2xl overflow-hidden">
      <div className="px-5 py-4 border-b border-zinc-100">
        <h2 className="font-bold text-zinc-900">Best third-placed teams</h2>
        <p className="text-sm text-zinc-500 mt-0.5">
          Ranked by points, goal difference, then goals scored — top eight advance
        </p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-[10px] uppercase tracking-wider text-zinc-400 border-b border-zinc-100">
              <th className="px-4 py-3 text-left font-semibold w-10">#</th>
              <th className="px-4 py-3 text-left font-semibold">Team</th>
              <th className="px-4 py-3 text-center font-semibold">Grp</th>
              <th className="px-4 py-3 text-center font-semibold">Pts</th>
              <th className="px-4 py-3 text-center font-semibold">GD</th>
              <th className="px-4 py-3 text-center font-semibold">GF</th>
              <th className="px-4 py-3 text-right font-semibold">Status</th>
            </tr>
          </thead>
          <tbody>
            {snapshot.thirdPlaceRanking.map((team) => {
              const t = getTeam(team.teamCode, team.teamName);
              const inZone = (team.thirdPlaceRank ?? 99) <= 8;
              return (
                <tr
                  key={team.teamCode}
                  className={clsx(
                    "border-b border-zinc-50 last:border-0",
                    inZone ? "bg-emerald-50/40" : undefined
                  )}
                >
                  <td className="px-4 py-3 font-bold text-zinc-400 tabular-nums">
                    {team.thirdPlaceRank}
                  </td>
                  <td className="px-4 py-3">
                    <Link
                      href={`/teams/${team.teamCode.toLowerCase()}`}
                      className="flex items-center gap-2 font-medium text-zinc-900 hover:text-blue-600"
                    >
                      <span>{t.flag}</span>
                      <span className="truncate">{team.teamName}</span>
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-center text-zinc-600">{team.group}</td>
                  <td className="px-4 py-3 text-center font-semibold tabular-nums">{team.points}</td>
                  <td className="px-4 py-3 text-center tabular-nums text-zinc-600">
                    {team.goalDiff > 0 ? `+${team.goalDiff}` : team.goalDiff}
                  </td>
                  <td className="px-4 py-3 text-center tabular-nums text-zinc-600">{team.goalsFor}</td>
                  <td className="px-4 py-3 text-right">
                    <StatusPill status={team.status} groupComplete={team.groupComplete} />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export function GroupQualificationGrid({ snapshot }: { snapshot: KnockoutQualificationSnapshot }) {
  return (
    <section className="space-y-4">
      <div>
        <h2 className="font-bold text-zinc-900">All groups</h2>
        <p className="text-sm text-zinc-500">Qualification zone and third-place race by group</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {snapshot.byGroup.map((view) => (
          <div key={view.letter} className="card-surface rounded-2xl overflow-hidden">
            <div
              className={clsx(
                "px-4 py-2.5 border-b border-zinc-100 flex items-center justify-between",
                view.complete ? "bg-emerald-50/60" : "bg-zinc-50/80"
              )}
            >
              <h3 className="font-semibold text-zinc-900">{view.group}</h3>
              <span className="text-[10px] font-bold uppercase tracking-wide text-zinc-400">
                {view.complete ? "Final" : "Live"}
              </span>
            </div>
            <ul className="divide-y divide-zinc-50">
              {view.teams.map((team) => {
                const t = getTeam(team.teamCode, team.teamName);
                return (
                  <li
                    key={team.teamCode}
                    className={clsx(
                      "flex items-center justify-between gap-2 px-4 py-2.5",
                      team.rank <= 2 && "bg-emerald-50/30"
                    )}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="w-4 text-xs font-bold text-zinc-400">{team.rank}</span>
                      <span>{t.flag}</span>
                      <span className="text-sm font-medium text-zinc-900 truncate">{team.teamName}</span>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-xs font-semibold text-zinc-500 tabular-nums">
                        {team.points}p
                      </span>
                      <StatusPill status={team.status} groupComplete={team.groupComplete} />
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
