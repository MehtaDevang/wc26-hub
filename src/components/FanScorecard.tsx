"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  Star,
  Trophy,
  Flame,
  Target,
  Sparkles,
  Radio,
} from "lucide-react";
import { getTeam } from "@/lib/data";
import { getMyTeams } from "@/lib/my-teams";
import { getSavedTeamResult } from "@/lib/quiz/team-personality-storage";
import { getPuzzleStreakState } from "@/lib/puzzle-streaks";
import { fetchLeaders } from "@/lib/matches";
import type { Match } from "@/lib/types";

function teamInMatch(match: Match, code: string): boolean {
  const u = code.toUpperCase();
  return match.home.toUpperCase() === u || match.away.toUpperCase() === u;
}

export function FanScorecard({
  todayMatches,
}: {
  todayMatches: Match[];
}) {
  const [teams, setTeams] = useState<string[]>([]);
  const [topScorers, setTopScorers] = useState<
    Array<{ name: string; goals: number; teamCode: string; flag: string }>
  >([]);

  const [quiz, setQuiz] = useState<ReturnType<typeof getSavedTeamResult>>(null);
  const [streak, setStreak] = useState<ReturnType<typeof getPuzzleStreakState> | null>(null);

  useEffect(() => {
    setTeams(getMyTeams());
    setQuiz(getSavedTeamResult());
    setStreak(getPuzzleStreakState());
  }, []);

  useEffect(() => {
    if (teams.length === 0) return;
    fetchLeaders()
      .then((leaders) => {
        const mine = leaders.scorers.filter((p) => teams.includes(p.teamCode));
        setTopScorers(
          mine.slice(0, 3).map((p) => ({
            name: p.name,
            goals: p.goals,
            teamCode: p.teamCode,
            flag: p.flag,
          }))
        );
      })
      .catch(() => {});
  }, [teams]);

  const liveForMe = useMemo(
    () =>
      todayMatches.filter(
        (m) => m.status === "live" && teams.some((c) => teamInMatch(m, c))
      ),
    [todayMatches, teams]
  );

  const hasContent =
    teams.length > 0 ||
    quiz ||
    (streak && streak.currentStreak > 0) ||
    topScorers.length > 0;

  if (!hasContent) return null;

  return (
    <section className="card-elevated rounded-2xl overflow-hidden">
      <div className="host-stripe" />
      <div className="p-5 sm:p-6">
        <h2 className="text-lg font-extrabold text-zinc-900 mb-1">Your World Cup so far</h2>
        <p className="text-sm text-zinc-500 mb-5">
          Everything you follow on this device in one place.
        </p>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {teams.length > 0 && (
            <div className="rounded-xl border border-amber-100 bg-amber-50/50 p-4">
              <p className="text-[10px] font-bold uppercase tracking-wider text-amber-700 mb-2 flex items-center gap-1">
                <Star size={11} className="fill-amber-500 text-amber-500" />
                Teams
              </p>
              <p className="text-2xl font-black text-zinc-900">{teams.length}</p>
              <div className="flex flex-wrap gap-1 mt-2">
                {teams.map((code) => (
                  <span key={code} className="text-lg" title={getTeam(code).name}>
                    {getTeam(code).flag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {liveForMe.length > 0 && (
            <div className="rounded-xl border border-red-100 bg-red-50/50 p-4">
              <p className="text-[10px] font-bold uppercase tracking-wider text-red-700 mb-2 flex items-center gap-1">
                <Radio size={11} />
                Live now
              </p>
              <p className="text-2xl font-black text-zinc-900">{liveForMe.length}</p>
              <p className="text-xs text-zinc-500 mt-1">of your teams playing</p>
            </div>
          )}

          {streak && streak.currentStreak > 0 && (
            <Link
              href="/puzzles"
              className="rounded-xl border border-orange-100 bg-orange-50/50 p-4 hover:border-orange-200 transition-colors"
            >
              <p className="text-[10px] font-bold uppercase tracking-wider text-orange-700 mb-2 flex items-center gap-1">
                <Flame size={11} />
                Puzzles
              </p>
              <p className="text-2xl font-black text-zinc-900">{streak.currentStreak}</p>
              <p className="text-xs text-zinc-500 mt-1">day streak</p>
            </Link>
          )}

          {quiz && (
            <Link
              href={`/which-team/${quiz.code.toLowerCase()}`}
              className="rounded-xl border border-fuchsia-100 bg-fuchsia-50/50 p-4 hover:border-fuchsia-200 transition-colors"
            >
              <p className="text-[10px] font-bold uppercase tracking-wider text-fuchsia-700 mb-2 flex items-center gap-1">
                <Sparkles size={11} />
                Your team
              </p>
              <p className="text-lg font-black text-zinc-900 flex items-center gap-1.5">
                <span>{getTeam(quiz.code).flag}</span>
                {getTeam(quiz.code).name}
              </p>
            </Link>
          )}
        </div>

        {topScorers.length > 0 && (
          <div className="mt-5 rounded-xl border border-zinc-100 bg-white p-4">
            <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 mb-3 flex items-center gap-1">
              <Target size={11} className="text-[var(--wc-usa)]" />
              Your teams · Golden Boot race
            </p>
            <div className="space-y-2">
              {topScorers.map((p) => (
                <div key={p.name} className="flex items-center justify-between text-sm">
                  <span className="font-semibold text-zinc-800">
                    {p.flag} {p.name}
                  </span>
                  <span className="font-bold tabular-nums text-zinc-900">
                    {p.goals} {p.goals === 1 ? "goal" : "goals"}
                  </span>
                </div>
              ))}
            </div>
            <Link href="/leaders" className="text-xs font-semibold text-blue-600 hover:underline mt-3 inline-block">
              Full leaderboard →
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
