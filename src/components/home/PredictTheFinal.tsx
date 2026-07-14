"use client";

import { useEffect, useState } from "react";
import { Check, Minus, Plus, RefreshCw, Trophy } from "lucide-react";
import { getTeam } from "@/lib/data";
import { getTeamColors } from "@/lib/team-colors";
import { CdnImage } from "@/components/CdnImage";
import { useMounted } from "@/hooks/useMounted";
import { getFinalPick, saveFinalPick, clearFinalPick, type FinalPick } from "@/lib/storage";
import type { BracketTeam } from "@/lib/types";

interface PredictTheFinalProps {
  candidates: BracketTeam[];
  /** True once the Final is set (exactly two finalists are known). */
  locked: boolean;
}

function TeamCrest({ code, size = 32 }: { code: string; size?: number }) {
  const info = getTeam(code);
  const colors = getTeamColors(code);
  return (
    <span
      className="flex shrink-0 items-center justify-center rounded-full"
      style={{
        width: size + 12,
        height: size + 12,
        background: `${colors.primary}14`,
        boxShadow: `inset 0 0 0 2px ${colors.primary}40`,
      }}
    >
      {info.logo ? (
        <CdnImage src={info.logo} alt="" width={size} height={size} className="object-contain" />
      ) : (
        <span style={{ fontSize: size * 0.7 }}>{info.flag}</span>
      )}
    </span>
  );
}

/** Small stepper used only for the Final scoreline mode. */
function GoalStepper({
  code,
  name,
  value,
  onChange,
}: {
  code: string;
  name: string;
  value: number;
  onChange: (next: number) => void;
}) {
  return (
    <div className="flex flex-1 flex-col items-center gap-2">
      <TeamCrest code={code} size={28} />
      <span className="max-w-full truncate text-xs font-bold text-zinc-700">{name}</span>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => onChange(Math.max(0, value - 1))}
          className="flex h-8 w-8 items-center justify-center rounded-full border border-zinc-200 text-zinc-500 hover:bg-zinc-50"
          aria-label={`Decrease ${name} goals`}
        >
          <Minus size={14} />
        </button>
        <span className="w-7 text-center text-2xl font-black tabular-nums text-zinc-900">{value}</span>
        <button
          type="button"
          onClick={() => onChange(Math.min(9, value + 1))}
          className="flex h-8 w-8 items-center justify-center rounded-full border border-zinc-200 text-zinc-500 hover:bg-zinc-50"
          aria-label={`Increase ${name} goals`}
        >
          <Plus size={14} />
        </button>
      </div>
    </div>
  );
}

export function PredictTheFinal({ candidates, locked }: PredictTheFinalProps) {
  const mounted = useMounted();
  const [pick, setPick] = useState<FinalPick | null>(null);
  const [selected, setSelected] = useState<string | null>(null);
  const [homeGoals, setHomeGoals] = useState(2);
  const [awayGoals, setAwayGoals] = useState(1);

  useEffect(() => {
    setPick(getFinalPick());
  }, []);

  const teams = candidates.filter(
    (t, i, arr) => t.code && arr.findIndex((x) => x.code === t.code) === i
  );

  if (!mounted) return null;

  // Final scoreline mode requires exactly two known finalists.
  const scoreMode = locked && teams.length === 2;
  const finalistA = scoreMode ? getTeam(teams[0].code!, teams[0].name) : null;
  const finalistB = scoreMode ? getTeam(teams[1].code!, teams[1].name) : null;

  function saveChampionOnly() {
    if (!selected) return;
    const team = getTeam(selected);
    const next: FinalPick = {
      championCode: selected,
      championName: team.name,
      homeGoals: 0,
      awayGoals: 0,
      savedAt: Date.now(),
      mode: "champion",
    };
    saveFinalPick(next);
    setPick(next);
  }

  function saveScoreline() {
    if (!scoreMode || !teams[0].code || !teams[1].code) return;
    // Winner = whoever has more goals; ties fall back to team A.
    const winnerIsA = homeGoals >= awayGoals;
    const champ = winnerIsA ? teams[0] : teams[1];
    const other = winnerIsA ? teams[1] : teams[0];
    const champInfo = getTeam(champ.code!, champ.name);
    const otherInfo = getTeam(other.code!, other.name);
    const next: FinalPick = {
      championCode: champ.code!,
      championName: champInfo.name,
      homeGoals: winnerIsA ? homeGoals : awayGoals,
      awayGoals: winnerIsA ? awayGoals : homeGoals,
      savedAt: Date.now(),
      mode: "score",
      opponentCode: other.code!,
      opponentName: otherInfo.name,
    };
    saveFinalPick(next);
    setPick(next);
  }

  function reset() {
    clearFinalPick();
    setPick(null);
    setSelected(null);
    setHomeGoals(2);
    setAwayGoals(1);
  }

  // ---- Saved state ---------------------------------------------------------
  if (pick) {
    const team = getTeam(pick.championCode, pick.championName);
    const colors = getTeamColors(pick.championCode);
    const isScore = pick.mode === "score" && pick.opponentName;
    return (
      <section
        className="relative overflow-hidden rounded-2xl border p-4 sm:p-5"
        style={{
          borderColor: `${colors.primary}44`,
          background: `linear-gradient(135deg, ${colors.primary}12, #fff 60%)`,
        }}
      >
        <div className="flex items-center gap-3">
          <TeamCrest code={pick.championCode} size={34} />
          <div className="min-w-0 flex-1">
            <p className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-green-700">
              <Check size={12} /> Prediction saved
            </p>
            <p className="text-lg font-black leading-tight tracking-tight text-zinc-900">
              {team.name} to win the World Cup
            </p>
            <p className="text-xs text-zinc-500">
              {isScore
                ? `You predicted a ${pick.homeGoals}–${pick.awayGoals} Final win over ${pick.opponentName}.`
                : "Come back after the Final to see if you called it."}
            </p>
          </div>
          <button
            type="button"
            onClick={reset}
            className="flex shrink-0 items-center gap-1.5 rounded-full border border-zinc-200 bg-white px-3 py-1.5 text-xs font-semibold text-zinc-600 hover:bg-zinc-50"
          >
            <RefreshCw size={12} /> Change
          </button>
        </div>
      </section>
    );
  }

  // ---- Final scoreline mode (two finalists known) --------------------------
  if (scoreMode && finalistA && finalistB) {
    return (
      <section className="relative overflow-hidden rounded-2xl border border-zinc-200 bg-white p-4 sm:p-5">
        <div className="mb-4 flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 text-white shadow-sm">
            <Trophy size={17} />
          </span>
          <div>
            <h2 className="text-sm font-extrabold tracking-tight text-zinc-900">Predict the Final score</h2>
            <p className="text-[11px] font-medium text-zinc-500">
              {finalistA.name} vs {finalistB.name} — set your scoreline
            </p>
          </div>
        </div>

        <div className="flex items-start justify-center gap-3 rounded-xl bg-zinc-50 px-3 py-4 sm:gap-5">
          <GoalStepper code={teams[0].code!} name={finalistA.name} value={homeGoals} onChange={setHomeGoals} />
          <span className="mt-9 text-lg font-black text-zinc-300">–</span>
          <GoalStepper code={teams[1].code!} name={finalistB.name} value={awayGoals} onChange={setAwayGoals} />
        </div>

        <p className="mt-3 text-center text-xs font-medium text-zinc-500">
          {homeGoals === awayGoals
            ? `A ${homeGoals}–${awayGoals} draw — ${finalistA.name} edge it on penalties in your call.`
            : `You're backing ${(homeGoals > awayGoals ? finalistA : finalistB).name} to lift the trophy.`}
        </p>

        <button
          type="button"
          onClick={saveScoreline}
          className="mt-4 flex w-full items-center justify-center gap-1.5 rounded-full bg-[var(--wc-usa)] px-4 py-2.5 text-sm font-bold text-white transition-opacity hover:opacity-90"
        >
          Lock in my prediction
        </button>
      </section>
    );
  }

  // ---- Champion pick mode (semi-finals, finalists not yet known) -----------
  return (
    <section className="relative overflow-hidden rounded-2xl border border-zinc-200 bg-white p-4 sm:p-5">
      <div className="mb-1 flex items-center gap-2.5">
        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 text-white shadow-sm">
          <Trophy size={17} />
        </span>
        <div>
          <h2 className="text-sm font-extrabold tracking-tight text-zinc-900">Who will win the World Cup?</h2>
          <p className="text-[11px] font-medium text-zinc-500">
            Pick your champion — we&apos;ll save it so you can see if you called it.
          </p>
        </div>
      </div>

      <p className="mb-3 mt-3 text-[11px] font-bold uppercase tracking-wider text-zinc-400">
        Tap a team
      </p>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {teams.map((team) => {
          const info = getTeam(team.code!, team.name);
          const isSel = selected === team.code;
          const colors = getTeamColors(team.code!);
          return (
            <button
              key={team.code}
              type="button"
              onClick={() => setSelected(team.code!)}
              className={`flex items-center gap-2 rounded-xl border px-2.5 py-2.5 text-left transition-all ${
                isSel ? "shadow-md" : "border-zinc-200 hover:border-zinc-300"
              }`}
              style={isSel ? { borderColor: colors.primary, background: `${colors.primary}0f` } : undefined}
            >
              <span className="text-xl">{info.flag}</span>
              <span className="min-w-0 flex-1 truncate text-xs font-bold text-zinc-900">{info.name}</span>
              {isSel && <Check size={14} style={{ color: colors.primary }} className="shrink-0" />}
            </button>
          );
        })}
      </div>

      <button
        type="button"
        onClick={saveChampionOnly}
        disabled={!selected}
        className="mt-4 flex w-full items-center justify-center gap-1.5 rounded-full bg-[var(--wc-usa)] px-4 py-2.5 text-sm font-bold text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
      >
        {selected ? `Lock in ${getTeam(selected).name}` : "Select your champion"}
      </button>
    </section>
  );
}
