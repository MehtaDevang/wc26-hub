"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  X,
  Loader2,
  Trophy,
  Calendar,
  MapPin,
  ChevronRight,
  TrendingUp,
} from "lucide-react";
import { getTeam } from "@/lib/data";
import { resolveTeamCode } from "@/lib/team-lookup";
import { fetchJson } from "@/lib/fetch-json";
import { useTimezone } from "@/components/TimezoneProvider";
import { MatchKickoffTime } from "@/components/MatchKickoffTime";
import { formatKickoffDateLabel } from "@/lib/timezone";
import type { TeamJourney, TeamJourneyMatch } from "@/lib/types";

const RESULT_STYLES: Record<string, string> = {
  W: "bg-emerald-100 text-emerald-700",
  D: "bg-zinc-100 text-zinc-600",
  L: "bg-red-50 text-red-600",
  live: "bg-red-100 text-red-700",
  upcoming: "bg-blue-50 text-blue-600",
};

const RESULT_LABELS: Record<string, string> = {
  W: "Win",
  D: "Draw",
  L: "Loss",
  live: "Live",
  upcoming: "Upcoming",
};

function formatDate(date: string) {
  return new Date(date + "T12:00:00").toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

function JourneyMatchCard({ match }: { match: TeamJourneyMatch }) {
  const opponent = getTeam(match.opponentCode, match.opponent, match.opponentLogo);
  const hasScore = match.goalsFor !== undefined && match.goalsAgainst !== undefined;
  const timezone = useTimezone();
  const dateLabel = match.kickoffAt
    ? formatKickoffDateLabel(match.kickoffAt, timezone)
    : formatDate(match.date);

  return (
    <Link
      href={`/match/${match.matchId}`}
      className="block card-surface rounded-xl p-4 hover:shadow-md hover:border-blue-200 transition-all group"
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400">
            {match.stage}
            {match.group !== "?" && ` · Group ${match.group}`}
          </p>
          <p className="text-xs text-zinc-500 mt-0.5 flex items-center gap-1">
            <Calendar size={11} />
            {dateLabel} · <MatchKickoffTime match={match} />
          </p>
        </div>
        <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full shrink-0 ${RESULT_STYLES[match.result]}`}>
          {RESULT_LABELS[match.result]}
        </span>
      </div>

      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 min-w-0 flex-1">
          <span className="text-xs text-zinc-400 w-8 shrink-0">{match.isHome ? "Home" : "Away"}</span>
          <span className="text-lg shrink-0">{opponent.flag}</span>
          {opponent.logo && (
            <img src={opponent.logo} alt="" className="h-6 w-6 object-contain shrink-0" />
          )}
          <span className="font-semibold text-zinc-900 truncate">vs {opponent.name}</span>
        </div>

        {match.result === "live" && (
          <span className="text-sm font-bold text-red-600 tabular-nums shrink-0">
            {match.goalsFor}–{match.goalsAgainst}
            {match.displayClock && (
              <span className="text-[10px] font-normal ml-1">{match.displayClock}</span>
            )}
          </span>
        )}
        {hasScore && match.result !== "live" && (
          <span className="text-lg font-extrabold text-zinc-900 tabular-nums shrink-0">
            {match.goalsFor}–{match.goalsAgainst}
          </span>
        )}
        {match.result === "upcoming" && (
          <span className="text-xs text-zinc-400 shrink-0">TBD</span>
        )}
      </div>

      {match.venue && (
        <p className="text-xs text-zinc-400 mt-2 flex items-center gap-1">
          <MapPin size={11} />
          {match.venue}
          {match.venueCity && `, ${match.venueCity}`}
        </p>
      )}

      <span className="inline-flex items-center gap-0.5 text-xs text-blue-600 font-medium mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
        Match details <ChevronRight size={12} />
      </span>
    </Link>
  );
}

interface TeamJourneyPanelProps {
  teamKey: string | null;
  onClose: () => void;
}

export function TeamJourneyPanel({ teamKey, onClose }: TeamJourneyPanelProps) {
  const timezone = useTimezone();
  const [journey, setJourney] = useState<TeamJourney | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!teamKey) {
      setJourney(null);
      return;
    }

    const code = resolveTeamCode(teamKey) ?? teamKey;
    setLoading(true);
    setError("");

    const params = new URLSearchParams({ tz: timezone });
    fetchJson<{ journey: TeamJourney }>(
      `/api/teams/${encodeURIComponent(code)}/journey?${params}`,
      { timeoutMs: 25_000 }
    )
      .then((d) => setJourney(d.journey))
      .catch((e) => setError(e instanceof Error ? e.message : "Failed to load"))
      .finally(() => setLoading(false));
  }, [teamKey, timezone]);

  useEffect(() => {
    if (!teamKey) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [teamKey, onClose]);

  if (!teamKey) return null;

  const team = journey ? getTeam(journey.teamCode, journey.teamName, journey.logo) : null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      <button
        type="button"
        className="absolute inset-0 bg-zinc-900/40 backdrop-blur-[2px]"
        onClick={onClose}
        aria-label="Close"
      />

      <div className="relative w-full sm:max-w-lg max-h-[92vh] sm:max-h-[85vh] bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl flex flex-col overflow-hidden team-journey-sheet border border-zinc-100">
        <div className="host-stripe shrink-0" />

        <div className="flex items-start justify-between gap-3 px-5 py-4 border-b border-zinc-100 shrink-0">
          {team ? (
            <div className="flex items-center gap-3 min-w-0">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-zinc-50 border border-zinc-100 text-3xl shrink-0">
                {team.logo ? (
                  <img src={team.logo} alt="" className="h-10 w-10 object-contain" />
                ) : (
                  team.flag
                )}
              </div>
              <div className="min-w-0">
                <h2 className="font-extrabold text-zinc-900 text-lg leading-tight truncate">
                  {team.name}
                </h2>
                <p className="text-sm text-zinc-500 mt-0.5">
                  {journey?.group}
                  {journey?.rank && ` · ${journey.rank}${getOrdinal(journey.rank)} place`}
                </p>
              </div>
            </div>
          ) : (
            <div className="h-14" />
          )}
          <button
            onClick={onClose}
            className="rounded-full p-2 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600 shrink-0"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        <div className="overflow-y-auto flex-1 px-5 py-4 space-y-5">
          {loading && (
            <div className="flex items-center justify-center gap-2 py-16 text-zinc-400 text-sm">
              <Loader2 size={18} className="animate-spin" />
              Loading World Cup journey...
            </div>
          )}

          {error && (
            <p className="text-center text-red-600 text-sm py-12">{error}</p>
          )}

          {journey && !loading && (
            <>
              <div className="grid grid-cols-4 gap-2">
                {[
                  { label: "Pts", value: journey.stats.points, highlight: true },
                  { label: "Played", value: journey.stats.played },
                  { label: "W-D-L", value: `${journey.stats.won}-${journey.stats.drawn}-${journey.stats.lost}` },
                  { label: "GD", value: journey.stats.goalDiff >= 0 ? `+${journey.stats.goalDiff}` : journey.stats.goalDiff },
                ].map((s) => (
                  <div
                    key={s.label}
                    className={`rounded-xl px-2 py-3 text-center ${s.highlight ? "bg-[var(--wc-usa-light)] border border-[var(--wc-usa)]/15" : "bg-zinc-50"}`}
                  >
                    <p className={`text-lg font-extrabold tabular-nums ${s.highlight ? "text-[var(--wc-usa)]" : "text-zinc-900"}`}>
                      {s.value}
                    </p>
                    <p className="text-[10px] text-zinc-400 uppercase tracking-wider font-semibold mt-0.5">
                      {s.label}
                    </p>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between text-sm card-surface rounded-xl px-4 py-3">
                <span className="text-zinc-500 flex items-center gap-1.5">
                  <Trophy size={14} className="text-amber-500" />
                  Goals
                </span>
                <span className="font-bold text-zinc-900 tabular-nums">
                  {journey.stats.goalsFor} scored · {journey.stats.goalsAgainst} conceded
                </span>
              </div>

              {journey.form && (
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400 mb-2 flex items-center gap-1">
                    <TrendingUp size={12} />
                    Form
                  </p>
                  <div className="flex gap-1.5">
                    {journey.form.split("").map((r, i) => (
                      <span
                        key={i}
                        className={`h-8 w-8 rounded-lg flex items-center justify-center text-xs font-bold ${RESULT_STYLES[r]}`}
                      >
                        {r}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {journey.nextMatch && (
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400 mb-2">
                    {journey.nextMatch.result === "live" ? "Live Now" : "Next Match"}
                  </p>
                  <JourneyMatchCard match={journey.nextMatch} />
                </div>
              )}

              <div>
                <p className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400 mb-2">
                  Tournament Journey ({journey.matches.length} matches)
                </p>
                <div className="space-y-2">
                  {journey.matches.map((m) => (
                    <JourneyMatchCard key={m.matchId} match={m} />
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function getOrdinal(n: number): string {
  const s = ["th", "st", "nd", "rd"];
  const v = n % 100;
  return s[(v - 20) % 10] || s[v] || s[0];
}
