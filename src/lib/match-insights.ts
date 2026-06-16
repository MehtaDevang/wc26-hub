import type {
  Match,
  MatchEvent,
  MatchStats,
  TeamLineup,
  VenueInfo,
} from "./types";
import { buildRankingInsight } from "./fifa-rankings";

interface MatchInsightsInput {
  match: Match;
  stats?: MatchStats;
  events?: MatchEvent[];
  homeName: string;
  awayName: string;
  homeLineup?: TeamLineup;
  awayLineup?: TeamLineup;
  venue?: VenueInfo;
  attendance?: string;
  referee?: string;
}

function shotAccuracy(shots: number, onTarget: number): number {
  return shots > 0 ? Math.round((onTarget / shots) * 100) : 0;
}

export function buildMatchInsights({
  match,
  stats,
  events = [],
  homeName,
  awayName,
  homeLineup,
  awayLineup,
  venue,
  attendance,
  referee,
}: MatchInsightsInput): string[] {
  const facts: string[] = [];

  const rankingLine = buildRankingInsight(
    match.home,
    homeName,
    match.away,
    awayName
  );
  if (rankingLine && match.status === "upcoming") {
    facts.push(rankingLine);
  }

  if (stats) {
    const [homePoss, awayPoss] = stats.possession;
    if (homePoss >= 58) {
      facts.push(`${homeName} controlled the ball with ${homePoss}% possession.`);
    } else if (awayPoss >= 58) {
      facts.push(`${awayName} controlled the ball with ${awayPoss}% possession.`);
    } else if (Math.abs(homePoss - awayPoss) <= 4) {
      facts.push(`Possession was evenly split (${homePoss}%–${awayPoss}%).`);
    }

    const homeAcc = shotAccuracy(stats.shots[0], stats.shotsOnTarget[0]);
    const awayAcc = shotAccuracy(stats.shots[1], stats.shotsOnTarget[1]);
    if (stats.shots[0] + stats.shots[1] >= 6) {
      if (stats.shots[0] > stats.shots[1] + 4) {
        facts.push(
          `${homeName} were far more threatening in attack with ${stats.shots[0]} shots (${stats.shotsOnTarget[0]} on target).`
        );
      } else if (stats.shots[1] > stats.shots[0] + 4) {
        facts.push(
          `${awayName} were far more threatening in attack with ${stats.shots[1]} shots (${stats.shotsOnTarget[1]} on target).`
        );
      }
    }
    if (homeAcc >= 50 && awayAcc < 35 && stats.shots[0] >= 4) {
      facts.push(`${homeName}'s finishing was clinical - ${homeAcc}% of shots were on target.`);
    } else if (awayAcc >= 50 && homeAcc < 35 && stats.shots[1] >= 4) {
      facts.push(`${awayName}'s finishing was clinical - ${awayAcc}% of shots were on target.`);
    }

    if (stats.corners[0] + stats.corners[1] >= 8) {
      const leader = stats.corners[0] > stats.corners[1] ? homeName : awayName;
      const leaderCorners = Math.max(stats.corners[0], stats.corners[1]);
      facts.push(`${leader} won ${leaderCorners} corners, showing sustained pressure in the final third.`);
    }

    const homeFouls = stats.fouls[0];
    const awayFouls = stats.fouls[1];
    const homeYellow = stats.yellowCards?.[0] ?? 0;
    const awayYellow = stats.yellowCards?.[1] ?? 0;
    if (homeYellow + awayYellow >= 4) {
      facts.push(
        `A physical contest - ${homeYellow + awayYellow} yellow cards shown (${homeName} ${homeYellow}, ${awayName} ${awayYellow}).`
      );
    } else if (homeFouls + awayFouls >= 22) {
      facts.push(`The referee had a busy game with ${homeFouls + awayFouls} fouls whistled.`);
    }

    const homeSaves = stats.saves?.[0] ?? 0;
    const awaySaves = stats.saves?.[1] ?? 0;
    if (homeSaves >= 5 || awaySaves >= 5) {
      const keeper = homeSaves > awaySaves ? homeName : awayName;
      const count = Math.max(homeSaves, awaySaves);
      facts.push(`${keeper}'s goalkeeper made ${count} saves.`);
    }
  }

  const goals = events.filter((e) => e.type === "goal" || e.type === "penalty");
  if (goals.length > 0 && match.status !== "upcoming") {
    const firstHalf = goals.filter((g) => g.minute <= 45).length;
    const secondHalf = goals.length - firstHalf;
    if (firstHalf === 0 && secondHalf > 0) {
      facts.push("All goals came after the break - a second-half story.");
    } else if (secondHalf === 0 && firstHalf > 0) {
      facts.push("Every goal arrived in the first half.");
    } else if (goals.length >= 3 && secondHalf >= 2) {
      facts.push(`${secondHalf} of ${goals.length} goals came in the second half.`);
    }
  }

  if (homeLineup?.formation && awayLineup?.formation) {
    facts.push(
      `Tactical matchup: ${homeName} (${homeLineup.formation}) vs ${awayName} (${awayLineup.formation}).`
    );
  }

  if (venue?.capacity && attendance) {
    const attNum = parseInt(attendance.replace(/,/g, ""), 10);
    if (!Number.isNaN(attNum) && attNum > 0) {
      const pct = Math.round((attNum / venue.capacity) * 100);
      if (pct >= 90) {
        facts.push(
          `A near-sellout at ${venue.name} - ${attendance} fans (${pct}% of capacity).`
        );
      } else if (pct >= 75) {
        facts.push(`${attendance} fans packed into ${venue.name}.`);
      }
    }
  } else if (venue?.name) {
    facts.push(`Played at ${venue.name}${venue.city ? `, ${venue.city}` : ""}.`);
  }

  if (referee) {
    facts.push(`Referee: ${referee}.`);
  }

  if (match.status === "finished" && match.homeScore === match.awayScore) {
    facts.push(`Honours even - ${homeName} and ${awayName} share the points.`);
  } else if (match.status === "finished") {
    const winner =
      (match.homeScore ?? 0) > (match.awayScore ?? 0) ? homeName : awayName;
    const margin = Math.abs((match.homeScore ?? 0) - (match.awayScore ?? 0));
    if (margin >= 3) {
      facts.push(`${winner} won convincingly by ${margin} goals.`);
    }
  }

  return facts.slice(0, 8);
}
