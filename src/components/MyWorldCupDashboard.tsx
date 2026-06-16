"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  Star,
  Calendar,
  Table2,
  GitBranch,
  Tv,
  Puzzle,
  Trophy,
  ArrowRight,
  BarChart3,
} from "lucide-react";
import clsx from "clsx";
import { MatchClashRow } from "@/components/MatchBattleGraphic";
import { MyTeamsPushPrompt } from "@/components/MyTeamsPushPrompt";
import { PuzzleStreakCard } from "@/components/PuzzleStreakCard";
import { getTeam, TEAMS } from "@/lib/data";
import { getMyTeams, setMyTeams, toggleMyTeam, MAX_MY_TEAMS } from "@/lib/my-teams";
import { getBracketPicks } from "@/lib/bracket-picks";
import { fetchMatches } from "@/lib/matches";
import { useTimezone } from "@/components/TimezoneProvider";
import type { Match } from "@/lib/types";

interface MyWorldCupDashboardProps {
  initialTodayMatches: Match[];
}

function teamInMatch(match: Match, code: string): boolean {
  const u = code.toUpperCase();
  return match.home.toUpperCase() === u || match.away.toUpperCase() === u;
}

export function MyWorldCupDashboard({ initialTodayMatches }: MyWorldCupDashboardProps) {
  const timezone = useTimezone();
  const [codes, setCodes] = useState<string[]>([]);
  const [allMatches, setAllMatches] = useState<Match[]>(initialTodayMatches);
  const [bracketPickCount, setBracketPickCount] = useState(0);

  useEffect(() => {
    setCodes(getMyTeams());
    const picks = getBracketPicks();
    setBracketPickCount(Object.keys(picks).length);
    const refresh = () => {
      setCodes(getMyTeams());
      setBracketPickCount(Object.keys(getBracketPicks()).length);
    };
    window.addEventListener("wc26-my-teams-changed", refresh);
    window.addEventListener("storage", refresh);
    return () => {
      window.removeEventListener("wc26-my-teams-changed", refresh);
      window.removeEventListener("storage", refresh);
    };
  }, []);

  useEffect(() => {
    fetchMatches({ range: "full", timeZone: timezone })
      .then(setAllMatches)
      .catch(() => {});
  }, [timezone]);

  const myToday = useMemo(() => {
    if (!codes.length) return [];
    return initialTodayMatches.filter((m) => codes.some((c) => teamInMatch(m, c)));
  }, [initialTodayMatches, codes]);

  const myUpcoming = useMemo(() => {
    if (!codes.length) return [];
    return allMatches
      .filter(
        (m) =>
          m.status === "upcoming" &&
          codes.some((c) => teamInMatch(m, c))
      )
      .slice(0, 5);
  }, [allMatches, codes]);

  const quickLinks = [
    { href: "/fixtures", label: "Full schedule", icon: Calendar },
    { href: "/standings", label: "Group tables", icon: Table2 },
    { href: "/bracket", label: "Live bracket", icon: GitBranch },
    { href: "/watch", label: "Where to watch", icon: Tv },
    { href: "/leaders", label: "Golden Boot", icon: BarChart3 },
    { href: "/puzzles", label: "Daily puzzles", icon: Puzzle },
  ];

  return (
    <div className="space-y-8">
      <section className="card-surface rounded-2xl overflow-hidden">
        <div className="host-stripe" />
        <div className="p-5 sm:p-6">
          <h2 className="font-bold text-zinc-900 flex items-center gap-2 mb-1">
            <Star size={18} className="text-amber-500 fill-amber-500" />
            Your teams
            <span className="text-xs font-normal text-zinc-400 ml-1">
              ({codes.length}/{MAX_MY_TEAMS})
            </span>
          </h2>
          <p className="text-sm text-zinc-500 mb-4">
            Tap to follow - your picks sync across this device.
          </p>
          <div className="flex flex-wrap gap-2">
            {Object.values(TEAMS)
              .sort((a, b) => a.name.localeCompare(b.name))
              .map((team) => {
                const active = codes.includes(team.code);
                return (
                  <button
                    key={team.code}
                    type="button"
                    onClick={() => setCodes(toggleMyTeam(team.code))}
                    className={clsx(
                      "inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium border transition-colors",
                      active
                        ? "bg-amber-50 border-amber-200 text-amber-800"
                        : "bg-white border-zinc-200 text-zinc-600 hover:border-zinc-300"
                    )}
                    title={team.name}
                  >
                    <span>{team.flag}</span>
                    <span className="hidden sm:inline max-w-[7rem] truncate">{team.name}</span>
                    <span className="sm:hidden">{team.code}</span>
                  </button>
                );
              })}
          </div>
          {codes.length > 0 && (
            <button
              type="button"
              onClick={() => setCodes(setMyTeams([]))}
              className="text-xs text-zinc-400 hover:text-red-600 mt-3"
            >
              Clear all teams
            </button>
          )}
        </div>
      </section>

      {codes.length > 0 && (
        <>
          <MyTeamsPushPrompt />

          {(myToday.length > 0 || myUpcoming.length > 0) && (
            <section>
              <h2 className="section-title text-base mb-4">Your matches</h2>
              {myToday.length > 0 && (
                <div className="card-surface rounded-2xl overflow-hidden mb-4">
                  <p className="px-4 py-2 text-[10px] font-bold uppercase tracking-wider text-zinc-400 bg-zinc-50 border-b border-zinc-100">
                    Today
                  </p>
                  <div className="match-clash-list">
                    {myToday.map((m) => (
                      <MatchClashRow key={m.id} match={m} />
                    ))}
                  </div>
                </div>
              )}
              {myUpcoming.length > 0 && (
                <div className="card-surface rounded-2xl overflow-hidden">
                  <p className="px-4 py-2 text-[10px] font-bold uppercase tracking-wider text-zinc-400 bg-zinc-50 border-b border-zinc-100">
                    Coming up
                  </p>
                  <div className="match-clash-list">
                    {myUpcoming.map((m) => (
                      <MatchClashRow key={m.id} match={m} />
                    ))}
                  </div>
                </div>
              )}
            </section>
          )}

          <div className="grid gap-3 sm:grid-cols-3">
            {codes.map((code) => {
              const team = getTeam(code);
              return (
                <Link
                  key={code}
                  href={`/teams/${code}`}
                  className="card-surface rounded-xl p-4 hover:border-blue-200 hover:shadow-sm transition-all flex items-center gap-3"
                >
                  <span className="text-2xl">{team.flag}</span>
                  <div className="min-w-0">
                    <p className="font-bold text-zinc-900 truncate">{team.name}</p>
                    <p className="text-xs text-blue-600 font-medium">Team hub →</p>
                  </div>
                </Link>
              );
            })}
          </div>
        </>
      )}

      {codes.length === 0 && (
        <div className="card-surface rounded-2xl p-8 text-center">
          <Star size={32} className="mx-auto text-zinc-300 mb-3" />
          <p className="font-semibold text-zinc-900">No teams yet</p>
          <p className="text-sm text-zinc-500 mt-1 mb-4">
            Pick teams above or star them on any team page.
          </p>
          <Link href="/teams" className="btn-primary inline-flex items-center gap-2 px-5 py-2.5 text-sm">
            Browse all 48 teams
          </Link>
        </div>
      )}

      <section>
        <h2 className="section-title text-base mb-4">Quick links</h2>
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {quickLinks.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className="card-surface rounded-xl px-4 py-3 flex items-center gap-3 hover:border-blue-200 transition-colors group"
            >
              <Icon size={18} className="text-[var(--wc-usa)] shrink-0" />
              <span className="font-medium text-zinc-800 group-hover:text-blue-600 text-sm">{label}</span>
              <ArrowRight size={14} className="ml-auto text-zinc-300 group-hover:text-blue-500" />
            </Link>
          ))}
        </div>
      </section>

      {bracketPickCount > 0 && (
        <Link
          href="/bracket/predict"
          className="card-surface rounded-xl p-4 flex items-center gap-3 hover:border-blue-200 transition-colors group"
        >
          <Trophy size={20} className="text-[var(--wc-gold)]" />
          <div className="flex-1 min-w-0">
            <p className="font-bold text-zinc-900">Your bracket</p>
            <p className="text-xs text-zinc-500">{bracketPickCount} picks saved on this device</p>
          </div>
          <ArrowRight size={16} className="text-zinc-300 group-hover:text-blue-500" />
        </Link>
      )}

      <PuzzleStreakCard />
    </div>
  );
}
