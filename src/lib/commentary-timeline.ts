import type { MatchEvent } from "./types";
import { parseSubstitution } from "./match-timeline";

export interface CommentaryLine {
  minute?: string;
  text: string;
  sequence?: number;
}

function parseCommentaryClock(
  displayValue?: string
): { minute: number; extraTime?: number } | null {
  if (!displayValue?.trim()) return null;

  const stoppage = displayValue.match(/^(\d+)['′]?\s*\+\s*(\d+)/);
  if (stoppage) {
    return {
      minute: parseInt(stoppage[1]!, 10),
      extraTime: parseInt(stoppage[2]!, 10),
    };
  }

  const plain = displayValue.match(/^(\d+)/);
  if (plain) return { minute: parseInt(plain[1]!, 10) };
  return null;
}

function resolveTeamSide(
  teamHint: string | undefined,
  homeName: string,
  awayName: string,
  homeCode: string,
  awayCode: string
): MatchEvent["team"] {
  if (!teamHint) return "neutral";
  const hint = teamHint.toLowerCase();
  if (hint.includes(homeName.toLowerCase()) || hint.includes(homeCode.toLowerCase())) {
    return "home";
  }
  if (hint.includes(awayName.toLowerCase()) || hint.includes(awayCode.toLowerCase())) {
    return "away";
  }
  return "neutral";
}

function extractPlayerAndTeam(text: string): {
  playerName: string;
  teamHint?: string;
} {
  const corner = text.match(/^Corner,\s*([^.]+)/i);
  if (corner) {
    const team = corner[1]!.trim();
    return { playerName: team, teamHint: team };
  }

  const playerTeam = text.match(
    /([A-Za-zÀ-ÿ''.\- ]+?)\s+\(([^)]+)\)/
  );
  if (playerTeam) {
    return {
      playerName: playerTeam[1]!.trim(),
      teamHint: playerTeam[2]!.trim(),
    };
  }

  const foul = text.match(/^Foul by\s+(.+?)\./i);
  if (foul) return { playerName: foul[1]!.trim() };

  const handball = text.match(/^Handball by\s+(.+?)\./i);
  if (handball) return { playerName: handball[1]!.trim() };

  const injury = text.match(/injury\s+(.+?)\./i);
  if (injury) return { playerName: injury[1]!.trim() };

  return { playerName: text.split(".")[0]!.trim().slice(0, 80) };
}

type CommentaryClass = {
  type: MatchEvent["type"];
  priority: number;
};

function classifyCommentary(text: string): CommentaryClass | null {
  const lower = text.toLowerCase();

  if (
    /^first half begins|^second half begins|^lineups are|^delay over|^fourth official/i.test(
      text
    )
  ) {
    return null;
  }
  if (/^first half ends|^second half ends|^match ends|^full time/i.test(text)) {
    return null;
  }

  if (/^goal!/i.test(text)) return { type: "goal", priority: 100 };
  if (/substitution,/i.test(text)) return { type: "sub", priority: 96 };
  if (/second yellow|yellow card.*second/i.test(lower)) return { type: "red", priority: 95 };
  if (/red card/i.test(lower)) return { type: "red", priority: 95 };
  if (/yellow card/i.test(lower)) return { type: "yellow", priority: 94 };
  if (/penalty/i.test(text) && /(awarded|missed|saved|scores|goal)/i.test(text)) {
    return { type: "penalty", priority: 92 };
  }
  if (/var|video assistant/i.test(lower)) return { type: "whistle", priority: 88 };
  if (/hits the (left|right) post|hits the bar|woodwork/i.test(lower)) {
    return { type: "chance", priority: 86 };
  }
  if (/attempt saved|saved in/i.test(lower)) return { type: "save", priority: 82 };
  if (/attempt blocked|blocked following/i.test(lower)) return { type: "chance", priority: 74 };
  if (/attempt missed|too high|too wide|over the bar|off target/i.test(lower)) {
    return { type: "chance", priority: 68 };
  }
  if (/right footed shot|left footed shot|header.*attempt|shot from/i.test(lower)) {
    return { type: "chance", priority: 62 };
  }
  if (/^corner,/i.test(text)) return { type: "chance", priority: 58 };
  if (/delay in match because of an injury/i.test(lower)) {
    return { type: "whistle", priority: 78 };
  }
  if (/delay in match/i.test(lower)) return { type: "whistle", priority: 45 };
  if (/handball by/i.test(lower)) return { type: "whistle", priority: 52 };

  return null;
}

function eventFingerprint(event: MatchEvent): string {
  const extra = event.extraTime ?? 0;
  const name = event.playerName.toLowerCase().slice(0, 40);
  const desc = event.description.toLowerCase().slice(0, 60);
  return `${event.minute}:${extra}:${event.type}:${name}:${desc}`;
}

function isNearDuplicate(existing: MatchEvent[], candidate: MatchEvent): boolean {
  return existing.some((event) => {
    if (Math.abs(event.minute - candidate.minute) > 0) return false;
    if ((event.extraTime ?? 0) !== (candidate.extraTime ?? 0)) return false;

    if (event.type === candidate.type) {
      if (event.type === "whistle") {
        const a = event.description.toLowerCase();
        const b = candidate.description.toLowerCase();
        if (/injury/.test(a) && /injury/.test(b)) return true;
        if (/drinks/.test(a) && /drinks/.test(b)) return true;
      }

      if (
        event.playerName &&
        candidate.playerName &&
        event.playerName.toLowerCase() === candidate.playerName.toLowerCase()
      ) {
        return true;
      }

      return eventFingerprint(event) === eventFingerprint(candidate);
    }

    return false;
  });
}

/** Turn ESPN live commentary into timeline events for goalless or low-event matches. */
export function parseCommentaryToEvents(
  lines: CommentaryLine[],
  homeCode: string,
  awayCode: string,
  homeName: string,
  awayName: string
): MatchEvent[] {
  const parsed: Array<MatchEvent & { priority: number }> = [];

  for (const [index, line] of lines.entries()) {
    const text = line.text?.trim();
    if (!text) continue;

    const classified = classifyCommentary(text);
    if (!classified) continue;

    const clock = parseCommentaryClock(line.minute);
    if (!clock) continue;

    const { playerName, teamHint } = extractPlayerAndTeam(text);
    const team = resolveTeamSide(teamHint, homeName, awayName, homeCode, awayCode);

    let subIn: string | undefined;
    let subOut: string | undefined;
    if (classified.type === "sub") {
      const subs = parseSubstitution(text);
      subIn = subs.subIn;
      subOut = subs.subOut;
    }

    parsed.push({
      id: `commentary-${line.sequence ?? index}-${clock.minute}-${classified.type}`,
      minute: clock.minute,
      extraTime: clock.extraTime,
      period: clock.minute > 45 ? 2 : 1,
      type: classified.type,
      team,
      playerName: subIn ?? playerName,
      description: text,
      subIn,
      subOut,
      priority: classified.priority,
    });
  }

  parsed.sort((a, b) => {
    const periodA = a.period ?? (a.minute > 45 ? 2 : 1);
    const periodB = b.period ?? (b.minute > 45 ? 2 : 1);
    const keyA = periodA * 10_000 + a.minute * 100 + (a.extraTime ?? 0);
    const keyB = periodB * 10_000 + b.minute * 100 + (b.extraTime ?? 0);
    return keyA - keyB || b.priority - a.priority;
  });

  const selected: MatchEvent[] = [];
  for (const event of parsed) {
    if (isNearDuplicate(selected, event)) continue;
    const { priority: _priority, ...matchEvent } = event;
    selected.push(matchEvent);
  }

  return selected;
}

export function mergeTimelineEvents(
  primary: MatchEvent[],
  secondary: MatchEvent[]
): MatchEvent[] {
  const merged = [...primary];
  for (const candidate of secondary) {
    if (isNearDuplicate(merged, candidate)) continue;
    if (
      (candidate.type === "goal" || candidate.type === "penalty") &&
      merged.some((event) => event.type === "goal" || event.type === "penalty")
    ) {
      const dupGoal = merged.some(
        (event) =>
          (event.type === "goal" || event.type === "penalty") &&
          Math.abs(event.minute - candidate.minute) <= 1 &&
          (event.extraTime ?? 0) === (candidate.extraTime ?? 0)
      );
      if (dupGoal) continue;
    }
    merged.push(candidate);
  }

  return merged.sort((a, b) => {
    const periodA = a.period ?? (a.minute > 45 ? 2 : 1);
    const periodB = b.period ?? (b.minute > 45 ? 2 : 1);
    const keyA = periodA * 10_000 + a.minute * 100 + (a.extraTime ?? 0);
    const keyB = periodB * 10_000 + b.minute * 100 + (b.extraTime ?? 0);
    return keyA - keyB;
  });
}
