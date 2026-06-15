"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Star } from "lucide-react";
import { MatchClashRow } from "@/components/MatchBattleGraphic";
import { getTeam } from "@/lib/data";
import { getMyTeams } from "@/lib/my-teams";
import type { Match } from "@/lib/types";

interface MyTeamsMatchesProps {
  matches: Match[];
}

function teamInMatch(match: Match, code: string): boolean {
  const upper = code.toUpperCase();
  return match.home.toUpperCase() === upper || match.away.toUpperCase() === upper;
}

export function MyTeamsMatches({ matches }: MyTeamsMatchesProps) {
  const [codes, setCodes] = useState<string[]>([]);

  useEffect(() => {
    setCodes(getMyTeams());
    const refresh = () => setCodes(getMyTeams());
    window.addEventListener("storage", refresh);
    window.addEventListener("wc26-my-teams-changed", refresh);
    return () => {
      window.removeEventListener("storage", refresh);
      window.removeEventListener("wc26-my-teams-changed", refresh);
    };
  }, []);

  const myMatches = useMemo(() => {
    if (codes.length === 0) return [];
    return matches.filter((m) => codes.some((code) => teamInMatch(m, code)));
  }, [matches, codes]);

  if (codes.length === 0 || myMatches.length === 0) return null;

  const live = myMatches.filter((m) => m.status === "live");
  const rest = myMatches.filter((m) => m.status !== "live");

  return (
    <section>
      <div className="flex items-center justify-between gap-3 mb-4">
        <h2 className="section-title text-base flex items-center gap-2">
          <Star size={18} className="text-amber-500 fill-amber-500" />
          My Teams Today
        </h2>
        <div className="flex gap-1.5">
          {codes.map((code) => {
            const team = getTeam(code);
            return (
              <Link
                key={code}
                href={`/teams/${code}`}
                className="text-lg hover:scale-110 transition-transform"
                title={team.name}
              >
                {team.flag}
              </Link>
            );
          })}
        </div>
      </div>

      <div className="card-elevated overflow-hidden rounded-2xl">
        <div className="host-stripe" />
        <div className="match-clash-list">
          {live.map((m) => (
            <MatchClashRow key={m.id} match={m} />
          ))}
          {rest.map((m) => (
            <MatchClashRow key={m.id} match={m} />
          ))}
        </div>
      </div>
    </section>
  );
}
