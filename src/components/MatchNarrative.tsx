import type { Match, MatchDetail } from "@/lib/types";
import { buildMatchPreview } from "@/lib/match-narrative";
import { Sparkles } from "lucide-react";
import { MatchRecapContent } from "./MatchRecapContent";

export function MatchNarrative({
  match,
  detail,
}: {
  match: Match;
  detail: MatchDetail;
}) {
  const isFinished = match.status === "finished";
  const isUpcoming = match.status === "upcoming";

  if (isFinished) {
    return <MatchRecapContent match={match} detail={detail} variant="embedded" />;
  }

  const lines = isUpcoming ? buildMatchPreview(match, detail) : [];
  if (lines.length === 0) return null;

  return (
    <section className="card-surface rounded-2xl p-6 border border-blue-200 bg-blue-50/40">
      <h2 className="section-title mb-4 flex items-center gap-2 text-base">
        <Sparkles size={18} className="text-blue-600" />
        Match Preview
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
