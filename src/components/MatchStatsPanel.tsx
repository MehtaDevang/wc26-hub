"use client";

import {
  Target, Shield, History, User, LayoutGrid, TrendingUp, BarChart3,
} from "lucide-react";
import { getTeam } from "@/lib/data";
import type {
  Match,
  MatchEvent,
  MatchLeader,
  MatchStats,
  HeadToHeadMatch,
  HeadToHeadRecord,
  TeamLineup,
  TeamRecord,
  GroupStandings,
} from "@/lib/types";

const CORE_STATS: Array<{ key: keyof MatchStats; label: string; higherIsBetter?: boolean }> = [
  { key: "possession", label: "Possession %", higherIsBetter: true },
  { key: "shots", label: "Shots", higherIsBetter: true },
  { key: "shotsOnTarget", label: "Shots on target", higherIsBetter: true },
  { key: "corners", label: "Corners", higherIsBetter: true },
];

const EXTRA_STATS: Array<{ key: keyof MatchStats; label: string; higherIsBetter?: boolean }> = [
  { key: "fouls", label: "Fouls", higherIsBetter: false },
  { key: "yellowCards", label: "Yellow cards", higherIsBetter: false },
  { key: "redCards", label: "Red cards", higherIsBetter: false },
  { key: "saves", label: "Saves", higherIsBetter: true },
  { key: "passes", label: "Passes", higherIsBetter: true },
  { key: "passAccuracy", label: "Pass accuracy %", higherIsBetter: true },
  { key: "offsides", label: "Offsides", higherIsBetter: false },
  { key: "tackles", label: "Tackles", higherIsBetter: true },
  { key: "interceptions", label: "Interceptions", higherIsBetter: true },
];

type StatRowData = {
  key: string;
  label: string;
  home: number;
  away: number;
  isPercent?: boolean;
  higherIsBetter?: boolean;
};

function formatStatValue(value: number, isPercent: boolean): string {
  if (isPercent) {
    return Number.isInteger(value) ? `${value}` : value.toFixed(1);
  }
  return String(value);
}

function buildStatRows(stats: MatchStats): StatRowData[] {
  const rows: StatRowData[] = [];

  for (const { key, label, higherIsBetter } of [...CORE_STATS, ...EXTRA_STATS]) {
    const val = stats[key];
    if (Array.isArray(val)) {
      rows.push({
        key,
        label,
        home: val[0],
        away: val[1],
        isPercent: key === "possession" || key === "passAccuracy",
        higherIsBetter,
      });
    }
  }

  return rows;
}

function countStatLeaders(rows: StatRowData[]) {
  let home = 0;
  let away = 0;
  let tied = 0;

  for (const row of rows) {
    if (row.home === row.away) {
      tied += 1;
      continue;
    }
    const homeLeads = row.higherIsBetter
      ? row.home > row.away
      : row.home < row.away;
    if (homeLeads) home += 1;
    else away += 1;
  }

  return { home, away, tied, total: rows.length };
}

function StatRow({
  label,
  home,
  away,
  isPercent = false,
  higherIsBetter = true,
}: StatRowData) {
  const total = isPercent && home + away > 0 ? 100 : home + away || 1;
  const homePct = isPercent && home + away > 0 ? home : (home / total) * 100;
  const awayPct = 100 - homePct;

  const homeLeads = higherIsBetter ? home > away : home < away;
  const awayLeads = higherIsBetter ? away > home : away < home;
  const tied = home === away;

  return (
    <div className="grid grid-cols-[4rem_auto_4rem] items-center justify-center gap-x-4 gap-y-2 py-3 border-b border-zinc-100 last:border-0">
      <span
        className={`text-right text-base font-bold tabular-nums leading-none ${
          tied ? "text-zinc-800" : homeLeads ? "text-[var(--wc-usa)]" : "text-zinc-400"
        }`}
      >
        {formatStatValue(home, isPercent)}
      </span>

      <div className="w-36 sm:w-44">
        <p className="mb-1.5 text-center text-[10px] font-semibold uppercase tracking-wide text-zinc-500">
          {label}
        </p>
        <div className="flex h-2.5 overflow-hidden rounded-full bg-zinc-100 shadow-inner">
          <div className="bg-[var(--wc-usa)]" style={{ width: `${homePct}%` }} />
          <div className="bg-[var(--wc-canada)]" style={{ width: `${awayPct}%` }} />
        </div>
      </div>

      <span
        className={`text-left text-base font-bold tabular-nums leading-none ${
          tied ? "text-zinc-800" : awayLeads ? "text-[var(--wc-canada)]" : "text-zinc-400"
        }`}
      >
        {formatStatValue(away, isPercent)}
      </span>
    </div>
  );
}

function MetricTile({
  label,
  home,
  away,
  homeLabel,
  awayLabel,
  suffix = "",
}: {
  label: string;
  home: string;
  away: string;
  homeLabel: string;
  awayLabel: string;
  suffix?: string;
}) {
  const homeNum = parseFloat(home);
  const awayNum = parseFloat(away);
  const homeLeads = homeNum > awayNum;
  const awayLeads = awayNum > homeNum;

  return (
    <div className="rounded-xl border border-zinc-100 bg-zinc-50/80 p-4">
      <p className="mb-3 text-[10px] font-semibold uppercase tracking-wider text-zinc-400">
        {label}
      </p>
      <div className="grid grid-cols-[1fr_auto_1fr] items-end gap-2">
        <div className="text-left">
          <p
            className={`text-2xl font-extrabold tabular-nums leading-none ${
              homeLeads ? "text-[var(--wc-usa)]" : "text-zinc-700"
            }`}
          >
            {home}{suffix}
          </p>
          <p className="mt-1 truncate text-[10px] font-medium text-zinc-500">{homeLabel}</p>
        </div>
        <span className="pb-1 text-[10px] font-bold uppercase tracking-widest text-zinc-300">
          vs
        </span>
        <div className="text-right">
          <p
            className={`text-2xl font-extrabold tabular-nums leading-none ${
              awayLeads ? "text-[var(--wc-canada)]" : "text-zinc-700"
            }`}
          >
            {away}{suffix}
          </p>
          <p className="mt-1 truncate text-[10px] font-medium text-zinc-500">{awayLabel}</p>
        </div>
      </div>
    </div>
  );
}

function PossessionTile({
  home,
  away,
  homeLabel,
  awayLabel,
}: {
  home: number;
  away: number;
  homeLabel: string;
  awayLabel: string;
}) {
  const homeLeads = home > away;
  const awayLeads = away > home;

  return (
    <div className="rounded-xl border border-zinc-100 bg-zinc-50/80 p-4">
      <p className="mb-3 text-[10px] font-semibold uppercase tracking-wider text-zinc-400">
        Possession
      </p>
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0 flex-1 text-left">
          <p
            className={`text-2xl font-extrabold tabular-nums leading-none ${
              homeLeads ? "text-[var(--wc-usa)]" : "text-zinc-700"
            }`}
          >
            {formatStatValue(home, true)}%
          </p>
          <p className="mt-1 truncate text-[10px] font-medium text-zinc-500">{homeLabel}</p>
        </div>
        <div
          className="h-11 w-11 shrink-0 rounded-full"
          style={{
            background: `conic-gradient(var(--wc-usa) 0 ${home}%, var(--wc-canada) ${home}% 100%)`,
          }}
          aria-hidden
        />
        <div className="min-w-0 flex-1 text-right">
          <p
            className={`text-2xl font-extrabold tabular-nums leading-none ${
              awayLeads ? "text-[var(--wc-canada)]" : "text-zinc-700"
            }`}
          >
            {formatStatValue(away, true)}%
          </p>
          <p className="mt-1 truncate text-[10px] font-medium text-zinc-500">{awayLabel}</p>
        </div>
      </div>
    </div>
  );
}

function SideCard({
  title,
  icon: Icon,
  children,
}: {
  title: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  children: React.ReactNode;
}) {
  return (
    <section className="card-surface overflow-hidden rounded-2xl">
      <div className="host-stripe" />
      <div className="p-5">
        <h3 className="section-title mb-4 flex items-center gap-2 text-sm">
          <Icon size={16} className="text-blue-600" />
          {title}
        </h3>
        {children}
      </div>
    </section>
  );
}

function countEventStats(events: MatchEvent[]) {
  const goals = { home: 0, away: 0 };
  const cards = { yellow: 0, red: 0 };

  for (const e of events) {
    if (e.type === "goal") {
      if (e.team === "home") goals.home += 1;
      else if (e.team === "away") goals.away += 1;
    }
    if (e.type === "yellow") cards.yellow += 1;
    if (e.type === "red") cards.red += 1;
  }

  return { goals, cards };
}

export function MatchStatsPanel({
  match,
  stats,
  leaders,
  headToHead,
  headToHeadRecord,
  homeRecord,
  awayRecord,
  homeLineup,
  awayLineup,
  events = [],
  attendance,
  referee,
  groupStandings,
}: {
  match: Match;
  stats?: MatchStats;
  leaders?: MatchLeader[];
  headToHead?: HeadToHeadMatch[];
  headToHeadRecord?: HeadToHeadRecord;
  homeRecord?: TeamRecord;
  awayRecord?: TeamRecord;
  homeLineup?: TeamLineup;
  awayLineup?: TeamLineup;
  events?: MatchEvent[];
  attendance?: string;
  referee?: string;
  groupStandings?: GroupStandings;
}) {
  const home = getTeam(match.home, match.homeName, match.homeLogo);
  const away = getTeam(match.away, match.awayName, match.awayLogo);

  const rows = stats ? buildStatRows(stats) : [];
  const leadersCount = stats ? countStatLeaders(rows) : null;
  const eventStats = countEventStats(events);

  const homeStanding = groupStandings?.rows.find(
    (r) => r.teamCode === match.home || r.team === home.name
  );
  const awayStanding = groupStandings?.rows.find(
    (r) => r.teamCode === match.away || r.team === away.name
  );

  const shotAccuracy = stats
    ? [
        stats.shots[0] > 0
          ? ((stats.shotsOnTarget[0] / stats.shots[0]) * 100).toFixed(0)
          : "0",
        stats.shots[1] > 0
          ? ((stats.shotsOnTarget[1] / stats.shots[1]) * 100).toFixed(0)
          : "0",
      ]
    : null;

  const hasSideContent =
    (leaders && leaders.length > 0) ||
    homeRecord ||
    awayRecord ||
    homeStanding ||
    awayStanding ||
    (headToHeadRecord?.totalMeetings ?? 0) > 0 ||
    (headToHead && headToHead.length > 0) ||
    homeLineup?.formation ||
    awayLineup?.formation ||
    attendance ||
    referee ||
    events.length > 0;

  if (!stats && !hasSideContent) {
    return (
      <p className="text-sm text-zinc-400 text-center py-12">
        Stats not available yet.
      </p>
    );
  }

  return (
    <div className="space-y-6">
      {stats && (
        <>
          <section className="card-surface overflow-hidden rounded-2xl">
            <div className="host-stripe" />
            <div className="p-5 sm:p-6">
              <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                <h2 className="section-title flex items-center gap-2 text-base">
                  <BarChart3 size={18} className="text-blue-600" />
                  Match Stats
                </h2>
                {match.status !== "upcoming" && (
                  <p className="text-2xl font-extrabold tabular-nums text-zinc-900">
                    {match.homeScore}
                    <span className="mx-2 text-zinc-300">–</span>
                    {match.awayScore}
                  </p>
                )}
              </div>

              <div className="mb-5 grid grid-cols-[1fr_auto_1fr] items-center gap-4 rounded-xl bg-zinc-50 px-4 py-3">
                <div className="flex min-w-0 items-center justify-end gap-2">
                  {home.logo ? (
                    <img src={home.logo} alt="" className="h-7 w-7 shrink-0 object-contain" />
                  ) : (
                    <span className="text-xl shrink-0">{home.flag}</span>
                  )}
                  <span className="truncate text-right text-sm font-bold text-zinc-900">
                    {home.name}
                  </span>
                </div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                  vs
                </span>
                <div className="flex min-w-0 items-center gap-2">
                  <span className="truncate text-left text-sm font-bold text-zinc-900">
                    {away.name}
                  </span>
                  {away.logo ? (
                    <img src={away.logo} alt="" className="h-7 w-7 shrink-0 object-contain" />
                  ) : (
                    <span className="text-xl shrink-0">{away.flag}</span>
                  )}
                </div>
              </div>

              {leadersCount && leadersCount.total > 0 && (
                <div className="mb-5 flex flex-wrap items-center justify-center gap-2 rounded-xl bg-blue-50/60 px-4 py-3 text-center text-sm text-zinc-600">
                  <TrendingUp size={14} className="shrink-0 text-blue-600" />
                  <span>
                    <strong className="text-[var(--wc-usa)]">{home.name}</strong> led in{" "}
                    <strong>{leadersCount.home}</strong>
                    {leadersCount.tied > 0 && (
                      <> · <strong>{leadersCount.tied}</strong> tied</>
                    )}
                    {leadersCount.away > 0 && (
                      <>
                        {" "}
                        · <strong className="text-[var(--wc-canada)]">{away.name}</strong> led in{" "}
                        <strong>{leadersCount.away}</strong>
                      </>
                    )}
                  </span>
                </div>
              )}

              <div className="mb-6 grid gap-3 sm:grid-cols-2">
                <PossessionTile
                  home={stats.possession[0]}
                  away={stats.possession[1]}
                  homeLabel={home.name}
                  awayLabel={away.name}
                />
                <MetricTile
                  label="Total shots"
                  home={String(stats.shots[0])}
                  away={String(stats.shots[1])}
                  homeLabel={home.name}
                  awayLabel={away.name}
                />
                <MetricTile
                  label="Shots on target"
                  home={String(stats.shotsOnTarget[0])}
                  away={String(stats.shotsOnTarget[1])}
                  homeLabel={home.name}
                  awayLabel={away.name}
                />
                {shotAccuracy && (
                  <MetricTile
                    label="Shot accuracy"
                    home={shotAccuracy[0]}
                    away={shotAccuracy[1]}
                    homeLabel={home.name}
                    awayLabel={away.name}
                    suffix="%"
                  />
                )}
              </div>

              <div className="mx-auto max-w-md">
                <p className="mb-2 text-center text-[10px] font-semibold uppercase tracking-wider text-zinc-400">
                  Full comparison
                </p>
                {rows.map(({ key, ...row }) => (
                  <StatRow key={key} {...row} />
                ))}
              </div>
            </div>
          </section>
        </>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        {leaders && leaders.length > 0 && (
          <SideCard title="Match Leaders" icon={Target}>
            <div className="space-y-2">
              {leaders.map((l) => (
                <div
                  key={`${l.category}-${l.playerName}`}
                  className="flex items-center justify-between gap-3 rounded-lg bg-zinc-50 px-3 py-2.5"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-zinc-900">
                      {l.playerName}
                    </p>
                    <p className="truncate text-xs text-zinc-400">
                      {l.team} · {l.category}
                    </p>
                  </div>
                  <span className="shrink-0 text-sm font-bold tabular-nums text-blue-600">
                    {l.value}
                  </span>
                </div>
              ))}
            </div>
          </SideCard>
        )}

        {(homeRecord || awayRecord || homeStanding || awayStanding) && (
          <SideCard title="Tournament Form" icon={Shield}>
            <div className="space-y-3">
              {(homeRecord || homeStanding) && (
                <div className="rounded-lg bg-zinc-50 px-3 py-3">
                  <div className="mb-2 flex items-center gap-2">
                    <span className="text-base">{home.flag}</span>
                    <p className="text-sm font-bold text-zinc-900">{home.name}</p>
                  </div>
                  {homeRecord && (
                    <p className="text-sm text-zinc-600">
                      Record: <strong>{homeRecord.summary}</strong>
                      {homeRecord.points && (
                        <span className="text-zinc-400"> · {homeRecord.points} pts</span>
                      )}
                    </p>
                  )}
                  {homeStanding && (
                    <p className="mt-1 text-xs text-zinc-500">
                      Group {match.group}: #{homeStanding.rank} · {homeStanding.points} pts · GD{" "}
                      {homeStanding.goalDiff}
                    </p>
                  )}
                </div>
              )}
              {(awayRecord || awayStanding) && (
                <div className="rounded-lg bg-zinc-50 px-3 py-3">
                  <div className="mb-2 flex items-center gap-2">
                    <span className="text-base">{away.flag}</span>
                    <p className="text-sm font-bold text-zinc-900">{away.name}</p>
                  </div>
                  {awayRecord && (
                    <p className="text-sm text-zinc-600">
                      Record: <strong>{awayRecord.summary}</strong>
                      {awayRecord.points && (
                        <span className="text-zinc-400"> · {awayRecord.points} pts</span>
                      )}
                    </p>
                  )}
                  {awayStanding && (
                    <p className="mt-1 text-xs text-zinc-500">
                      Group {match.group}: #{awayStanding.rank} · {awayStanding.points} pts · GD{" "}
                      {awayStanding.goalDiff}
                    </p>
                  )}
                </div>
              )}
            </div>
          </SideCard>
        )}

        {(homeLineup?.formation || awayLineup?.formation) && (
          <SideCard title="Formations" icon={LayoutGrid}>
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-lg bg-zinc-50 px-3 py-4 text-center">
                <p className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-zinc-400">
                  {home.name}
                </p>
                <p className="text-2xl font-extrabold text-[var(--wc-usa)]">
                  {homeLineup?.formation || "—"}
                </p>
              </div>
              <div className="rounded-lg bg-zinc-50 px-3 py-4 text-center">
                <p className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-zinc-400">
                  {away.name}
                </p>
                <p className="text-2xl font-extrabold text-[var(--wc-canada)]">
                  {awayLineup?.formation || "—"}
                </p>
              </div>
            </div>
          </SideCard>
        )}

        {(headToHeadRecord || (headToHead && headToHead.length > 0)) && (
          <SideCard title="Head-to-Head" icon={History}>
            {headToHeadRecord && headToHeadRecord.totalMeetings > 0 ? (
              <>
                <div className="grid grid-cols-3 gap-2 mb-3">
                  <div className="rounded-lg bg-[var(--wc-usa-light)] px-2 py-2 text-center">
                    <p className="text-lg font-bold text-[var(--wc-usa)]">{headToHeadRecord.homeWins}</p>
                    <p className="text-[9px] font-semibold text-zinc-500 truncate">{home.name}</p>
                  </div>
                  <div className="rounded-lg bg-zinc-100 px-2 py-2 text-center">
                    <p className="text-lg font-bold text-zinc-600">{headToHeadRecord.draws}</p>
                    <p className="text-[9px] font-semibold text-zinc-500">Draws</p>
                  </div>
                  <div className="rounded-lg bg-[var(--wc-canada-light)] px-2 py-2 text-center">
                    <p className="text-lg font-bold text-[var(--wc-canada)]">{headToHeadRecord.awayWins}</p>
                    <p className="text-[9px] font-semibold text-zinc-500 truncate">{away.name}</p>
                  </div>
                </div>
                <p className="text-xs text-zinc-500 mb-3">
                  Goals {headToHeadRecord.homeGoals}–{headToHeadRecord.awayGoals}
                  {headToHeadRecord.worldCupMeetings > 0 &&
                    ` · ${headToHeadRecord.worldCupMeetings} WC meeting${headToHeadRecord.worldCupMeetings === 1 ? "" : "s"}`}
                </p>
              </>
            ) : (
              <p className="text-xs text-zinc-500 mb-3">No previous meetings on record.</p>
            )}
            {headToHead && headToHead.length > 0 && (
            <div className="space-y-2">
              {headToHead.slice(0, 5).map((h, i) => (
                <div
                  key={`${h.date}-${h.opponent}-${i}`}
                  className="flex items-center justify-between gap-3 border-b border-zinc-50 py-2 text-sm last:border-0"
                >
                  <div className="min-w-0">
                    <p className="truncate font-medium text-zinc-800">
                      {h.homeTeam} {h.score} {h.awayTeam}
                    </p>
                    <p className="text-xs text-zinc-400">
                      {h.date} · {h.competition}
                    </p>
                  </div>
                  <span
                    className={`shrink-0 rounded px-1.5 py-0.5 text-[10px] font-bold ${
                      h.resultForHome === "W"
                        ? "bg-emerald-50 text-emerald-700"
                        : h.resultForHome === "L"
                          ? "bg-red-50 text-red-600"
                          : "bg-zinc-100 text-zinc-600"
                    }`}
                  >
                    {h.resultForHome}
                  </span>
                </div>
              ))}
            </div>
            )}
          </SideCard>
        )}

        {(attendance || referee || events.length > 0) && (
          <SideCard title="Match Facts" icon={User}>
            <div className="space-y-3 text-sm text-zinc-600">
              {match.status !== "upcoming" && (
                <div className="grid grid-cols-2 gap-2">
                  <div className="rounded-lg bg-zinc-50 px-3 py-2 text-center">
                    <p className="text-lg font-bold tabular-nums text-zinc-900">
                      {eventStats.goals.home}
                    </p>
                    <p className="text-[10px] text-zinc-400">{home.name} goals</p>
                  </div>
                  <div className="rounded-lg bg-zinc-50 px-3 py-2 text-center">
                    <p className="text-lg font-bold tabular-nums text-zinc-900">
                      {eventStats.goals.away}
                    </p>
                    <p className="text-[10px] text-zinc-400">{away.name} goals</p>
                  </div>
                </div>
              )}
              {(eventStats.cards.yellow > 0 || eventStats.cards.red > 0) && (
                <p>
                  Discipline:{" "}
                  <strong>{eventStats.cards.yellow}</strong> yellow
                  {eventStats.cards.red > 0 && (
                    <>
                      , <strong>{eventStats.cards.red}</strong> red
                    </>
                  )}
                </p>
              )}
              {attendance && (
                <p>
                  Attendance: <strong>{attendance}</strong>
                </p>
              )}
              {referee && (
                <p>
                  Referee: <strong>{referee}</strong>
                </p>
              )}
              <p className="text-xs text-zinc-400">
                Group {match.group}
                {match.venueCity && ` · ${match.venueCity}`}
              </p>
            </div>
          </SideCard>
        )}
      </div>
    </div>
  );
}
