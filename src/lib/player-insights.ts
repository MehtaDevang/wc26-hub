import type {
  PlayerFactBadge,
  PlayerRichProfile,
  PlayerWorldCupProfile,
} from "./types";
import { getPlayerEditorial } from "./player-editorial";

interface SquadPeer {
  age: number;
  worldCupGoals: number;
  matchesPlayed: number;
  number: number;
}

function positionLabel(position: string): string {
  const p = position.toLowerCase();
  if (p.includes("goalkeeper") || p === "g") return "goalkeeper";
  if (p.includes("defender") || p === "d") return "defender";
  if (p.includes("midfielder") || p === "m") return "midfielder";
  if (p.includes("forward") || p === "f") return "forward";
  return position.toLowerCase();
}

function buildOverview(player: PlayerWorldCupProfile): string[] {
  const lines: string[] = [];
  const role = positionLabel(player.position);

  if (player.age > 0 && player.birthPlace) {
    lines.push(
      `${player.name} is a ${player.age}-year-old ${role} born in ${player.birthPlace}.`
    );
  } else if (player.age > 0) {
    lines.push(`${player.name} is a ${player.age}-year-old ${role}.`);
  } else if (player.birthPlace) {
    lines.push(`${player.name} is a ${role} born in ${player.birthPlace}.`);
  }

  if (player.club) {
    lines.push(`At club level, plays for ${player.club}.`);
  }

  lines.push(
    `Part of ${player.teamName}'s squad at the FIFA World Cup 2026${
      player.number > 0 ? `, wearing the #${player.number} shirt` : ""
    }.`
  );

  if (player.matchesPlayed > 0 || player.worldCupGoals > 0) {
    const parts: string[] = [];
    if (player.matchesPlayed > 0) {
      parts.push(
        `${player.matchesPlayed} World Cup appearance${player.matchesPlayed === 1 ? "" : "s"}`
      );
    }
    if (player.worldCupGoals > 0) {
      parts.push(
        `${player.worldCupGoals} goal${player.worldCupGoals === 1 ? "" : "s"} scored`
      );
    }
    if (player.yellowCards > 0) {
      parts.push(`${player.yellowCards} yellow card${player.yellowCards === 1 ? "" : "s"}`);
    }
    if (player.redCards > 0) {
      parts.push(`${player.redCards} red card${player.redCards === 1 ? "" : "s"}`);
    }
    lines.push(`At this tournament so far: ${parts.join(", ")}.`);
  }

  if (player.displayHeight || player.displayWeight) {
    const physical = [player.displayHeight, player.displayWeight].filter(Boolean).join(", ");
    if (physical) lines.push(`Listed at ${physical}.`);
  }

  const recentGoals = player.recentMatches.reduce((sum, m) => sum + m.goals, 0);
  const recentApps = player.recentMatches.length;
  if (recentApps >= 3 && recentGoals > 0) {
    lines.push(
      `In his last ${recentApps} club matches before the tournament he scored ${recentGoals} goal${recentGoals === 1 ? "" : "s"}.`
    );
  }

  return lines;
}

function buildBadges(player: PlayerWorldCupProfile, squad: SquadPeer[]): PlayerFactBadge[] {
  const badges: PlayerFactBadge[] = [];
  const ages = squad.map((p) => p.age).filter((a) => a > 0);

  if (player.age > 0 && ages.length >= 3) {
    const minAge = Math.min(...ages);
    const maxAge = Math.max(...ages);
    if (player.age === minAge) {
      badges.push({ label: `Youngest in ${player.teamName} squad`, highlight: true });
    }
    if (player.age === maxAge) {
      badges.push({ label: `Oldest in ${player.teamName} squad`, highlight: true });
    }
  }

  const squadGoals = squad.map((p) => p.worldCupGoals);
  const maxGoals = Math.max(...squadGoals, 0);
  if (player.worldCupGoals > 0 && player.worldCupGoals === maxGoals) {
    const tied = squadGoals.filter((g) => g === maxGoals).length;
    badges.push({
      label:
        tied === 1
          ? `${player.teamName}'s top scorer at WC 2026`
          : `Joint top scorer for ${player.teamName}`,
      highlight: true,
    });
  }

  if (player.worldCupGoals > 0) {
    badges.push({ label: "Scored at World Cup 2026" });
  }

  if (player.matchesPlayed > 0) {
    badges.push({ label: `${player.matchesPlayed} WC 2026 appearance${player.matchesPlayed === 1 ? "" : "s"}` });
  }

  if (player.number === 10) {
    badges.push({ label: "Squad #10" });
  }
  if (player.number === 1 && player.position.toLowerCase().includes("goal")) {
    badges.push({ label: "First-choice goalkeeper" });
  }

  const topSeasonStat = player.seasonStats.find((s) => {
    const n = s.name.toLowerCase();
    return n.includes("goal") || n.includes("assist");
  });
  if (topSeasonStat && topSeasonStat.displayValue !== "0") {
    badges.push({ label: `Club season: ${topSeasonStat.displayValue} ${topSeasonStat.name.toLowerCase()}` });
  }

  return badges.slice(0, 6);
}

/** Build factual rich profile for any player; merges curated editorial when available. */
export function buildPlayerRichProfile(
  player: PlayerWorldCupProfile,
  squadPeers: SquadPeer[] = []
): PlayerRichProfile {
  const editorial = getPlayerEditorial(player.teamCode, player.slug, player.name);
  const overview = buildOverview(player);
  const badges = buildBadges(player, squadPeers.length > 0 ? squadPeers : [player]);

  if (!editorial) {
    return { overview, badges };
  }

  return {
    overview,
    badges,
    playStyle: editorial.playStyle,
    journey: editorial.journey,
    highlights: editorial.highlights,
    records: editorial.records,
    hasEditorial: true,
  };
}
