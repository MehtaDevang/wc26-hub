import type { Match, MatchDetail } from "@/lib/types";
import { buildMatchPreview, buildMatchRecap } from "@/lib/match-narrative";
import { Newspaper, Sparkles } from "lucide-react";

export function MatchNarrative({
  match,
  detail,
}: {
  match: Match;
  detail: MatchDetail;
}) {
  const isFinished = match.status === "finished";
  const isUpcoming = match.status === "upcoming";
  const lines = isFinished
    ? buildMatchRecap(match, detail)
    : isUpcoming
      ? buildMatchPreview(match, detail)
      : [];

  if (lines.length === 0) return null;

  const title = isFinished ? "Match Recap" : "Match Preview";
  const Icon = isFinished ? Newspaper : Sparkles;
  const accent = isFinished ? "border-emerald-200 bg-emerald-50/40" : "border-blue-200 bg-blue-50/40";

  return (
    <section className={`card-surface rounded-2xl p-6 border ${accent}`}>
      <h2 className="section-title mb-4 flex items-center gap-2 text-base">
        <Icon size={18} className={isFinished ? "text-emerald-600" : "text-blue-600"} />
        {title}
      </h2>
      <div className="space-y-3">
        {lines.map((line, i) => (
          <p key={i} className="text-zinc-600 leading-relaxed text-sm sm:text-base">
            {line}
          </p>
        ))}
      </div>
    </section>
  );
}
