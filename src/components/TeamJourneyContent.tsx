import Link from "next/link";
import { Trophy, Calendar, MapPin, ChevronRight, TrendingUp } from "lucide-react";
import { getTeam } from "@/lib/data";
import { MatchKickoffTime } from "@/components/MatchKickoffTime";
import { ShareButtons } from "@/components/ShareButtons";
import { StarTeamButton } from "@/components/MyTeams";
import { FifaRankBadge } from "@/components/FifaRankBadge";
import { getFifaRank } from "@/lib/fifa-rankings";
import { buildTeamSharePayload } from "@/lib/share";
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

function getOrdinal(n: number): string {
  const s = ["th", "st", "nd", "rd"];
  const v = n % 100;
  return s[(v - 20) % 10] || s[v] || s[0];
}

function JourneyMatchCard({
  match,
  timezone,
}: {
  match: TeamJourneyMatch;
  timezone: string;
}) {
  const opponent = getTeam(match.opponentCode, match.opponent, match.opponentLogo);
  const hasScore = match.goalsFor !== undefined && match.goalsAgainst !== undefined;
  const dateLabel = match.kickoffAt
    ? formatKickoffDateLabel(match.kickoffAt, timezone)
    : formatDate(match.date);

  return (
    <div className="card-surface rounded-xl p-4 hover:shadow-md hover:border-blue-200 transition-all group">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400">
            {match.stage}
            {match.group !== "?" && (
              <>
                {" · "}
                <Link href={`/groups/${match.group}`} className="hover:text-blue-600">
                  Group {match.group}
                </Link>
              </>
            )}
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

      <Link href={`/match/${match.matchId}`} className="block">
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
    </div>
  );
}

export function TeamJourneyContent({
  journey,
  timezone,
}: {
  journey: TeamJourney;
  timezone: string;
}) {
  const team = getTeam(journey.teamCode, journey.teamName, journey.logo);
  const groupLetter = journey.group.replace(/^Group\s+/i, "");
  const share = buildTeamSharePayload(journey.teamCode, team.name);

  return (
    <div className="space-y-6">
      <div className="card-surface rounded-2xl overflow-hidden">
        <div className="host-stripe" />
        <div className="p-5 sm:p-6">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-zinc-50 border border-zinc-100 text-4xl shrink-0">
              {team.logo ? (
                <img src={team.logo} alt="" className="h-12 w-12 object-contain" />
              ) : (
                team.flag
              )}
            </div>
            <div className="min-w-0">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 truncate">
                {team.name}
              </h1>
              <p className="text-sm text-zinc-500 mt-1">
                FIFA World Cup 2026
                {getFifaRank(journey.teamCode) != null && (
                  <> · FIFA #{getFifaRank(journey.teamCode)} world ranking</>
                )}
                {groupLetter && (
                  <>
                    {" · "}
                    <Link href={`/groups/${groupLetter}`} className="text-blue-600 hover:underline">
                      {journey.group}
                    </Link>
                  </>
                )}
                {journey.rank && ` · ${journey.rank}${getOrdinal(journey.rank)} in group`}
              </p>
              <div className="flex flex-wrap items-center gap-3 mt-4">
                <StarTeamButton teamCode={journey.teamCode} />
                <ShareButtons
                  url={share.url}
                  title={share.title}
                  text={share.text}
                  label={share.label}
                  className="justify-start"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {[
          { label: "Pts", value: journey.stats.points, highlight: true },
          { label: "Played", value: journey.stats.played },
          { label: "W-D-L", value: `${journey.stats.won}-${journey.stats.drawn}-${journey.stats.lost}` },
          {
            label: "GD",
            value: journey.stats.goalDiff >= 0 ? `+${journey.stats.goalDiff}` : journey.stats.goalDiff,
          },
        ].map((s) => (
          <div
            key={s.label}
            className={`rounded-xl px-2 py-3 text-center card-surface ${
              s.highlight ? "bg-[var(--wc-usa-light)] border-[var(--wc-usa)]/15" : ""
            }`}
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
          <p className="section-title mb-3 text-sm">
            {journey.nextMatch.result === "live" ? "Live Now" : "Next Match"}
          </p>
          <JourneyMatchCard match={journey.nextMatch} timezone={timezone} />
        </div>
      )}

      <div>
        <h2 className="section-title mb-3 text-base">
          Tournament Fixtures ({journey.matches.length})
        </h2>
        <div className="space-y-2">
          {journey.matches.map((m) => (
            <JourneyMatchCard key={m.matchId} match={m} timezone={timezone} />
          ))}
        </div>
      </div>
    </div>
  );
}
