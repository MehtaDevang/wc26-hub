import { Play, ImageIcon } from "lucide-react";
import { HighlightCard } from "./HighlightCard";
import { MatchMedia } from "./MatchMedia";
import type { Highlight, Match, MatchPhoto, MatchVideo } from "@/lib/types";

interface MatchHighlightsPanelProps {
  match: Match;
  highlights: Highlight[];
  videos?: MatchVideo[];
  photos?: MatchPhoto[];
}

export function MatchHighlightsPanel({
  match,
  highlights,
  videos = [],
  photos = [],
}: MatchHighlightsPanelProps) {
  const goalHighlights = highlights.filter((h) => h.type === "goal");
  const otherHighlights = highlights.filter((h) => h.type !== "goal");
  const hasContent = highlights.length > 0 || videos.length > 0 || photos.length > 0;

  if (!hasContent) {
    return (
      <div className="card-surface rounded-2xl p-8 text-center">
        <ImageIcon size={32} className="mx-auto text-zinc-300 mb-3" />
        <p className="text-sm text-zinc-500">
          {match.status === "finished"
            ? "Highlights and clips for this match aren't available yet."
            : "Highlights will appear here once the match gets underway."}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {videos.length > 0 && (
        <section>
          <h2 className="section-title mb-4 flex items-center gap-2 text-base">
            <Play size={18} className="text-[var(--wc-usa)]" />
            Watch Highlights
          </h2>
          <MatchMedia videos={videos} photos={[]} />
        </section>
      )}

      {goalHighlights.length > 0 && (
        <section>
          <h2 className="section-title mb-1 text-base">Goal Highlights</h2>
          <p className="text-xs text-zinc-400 mb-4">
            Every goal from {match.homeName} vs {match.awayName}
          </p>
          <div className="grid gap-4 sm:grid-cols-2">
            {goalHighlights.map((h) => (
              <HighlightCard key={h.id} highlight={h} />
            ))}
          </div>
        </section>
      )}

      {otherHighlights.length > 0 && (
        <section>
          <h2 className="section-title mb-1 text-base">
            {match.status === "finished" ? "Match Moments" : "Clips & Photos"}
          </h2>
          <p className="text-xs text-zinc-400 mb-4">
            Video clips, photos, and coverage from the match
          </p>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {otherHighlights.map((h) => (
              <HighlightCard key={h.id} highlight={h} compact />
            ))}
          </div>
        </section>
      )}

      {photos.length > 0 && (
        <section>
          <h2 className="section-title mb-4 text-base">Match Photos</h2>
          <MatchMedia videos={[]} photos={photos} />
        </section>
      )}
    </div>
  );
}
