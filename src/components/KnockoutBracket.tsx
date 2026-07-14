"use client";

import Link from "next/link";
import { GitBranch, ChevronRight } from "lucide-react";
import { getTeam } from "@/lib/data";
import type { BracketMatch, BracketRound, BracketRoundId, KnockoutBracketData } from "@/lib/types";

const ROUND_PROGRESS: BracketRoundId[] = [
  "round-of-32",
  "round-of-16",
  "quarter-final",
  "semi-final",
  "final",
];

const ROUND_INDEX: Record<BracketRoundId, number> = {
  "round-of-32": 0,
  "round-of-16": 1,
  "quarter-final": 2,
  "semi-final": 3,
  "third-place": 3,
  final: 4,
};

const ROUND_THEME: Record<BracketRoundId, { accent: string; light: string; glow: string }> = {
  "round-of-32": { accent: "var(--wc-mexico)", light: "var(--wc-mexico-light)", glow: "rgba(0, 104, 71, 0.25)" },
  "round-of-16": { accent: "var(--wc-usa)", light: "var(--wc-usa-light)", glow: "rgba(0, 40, 104, 0.25)" },
  "quarter-final": { accent: "#7c3aed", light: "#f5f3ff", glow: "rgba(124, 58, 237, 0.25)" },
  "semi-final": { accent: "var(--wc-canada)", light: "var(--wc-canada-light)", glow: "rgba(216, 6, 33, 0.22)" },
  "third-place": { accent: "#b45309", light: "#fffbeb", glow: "rgba(180, 83, 9, 0.2)" },
  final: { accent: "var(--wc-gold)", light: "var(--wc-gold-light)", glow: "rgba(201, 162, 39, 0.35)" },
};

const CARD_H = 76;
const SLOT_GAP = 10;
const SLOT_STEP = CARD_H + SLOT_GAP;
const CONNECTOR_W = 28;

function slotTop(slot: number, roundIdx: number): number {
  const mult = 2 ** roundIdx;
  return slot * SLOT_STEP * mult + ((mult - 1) * SLOT_STEP) / 2;
}

function TeamLine({ team }: { team: BracketMatch["home"]; accent?: string }) {
  const display = team.code ? getTeam(team.code, team.name, team.logo) : null;
  const isPlaceholder = team.placeholder && !team.code;

  return (
    <div
      className={`flex items-center gap-1 min-w-0 rounded px-0.5 py-px ${team.winner ? "font-bold" : ""}`}
    >
      {display?.logo ? (
        <img src={display.logo} alt="" className="h-3.5 w-3.5 object-contain shrink-0" />
      ) : display?.flag ? (
        <span className="text-xs shrink-0">{display.flag}</span>
      ) : isPlaceholder ? (
        <span className="text-[8px] shrink-0 w-3.5 h-3.5 rounded-full bg-zinc-200 text-zinc-500 flex items-center justify-center font-bold">
          ?
        </span>
      ) : null}
      <span
        className={`text-[10px] truncate leading-tight ${
          team.winner
            ? "text-zinc-900"
            : isPlaceholder
              ? "text-zinc-400 italic"
              : team.projected
                ? "text-zinc-500"
                : "text-zinc-600"
        }`}
        title={team.feederLabel ?? team.name}
      >
        {display?.name ?? team.name}
      </span>
      {team.projected && (
        <span className="text-[7px] font-bold uppercase text-amber-600 shrink-0">proj</span>
      )}
      {team.score !== undefined && (
        <span
          className={`text-[10px] tabular-nums shrink-0 ml-auto rounded px-0.5 ${
            team.winner ? "font-extrabold text-zinc-900" : "font-medium text-zinc-400"
          }`}
        >
          {team.score}
        </span>
      )}
    </div>
  );
}

function BracketMatchCard({ match, roundId }: { match: BracketMatch; roundId: BracketRoundId }) {
  const theme = ROUND_THEME[roundId];
  const isLive = match.status === "live";
  const isFinished = match.status === "finished";
  const isTbd = match.status === "tbd";
  const isFinal = roundId === "final";
  const hasTeams = match.home.code || match.away.code || !match.home.placeholder;
  const isClickable = Boolean(match.id);
  const homeDisplay = match.home.code
    ? getTeam(match.home.code, match.home.name, match.home.logo)
    : null;
  const awayDisplay = match.away.code
    ? getTeam(match.away.code, match.away.name, match.away.logo)
    : null;
  const matchLabel = `${homeDisplay?.name ?? match.home.name} vs ${awayDisplay?.name ?? match.away.name}`;

  const content = (
    <div
      className={`bracket-match relative rounded-lg border-2 px-2 py-1.5 transition-all overflow-hidden h-[76px] flex flex-col justify-center ${
        isTbd
          ? "border-dashed border-zinc-200/80 bg-white/50"
          : isLive
            ? "bracket-match-live border-red-300"
            : isFinal
              ? "bracket-match-final"
              : isClickable
                ? "bracket-match-played hover:shadow-md"
                : "bracket-match-feeder"
      }`}
      style={
        !isTbd && !isLive
          ? {
              borderColor: `color-mix(in srgb, ${theme.accent} 40%, white)`,
              background: `linear-gradient(135deg, white 0%, ${theme.light} 100%)`,
              boxShadow: isFinal ? `0 4px 16px ${theme.glow}` : `0 2px 6px ${theme.glow}`,
            }
          : isLive
            ? { background: "linear-gradient(135deg, #fff5f5 0%, #ffe4e6 100%)" }
            : hasTeams
              ? {
                  borderColor: `color-mix(in srgb, ${theme.accent} 25%, white)`,
                  background: "linear-gradient(135deg, #fafafa 0%, white 100%)",
                }
              : undefined
      }
    >
      <div className="absolute top-0 left-0 right-0 h-0.5" style={{ background: theme.accent }} />
      <div className="flex items-center justify-between gap-1 mb-0.5">
        <span
          className="text-[8px] font-extrabold uppercase tracking-wider rounded px-1 py-px"
          style={{ color: theme.accent, background: theme.light }}
        >
          {isFinal && "🏆 "}
          {match.label}
        </span>
        {isLive && <span className="badge-live text-[8px] px-1 py-px scale-90 origin-right">Live</span>}
        {isFinished && <span className="text-[8px] font-bold text-emerald-600">FT</span>}
        {!isLive && !isFinished && match.time && (
          <span className="text-[7px] font-semibold text-zinc-400 truncate max-w-[3rem]">{match.time}</span>
        )}
      </div>
      <div className="space-y-0.5">
        <TeamLine team={match.home} accent={theme.accent} />
        <TeamLine team={match.away} accent={theme.accent} />
      </div>
    </div>
  );

  if (isClickable) {
    return (
      <Link
        href={`/match/${match.id}`}
        className="bracket-match-link block w-full h-full relative z-10 rounded-lg"
        aria-label={matchLabel}
      >
        {content}
      </Link>
    );
  }

  return <div className="block w-full h-full relative z-10">{content}</div>;
}

function BracketTreeColumn({
  round,
  roundIdx,
  treeHeight,
  isLast,
  highlight,
}: {
  round: BracketRound;
  roundIdx: number;
  treeHeight: number;
  isLast: boolean;
  highlight?: boolean;
}) {
  const theme = ROUND_THEME[round.id];
  const filled = round.matches.filter((m) => m.status !== "tbd").length;

  return (
    <div
      className={`bracket-tree-column shrink-0 ${highlight ? "bracket-round-active" : ""}`}
      style={{ width: `calc(9.5rem + ${isLast ? 0 : CONNECTOR_W}px)` }}
    >
      <div
        className="mb-2 text-center rounded-lg px-1.5 py-1.5 border mx-auto max-w-[9.5rem]"
        style={{
          background: `linear-gradient(180deg, ${theme.light} 0%, white 100%)`,
          borderColor: `color-mix(in srgb, ${theme.accent} 35%, white)`,
          boxShadow: highlight ? `0 0 0 2px ${theme.glow}` : undefined,
        }}
      >
        <p className="text-[9px] font-extrabold uppercase tracking-wider" style={{ color: theme.accent }}>
          {round.id === "final" && "🏆 "}
          {round.shortLabel}
        </p>
        <p className="text-[8px] text-zinc-500 font-medium">{filled}/{round.matches.length}</p>
      </div>

      <div className="relative" style={{ height: treeHeight }}>
        {round.matches.map((match, slot) => {
          const top = slotTop(slot, roundIdx);
          const showPairJoin = !isLast && slot % 2 === 0 && slot + 1 < round.matches.length;
          const pairTop = top + CARD_H / 2;
          const pairBottom = showPairJoin ? slotTop(slot + 1, roundIdx) + CARD_H / 2 : 0;
          const pairMid = showPairJoin ? (pairTop + pairBottom) / 2 : 0;

          return (
            <div key={`${round.id}-${slot}`}>
              <div className="bracket-tree-slot absolute left-0 w-[9.5rem]" style={{ top, height: CARD_H }}>
                <BracketMatchCard match={match} roundId={round.id} />
                {!isLast && <div className="bracket-connector-h" style={{ background: theme.accent }} />}
              </div>

              {showPairJoin && (
                <>
                  <div
                    className="bracket-connector-v"
                    style={{ top: pairTop, height: pairBottom - pairTop, borderColor: theme.accent }}
                  />
                  <div
                    className="bracket-connector-merge"
                    style={{ top: pairMid, borderColor: theme.accent }}
                  />
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

interface KnockoutBracketProps {
  data: KnockoutBracketData;
  compact?: boolean;
  showLink?: boolean;
  refreshing?: boolean;
  embedded?: boolean;
}

export function KnockoutBracket({
  data,
  compact = false,
  showLink = false,
  refreshing = false,
  embedded = false,
}: KnockoutBracketProps) {
  const mainRounds = data.rounds.filter((r) => r.id !== "third-place");
  const thirdPlace = data.rounds.find((r) => r.id === "third-place");

  const visibleRounds = compact
    ? mainRounds.filter((r) =>
        ["round-of-16", "quarter-final", "semi-final", "final"].includes(r.id)
      )
    : mainRounds;

  const baseRoundIdx = compact ? 1 : 0;
  const treeLeafCount = compact ? 8 : 16;
  const treeHeight = treeLeafCount * SLOT_STEP;

  const progressIndex = data.activeRound
    ? ROUND_PROGRESS.indexOf(data.activeRound)
    : ROUND_PROGRESS.length - 1;

  const bracketContent = (
    <div className={`bracket-shell ${embedded ? "bracket-shell--embedded" : "rounded-2xl p-4 sm:p-6"} overflow-hidden relative`}>
        {!embedded && <div className="host-stripe absolute top-0 left-0 right-0 z-[1]" />}

        <div className={`relative z-[2] ${embedded ? "mb-3 mt-0" : "mb-4 mt-1"}`}>
          <div className="flex items-center justify-between gap-1">
            {ROUND_PROGRESS.map((roundId, index) => {
              const theme = ROUND_THEME[roundId];
              const active = index <= progressIndex;
              const current = roundId === data.activeRound;
              return (
                <div key={roundId} className="flex-1 flex flex-col items-center gap-1 min-w-0">
                  <div
                    className="h-2 w-full rounded-full"
                    style={
                      active
                        ? {
                            background: `linear-gradient(90deg, ${theme.accent}, color-mix(in srgb, ${theme.accent} 55%, white))`,
                            boxShadow: current ? `0 0 8px ${theme.glow}` : undefined,
                          }
                        : { background: "#e4e4e7" }
                    }
                  />
                  <span
                    className="text-[8px] sm:text-[9px] font-extrabold uppercase tracking-wide"
                    style={{ color: current ? theme.accent : active ? "#52525b" : "#a1a1aa" }}
                  >
                    {data.rounds.find((r) => r.id === roundId)?.shortLabel ?? roundId}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="relative z-[2] overflow-x-auto pb-3 scrollbar-none">
          <div className="bracket-tree flex items-start min-w-max px-1">
            {visibleRounds.map((round, index) => (
              <BracketTreeColumn
                key={round.id}
                round={round}
                roundIdx={ROUND_INDEX[round.id] - baseRoundIdx}
                treeHeight={treeHeight}
                isLast={index === visibleRounds.length - 1}
                highlight={round.id === data.activeRound}
              />
            ))}
          </div>
        </div>

        {thirdPlace && !compact && thirdPlace.matches.some((m) => m.status !== "tbd" || !m.home.placeholder) && (
          <div className="relative z-[2] mt-4 pt-4 border-t border-zinc-100">
            <p className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-2 text-center">
              Third-Place Playoff
            </p>
            <div className="max-w-[9.5rem] mx-auto">
              <BracketMatchCard match={thirdPlace.matches[0]} roundId="third-place" />
            </div>
          </div>
        )}

        {compact && !embedded && (
          <p className="relative z-[2] mt-3 text-center text-xs text-zinc-500">
            Round of 32 on the{" "}
            <Link href="/bracket" className="text-[var(--wc-usa)] font-semibold hover:underline">
              full bracket page
            </Link>
          </p>
        )}
      </div>
  );

  if (embedded) {
    return bracketContent;
  }

  return (
    <section>
      <div className="mb-4 flex items-end justify-between gap-4">
        <div>
          <h2 className="section-title flex items-center gap-2 text-base sm:text-lg">
            <GitBranch size={20} className="text-[var(--wc-usa)]" />
            Knockout Bracket
          </h2>
          <p className="mt-1 text-sm text-zinc-500">
            {data.finishedMatches} of {data.totalMatches} knockout matches played
            {data.activeRound && (
              <>
                {" · "}
                <span className="font-semibold text-[var(--wc-usa)]">
                  Now: {data.rounds.find((r) => r.id === data.activeRound)?.label}
                </span>
              </>
            )}
            {data.updatedAt && (
              <>
                {" · "}
                <span className={`text-xs ${refreshing ? "text-[var(--wc-usa)]" : ""}`}>
                  {refreshing ? "Updating…" : "Auto-updates from ESPN"}
                </span>
              </>
            )}
          </p>
        </div>
        {showLink && (
          <Link
            href="/bracket"
            className="text-sm font-semibold text-[var(--wc-usa)] hover:underline shrink-0 inline-flex items-center gap-1"
          >
            Full bracket <ChevronRight size={14} />
          </Link>
        )}
      </div>
      {bracketContent}
    </section>
  );
}
