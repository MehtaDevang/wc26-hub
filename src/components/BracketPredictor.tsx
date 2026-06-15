"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { GitBranch, RotateCcw, Trophy } from "lucide-react";
import { KnockoutBracket } from "@/components/KnockoutBracket";
import { ShareButtons } from "@/components/ShareButtons";
import { SITE_NAME } from "@/lib/site";
import {
  applyBracketPicks,
  bracketMatchKey,
  clearBracketPicks,
  countBracketPicks,
  decodeBracketPicks,
  encodeBracketPicks,
  getBracketPicks,
  getPredictedChampion,
  saveBracketPicks,
  type BracketPickSide,
  type BracketPicks,
} from "@/lib/bracket-picks";
import type { BracketMatch, BracketRoundId, KnockoutBracketData } from "@/lib/types";
import { getTeam } from "@/lib/data";

const PREDICT_ROUNDS: BracketRoundId[] = [
  "round-of-32",
  "round-of-16",
  "quarter-final",
  "semi-final",
  "third-place",
  "final",
];

interface BracketPredictorProps {
  initialData: KnockoutBracketData;
}

function PredictMatchCard({
  match,
  roundId,
  picks,
  onPick,
}: {
  match: BracketMatch;
  roundId: BracketRoundId;
  picks: BracketPicks;
  onPick: (key: string, side: BracketPickSide) => void;
}) {
  const key = bracketMatchKey(roundId, match.slot);
  const picked = picks[key];
  const isFinal = roundId === "final";

  function TeamButton({ side, team }: { side: BracketPickSide; team: BracketMatch["home"] }) {
    const display = team.code ? getTeam(team.code, team.name, team.logo) : null;
    const isSelected = picked === side;
    const canPick = Boolean(team.code || (!team.placeholder && team.name !== "Awaiting teams"));

    return (
      <button
        type="button"
        disabled={!canPick}
        onClick={() => canPick && onPick(key, side)}
        className={`flex items-center gap-1.5 w-full rounded-md px-1.5 py-1 text-left transition-all ${
          isSelected
            ? "bg-blue-600 text-white shadow-sm"
            : canPick
              ? "hover:bg-blue-50 text-zinc-700"
              : "text-zinc-400 cursor-not-allowed"
        }`}
      >
        {display?.logo ? (
          <img src={display.logo} alt="" className="h-3.5 w-3.5 object-contain shrink-0" />
        ) : display?.flag ? (
          <span className="text-xs shrink-0">{display.flag}</span>
        ) : (
          <span className="text-[8px] w-3.5 h-3.5 rounded-full bg-zinc-200 shrink-0" />
        )}
        <span className="text-[10px] truncate font-medium">{display?.name ?? team.name}</span>
      </button>
    );
  }

  return (
    <div
      className={`relative rounded-lg border-2 px-2 py-1.5 h-[76px] flex flex-col justify-center ${
        isFinal ? "border-amber-300 bg-gradient-to-br from-amber-50 to-white" : "border-zinc-200 bg-white"
      }`}
    >
      <p className="text-[8px] font-bold uppercase tracking-wider text-zinc-400 mb-0.5">
        {isFinal && "🏆 "}
        {match.label}
      </p>
      <div className="space-y-0.5">
        <TeamButton side="home" team={match.home} />
        <TeamButton side="away" team={match.away} />
      </div>
    </div>
  );
}

function PredictBracketTree({ data, picks, onPick }: {
  data: KnockoutBracketData;
  picks: BracketPicks;
  onPick: (key: string, side: BracketPickSide) => void;
}) {
  return (
    <div className="overflow-x-auto pb-4 -mx-4 px-4">
      <div className="flex gap-3 min-w-max">
        {PREDICT_ROUNDS.map((roundId) => {
          const round = data.rounds.find((r) => r.id === roundId);
          if (!round) return null;
          return (
            <div key={roundId} className="w-[10rem] shrink-0">
              <p className="text-[9px] font-extrabold uppercase tracking-wider text-center text-zinc-500 mb-2">
                {round.shortLabel}
              </p>
              <div className="space-y-2">
                {round.matches.map((match) => (
                  <PredictMatchCard
                    key={`${roundId}-${match.slot}`}
                    match={match}
                    roundId={roundId}
                    picks={picks}
                    onPick={onPick}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function BracketPredictor({ initialData }: BracketPredictorProps) {
  const searchParams = useSearchParams();
  const [picks, setPicks] = useState<BracketPicks>({});
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const fromUrl = searchParams.get("p");
    let initial = getBracketPicks();
    if (fromUrl) {
      initial = { ...initial, ...decodeBracketPicks(fromUrl, initialData) };
    }
    setPicks(initial);
    setHydrated(true);
  }, [searchParams, initialData]);

  useEffect(() => {
    if (!hydrated) return;
    saveBracketPicks(picks);
  }, [picks, hydrated]);

  const applied = useMemo(() => applyBracketPicks(initialData, picks), [initialData, picks]);
  const pickCount = countBracketPicks(picks, initialData);
  const totalSlots = PREDICT_ROUNDS.reduce((sum, id) => {
    const round = initialData.rounds.find((r) => r.id === id);
    return sum + (round?.matches.length ?? 0);
  }, 0);
  const champion = getPredictedChampion(initialData, picks);

  const shareUrl = useMemo(() => {
    if (typeof window === "undefined") return "/bracket/predict";
    const encoded = encodeBracketPicks(picks, initialData);
    return `${window.location.origin}/bracket/predict?p=${encoded}`;
  }, [picks, initialData]);

  const handlePick = useCallback((key: string, side: BracketPickSide) => {
    setPicks((prev) => {
      if (prev[key] === side) {
        const next = { ...prev };
        delete next[key];
        return next;
      }
      return { ...prev, [key]: side };
    });
  }, []);

  const handleReset = useCallback(() => {
    clearBracketPicks();
    setPicks({});
    if (typeof window !== "undefined") {
      window.history.replaceState({}, "", "/bracket/predict");
    }
  }, []);

  const championName = champion?.code
    ? getTeam(champion.code, champion.name, champion.logo).name
    : null;

  return (
    <div className="space-y-6">
      <div className="card-surface rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-bold text-zinc-900 flex items-center gap-2">
            <GitBranch size={18} className="text-blue-600" />
            My World Cup Bracket
          </h2>
          <p className="text-sm text-zinc-500 mt-1">
            Tap a team to pick the winner — {pickCount}/{totalSlots} picks made
          </p>
          {championName && (
            <p className="text-sm font-semibold text-amber-700 mt-2 flex items-center gap-1.5">
              <Trophy size={14} />
              Your champion: {championName}
            </p>
          )}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button type="button" onClick={handleReset} className="btn-secondary text-sm px-3 py-2 inline-flex items-center gap-1.5">
            <RotateCcw size={14} />
            Reset
          </button>
          <ShareButtons
            url={shareUrl}
            title="My World Cup 2026 Bracket"
            text={`🏆 My FIFA World Cup 2026 bracket prediction on ${SITE_NAME}`}
            label="Share bracket"
          />
        </div>
      </div>

      <div className="card-elevated rounded-2xl p-4 sm:p-6">
        <p className="text-xs text-zinc-400 mb-4 lg:hidden">
          Scroll horizontally to fill in every round →
        </p>
        <PredictBracketTree data={applied} picks={picks} onPick={handlePick} />
      </div>

      <div className="card-surface rounded-2xl p-5">
        <h3 className="text-sm font-bold text-zinc-800 mb-3">Live bracket comparison</h3>
        <p className="text-xs text-zinc-500 mb-4">
          See how your picks compare to real results as the knockout stage unfolds.
        </p>
        <KnockoutBracket data={initialData} compact />
      </div>

      <p className="text-center text-sm text-zinc-500">
        <Link href="/bracket" className="text-blue-600 hover:underline font-medium">
          ← Back to live knockout bracket
        </Link>
      </p>
    </div>
  );
}
