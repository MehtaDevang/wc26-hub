import { getClassicMoments } from "./iconic-moments";
import type { IconicMoment } from "./iconic-moments";
import type { Match } from "./types";

export interface HistoricalParallel {
  moment: IconicMoment;
  hook: string;
}

function parseScore(teams: string): { a: number; b: number } | null {
  const m = teams.match(/(\d+)\s*[-–]\s*(\d+)/);
  if (!m) return null;
  return { a: parseInt(m[1], 10), b: parseInt(m[2], 10) };
}

interface ScoredMoment {
  moment: IconicMoment;
  margin: number;
  total: number;
}

function classicWithScores(): ScoredMoment[] {
  return getClassicMoments()
    .map((moment) => {
      const score = parseScore(moment.teams);
      if (!score) return null;
      return {
        moment,
        margin: Math.abs(score.a - score.b),
        total: score.a + score.b,
      };
    })
    .filter((x): x is ScoredMoment => x !== null);
}

/**
 * Find a thematically-matching famous World Cup moment for a finished match.
 * Only surfaces for genuinely notable scorelines (big margins / high-scoring),
 * and the linked moment is always a real, documented result - the connection
 * is framed as a thematic echo, never an invented claim about the live match.
 */
export function findHistoricalParallel(match: Match): HistoricalParallel | null {
  if (match.status !== "finished") return null;

  const home = match.homeScore ?? 0;
  const away = match.awayScore ?? 0;
  const margin = Math.abs(home - away);
  const total = home + away;

  const scored = classicWithScores();
  if (scored.length === 0) return null;

  // Emphatic rout
  if (margin >= 4) {
    const rout = [...scored].sort((a, b) => b.margin - a.margin)[0];
    if (rout) {
      return {
        moment: rout.moment,
        hook: `A ${margin}-goal margin is rare on this stage - the most famous of all came when ${rout.moment.teams} (${rout.moment.year}).`,
      };
    }
  }

  // Goal-fest
  if (total >= 5) {
    const thriller = [...scored].sort((a, b) => b.total - a.total)[0];
    if (thriller) {
      return {
        moment: thriller.moment,
        hook: `${total} goals in one match is a proper World Cup thriller - history remembers nights like ${thriller.moment.teams} (${thriller.moment.year}).`,
      };
    }
  }

  // Notable but not extreme margin (3 goals)
  if (margin === 3) {
    const big = [...scored]
      .filter((s) => s.margin >= 3)
      .sort((a, b) => a.margin - b.margin)[0];
    if (big) {
      return {
        moment: big.moment,
        hook: `Commanding wins like this have shaped World Cup history - think back to ${big.moment.teams} (${big.moment.year}).`,
      };
    }
  }

  return null;
}
