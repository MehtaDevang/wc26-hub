import Link from "next/link";
import { ArrowLeft, ArrowRight, Sparkles } from "lucide-react";
import type { Match, MatchDetail } from "@/lib/types";
import { getTeam } from "@/lib/data";
import { MatchNarrative } from "./MatchNarrative";
import { MatchRecapView } from "./MatchRecapView";
import { HistoricalParallel } from "./HistoricalParallel";
import { AddToCalendar } from "./AddToCalendar";
import { MatchKickoffTime } from "./MatchKickoffTime";
import { formatKickoffDateLabel } from "@/lib/timezone";
import { FifaRankBadge, FifaRankMatchup } from "@/components/FifaRankBadge";

export function MatchNarrativePageView({
  match,
  detail,
  mode,
  timeZone,
}: {
  match: Match;
  detail: MatchDetail;
  mode: "preview" | "recap";
  timeZone: string;
}) {
  if (mode === "recap") {
    return (
      <div className="space-y-6">
        <MatchRecapView match={match} detail={detail} timeZone={timeZone} />
        <HistoricalParallel match={match} />
      </div>
    );
  }

  const home = getTeam(match.home, match.homeName, match.homeLogo);
  const away = getTeam(match.away, match.awayName, match.awayLogo);
  const kickoffLabel = match.kickoffAt
    ? formatKickoffDateLabel(match.kickoffAt, timeZone)
    : match.date;
  const Icon = Sparkles;

  return (
    <div className="space-y-8">
      <Link
        href={`/match/${match.id}`}
        className="inline-flex items-center gap-2 text-sm text-zinc-500 hover:text-zinc-900 transition-colors"
      >
        <ArrowLeft size={16} />
        Full match page
      </Link>

      <div className="card-elevated rounded-2xl overflow-hidden">
        <div className="host-stripe" />
        <div className="p-6 sm:p-8">
          <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 mb-3 flex items-center gap-2">
            <Icon size={14} className="text-blue-500" />
            Match Preview
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 mb-6 text-xs text-zinc-500 uppercase tracking-wider">
            {match.group !== "?" ? `Group ${match.group}` : match.stageLabel ?? "Knockout"}
            {" · "}
            {kickoffLabel}
            {" · "}
            <MatchKickoffTime match={match} />
          </div>

          <div className="flex items-center justify-center gap-6 sm:gap-12 mb-6">
            <div className="flex-1 text-center">
              <span className="text-4xl block mb-2">{home.flag}</span>
              <p className="text-lg font-bold text-zinc-900">{home.name}</p>
              <FifaRankBadge code={match.home} className="mt-1" />
            </div>
            <div className="text-center shrink-0">
              {match.status !== "upcoming" ? (
                <p className="text-3xl sm:text-4xl font-extrabold tabular-nums text-zinc-900">
                  {match.homeScore}
                  <span className="mx-2 text-zinc-300">–</span>
                  {match.awayScore}
                </p>
              ) : (
                <p className="text-xl font-bold text-zinc-300">vs</p>
              )}
            </div>
            <div className="flex-1 text-center">
              <span className="text-4xl block mb-2">{away.flag}</span>
              <p className="text-lg font-bold text-zinc-900">{away.name}</p>
              <FifaRankBadge code={match.away} className="mt-1" />
            </div>
          </div>

          <div className="flex justify-center mb-4">
            <FifaRankMatchup homeCode={match.home} awayCode={match.away} />
          </div>

          <div className="flex flex-wrap justify-center gap-3">
            {match.status !== "finished" && <AddToCalendar match={match} />}
            <Link
              href={`/match/${match.id}`}
              className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-3 py-2 text-xs font-semibold text-zinc-700 hover:bg-zinc-50 transition-colors"
            >
              Live score & stats
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </div>

      <MatchNarrative match={match} detail={detail} />

      {detail.rivalryName && (
        <section className="card-surface rounded-2xl p-5">
          <h2 className="font-bold text-zinc-900 mb-2">{detail.rivalryName}</h2>
          <p className="text-sm text-zinc-600 leading-relaxed">{detail.rivalryNote}</p>
          {detail.rivalryFunFact && (
            <p className="text-sm text-zinc-500 mt-2 italic">{detail.rivalryFunFact}</p>
          )}
        </section>
      )}

      <div className="text-center">
        <Link href={`/match/${match.id}`} className="btn-primary inline-flex items-center gap-2 px-6 py-2.5 text-sm">
          View full match hub
          <ArrowRight size={16} />
        </Link>
      </div>
    </div>
  );
}
