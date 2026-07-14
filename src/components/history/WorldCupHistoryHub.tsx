"use client";

import { useState, useEffect } from "react";
import {
  Trophy,
  Medal,
  BarChart3,
  Gift,
  ChevronDown,
  ChevronUp,
  Crown,
  Calendar,
  Goal,
  Users,
  AlertTriangle,
  BookOpen,
  Globe,
  List,
  ArrowRight,
  Flame,
  Star,
} from "lucide-react";
import Link from "next/link";
import {
  WORLD_CUP_EDITIONS,
  WORLD_CUP_RECORDS,
  TITLE_WINNERS,
  HISTORY_SUMMARY,
  HISTORY_INTRO,
  WORLD_CUP_TIMELINE,
  FORMAT_MILESTONES,
  CANCELLED_EDITIONS,
  HOST_NATIONS,
  UPCOMING_EDITION,
  TROPHY_INFO,
  AWARDS,
  type WorldCupEdition,
} from "@/lib/world-cup-history";
import {
  EDITION_AWARDS,
} from "@/lib/world-cup-awards";
import { GREATEST_MATCHES, WC_LEGENDS } from "@/lib/world-cup-legends";
import {
  WORLD_CUP_CONTROVERSIES,
  CONTROVERSY_CATEGORIES,
  CONTROVERSY_SUMMARY,
  type ControversyCategory,
  type WorldCupControversy,
} from "@/lib/world-cup-controversies";
import { GoalRecordsTab } from "@/components/history/GoalRecordsTab";

const TABS = [
  { id: "overview", label: "Overview", icon: BookOpen },
  { id: "matches", label: "Greatest Matches", icon: Flame },
  { id: "legends", label: "Legends", icon: Star },
  { id: "winners", label: "Winners", icon: Crown },
  { id: "finals", label: "All Finals", icon: List },
  { id: "editions", label: "All Cups", icon: Calendar },
  { id: "hosts", label: "Host Nations", icon: Globe },
  { id: "goals", label: "Goal Records", icon: Goal },
  { id: "records", label: "Records", icon: BarChart3 },
  { id: "awards", label: "Awards & Prizes", icon: Gift },
  { id: "controversies", label: "Controversies", icon: AlertTriangle },
] as const;

type TabId = (typeof TABS)[number]["id"];
const VALID_TAB_HASHES = new Set<string>(TABS.map((t) => t.id));

function SummaryStrip() {
  const items = [
    { label: "Editions", value: HISTORY_SUMMARY.editions, icon: Trophy },
    { label: "Total matches", value: HISTORY_SUMMARY.totalMatches.toLocaleString(), icon: Calendar },
    { label: "Total goals", value: HISTORY_SUMMARY.totalGoals.toLocaleString(), icon: Goal },
    { label: "Unique winners", value: HISTORY_SUMMARY.uniqueWinners, icon: Crown },
    { label: "Host nations", value: HISTORY_SUMMARY.uniqueHosts, icon: Globe },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
      {items.map((item) => (
        <div key={item.label} className="card-surface rounded-xl px-4 py-3 text-center">
          <item.icon size={16} className="mx-auto text-[var(--wc-gold)] mb-1.5" />
          <p className="text-xl font-extrabold text-zinc-900 tabular-nums">{item.value}</p>
          <p className="text-[10px] text-zinc-400 uppercase tracking-wider font-semibold mt-0.5">{item.label}</p>
        </div>
      ))}
    </div>
  );
}

function OverviewTab({ onNavigate }: { onNavigate: (tab: TabId) => void }) {
  const quickLinks: Array<{ id: TabId; label: string; desc: string }> = [
    { id: "winners", label: "Champions", desc: "All 8 nations to win the trophy" },
    { id: "finals", label: "Every final", desc: "Scores and venues since 1930" },
    { id: "goals", label: "Goal records", desc: "Klose, Fontaine, and famous hauls" },
    { id: "controversies", label: "Controversies", desc: "Hand of God, VAR, and more" },
  ];

  return (
    <div className="space-y-6">
      <div className="card-surface rounded-2xl p-5 sm:p-6">
        <p className="text-base sm:text-lg text-zinc-700 leading-relaxed">{HISTORY_INTRO.lead}</p>
        <p className="text-sm text-zinc-500 mt-3 leading-relaxed">{HISTORY_INTRO.body}</p>
      </div>

      <div className="card-surface rounded-2xl p-5 sm:p-6 border border-[var(--wc-usa)]/15 bg-gradient-to-br from-[var(--wc-usa-light)]/40 to-white">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--wc-usa)] mb-1">Up next</p>
            <h3 className="text-lg font-bold text-zinc-900 flex items-center gap-2">
              {UPCOMING_EDITION.hostFlag} FIFA World Cup {UPCOMING_EDITION.year}
            </h3>
            <p className="text-sm text-zinc-600 mt-2 leading-relaxed">{UPCOMING_EDITION.note}</p>
          </div>
          <Link
            href="/fixtures"
            className="inline-flex items-center gap-1 text-sm font-semibold text-[var(--wc-usa)] hover:underline shrink-0"
          >
            2026 fixtures <ArrowRight size={14} />
          </Link>
        </div>
        <dl className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
          <div className="rounded-lg bg-white/80 px-3 py-2">
            <dt className="text-[10px] text-zinc-400 uppercase font-semibold">Teams</dt>
            <dd className="font-bold text-zinc-900">{UPCOMING_EDITION.teams}</dd>
          </div>
          <div className="rounded-lg bg-white/80 px-3 py-2">
            <dt className="text-[10px] text-zinc-400 uppercase font-semibold">Matches</dt>
            <dd className="font-bold text-zinc-900">{UPCOMING_EDITION.matches}</dd>
          </div>
          <div className="rounded-lg bg-white/80 px-3 py-2 col-span-2">
            <dt className="text-[10px] text-zinc-400 uppercase font-semibold">Final</dt>
            <dd className="font-semibold text-zinc-800 text-xs sm:text-sm">{UPCOMING_EDITION.final}</dd>
          </div>
        </dl>
      </div>

      <div>
        <h3 className="font-bold text-zinc-900 mb-3">Key moments in World Cup history</h3>
        <div className="space-y-2">
          {WORLD_CUP_TIMELINE.map((event) => (
            <div
              key={event.year}
              className="card-surface rounded-xl px-4 py-3 flex gap-4 items-start"
            >
              <span className="text-sm font-extrabold text-[var(--wc-usa)] w-12 shrink-0 tabular-nums">
                {event.year}
              </span>
              {event.flag && <span className="text-lg shrink-0">{event.flag}</span>}
              <div className="min-w-0">
                <p className="text-sm font-semibold text-zinc-900">{event.title}</p>
                <p className="text-xs text-zinc-500 mt-0.5 leading-relaxed">{event.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="card-surface rounded-2xl p-5">
          <h3 className="font-bold text-zinc-900 mb-3">Tournament format evolution</h3>
          <div className="space-y-2">
            {FORMAT_MILESTONES.map((m) => (
              <div
                key={m.year}
                className="flex items-start gap-3 rounded-lg bg-zinc-50 px-3 py-2.5"
              >
                <span className="text-sm font-extrabold text-[var(--wc-gold)] w-12 shrink-0">{m.year}</span>
                <div>
                  <p className="text-sm font-semibold text-zinc-900">{m.teams} teams</p>
                  <p className="text-xs text-zinc-500 mt-0.5">{m.note}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card-surface rounded-2xl p-5">
          <h3 className="font-bold text-zinc-900 mb-3">Cancelled editions</h3>
          <p className="text-sm text-zinc-500 mb-3">
            No World Cup was played in 1942 or 1946 because of World War II and its aftermath.
          </p>
          <div className="space-y-3">
            {CANCELLED_EDITIONS.map((e) => (
              <div key={e.year} className="rounded-xl border border-zinc-100 px-4 py-3">
                <p className="text-sm font-bold text-zinc-900">
                  {e.year} - <span className="text-zinc-500 font-medium">{e.reason}</span>
                </p>
                <p className="text-xs text-zinc-500 mt-1 leading-relaxed">{e.note}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div>
        <h3 className="font-bold text-zinc-900 mb-3">Explore further</h3>
        <div className="grid gap-3 sm:grid-cols-2">
          {quickLinks.map((link) => (
            <button
              key={link.id}
              type="button"
              onClick={() => onNavigate(link.id)}
              className="card-surface rounded-xl p-4 text-left hover:shadow-md hover:-translate-y-0.5 transition-all"
            >
              <p className="font-semibold text-zinc-900">{link.label}</p>
              <p className="text-xs text-zinc-500 mt-1">{link.desc}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function FinalsTab() {
  return (
    <div className="space-y-4">
      <p className="text-sm text-zinc-500">
        Every FIFA World Cup final since 1930 - winners, runners-up, scores, and venues.
      </p>
      <div className="card-surface rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-[10px] uppercase tracking-wider text-zinc-400 border-b border-zinc-100 bg-zinc-50/80">
                <th className="text-left py-2.5 px-4 font-semibold">Year</th>
                <th className="text-left py-2.5 font-semibold">Winner</th>
                <th className="text-center py-2.5 px-2 font-semibold">Score</th>
                <th className="text-left py-2.5 font-semibold">Runner-up</th>
                <th className="text-left py-2.5 px-4 font-semibold hidden md:table-cell">Venue</th>
              </tr>
            </thead>
            <tbody>
              {WORLD_CUP_EDITIONS.map((e) => (
                <tr key={e.year} className="border-b border-zinc-50 hover:bg-zinc-50/60">
                  <td className="py-2.5 px-4 font-bold text-[var(--wc-usa)] tabular-nums">{e.year}</td>
                  <td className="py-2.5 font-semibold text-zinc-900">
                    {e.winnerFlag} {e.winner}
                  </td>
                  <td className="py-2.5 px-2 text-center font-bold text-zinc-800 tabular-nums whitespace-nowrap">
                    {e.finalScore}
                  </td>
                  <td className="py-2.5 text-zinc-600">
                    {e.runnerUpFlag} {e.runnerUp}
                  </td>
                  <td className="py-2.5 px-4 text-zinc-500 text-xs hidden md:table-cell">{e.finalVenue}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function HostsTab() {
  const sorted = [...HOST_NATIONS].sort((a, b) => b.editions.length - a.editions.length || a.country.localeCompare(b.country));

  return (
    <div className="space-y-4">
      <p className="text-sm text-zinc-500">
        {HOST_NATIONS.length} nations have hosted the men&apos;s World Cup. Only six have won the trophy on home soil.
      </p>
      <div className="grid gap-3 sm:grid-cols-2">
        {sorted.map((host) => (
          <div key={host.country} className="card-surface rounded-xl p-4">
            <div className="flex items-start gap-3">
              <span className="text-2xl shrink-0">{host.flag}</span>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <p className="font-bold text-zinc-900">{host.country}</p>
                  {host.winsAsHost > 0 && (
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--wc-gold)] bg-[var(--wc-gold-light)] px-2 py-0.5 rounded-full shrink-0">
                      Won at home
                    </span>
                  )}
                </div>
                <p className="text-xs text-zinc-500 mt-1">
                  Hosted: {host.editions.join(", ")}
                  {host.editions.length > 1 && ` · ${host.editions.length}×`}
                </p>
                {host.notes && (
                  <p className="text-xs text-zinc-600 mt-2 leading-relaxed">{host.notes}</p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function WinnersTab() {
  return (
    <div className="space-y-6">
      <div className="card-surface rounded-2xl p-5 sm:p-6">
        <h3 className="font-bold text-zinc-900 mb-1 flex items-center gap-2">
          <Trophy size={18} className="text-[var(--wc-gold)]" />
          All-time champions
        </h3>
        <p className="text-sm text-zinc-500 mb-5">Only 8 nations have ever lifted the World Cup trophy.</p>
        <div className="space-y-3">
          {TITLE_WINNERS.map((w, i) => (
            <div
              key={w.team}
              className="flex items-center gap-4 rounded-xl border border-zinc-100 px-4 py-3 hover:bg-zinc-50/80 transition-colors"
            >
              <span className="text-lg font-extrabold text-zinc-300 w-6 tabular-nums">{i + 1}</span>
              <span className="text-2xl shrink-0">{w.flag}</span>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-zinc-900">{w.team}</p>
                <p className="text-xs text-zinc-400 mt-0.5">{w.years.join(" · ")}</p>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                {Array.from({ length: w.titles }).map((_, j) => (
                  <Trophy key={j} size={14} className="text-[var(--wc-gold)]" fill="currentColor" fillOpacity={0.2} />
                ))}
                <span className="ml-1 text-sm font-extrabold text-[var(--wc-usa)] tabular-nums">{w.titles}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="card-surface rounded-2xl p-5 sm:p-6">
        <h3 className="font-bold text-zinc-900 mb-4">The trophy</h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-xl bg-[var(--wc-gold-light)] border border-[var(--wc-gold)]/20 p-4">
            <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--wc-gold)] mb-2">Current trophy</p>
            <p className="font-semibold text-zinc-900">{TROPHY_INFO.name}</p>
            <p className="text-sm text-zinc-600 mt-2 leading-relaxed">{TROPHY_INFO.description}</p>
            <dl className="mt-3 grid grid-cols-2 gap-2 text-xs">
              <div><dt className="text-zinc-400">Since</dt><dd className="font-semibold text-zinc-800">{TROPHY_INFO.introduced}</dd></div>
              <div><dt className="text-zinc-400">Material</dt><dd className="font-semibold text-zinc-800">{TROPHY_INFO.material}</dd></div>
              <div><dt className="text-zinc-400">Weight</dt><dd className="font-semibold text-zinc-800">{TROPHY_INFO.weight}</dd></div>
              <div><dt className="text-zinc-400">Designer</dt><dd className="font-semibold text-zinc-800">{TROPHY_INFO.designer}</dd></div>
            </dl>
          </div>
          <div className="rounded-xl bg-zinc-50 border border-zinc-100 p-4">
            <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 mb-2">Previous trophy</p>
            <p className="font-semibold text-zinc-900">{TROPHY_INFO.previousTrophy.name}</p>
            <p className="text-xs text-zinc-500 mt-1">{TROPHY_INFO.previousTrophy.years}</p>
            <p className="text-sm text-zinc-600 mt-2 leading-relaxed">{TROPHY_INFO.previousTrophy.note}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function EditionCard({ edition }: { edition: WorldCupEdition }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="card-surface rounded-xl overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-3 px-4 py-3.5 text-left hover:bg-zinc-50/80 transition-colors"
      >
        <span className="text-sm font-extrabold text-[var(--wc-usa)] w-10 shrink-0">{edition.year}</span>
        <span className="text-lg shrink-0">{edition.hostFlag}</span>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-zinc-900 truncate">{edition.host}</p>
          <p className="text-xs text-zinc-400 flex items-center gap-1.5 mt-0.5">
            <span>{edition.winnerFlag}</span>
            <span className="font-medium text-zinc-600">{edition.winner}</span>
            <span className="text-zinc-300">·</span>
            <span>{edition.finalScore}</span>
          </p>
        </div>
        {open ? <ChevronUp size={16} className="text-zinc-400 shrink-0" /> : <ChevronDown size={16} className="text-zinc-400 shrink-0" />}
      </button>

      {open && (
        <div className="px-4 pb-4 pt-1 border-t border-zinc-50 space-y-4">
          <p className="text-sm text-zinc-600 leading-relaxed italic">{edition.highlight}</p>

          <div className="rounded-xl bg-gradient-to-r from-[var(--wc-mexico-light)] via-[var(--wc-usa-light)] to-[var(--wc-canada-light)] p-4">
            <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 mb-2">Final</p>
            <div className="flex items-center justify-center gap-4 text-center">
              <div>
                <span className="text-2xl">{edition.winnerFlag}</span>
                <p className="text-sm font-bold text-zinc-900 mt-1">{edition.winner}</p>
              </div>
              <p className="text-xl font-extrabold text-zinc-900 tabular-nums">{edition.finalScore}</p>
              <div>
                <span className="text-2xl">{edition.runnerUpFlag}</span>
                <p className="text-sm font-bold text-zinc-900 mt-1">{edition.runnerUp}</p>
              </div>
            </div>
            <p className="text-center text-xs text-zinc-500 mt-2">
              {edition.finalVenue} · {edition.finalDate}
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center">
            {[
              { label: "Teams", value: edition.teams },
              { label: "Matches", value: edition.matches },
              { label: "Goals", value: edition.goals },
              { label: "Avg/game", value: edition.avgGoals.toFixed(2) },
            ].map((s) => (
              <div key={s.label} className="rounded-lg bg-zinc-50 py-2">
                <p className="text-sm font-bold text-zinc-900">{s.value}</p>
                <p className="text-[10px] text-zinc-400 uppercase">{s.label}</p>
              </div>
            ))}
          </div>

          <div className="grid gap-2 sm:grid-cols-2 text-sm">
            <div className="flex items-center gap-2 rounded-lg bg-amber-50 px-3 py-2">
              <Medal size={14} className="text-amber-600 shrink-0" />
              <span className="text-zinc-600">Top scorer:</span>
              <span className="font-semibold text-zinc-900">
                {edition.topScorer.flag} {edition.topScorer.name} ({edition.topScorer.goals})
              </span>
            </div>
            {edition.goldenBall && (
              <div className="flex items-center gap-2 rounded-lg bg-zinc-50 px-3 py-2">
                <span>⚽</span>
                <span className="text-zinc-600">Golden Ball:</span>
                <span className="font-semibold text-zinc-900">{edition.goldenBall}</span>
              </div>
            )}
            {edition.goldenGlove && (
              <div className="flex items-center gap-2 rounded-lg bg-zinc-50 px-3 py-2">
                <span>🧤</span>
                <span className="text-zinc-600">Golden Glove:</span>
                <span className="font-semibold text-zinc-900">{edition.goldenGlove}</span>
              </div>
            )}
            {edition.thirdPlace && (
              <div className="flex items-center gap-2 rounded-lg bg-zinc-50 px-3 py-2">
                <span>🥉</span>
                <span className="text-zinc-600">3rd place:</span>
                <span className="font-semibold text-zinc-900">{edition.thirdFlag} {edition.thirdPlace}</span>
              </div>
            )}
            {edition.ball && (
              <div className="flex items-center gap-2 rounded-lg bg-zinc-50 px-3 py-2">
                <span>⚽</span>
                <span className="text-zinc-600">Official ball:</span>
                <span className="font-semibold text-zinc-900">{edition.ball}</span>
              </div>
            )}
            {edition.attendance && (
              <div className="flex items-center gap-2 rounded-lg bg-zinc-50 px-3 py-2">
                <Users size={14} className="text-zinc-400 shrink-0" />
                <span className="text-zinc-600">Attendance:</span>
                <span className="font-semibold text-zinc-900">{edition.attendance}</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function EditionsTab() {
  return (
    <div className="space-y-2">
      <p className="text-sm text-zinc-500 mb-4">
        Every FIFA World Cup from 1930 to 2022 - tap an edition for finals, stats, and awards.
      </p>
      {WORLD_CUP_EDITIONS.map((edition) => (
        <EditionCard key={edition.year} edition={edition} />
      ))}
    </div>
  );
}

function RecordsTab() {
  return (
    <div className="space-y-4">
      <p className="text-sm text-zinc-500">
        Legendary milestones from 94 years of World Cup history.
      </p>
      <div className="grid gap-3 sm:grid-cols-2">
        {WORLD_CUP_RECORDS.map((record) => (
          <div key={record.category} className="card-surface rounded-xl p-4 hover:shadow-sm transition-shadow">
            <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 mb-2">{record.category}</p>
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="font-bold text-zinc-900 flex items-center gap-2">
                  {record.flag && <span>{record.flag}</span>}
                  {record.holder}
                </p>
                {record.detail && <p className="text-xs text-zinc-500 mt-1">{record.detail}</p>}
              </div>
              <p className="text-lg font-extrabold text-[var(--wc-usa)] shrink-0 tabular-nums">{record.value}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function AwardWinnerRow({
  icon,
  label,
  winner,
}: {
  icon: string;
  label: string;
  winner: { name: string; country: string; flag: string; detail?: string } | { team: string; flag: string };
}) {
  const isTeam = "team" in winner;
  return (
    <div className="flex items-center gap-3 py-2 border-b border-zinc-50 last:border-0">
      <span className="text-base w-6 shrink-0 text-center">{icon}</span>
      <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 w-24 shrink-0">{label}</span>
      {isTeam ? (
        <span className="text-sm font-semibold text-zinc-900">
          {winner.flag} {winner.team}
        </span>
      ) : (
        <div className="min-w-0">
          <span className="text-sm font-semibold text-zinc-900">
            {winner.flag} {winner.name}
          </span>
          <span className="text-xs text-zinc-400 ml-1.5">{winner.country}</span>
          {winner.detail && (
            <span className="text-xs text-[var(--wc-gold)] font-medium ml-1.5">({winner.detail})</span>
          )}
        </div>
      )}
    </div>
  );
}

type AwardRowWinner =
  | { name: string; country: string; flag: string; detail?: string }
  | { team: string; flag: string };

function EditionAwardsCard({ year, host, hostFlag }: { year: number; host: string; hostFlag: string }) {
  const [open, setOpen] = useState(false);
  const awards = EDITION_AWARDS[year];
  if (!awards) return null;

  const rows: { icon: string; label: string; winner: AwardRowWinner }[] = [];
  if (awards.goldenBall) rows.push({ icon: "⚽", label: "Golden Ball", winner: awards.goldenBall });
  if (awards.silverBall) rows.push({ icon: "🥈", label: "Silver Ball", winner: awards.silverBall });
  if (awards.bronzeBall) rows.push({ icon: "🥉", label: "Bronze Ball", winner: awards.bronzeBall });
  if (awards.goldenBoot) rows.push({ icon: "👟", label: "Golden Boot", winner: awards.goldenBoot });
  if (awards.goldenGlove) rows.push({ icon: "🧤", label: "Golden Glove", winner: awards.goldenGlove });
  if (awards.bestYoungPlayer) rows.push({ icon: "⭐", label: "Best Young Player", winner: awards.bestYoungPlayer });
  if (awards.fairPlay) rows.push({ icon: "🤝", label: "Fair Play", winner: awards.fairPlay });

  return (
    <div className="card-surface rounded-xl overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-3 px-4 py-3.5 text-left hover:bg-zinc-50/80 transition-colors"
      >
        <span className="text-sm font-extrabold text-[var(--wc-usa)] w-10 shrink-0">{year}</span>
        <span className="text-lg shrink-0">{hostFlag}</span>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-zinc-900">{host}</p>
          <p className="text-xs text-zinc-400 mt-0.5 truncate">
            {awards.goldenBall
              ? `⚽ ${awards.goldenBall.name}`
              : `👟 ${awards.goldenBoot.name}`}
            {awards.goldenBoot.detail && ` · ${awards.goldenBoot.detail}`}
          </p>
        </div>
        {(awards.prizePool || awards.winnerPrize) && (
          <span className="text-[10px] font-semibold text-[var(--wc-mexico)] bg-[var(--wc-mexico-light)] px-2 py-0.5 rounded-full shrink-0 hidden sm:inline">
            {awards.winnerPrize ?? awards.prizePool}
          </span>
        )}
        {open ? <ChevronUp size={16} className="text-zinc-400 shrink-0" /> : <ChevronDown size={16} className="text-zinc-400 shrink-0" />}
      </button>

      {open && (
        <div className="px-4 pb-4 border-t border-zinc-50">
          <div className="pt-2">
            {rows.map((row) => (
              <AwardWinnerRow key={row.label} icon={row.icon} label={row.label} winner={row.winner} />
            ))}
          </div>
          {(awards.prizePool || awards.winnerPrize) && (
            <div className="mt-3 rounded-lg bg-[var(--wc-gold-light)] border border-[var(--wc-gold)]/20 px-3 py-2.5 flex flex-wrap gap-x-6 gap-y-1 text-sm">
              {awards.prizePool && (
                <span>
                  <span className="text-zinc-500">Prize pool: </span>
                  <span className="font-bold text-zinc-900">{awards.prizePool}</span>
                </span>
              )}
              {awards.winnerPrize && (
                <span>
                  <span className="text-zinc-500">Winner share: </span>
                  <span className="font-bold text-[var(--wc-mexico)]">{awards.winnerPrize}</span>
                </span>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function AwardsTab() {
  return (
    <div className="space-y-6">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {AWARDS.map((award) => (
          <div key={award.name} className="card-surface rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xl">{award.icon}</span>
              <p className="font-bold text-zinc-900">{award.name}</p>
            </div>
            <p className="text-sm text-zinc-600">{award.description}</p>
            <p className="text-[10px] text-zinc-400 mt-2">First awarded: {award.firstAwarded}</p>
          </div>
        ))}
      </div>

      <div>
        <h3 className="font-bold text-zinc-900 mb-1 flex items-center gap-2">
          <Medal size={18} className="text-[var(--wc-gold)]" />
          Award winners by edition
        </h3>
        <p className="text-sm text-zinc-500 mb-4">
          Tap any World Cup to see who won the Golden Ball, Boot, Glove, Young Player award, and Fair Play trophy.
        </p>
        <div className="space-y-2">
          {WORLD_CUP_EDITIONS.filter((e) => EDITION_AWARDS[e.year]).map((edition) => (
            <EditionAwardsCard
              key={edition.year}
              year={edition.year}
              host={edition.host}
              hostFlag={edition.hostFlag}
            />
          ))}
        </div>
        <p className="text-xs text-zinc-400 mt-3">
          Golden Ball officially awarded since 1982. Silver/Bronze Ball since 2010. Golden Glove since 1994. Best Young Player since 2006. Fair Play since 1970. Earlier editions show top scorers only.
        </p>
      </div>

      <div className="card-surface rounded-2xl overflow-hidden">
        <div className="px-4 py-3 border-b border-zinc-100 bg-[var(--wc-gold-light)]">
          <h3 className="font-bold text-zinc-900 flex items-center gap-2">
            <Gift size={16} className="text-[var(--wc-gold)]" />
            Prize money by edition
          </h3>
          <p className="text-xs text-zinc-500 mt-0.5">FIFA tournament prize pool paid to national federations</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-[10px] uppercase tracking-wider text-zinc-400 border-b border-zinc-100">
                <th className="text-left py-2.5 px-4 font-semibold">Edition</th>
                <th className="text-left py-2.5 font-semibold">Champion</th>
                <th className="text-right py-2.5 px-2 font-semibold">Total pool</th>
                <th className="text-right py-2.5 px-4 font-semibold">Winner share</th>
              </tr>
            </thead>
            <tbody>
              {WORLD_CUP_EDITIONS.filter((e) => EDITION_AWARDS[e.year]?.prizePool).map((edition) => {
                const a = EDITION_AWARDS[edition.year]!;
                return (
                  <tr key={edition.year} className="border-b border-zinc-50 hover:bg-zinc-50/50">
                    <td className="py-2.5 px-4 font-medium text-zinc-900">
                      {edition.year} {edition.hostFlag}
                    </td>
                    <td className="py-2.5 text-zinc-600">
                      {edition.winnerFlag} {edition.winner}
                    </td>
                    <td className="py-2.5 px-2 text-right font-semibold text-zinc-800 tabular-nums">{a.prizePool}</td>
                    <td className="py-2.5 px-4 text-right font-bold text-[var(--wc-mexico)] tabular-nums">{a.winnerPrize}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function ControversyCard({ item }: { item: WorldCupControversy }) {
  const [open, setOpen] = useState(false);
  const cat = CONTROVERSY_CATEGORIES[item.category];

  return (
    <div className="card-surface rounded-xl overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-start gap-3 px-4 py-3.5 text-left hover:bg-zinc-50/80 transition-colors"
      >
        <span className="text-sm font-extrabold text-[var(--wc-usa)] w-12 shrink-0 tabular-nums pt-0.5">
          {item.year}
        </span>
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <p className="text-sm font-semibold text-zinc-900">{item.title}</p>
            <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${cat.color}`}>
              {cat.label}
            </span>
          </div>
          <p className="text-xs text-zinc-500">{item.edition}</p>
          <p className="text-sm text-zinc-600 mt-1.5 line-clamp-2 leading-relaxed">{item.summary}</p>
        </div>
        {open ? (
          <ChevronUp size={16} className="text-zinc-400 shrink-0 mt-1" />
        ) : (
          <ChevronDown size={16} className="text-zinc-400 shrink-0 mt-1" />
        )}
      </button>

      {open && (
        <div className="px-4 pb-4 pt-1 border-t border-zinc-50 space-y-3">
          <ul className="space-y-2">
            {item.facts.map((fact) => (
              <li key={fact} className="flex gap-2.5 text-sm text-zinc-600 leading-relaxed">
                <span className="text-[var(--wc-gold)] shrink-0 mt-0.5">•</span>
                <span>{fact}</span>
              </li>
            ))}
          </ul>
          {item.outcome && (
            <div className="rounded-lg bg-zinc-50 px-3 py-2.5 text-sm text-zinc-700">
              <span className="font-semibold text-zinc-900">Outcome: </span>
              {item.outcome}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function ControversiesTab() {
  const [filter, setFilter] = useState<ControversyCategory | "all">("all");

  const filtered = (
    filter === "all"
      ? WORLD_CUP_CONTROVERSIES
      : WORLD_CUP_CONTROVERSIES.filter((c) => c.category === filter)
  ).sort((a, b) => b.year - a.year);

  const filters: Array<{ id: ControversyCategory | "all"; label: string }> = [
    { id: "all", label: `All (${CONTROVERSY_SUMMARY.total})` },
    { id: "wc26", label: `WC26 (${CONTROVERSY_SUMMARY.wc26})` },
    { id: "on-field", label: "On-field" },
    { id: "hosting", label: "Hosting" },
    { id: "governance", label: "Governance" },
    { id: "off-field", label: "Off-field" },
  ];

  return (
    <div className="space-y-4">
      <p className="text-sm text-zinc-500">
        Documented disputes and incidents from World Cup history - factual summaries, sorted by year.
      </p>

      <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1">
        {filters.map((f) => (
          <button
            key={f.id}
            type="button"
            onClick={() => setFilter(f.id)}
            className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-semibold transition-colors ${
              filter === f.id
                ? "bg-[var(--wc-usa)] text-white"
                : "bg-white border border-zinc-200 text-zinc-600 hover:bg-zinc-50"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="space-y-2">
        {filtered.map((item) => (
          <ControversyCard key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
}

function GreatestMatchesTab() {
  return (
    <div className="space-y-4">
      <p className="text-sm text-zinc-500 leading-relaxed">
        Eight matches that shaped the World Cup&apos;s legend — upsets, classics and
        moments that outlived the tournaments they were played in.
      </p>
      <div className="space-y-3">
        {GREATEST_MATCHES.map((m) => (
          <article key={m.id} className="card-surface rounded-2xl p-5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm font-extrabold text-[var(--wc-usa)] tabular-nums">{m.year}</span>
              <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 bg-zinc-100 px-2 py-0.5 rounded-full">
                {m.stage}
              </span>
            </div>
            <h3 className="mt-2 text-lg font-extrabold tracking-tight text-zinc-900">{m.title}</h3>
            <p className="mt-1 text-sm font-bold text-zinc-800">
              {m.teams.homeFlag} {m.scoreline} {m.teams.awayFlag}
            </p>
            <p className="mt-0.5 text-xs text-zinc-400">{m.venue}</p>
            <p className="mt-3 text-sm text-zinc-600 leading-relaxed">{m.summary}</p>
            <p className="mt-3 flex gap-2 rounded-lg bg-[var(--wc-gold-light)] px-3 py-2 text-sm text-zinc-700 leading-relaxed">
              <Flame size={15} className="mt-0.5 shrink-0 text-[var(--wc-gold)]" />
              <span><span className="font-semibold text-zinc-900">Why it matters: </span>{m.why}</span>
            </p>
          </article>
        ))}
      </div>
    </div>
  );
}

function LegendsTab() {
  return (
    <div className="space-y-4">
      <p className="text-sm text-zinc-500 leading-relaxed">
        The players who defined the World Cup — from three-time champions to the
        record-breakers whose numbers still stand.
      </p>
      <div className="grid gap-3 sm:grid-cols-2">
        {WC_LEGENDS.map((p) => (
          <article key={p.id} className="card-surface rounded-2xl p-5">
            <div className="flex items-start gap-3">
              <span className="text-3xl shrink-0">{p.flag}</span>
              <div className="min-w-0">
                <h3 className="text-base font-extrabold tracking-tight text-zinc-900">{p.name}</h3>
                <p className="text-xs text-zinc-400">{p.country} · {p.era}</p>
              </div>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              <span className="inline-flex items-center gap-1 rounded-full bg-[var(--wc-gold-light)] px-2.5 py-1 text-[11px] font-semibold text-[var(--wc-gold)]">
                <Trophy size={11} /> {p.worldCups}
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-zinc-100 px-2.5 py-1 text-[11px] font-semibold text-zinc-600">
                {p.honour}
              </span>
            </div>
            <p className="mt-3 text-sm text-zinc-600 leading-relaxed">{p.summary}</p>
          </article>
        ))}
      </div>
    </div>
  );
}

export function WorldCupHistoryHub() {
  const [tab, setTab] = useState<TabId>("overview");

  useEffect(() => {
    const hash = window.location.hash.replace("#", "");
    if (VALID_TAB_HASHES.has(hash)) {
      setTab(hash as TabId);
    }
  }, []);

  function navigateTab(id: TabId) {
    setTab(id);
    window.history.replaceState(null, "", `#${id}`);
  }

  return (
    <div className="space-y-6" id="history-hub">
      <SummaryStrip />

      <div className="flex gap-1 overflow-x-auto pb-1 -mx-1 px-1">
        {TABS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            type="button"
            onClick={() => navigateTab(id)}
            className={`flex items-center gap-1.5 shrink-0 rounded-xl px-4 py-2.5 text-sm font-semibold transition-colors ${
              tab === id
                ? "bg-[var(--wc-usa)] text-white shadow-sm"
                : "bg-white border border-zinc-200 text-zinc-600 hover:bg-zinc-50"
            }`}
          >
            <Icon size={15} />
            {label}
          </button>
        ))}
      </div>

      {tab === "overview" && <OverviewTab onNavigate={navigateTab} />}
      {tab === "matches" && <GreatestMatchesTab />}
      {tab === "legends" && <LegendsTab />}
      {tab === "winners" && <WinnersTab />}
      {tab === "finals" && <FinalsTab />}
      {tab === "editions" && <EditionsTab />}
      {tab === "hosts" && <HostsTab />}
      {tab === "goals" && <GoalRecordsTab />}
      {tab === "records" && <RecordsTab />}
      {tab === "awards" && <AwardsTab />}
      {tab === "controversies" && <ControversiesTab />}
    </div>
  );
}
