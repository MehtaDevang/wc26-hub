import { resolveTeamCode } from "../team-lookup";
import {
  fifaR32PositionForMatch,
  FIFA_R32_POSITION_TO_TREE_SLOT,
  r16TreeSlotForTeams,
} from "./fifa-bracket-slots";
import type {
  BracketMatch,
  BracketRound,
  BracketRoundId,
  BracketTeam,
  GroupStandings,
  KnockoutBracketData,
  Match,
} from "../types";

const ROUND_ORDER: BracketRoundId[] = [
  "round-of-32",
  "round-of-16",
  "quarter-final",
  "semi-final",
  "final",
];

const ROUND_META: Record<
  BracketRoundId,
  { label: string; shortLabel: string; slots: number }
> = {
  "round-of-32": { label: "Round of 32", shortLabel: "R32", slots: 16 },
  "round-of-16": { label: "Round of 16", shortLabel: "R16", slots: 8 },
  "quarter-final": { label: "Quarter-Finals", shortLabel: "QF", slots: 4 },
  "semi-final": { label: "Semi-Finals", shortLabel: "SF", slots: 2 },
  "third-place": { label: "Third-Place Playoff", shortLabel: "3rd", slots: 1 },
  final: { label: "Final", shortLabel: "Final", slots: 1 },
};

const R16_PAIRINGS: [number, number][] = [
  [1, 3],
  [2, 5],
  [4, 6],
  [7, 8],
  [11, 12],
  [9, 10],
  [14, 16],
  [13, 15],
];

const QF_PAIRINGS: [number, number][] = [
  [1, 2],
  [5, 6],
  [3, 4],
  [7, 8],
];

const SF_PAIRINGS: [number, number][] = [
  [1, 2],
  [3, 4],
];

const SYNTHESIZED_ROUNDS: Partial<
  Record<BracketRoundId, { home: string; away: string }[]>
> = {
  "semi-final": [
    { home: "Quarter-Final 1 Winner", away: "Quarter-Final 2 Winner" },
    { home: "Quarter-Final 3 Winner", away: "Quarter-Final 4 Winner" },
  ],
  "third-place": [
    { home: "Semi-Final 1 Loser", away: "Semi-Final 2 Loser" },
  ],
  final: [{ home: "Semi-Final 1 Winner", away: "Semi-Final 2 Winner" }],
};

const SLUG_TO_ROUND: Record<string, BracketRoundId> = {
  "round-of-32": "round-of-32",
  "round-of-16": "round-of-16",
  quarterfinals: "quarter-final",
  "quarter-finals": "quarter-final",
  semifinals: "semi-final",
  "semi-finals": "semi-final",
  "3rd-place-match": "third-place",
  "third-place": "third-place",
  "third-place-playoff": "third-place",
  final: "final",
};

function classifyMatchRound(match: Match): BracketRoundId | null {
  if (match.roundSlug && match.roundSlug !== "group-stage") {
    const fromSlug = SLUG_TO_ROUND[match.roundSlug];
    if (fromSlug) return fromSlug;
  }
  if (match.stageLabel) return classifyKnockoutRound(match.stageLabel);
  return null;
}

function classifyKnockoutRound(stageLabel: string): BracketRoundId | null {
  const low = stageLabel.toLowerCase();

  if (low.includes("round of 32") && low.includes("winner at round of 32")) {
    return "round-of-16";
  }
  if (low.includes("round of 16") && low.includes("winner at round of 16")) {
    return "quarter-final";
  }
  if (low.includes("quarter") && low.includes("winner")) return "semi-final";
  if (low.includes("semi") && low.includes("winner")) return "final";
  if (low.includes("third place") && low.includes("group")) return "round-of-32";
  if (/group [a-l]/.test(low) && (low.includes("2nd place") || low.includes("winner"))) {
    return "round-of-32";
  }
  if (low.includes("round of 32")) return "round-of-32";
  if (low.includes("round of 16")) return "round-of-16";
  if (low.includes("quarter")) return "quarter-final";
  if (low.includes("semi")) return "semi-final";
  if (low.includes("third place")) return "third-place";
  if (low.includes("final") && !low.includes("semi") && !low.includes("quarter")) {
    return "final";
  }

  return null;
}

function isFeederLabel(name: string): boolean {
  return /winner|2nd place|third place|round of|quarter-final|semi-final/i.test(name);
}

function parseFeederNumbers(stageLabel: string): [number, number] | null {
  const patterns = [
    /round of 32 (\d+) winner at round of 32 (\d+) winner/i,
    /round of 16 (\d+) winner at round of 16 (\d+) winner/i,
    /quarter-final (\d+) winner at quarter-final (\d+) winner/i,
    /semi-final (\d+) winner at semi-final (\d+) winner/i,
  ];

  for (const pattern of patterns) {
    const match = stageLabel.match(pattern);
    if (match) {
      return [parseInt(match[1], 10), parseInt(match[2], 10)];
    }
  }

  return null;
}

function slotFromPairing(
  feeders: [number, number],
  pairings: [number, number][]
): number {
  const sorted = [...feeders].sort((a, b) => a - b) as [number, number];
  const index = pairings.findIndex(([a, b]) => a === sorted[0] && b === sorted[1]);
  return index >= 0 ? index : 0;
}

function parseGroupSlot(name: string): { group: string; rank: number } | null {
  const winner = name.match(/group\s+([a-l])\s+winner/i);
  if (winner) return { group: winner[1].toUpperCase(), rank: 1 };

  const second = name.match(/group\s+([a-l])\s+2nd place/i);
  if (second) return { group: second[1].toUpperCase(), rank: 2 };

  const third = name.match(/third place group\s+([a-l])/i);
  if (third) return { group: third[1].toUpperCase(), rank: 3 };

  return null;
}

function resolveFromStandings(
  name: string,
  standings: GroupStandings[]
): BracketTeam | null {
  const slot = parseGroupSlot(name);
  if (!slot) return null;

  const table = standings.find((entry) => entry.group === `Group ${slot.group}`);
  const row = table?.rows.find((entry) => entry.rank === slot.rank);
  if (!row?.teamCode) return null;

  const groupComplete = table?.rows.every((entry) => entry.played >= 3) ?? false;

  return {
    name: row.team,
    code: row.teamCode,
    feederLabel: name,
    placeholder: !groupComplete,
    projected: !groupComplete,
  };
}

function toBracketTeam(
  name: string,
  code: string,
  logo: string | undefined,
  score: number | undefined,
  winner: boolean | undefined,
  standings?: GroupStandings[]
): BracketTeam {
  if (!isFeederLabel(name)) {
    return {
      name,
      code: code || resolveTeamCode(name),
      logo,
      score,
      winner,
    };
  }

  const resolved = standings ? resolveFromStandings(name, standings) : null;
  if (resolved) {
    return {
      ...resolved,
      score,
      winner,
      logo: resolved.logo ?? logo,
    };
  }

  return {
    name: shortenFeederLabel(name),
    feederLabel: name,
    placeholder: true,
    score,
    winner,
  };
}

function shortenFeederLabel(name: string): string {
  return name
    .replace(/FIFA World Cup/gi, "")
    .replace(/Third Place Group/gi, "3rd")
    .replace(/Round of 32/gi, "R32")
    .replace(/Round of 16/gi, "R16")
    .replace(/Quarter-Final/gi, "QF")
    .replace(/Semi-Final/gi, "SF")
    .replace(/\s+/g, " ")
    .trim();
}

function parseFeederReference(label: string): { round: BracketRoundId; num: number } | null {
  const patterns: [RegExp, BracketRoundId][] = [
    [/(?:round of 32|r32) (\d+) winner/i, "round-of-32"],
    [/(?:round of 16|r16) (\d+) winner/i, "round-of-16"],
    [/(?:quarter-final|qf) (\d+) winner/i, "quarter-final"],
    [/(?:semi-final|sf) (\d+) winner/i, "semi-final"],
  ];

  for (const [pattern, round] of patterns) {
    const match = label.match(pattern);
    if (match) return { round, num: parseInt(match[1], 10) };
  }

  const loser = label.match(/(?:semi-final|sf) (\d+) loser/i);
  if (loser) return { round: "semi-final", num: parseInt(loser[1], 10) };

  return null;
}

function matchSideWon(match: Match, side: "home" | "away"): boolean {
  if (side === "home" && match.homeWon) return true;
  if (side === "away" && match.awayWon) return true;
  if (match.status !== "finished") return false;
  if (match.homeScore === undefined || match.awayScore === undefined) return false;
  return side === "home"
    ? match.homeScore > match.awayScore
    : match.awayScore > match.homeScore;
}

function matchToBracket(
  match: Match,
  round: BracketRoundId,
  slot: number,
  matchNumber: number | undefined,
  standings?: GroupStandings[]
): BracketMatch {
  const homeWinner = matchSideWon(match, "home");
  const awayWinner = matchSideWon(match, "away");

  return {
    id: String(match.id),
    round,
    slot,
    matchNumber,
    label: `${ROUND_META[round].shortLabel} ${matchNumber ?? slot + 1}`,
    home: toBracketTeam(
      match.homeName,
      match.home,
      match.homeLogo,
      match.homeScore,
      homeWinner,
      standings
    ),
    away: toBracketTeam(
      match.awayName,
      match.away,
      match.awayLogo,
      match.awayScore,
      awayWinner,
      standings
    ),
    status: match.status,
    kickoffAt: match.kickoffAt,
    date: match.date,
    time: match.time,
  };
}

function createSynthesizedMatch(
  round: BracketRoundId,
  slot: number,
  home: string,
  away: string
): BracketMatch {
  return {
    round,
    slot,
    matchNumber: slot + 1,
    label: `${ROUND_META[round].shortLabel} ${slot + 1}`,
    home: toBracketTeam(home, "", undefined, undefined, undefined),
    away: toBracketTeam(away, "", undefined, undefined, undefined),
    status: "upcoming",
  };
}

function createEmptyPlaceholder(round: BracketRoundId, slot: number): BracketMatch {
  return {
    round,
    slot,
    matchNumber: slot + 1,
    label: `${ROUND_META[round].shortLabel} ${slot + 1}`,
    home: { name: "Awaiting teams", placeholder: true },
    away: { name: "Awaiting teams", placeholder: true },
    status: "tbd",
  };
}

function mergeRound(roundId: BracketRoundId, fromMatches: BracketMatch[]): BracketRound {
  const { label, shortLabel, slots } = ROUND_META[roundId];
  const synthesized = SYNTHESIZED_ROUNDS[roundId];

  const matches: BracketMatch[] = Array.from({ length: slots }, (_, slot) => {
    const found = fromMatches.find((match) => match.slot === slot);
    if (found) return found;

    const template = synthesized?.[slot];
    if (template) {
      return createSynthesizedMatch(roundId, slot, template.home, template.away);
    }

    return createEmptyPlaceholder(roundId, slot);
  });

  return { id: roundId, label, shortLabel, matches };
}

function getWinnerTeam(match: BracketMatch): BracketTeam | null {
  if (match.status !== "finished") return null;
  if (match.home.winner) return { ...match.home, placeholder: false, projected: false, winner: true };
  if (match.away.winner) return { ...match.away, placeholder: false, projected: false, winner: true };
  return null;
}

function getLoserTeam(match: BracketMatch): BracketTeam | null {
  if (match.status !== "finished") return null;
  if (match.home.winner) return { ...match.away, placeholder: false, projected: false, winner: false };
  if (match.away.winner) return { ...match.home, placeholder: false, projected: false, winner: false };
  return null;
}

function feederLabelForTeam(team: BracketTeam): string {
  return team.feederLabel ?? team.name;
}

function isResolvedTeam(team: BracketTeam): boolean {
  return Boolean(team.code) && !team.placeholder;
}

function findMatchByNumber(
  rounds: BracketRound[],
  roundId: BracketRoundId,
  num: number
): BracketMatch | undefined {
  const round = rounds.find((entry) => entry.id === roundId);
  return round?.matches.find((match) => match.matchNumber === num);
}

function resolveFeederTeam(
  label: string,
  rounds: BracketRound[],
  wantLoser = false
): BracketTeam | null {
  const ref = parseFeederReference(label);
  if (!ref) return null;

  const source = findMatchByNumber(rounds, ref.round, ref.num);
  if (!source) return null;

  const team = wantLoser ? getLoserTeam(source) : getWinnerTeam(source);
  if (!team?.code) return null;

  return {
    ...team,
    feederLabel: label,
    placeholder: false,
    projected: false,
  };
}

function propagateWinners(rounds: BracketRound[]): void {
  const ordered = [...ROUND_ORDER, "third-place"];

  for (let pass = 0; pass < 4; pass++) {
    let changed = false;

    for (const roundId of ordered) {
      const round = rounds.find((entry) => entry.id === roundId);
      if (!round) continue;

      for (const match of round.matches) {
        for (const side of ["home", "away"] as const) {
          const team = match[side];
          if (isResolvedTeam(team)) continue;

          const feederLabel = feederLabelForTeam(team);
          const wantLoser = /loser/i.test(feederLabel);
          const resolved = resolveFeederTeam(feederLabel, rounds, wantLoser);
          if (!resolved) continue;

          match[side] = {
            ...resolved,
            winner: undefined,
          };
          changed = true;
        }

        if (match.home.code || match.away.code) {
          if (match.status === "tbd") match.status = "upcoming";
        }
      }
    }

    if (!changed) break;
  }
}

function assignR32TreeSlots(matches: BracketMatch[], sourceMatches: Match[]): void {
  const sourceById = new Map(sourceMatches.map((m) => [m.id, m]));

  for (const match of matches) {
    const source = match.id ? sourceById.get(match.id) : undefined;
    if (!source) continue;

    const position = fifaR32PositionForMatch(source.id, source.home, source.away);
    if (!position) continue;

    const treeSlot = FIFA_R32_POSITION_TO_TREE_SLOT[position];
    if (treeSlot === undefined) continue;

    match.slot = treeSlot;
    match.matchNumber = position;
    match.label = `${ROUND_META["round-of-32"].shortLabel} ${position}`;
  }
}

function assignRemainingRoundSlots(
  roundId: BracketRoundId,
  matches: BracketMatch[],
  stageLabels: Map<BracketMatch, string>
): void {
  if (roundId === "round-of-32" || matches.length === 0) return;

  const feederMatches: BracketMatch[] = [];
  const realMatches: BracketMatch[] = [];

  for (const match of matches) {
    const label = stageLabels.get(match) ?? "";
    if (parseFeederNumbers(label)) feederMatches.push(match);
    else realMatches.push(match);
  }

  const slotAssignments = new Map<BracketMatch, number>();

  if (feederMatches.length > 0) {
    assignFeederRoundSlots(roundId, feederMatches, stageLabels);
    for (const match of feederMatches) {
      if (match.slot !== undefined) slotAssignments.set(match, match.slot);
    }
  }

  for (const match of realMatches) {
    if (roundId !== "round-of-16") {
      continue;
    }
    const homeCode = match.home.code ?? resolveTeamCode(match.home.name) ?? "";
    const awayCode = match.away.code ?? resolveTeamCode(match.away.name) ?? "";
    if (!homeCode || !awayCode) continue;
    const slot = r16TreeSlotForTeams(homeCode, awayCode);
    if (slot !== null) slotAssignments.set(match, slot);
  }

  const usedSlots = new Set(slotAssignments.values());
  const { slots } = ROUND_META[roundId];
  const openSlots = Array.from({ length: slots }, (_, slot) => slot).filter(
    (slot) => !usedSlots.has(slot)
  );

  realMatches
    .filter((match) => !slotAssignments.has(match))
    .sort(
      (a, b) =>
        new Date(a.kickoffAt ?? 0).getTime() - new Date(b.kickoffAt ?? 0).getTime()
    )
    .forEach((match, index) => {
      slotAssignments.set(match, openSlots[index] ?? index);
    });

  for (const [match, slot] of slotAssignments) {
    match.slot = slot;
    match.matchNumber = slot + 1;
    match.label = `${ROUND_META[roundId].shortLabel} ${slot + 1}`;
  }
}

function assignFeederRoundSlots(
  roundId: BracketRoundId,
  matches: BracketMatch[],
  stageLabels: Map<BracketMatch, string>
): void {
  const pairings =
    roundId === "round-of-16"
      ? R16_PAIRINGS
      : roundId === "quarter-final"
        ? QF_PAIRINGS
        : roundId === "semi-final"
          ? SF_PAIRINGS
          : null;

  for (const match of matches) {
    const stageLabel = stageLabels.get(match);
    if (!stageLabel || !pairings) continue;

    const feeders = parseFeederNumbers(stageLabel);
    if (!feeders) continue;

    const slot = slotFromPairing(feeders, pairings);
    match.slot = slot;
    match.matchNumber = slot + 1;
    match.label = `${ROUND_META[roundId].shortLabel} ${slot + 1}`;
  }
}

export function buildKnockoutBracket(
  matches: Match[],
  standings: GroupStandings[] = []
): KnockoutBracketData {
  const byRound = new Map<BracketRoundId, BracketMatch[]>();
  const stageLabels = new Map<BracketMatch, string>();

  for (const match of matches) {
    const round = classifyMatchRound(match);
    if (!round) continue;

    const list = byRound.get(round) ?? [];
    const bracketMatch = matchToBracket(match, round, list.length, undefined, standings);
    stageLabels.set(bracketMatch, match.stageLabel ?? match.roundSlug ?? "");
    list.push(bracketMatch);
    byRound.set(round, list);
  }

  assignR32TreeSlots(byRound.get("round-of-32") ?? [], matches);

  for (const roundId of ["round-of-16", "quarter-final", "semi-final"] as BracketRoundId[]) {
    assignRemainingRoundSlots(roundId, byRound.get(roundId) ?? [], stageLabels);
  }

  const rounds: BracketRound[] = [];

  for (const roundId of ROUND_ORDER) {
    if (roundId === "final") {
      rounds.push(mergeRound("third-place", byRound.get("third-place") ?? []));
    }
    rounds.push(mergeRound(roundId, byRound.get(roundId) ?? []));
  }

  propagateWinners(rounds);

  const allMatches = rounds.flatMap((round) => round.matches);
  const finishedMatches = allMatches.filter((match) => match.status === "finished").length;
  const totalMatches = allMatches.filter((match) => match.status !== "tbd").length;

  const activeRound = [...ROUND_ORDER].reverse().find((roundId) => {
    const round = rounds.find((entry) => entry.id === roundId);
    return round?.matches.some(
      (match) =>
        (match.status === "live" || match.status === "upcoming") &&
        match.home.code &&
        match.away.code
    );
  });

  return {
    rounds,
    activeRound,
    finishedMatches,
    totalMatches,
    updatedAt: new Date().toISOString(),
  };
}
