"use client";

import { useState } from "react";
import Link from "next/link";
import { Goal, Trophy, Users, Swords } from "lucide-react";
import {
  ALL_TIME_PLAYER_GOALS,
  ALL_TIME_TEAM_GOALS,
  SINGLE_TOURNAMENT_PLAYER_GOALS,
  SINGLE_TOURNAMENT_TEAM_GOALS,
  HIGHEST_SCORING_MATCHES,
  SINGLE_MATCH_PLAYER_GOALS,
  HIGHEST_SCORING_TOURNAMENTS,
  GOAL_RECORDS_SUMMARY,
  GOAL_RECORD_CATEGORIES,
  type GoalRecordCategory,
} from "@/lib/world-cup-goal-records";

function RankBadge({ rank }: { rank: number }) {
  return (
    <span className="text-sm font-extrabold text-zinc-300 w-6 shrink-0 tabular-nums text-center">
      {rank}
    </span>
  );
}

function GoalsBadge({ goals }: { goals: number }) {
  return (
    <span className="text-lg font-extrabold text-[var(--wc-usa)] tabular-nums shrink-0">
      {goals}
    </span>
  );
}

function SummaryStrip() {
  const items = [
    { label: "All-time leader", value: `${GOAL_RECORDS_SUMMARY.allTimeLeader.goals}`, sub: GOAL_RECORDS_SUMMARY.allTimeLeader.name, flag: GOAL_RECORDS_SUMMARY.allTimeLeader.flag },
    { label: "One tournament", value: `${GOAL_RECORDS_SUMMARY.singleTournamentLeader.goals}`, sub: `Fontaine ${GOAL_RECORDS_SUMMARY.singleTournamentLeader.year}`, flag: GOAL_RECORDS_SUMMARY.singleTournamentLeader.flag },
    { label: "One match (player)", value: `${GOAL_RECORDS_SUMMARY.singleMatchPlayer.goals}`, sub: GOAL_RECORDS_SUMMARY.singleMatchPlayer.name, flag: GOAL_RECORDS_SUMMARY.singleMatchPlayer.flag },
    { label: "Top nation", value: `${GOAL_RECORDS_SUMMARY.topScoringNation.goals}`, sub: GOAL_RECORDS_SUMMARY.topScoringNation.team, flag: GOAL_RECORDS_SUMMARY.topScoringNation.flag },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      {items.map((item) => (
        <div key={item.label} className="card-surface rounded-xl px-3 py-3 text-center">
          <span className="text-xl">{item.flag}</span>
          <p className="text-xl font-extrabold text-zinc-900 tabular-nums mt-1">{item.value}</p>
          <p className="text-[10px] text-zinc-400 uppercase tracking-wider font-semibold">{item.label}</p>
          <p className="text-xs text-zinc-500 mt-0.5 truncate">{item.sub}</p>
        </div>
      ))}
    </div>
  );
}

function AllTimePlayersSection() {
  return (
    <div className="space-y-2">
      {ALL_TIME_PLAYER_GOALS.map((player) => (
        <div
          key={`${player.name}-${player.rank}`}
          className="flex items-center gap-3 card-surface rounded-xl px-4 py-3 hover:shadow-sm transition-shadow"
        >
          <RankBadge rank={player.rank} />
          <span className="text-xl shrink-0">{player.flag}</span>
          <div className="flex-1 min-w-0">
            <p className="font-bold text-zinc-900 truncate">{player.name}</p>
            <p className="text-xs text-zinc-500 mt-0.5">
              {player.country}
              {player.matches && ` · ${player.matches} matches`}
              {" · "}
              {player.tournaments}
            </p>
            {player.note && <p className="text-xs text-[var(--wc-gold)] font-medium mt-0.5">{player.note}</p>}
          </div>
          <GoalsBadge goals={player.goals} />
        </div>
      ))}
    </div>
  );
}

function SingleTournamentPlayersSection() {
  return (
    <div className="space-y-2">
      {SINGLE_TOURNAMENT_PLAYER_GOALS.map((player) => (
        <div
          key={`${player.year}-${player.name}`}
          className="flex items-center gap-3 card-surface rounded-xl px-4 py-3"
        >
          <RankBadge rank={player.rank} />
          <span className="text-xl shrink-0">{player.flag}</span>
          <div className="flex-1 min-w-0">
            <p className="font-bold text-zinc-900">{player.name}</p>
            <p className="text-xs text-zinc-500 mt-0.5">
              {player.country} · {player.year} · {player.matches} matches
            </p>
            {player.note && <p className="text-xs text-amber-600 font-medium mt-0.5">{player.note}</p>}
          </div>
          <GoalsBadge goals={player.goals} />
        </div>
      ))}
    </div>
  );
}

function TeamGoalsList({
  teams,
  showPerGame,
}: {
  teams: typeof ALL_TIME_TEAM_GOALS;
  showPerGame?: boolean;
}) {
  return (
    <div className="space-y-2">
      {teams.map((team) => (
        <div
          key={`${team.team}-${team.note ?? team.rank}`}
          className="flex items-center gap-3 card-surface rounded-xl px-4 py-3"
        >
          <RankBadge rank={team.rank} />
          <span className="text-xl shrink-0">{team.flag}</span>
          <div className="flex-1 min-w-0">
            <p className="font-bold text-zinc-900">{team.team}</p>
            <p className="text-xs text-zinc-500 mt-0.5">
              {team.matches && `${team.matches} matches`}
              {showPerGame && team.goalsPerGame && ` · ${team.goalsPerGame.toFixed(2)} per game`}
              {team.note && ` · ${team.note}`}
            </p>
          </div>
          <GoalsBadge goals={team.goals} />
        </div>
      ))}
    </div>
  );
}

function SingleMatchSection() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-bold text-zinc-900 mb-3 flex items-center gap-2">
          <Swords size={15} className="text-[var(--wc-usa)]" />
          Most goals in one match (player)
        </h3>
        <div className="space-y-2">
          {SINGLE_MATCH_PLAYER_GOALS.map((record) => (
            <div key={`${record.year}-${record.name}`} className="card-surface rounded-xl px-4 py-3">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <span className="text-xl shrink-0">{record.flag}</span>
                  <div className="min-w-0">
                    <p className="font-bold text-zinc-900">{record.name}</p>
                    <p className="text-xs text-zinc-500 mt-0.5">
                      {record.year} · {record.score} vs {record.opponentFlag} {record.opponent}
                      {record.stage && ` · ${record.stage}`}
                    </p>
                  </div>
                </div>
                <GoalsBadge goals={record.goals} />
              </div>
              {record.note && <p className="text-xs text-zinc-500 mt-2 pl-9">{record.note}</p>}
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-sm font-bold text-zinc-900 mb-3 flex items-center gap-2">
          <Goal size={15} className="text-[var(--wc-usa)]" />
          Highest-scoring matches
        </h3>
        <div className="space-y-2">
          {HIGHEST_SCORING_MATCHES.map((match) => (
            <div key={`${match.year}-${match.winner}-${match.loser}`} className="card-surface rounded-xl px-4 py-3">
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="font-bold text-zinc-900">
                    {match.winnerFlag} {match.winner}{" "}
                    <span className="text-[var(--wc-usa)] tabular-nums">{match.score}</span>{" "}
                    {match.loserFlag} {match.loser}
                  </p>
                  <p className="text-xs text-zinc-500 mt-0.5">
                    {match.year} · {match.stage} · {match.totalGoals} total goals
                  </p>
                </div>
              </div>
              {match.highlight && (
                <p className="text-xs text-amber-600 font-medium mt-2">{match.highlight}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function TournamentsSection() {
  return (
    <div className="space-y-2">
      {HIGHEST_SCORING_TOURNAMENTS.map((edition) => (
        <div key={edition.year} className="card-surface rounded-xl px-4 py-3">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <span className="text-sm font-extrabold text-[var(--wc-usa)] w-10 shrink-0">{edition.year}</span>
              <span className="text-xl shrink-0">{edition.hostFlag}</span>
              <div className="min-w-0">
                <p className="font-bold text-zinc-900">{edition.host}</p>
                <p className="text-xs text-zinc-500 mt-0.5">
                  {edition.matches} matches · {edition.avgGoals.toFixed(2)} goals/game
                </p>
              </div>
            </div>
            <GoalsBadge goals={edition.totalGoals} />
          </div>
          {edition.note && <p className="text-xs text-amber-600 font-medium mt-2 pl-[3.25rem]">{edition.note}</p>}
        </div>
      ))}
    </div>
  );
}

const CATEGORY_INTRO: Record<GoalRecordCategory, string> = {
  "all-time-players": "Career World Cup goals across every edition a player appeared in (1930–2022).",
  "single-tournament-players": "Golden Boot territory - most goals by one player in a single World Cup.",
  "all-time-teams": "Total goals scored by each nation across all World Cups through 2022.",
  "single-tournament-teams": "Most goals scored by one country in a single tournament.",
  "single-match": "Individual hauls and the highest-scoring games in World Cup history.",
  tournaments: "Editions with the most total goals - and the highest scoring rate ever (1954).",
};

export function GoalRecordsTab() {
  const [category, setCategory] = useState<GoalRecordCategory>("all-time-players");

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <p className="text-sm text-zinc-500">
          All-time and single-edition goal records from 94 years of World Cup football.
        </p>
        <Link
          href="/leaders"
          className="text-sm font-semibold text-blue-600 hover:underline shrink-0 flex items-center gap-1"
        >
          <Trophy size={14} />
          2026 live leaders →
        </Link>
      </div>

      <SummaryStrip />

      <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1">
        {GOAL_RECORD_CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            type="button"
            onClick={() => setCategory(cat.id)}
            className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-semibold transition-colors ${
              category === cat.id
                ? "bg-[var(--wc-usa)] text-white"
                : "bg-white border border-zinc-200 text-zinc-600 hover:bg-zinc-50"
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      <p className="text-sm text-zinc-500">{CATEGORY_INTRO[category]}</p>

      {category === "all-time-players" && <AllTimePlayersSection />}
      {category === "single-tournament-players" && <SingleTournamentPlayersSection />}
      {category === "all-time-teams" && <TeamGoalsList teams={ALL_TIME_TEAM_GOALS} showPerGame />}
      {category === "single-tournament-teams" && <TeamGoalsList teams={SINGLE_TOURNAMENT_TEAM_GOALS} />}
      {category === "single-match" && <SingleMatchSection />}
      {category === "tournaments" && <TournamentsSection />}

      <div className="rounded-xl bg-[var(--wc-usa-light)] border border-[var(--wc-usa)]/15 px-4 py-3 flex items-start gap-3">
        <Users size={16} className="text-[var(--wc-usa)] shrink-0 mt-0.5" />
        <div className="text-sm text-zinc-600">
          <p>
            Records through Qatar 2022. For{" "}
            <strong className="text-zinc-800">World Cup 2026</strong> Golden Boot and live scoring, see{" "}
            <Link href="/leaders" className="text-blue-600 font-semibold hover:underline">
              Tournament Leaders
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
