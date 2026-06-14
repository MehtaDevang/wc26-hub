import { History, Trophy } from "lucide-react";
import type { HeadToHeadMatch, HeadToHeadRecord, Match } from "@/lib/types";

const RESULT_STYLES: Record<HeadToHeadMatch["resultForHome"], string> = {
  W: "bg-emerald-50 text-emerald-700 border-emerald-200",
  D: "bg-zinc-100 text-zinc-600 border-zinc-200",
  L: "bg-red-50 text-red-600 border-red-200",
};

const RESULT_LABELS: Record<HeadToHeadMatch["resultForHome"], string> = {
  W: "W",
  D: "D",
  L: "L",
};

interface MatchHeadToHeadProps {
  match: Match;
  meetings?: HeadToHeadMatch[];
  record?: HeadToHeadRecord;
  rivalryName?: string;
  rivalryNote?: string;
  rivalryFunFact?: string;
  compact?: boolean;
  limit?: number;
}

function RecordPill({
  value,
  label,
  accent,
}: {
  value: number;
  label: string;
  accent?: "home" | "draw" | "away";
}) {
  const colors =
    accent === "home"
      ? "bg-[var(--wc-usa-light)] text-[var(--wc-usa)]"
      : accent === "away"
        ? "bg-[var(--wc-canada-light)] text-[var(--wc-canada)]"
        : "bg-zinc-100 text-zinc-600";

  return (
    <div className={`rounded-xl px-3 py-2 text-center ${colors}`}>
      <p className="text-xl font-extrabold tabular-nums leading-none">{value}</p>
      <p className="mt-1 text-[10px] font-bold uppercase tracking-wider opacity-80">
        {label}
      </p>
    </div>
  );
}

export function MatchHeadToHead({
  match,
  meetings = [],
  record,
  rivalryName,
  rivalryNote,
  rivalryFunFact,
  compact = false,
  limit = 10,
}: MatchHeadToHeadProps) {
  const shown = meetings.slice(0, limit);
  const wcMeetings = meetings.filter((m) => m.isWorldCup);

  if (!record || record.totalMeetings === 0) {
    return (
      <section className="card-surface rounded-2xl overflow-hidden">
        <div className="host-stripe" />
        <div className="p-6">
          <h2 className="section-title mb-3 flex items-center gap-2 text-base">
            <History size={18} className="text-[var(--wc-usa)]" />
            Head-to-Head History
          </h2>
          {rivalryName && (
            <p className="text-xs font-bold uppercase tracking-wider text-[var(--wc-gold)] mb-2">
              {rivalryName}
            </p>
          )}
          {rivalryNote && (
            <p className="text-sm text-zinc-600 leading-relaxed mb-3">{rivalryNote}</p>
          )}
          <p className="text-sm text-zinc-500 leading-relaxed">
            No previous meetings on record between {match.homeName} and {match.awayName}.
            {match.status === "upcoming" && " This could be a first competitive clash."}
          </p>
          {rivalryFunFact && (
            <p className="mt-4 text-xs text-zinc-400 border-l-2 border-zinc-200 pl-3 leading-relaxed">
              {rivalryFunFact}
            </p>
          )}
        </div>
      </section>
    );
  }

  return (
    <section className="card-surface rounded-2xl overflow-hidden">
      <div className="host-stripe" />
      <div className="p-6">
        <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
          <div>
            <h2 className="section-title flex items-center gap-2 text-base">
              <History size={18} className="text-[var(--wc-usa)]" />
              Head-to-Head History
            </h2>
            <p className="text-xs text-zinc-400 mt-1">
              {record.totalMeetings} all-time meeting{record.totalMeetings === 1 ? "" : "s"}
            </p>
          </div>
          {!compact && record.worldCupMeetings > 0 && (
            <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider">
              <Trophy size={11} />
              {record.worldCupMeetings} World Cup
            </span>
          )}
        </div>

        <div className="grid grid-cols-3 gap-2 mb-4 max-w-sm">
          <RecordPill value={record.homeWins} label={match.homeName} accent="home" />
          <RecordPill value={record.draws} label="Draws" accent="draw" />
          <RecordPill value={record.awayWins} label={match.awayName} accent="away" />
        </div>

        <div className="flex flex-wrap gap-4 text-sm text-zinc-600 mb-4">
          <span>
            Goals: <strong className="text-zinc-900">{record.homeGoals}</strong> –{" "}
            <strong className="text-zinc-900">{record.awayGoals}</strong>
          </span>
          {record.worldCupMeetings > 0 && (
            <span>
              World Cup: {match.homeName}{" "}
              <strong>{record.worldCupHomeWins}W</strong> ·{" "}
              <strong>{record.worldCupDraws}D</strong> · {match.awayName}{" "}
              <strong>{record.worldCupAwayWins}W</strong>
            </span>
          )}
        </div>

        {!compact && (
          <p className="text-sm text-zinc-600 leading-relaxed mb-5 border-l-2 border-[var(--wc-usa)]/20 pl-3">
            {record.summary}
          </p>
        )}

        {rivalryNote && !compact && (
          <div className="mb-5 rounded-xl bg-zinc-50 border border-zinc-100 px-4 py-3">
            {rivalryName && (
              <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--wc-gold)] mb-1">
                {rivalryName}
              </p>
            )}
            <p className="text-sm text-zinc-600 leading-relaxed">{rivalryNote}</p>
            {rivalryFunFact && (
              <p className="mt-2 text-xs text-zinc-400 leading-relaxed">{rivalryFunFact}</p>
            )}
          </div>
        )}

        {wcMeetings.length > 0 && !compact && (
          <div className="mb-5">
            <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-2">
              World Cup meetings
            </p>
            <div className="space-y-2">
              {wcMeetings.slice(0, 5).map((meeting) => (
                <div
                  key={`wc-${meeting.id ?? meeting.date}`}
                  className="flex items-center gap-3 rounded-xl border border-amber-100 bg-amber-50/50 px-3 py-2.5"
                >
                  <Trophy size={14} className="text-amber-600 shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-zinc-900 truncate">
                      {meeting.homeTeam} {meeting.score} {meeting.awayTeam}
                    </p>
                    <p className="text-xs text-zinc-400 truncate">
                      {meeting.date}
                      {meeting.round ? ` · ${meeting.round}` : ""}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="space-y-2">
          <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">
            Previous meetings
          </p>
          {shown.map((meeting) => (
            <div
              key={meeting.id ?? `${meeting.date}-${meeting.score}`}
              className="flex items-center gap-3 rounded-xl border border-zinc-100 bg-zinc-50/80 px-3 py-2.5"
            >
              <span
                className={`shrink-0 rounded-md border px-2 py-1 text-[10px] font-extrabold ${RESULT_STYLES[meeting.resultForHome]}`}
                title={`${match.homeName} result`}
              >
                {RESULT_LABELS[meeting.resultForHome]}
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-zinc-900 truncate">
                  {meeting.homeTeam} {meeting.score} {meeting.awayTeam}
                </p>
                <p className="text-xs text-zinc-400 truncate">
                  {meeting.date}
                  {meeting.round ? ` · ${meeting.round}` : ""} · {meeting.competition}
                  {meeting.isWorldCup ? " · World Cup" : ""}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
