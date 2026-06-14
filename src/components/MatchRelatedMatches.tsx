import Link from "next/link";
import { ChevronRight, Radio, Users } from "lucide-react";
import { MatchClashRow } from "@/components/MatchBattleGraphic";
import type { Match } from "@/lib/types";

interface MatchRelatedMatchesProps {
  currentMatch: Match;
  liveMatches: Match[];
  relatedMatches: Match[];
}

export function MatchRelatedMatches({
  currentMatch,
  liveMatches,
  relatedMatches,
}: MatchRelatedMatchesProps) {
  const groupLabel =
    currentMatch.group === "?"
      ? "Knockout stage"
      : `Group ${currentMatch.group}`;

  if (liveMatches.length === 0 && relatedMatches.length === 0) {
    return null;
  }

  return (
    <div className="space-y-8">
      {liveMatches.length > 0 && (
        <section>
          <div className="mb-4 flex items-center justify-between gap-3">
            <h2 className="section-title flex items-center gap-2 text-base">
              <Radio size={18} className="text-red-500" />
              More live matches
            </h2>
            <Link
              href="/"
              className="text-[13px] font-medium text-blue-600 hover:text-blue-700 flex items-center gap-0.5"
            >
              All scores <ChevronRight size={14} />
            </Link>
          </div>
          <div className="card-elevated overflow-hidden rounded-2xl">
            <div className="host-stripe" />
            <div className="match-clash-list">
              {liveMatches.map((m) => (
                <MatchClashRow key={m.id} match={m} />
              ))}
            </div>
          </div>
        </section>
      )}

      {relatedMatches.length > 0 && (
        <section>
          <div className="mb-4 flex items-center justify-between gap-3">
            <h2 className="section-title flex items-center gap-2 text-base">
              <Users size={18} className="text-blue-600" />
              Related matches
            </h2>
            {currentMatch.group !== "?" && (
              <Link
                href={`/groups/${currentMatch.group}`}
                className="text-[13px] font-medium text-blue-600 hover:text-blue-700"
              >
                {groupLabel}
              </Link>
            )}
          </div>
          <div className="card-elevated overflow-hidden rounded-2xl">
            <div className="host-stripe" />
            <div className="match-clash-list">
              {relatedMatches.map((m) => (
                <MatchClashRow key={m.id} match={m} />
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
