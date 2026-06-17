"use client";

import { useState } from "react";
import Link from "next/link";
import { getPlayerPath } from "@/lib/espn/player-profile";
import { getTeam } from "@/lib/data";
import { FeaturedPlayerBadge } from "@/components/FeaturedPlayerBadge";
import { isFeaturedPlayer } from "@/lib/player-editorial";
import type { TournamentLeaderEntry, TournamentLeaders } from "@/lib/espn/tournament-stats";

type Tab = "goals" | "assists" | "appearances" | "cards";
type PortraitSize = "sm" | "md" | "lg" | "xl";

const PORTRAIT_SIZES: Record<PortraitSize, string> = {
  sm: "h-9 w-9 text-xs",
  md: "h-11 w-11 text-sm",
  lg: "h-16 w-16 text-lg",
  xl: "h-24 w-24 text-2xl sm:h-28 sm:w-28 sm:text-3xl",
};

const AVATAR_PALETTES = [
  { bg: "#dbeafe", text: "#1d4ed8" },
  { bg: "#fce7f3", text: "#be185d" },
  { bg: "#d1fae5", text: "#047857" },
  { bg: "#ede9fe", text: "#6d28d9" },
  { bg: "#ffedd5", text: "#c2410c" },
  { bg: "#e0e7ff", text: "#4338ca" },
  { bg: "#ccfbf1", text: "#0f766e" },
  { bg: "#fef3c7", text: "#b45309" },
];

function playerInitials(name: string): string {
  const parts = name.split(/\s+/).filter(Boolean);
  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
}

function avatarPalette(seed: string) {
  let hash = 0;
  for (let i = 0; i < seed.length; i += 1) {
    hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
  }
  return AVATAR_PALETTES[hash % AVATAR_PALETTES.length];
}

function PlayerPortrait({
  player,
  size = "md",
  ringClass = "ring-2 ring-white",
}: {
  player: TournamentLeaderEntry;
  size?: PortraitSize;
  ringClass?: string;
}) {
  const palette = avatarPalette(player.id || player.name);
  const sizeClass = PORTRAIT_SIZES[size];

  if (player.headshot) {
    return (
      <img
        src={player.headshot}
        alt=""
        className={`${sizeClass} rounded-full object-cover bg-zinc-100 shrink-0 ${ringClass} shadow-sm`}
      />
    );
  }

  return (
    <span
      className={`${sizeClass} rounded-full flex items-center justify-center font-bold shrink-0 ${ringClass} shadow-sm`}
      style={{ backgroundColor: palette.bg, color: palette.text }}
      aria-hidden
    >
      {playerInitials(player.name)}
    </span>
  );
}

function playerMeta(player: TournamentLeaderEntry) {
  const team = getTeam(player.teamCode, player.teamName, player.teamLogo);
  const parts: string[] = [];
  if (player.number > 0) parts.push(`#${player.number}`);
  if (team.name) parts.push(team.name);
  return parts.join(" · ");
}

function PlayerNameWithFlag({
  player,
  className = "",
  flagClassName = "text-sm",
}: {
  player: TournamentLeaderEntry;
  className?: string;
  flagClassName?: string;
}) {
  const team = getTeam(player.teamCode, player.teamName, player.teamLogo);
  const featured = isFeaturedPlayer(player);
  return (
    <span className={`inline-flex items-center gap-1.5 min-w-0 flex-wrap ${className}`}>
      <span className={`shrink-0 leading-none ${flagClassName}`} aria-hidden>
        {team.flag}
      </span>
      <span className="truncate">{player.name}</span>
      {featured && <FeaturedPlayerBadge />}
    </span>
  );
}

function GoalBar({ value, max, className = "" }: { value: number; max: number; className?: string }) {
  const pct = max > 0 ? Math.max(8, Math.round((value / max) * 100)) : 0;
  return (
    <div className={`h-1.5 rounded-full bg-zinc-100 overflow-hidden ${className}`}>
      <div
        className="h-full rounded-full bg-gradient-to-r from-amber-400 to-amber-500 transition-all"
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}

function GoldenBootRace({ scorers }: { scorers: TournamentLeaderEntry[] }) {
  const race = scorers.slice(0, 6);
  if (race.length === 0) return null;

  const leader = race[0];
  const maxGoals = Math.max(leader.goals, 1);
  const chasers = race.slice(1);

  return (
    <section className="card-elevated rounded-2xl overflow-hidden">
      <div className="relative overflow-hidden border-b border-amber-100 bg-gradient-to-br from-amber-50 via-white to-orange-50 px-5 py-5 sm:px-6 sm:py-6">
        <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-amber-200/30 blur-2xl" />
        <div className="absolute -left-6 bottom-0 h-24 w-24 rounded-full bg-orange-200/20 blur-2xl" />

        <div className="relative flex items-start justify-between gap-4 mb-5">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-amber-700/80">
              Golden Boot
            </p>
            <h2 className="text-lg sm:text-xl font-extrabold text-zinc-900 tracking-tight">
              Top Scorer Race
            </h2>
          </div>
          <span className="shrink-0 rounded-full bg-amber-100 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-amber-800">
            {race.length} in contention
          </span>
        </div>

        <Link
          href={getPlayerPath(leader)}
          className="relative flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 rounded-2xl border border-amber-200/80 bg-white/90 p-4 sm:p-5 shadow-sm hover:shadow-md hover:border-amber-300 transition-all group"
        >
          <div className="flex items-center gap-4 min-w-0 flex-1">
            <div className="relative shrink-0">
              <PlayerPortrait player={leader} size="xl" ringClass="ring-[3px] ring-amber-200" />
              <span className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full bg-amber-500 text-xs font-extrabold text-white shadow-md ring-2 ring-white">
                1
              </span>
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xl sm:text-2xl font-extrabold text-zinc-900 leading-tight group-hover:text-blue-600 transition-colors">
                <PlayerNameWithFlag player={leader} flagClassName="text-lg sm:text-xl" />
              </p>
              {playerMeta(leader) && (
                <p className="text-sm text-zinc-500 mt-1 truncate">{playerMeta(leader)}</p>
              )}
              <GoalBar value={leader.goals} max={maxGoals} className="mt-3 max-w-xs" />
            </div>
          </div>
          <div className="sm:text-right shrink-0 sm:pl-4 sm:border-l sm:border-amber-100">
            <p className="text-4xl sm:text-5xl font-black tabular-nums text-zinc-900 leading-none">
              {leader.goals}
            </p>
            <p className="text-xs font-semibold uppercase tracking-wider text-amber-700 mt-1">
              {leader.goals === 1 ? "goal" : "goals"}
            </p>
            {leader.assists > 0 && (
              <p className="text-xs text-zinc-400 mt-1">{leader.assists} assist{leader.assists === 1 ? "" : "s"}</p>
            )}
          </div>
        </Link>
      </div>

      {chasers.length > 0 && (
        <div className="divide-y divide-zinc-100 bg-white">
          {chasers.map((player, index) => {
            const rank = index + 2;
            const gap = leader.goals - player.goals;
            return (
              <Link
                key={player.id}
                href={getPlayerPath(player)}
                className="flex items-center gap-3 sm:gap-4 px-5 py-3.5 sm:px-6 hover:bg-zinc-50/80 transition-colors group"
              >
                <span className="w-6 text-center text-sm font-bold tabular-nums text-zinc-400 shrink-0">
                  {rank}
                </span>
                <PlayerPortrait player={player} size="sm" />
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-zinc-900 group-hover:text-blue-600 transition-colors">
                    <PlayerNameWithFlag player={player} />
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <GoalBar value={player.goals} max={maxGoals} className="flex-1 max-w-[140px] sm:max-w-[200px]" />
                    {gap > 0 && (
                      <span className="text-[10px] font-medium text-zinc-400 shrink-0">
                        −{gap}
                      </span>
                    )}
                  </div>
                </div>
                <div className="text-right shrink-0 pl-2">
                  <p className="text-lg font-extrabold tabular-nums text-zinc-900">{player.goals}</p>
                  <p className="text-[10px] uppercase tracking-wide text-zinc-400">goals</p>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </section>
  );
}

function LeadersTable({
  players,
  primaryKey,
  primaryLabel,
}: {
  players: TournamentLeaderEntry[];
  primaryKey: "goals" | "assists" | "appearances" | "yellowCards" | "redCards";
  primaryLabel: string;
}) {
  if (players.length === 0) {
    return (
      <p className="text-sm text-zinc-400 text-center py-12">
        No tournament data yet - check back after matches kick off.
      </p>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-zinc-100 text-left text-[10px] uppercase tracking-wider text-zinc-400">
            <th className="px-4 py-3 font-semibold w-10">#</th>
            <th className="px-4 py-3 font-semibold">Player</th>
            <th className="px-4 py-3 font-semibold text-center w-20">{primaryLabel}</th>
          </tr>
        </thead>
        <tbody>
          {players.map((player, index) => (
            <tr key={player.id} className="border-b border-zinc-50 last:border-0 hover:bg-zinc-50/80 transition-colors">
              <td className="px-4 py-3 font-bold text-zinc-400 tabular-nums">{index + 1}</td>
              <td className="px-4 py-3">
                <Link href={getPlayerPath(player)} className="flex items-center gap-3 group min-w-0">
                  <PlayerPortrait player={player} />
                  <div className="min-w-0">
                    <p className="font-semibold text-zinc-900 truncate group-hover:text-blue-600 transition-colors">
                      {player.name}
                      {player.number > 0 && (
                        <span className="text-zinc-400 font-normal ml-1">#{player.number}</span>
                      )}
                    </p>
                    {playerMeta(player) && (
                      <p className="text-xs text-zinc-400 truncate">{playerMeta(player)}</p>
                    )}
                  </div>
                </Link>
              </td>
              <td className="px-4 py-3 text-center">
                <span className="inline-flex min-w-[2rem] justify-center rounded-lg bg-blue-50 px-2 py-1 text-base font-bold tabular-nums text-blue-800">
                  {player[primaryKey]}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function TournamentLeadersPanel({ leaders }: { leaders: TournamentLeaders }) {
  const [tab, setTab] = useState<Tab>("goals");

  const tabs: { id: Tab; label: string; count: number }[] = [
    { id: "goals", label: "Goals", count: leaders.scorers.length },
    { id: "assists", label: "Assists", count: leaders.assists.length },
    { id: "appearances", label: "Appearances", count: leaders.appearances.length },
    { id: "cards", label: "Cards", count: leaders.yellowCards.length + leaders.redCards.length },
  ];

  return (
    <div className="space-y-6">
      <GoldenBootRace scorers={leaders.scorers} />

      <div className="card-elevated rounded-2xl overflow-hidden">
        <div className="host-stripe" />
        <div className="flex gap-1 overflow-x-auto p-2 border-b border-zinc-100 bg-zinc-50/50">
          {tabs.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              className={`shrink-0 rounded-xl px-4 py-2 text-sm font-semibold transition-colors ${
                tab === t.id
                  ? "bg-blue-600 text-white shadow-sm"
                  : "text-zinc-600 hover:bg-white hover:text-zinc-900"
              }`}
            >
              {t.label}
              {t.count > 0 && (
                <span className={`ml-1.5 text-xs ${tab === t.id ? "text-blue-200" : "text-zinc-400"}`}>
                  {t.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {tab === "goals" && (
          <LeadersTable
            players={leaders.scorers}
            primaryKey="goals"
            primaryLabel="Goals"
          />
        )}
        {tab === "assists" && (
          <LeadersTable
            players={leaders.assists}
            primaryKey="assists"
            primaryLabel="Assists"
          />
        )}
        {tab === "appearances" && (
          <LeadersTable
            players={leaders.appearances}
            primaryKey="appearances"
            primaryLabel="Appearances"
          />
        )}
        {tab === "cards" && (
          <div className="grid lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-zinc-100">
            <div>
              <p className="px-4 py-3 text-xs font-bold uppercase tracking-wider text-amber-700 bg-amber-50/50">
                Yellow Cards
              </p>
              <LeadersTable players={leaders.yellowCards} primaryKey="yellowCards" primaryLabel="Yellow" />
            </div>
            <div>
              <p className="px-4 py-3 text-xs font-bold uppercase tracking-wider text-red-700 bg-red-50/50">
                Red Cards
              </p>
              <LeadersTable players={leaders.redCards} primaryKey="redCards" primaryLabel="Red" />
            </div>
          </div>
        )}
      </div>

      <p className="text-xs text-zinc-400 text-center">
        Stats from match data · Auto-refreshes every 90s · Updated{" "}
        {new Date(leaders.updatedAt).toLocaleString()}
      </p>
    </div>
  );
}
