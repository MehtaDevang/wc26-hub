"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import {
  getDailyScrambles,
  checkScrambleAnswer,
  SCRAMBLE_MAX_GUESSES,
  SCRAMBLE_HINTS,
} from "@/lib/puzzles/scramble";
import { getPlayerFlag } from "@/lib/guess-player";
import {
  getScrambleState,
  saveScrambleState,
  clearStalePuzzleState,
  countWins,
  PUZZLES_PER_DAY,
} from "@/lib/storage";
import type { RoundResult } from "@/lib/storage";
import { recordPuzzleSessionEnd } from "@/lib/puzzle-streaks";
import { useTodayKey } from "@/lib/hooks/useTodayKey";
import { PuzzleShell } from "./PuzzleShell";
import { PuzzleProgress } from "./PuzzleProgress";
import { PuzzleDailyBanner } from "./PuzzleDailyBanner";
import { PuzzleCelebration } from "./PuzzleCelebration";
import { AdBanner } from "./AdBanner";

export function ScramblePuzzle() {
  const { today, ready: dateReady } = useTodayKey();
  const scrambles = useMemo(
    () => (today ? getDailyScrambles(today) : []),
    [today]
  );

  const [ready, setReady] = useState(false);
  const [roundIndex, setRoundIndex] = useState(0);
  const [rounds, setRounds] = useState<RoundResult[]>([]);
  const [finished, setFinished] = useState(false);
  const [guess, setGuess] = useState("");
  const [guesses, setGuesses] = useState<string[]>([]);
  const [roundOver, setRoundOver] = useState(false);
  const [roundWon, setRoundWon] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);

  const resetRound = useCallback(() => {
    setGuess("");
    setGuesses([]);
    setRoundOver(false);
    setRoundWon(false);
    setShowCelebration(false);
  }, []);

  const resetSession = useCallback(() => {
    setRoundIndex(0);
    setRounds([]);
    setFinished(false);
    resetRound();
  }, [resetRound]);

  useEffect(() => {
    if (!today) {
      setReady(false);
      return;
    }

    setReady(false);
    clearStalePuzzleState(today);
    const state = getScrambleState();
    if (state?.date === today) {
      setRoundIndex(state.currentRound);
      setRounds(Array.isArray(state.rounds) ? state.rounds : []);
      setFinished(Boolean(state.finished));
    } else {
      resetSession();
    }
    resetRound();
    setReady(true);
  }, [today, resetRound, resetSession]);

  const persist = useCallback(
    (nextRound: number, nextRounds: RoundResult[], done: boolean) => {
      if (!today) return;
      saveScrambleState({ date: today, currentRound: nextRound, rounds: nextRounds, finished: done });
      if (done) recordPuzzleSessionEnd(today);
    },
    [today]
  );

  if (!dateReady || !ready || !today) {
    return (
      <PuzzleShell title="Name Scramble" subtitle="Loading today's puzzle…">
        <div className="card-elevated rounded-2xl p-8 text-center text-sm text-zinc-500">
          Preparing your daily set…
        </div>
      </PuzzleShell>
    );
  }

  if (finished) {
    const wins = countWins(rounds);
    return (
      <PuzzleShell title="Name Scramble" subtitle={`Daily set complete · ${today}`}>
        <div className="card-elevated rounded-2xl p-8 text-center">
          <p className="text-4xl font-extrabold text-violet-600 mb-2">{wins}/{PUZZLES_PER_DAY}</p>
          <p className="text-lg font-semibold text-zinc-900">Names unscrambled</p>
          <div className="mt-6 space-y-2 text-left">
            {rounds.map((r, i) => (
              <div key={i} className="flex justify-between text-sm py-2 border-b border-zinc-50">
                <span className="text-zinc-600">#{i + 1} {scrambles[i]?.player.name ?? " - "}</span>
                <span>{r.won ? "✅" : "❌"}</span>
              </div>
            ))}
          </div>
        </div>
      </PuzzleShell>
    );
  }

  const round = scrambles[roundIndex];
  if (!round) {
    return (
      <PuzzleShell title="Name Scramble" subtitle={today}>
        <div className="card-elevated rounded-2xl p-8 text-center space-y-4">
          <p className="text-zinc-600">Could not load today&apos;s scramble. Your saved progress may be out of date.</p>
          <button type="button" onClick={resetSession} className="btn-primary px-5 py-2.5 text-sm">
            Start fresh
          </button>
        </div>
      </PuzzleShell>
    );
  }

  const maxGuesses = SCRAMBLE_MAX_GUESSES;
  const attemptsLeft = maxGuesses - guesses.length;

  function handleSubmit() {
    if (!guess.trim() || roundOver || finished) return;

    const newGuesses = [...guesses, guess.trim()];
    const correct = checkScrambleAnswer(guess, round.player);
    setGuesses(newGuesses);
    setGuess("");

    if (correct) {
      setRoundWon(true);
      setRoundOver(true);
      setShowCelebration(true);
    } else if (newGuesses.length >= maxGuesses) {
      setRoundWon(false);
      setRoundOver(true);
    }
  }

  function handleNext() {
    const result: RoundResult = { guesses, won: roundWon, gaveUp: !roundWon };
    const nextRounds = [...rounds, result];
    const isLast = roundIndex >= PUZZLES_PER_DAY - 1;

    if (isLast) {
      setRounds(nextRounds);
      setFinished(true);
      persist(PUZZLES_PER_DAY - 1, nextRounds, true);
      return;
    }

    const nextIdx = roundIndex + 1;
    setRounds(nextRounds);
    setRoundIndex(nextIdx);
    setGuesses([]);
    setRoundOver(false);
    setRoundWon(false);
    setShowCelebration(false);
    persist(nextIdx, nextRounds, false);
  }

  return (
    <PuzzleShell title="Name Scramble" subtitle={`5 scrambled names · ${today}`}>
      <PuzzleCelebration
        show={showCelebration}
        message="Solved!"
        subtitle={`${round.player.name} unscrambled`}
        onComplete={() => setShowCelebration(false)}
      />
      <PuzzleDailyBanner />
      <PuzzleProgress current={roundIndex} total={PUZZLES_PER_DAY} score={countWins(rounds)} />

      <div className="card-elevated rounded-2xl p-6 text-center">
        <div className="flex items-center justify-center gap-2 mb-4">
          <span className="text-2xl">{getPlayerFlag(round.player)}</span>
          <span className="text-xs text-zinc-400">{round.player.nationality} · {round.player.position}</span>
        </div>
        <p className="text-[10px] uppercase tracking-wider text-zinc-400 font-semibold mb-2">Unscramble this name</p>
        <p className="text-2xl sm:text-3xl font-extrabold text-violet-600 tracking-widest leading-relaxed font-mono">
          {round.scrambled}
        </p>
        <p className="text-xs text-zinc-400 mt-3">
          {round.wordLengths.map((n) => `${n} letters`).join(" · ")}
        </p>
        {roundOver && (
          <p className={`mt-4 text-sm font-semibold ${roundWon ? "text-emerald-700" : "text-zinc-900"}`}>
            {roundWon ? "Solved!" : `Answer: ${round.player.name}`}
          </p>
        )}
      </div>

      {!roundOver && (
        <div className="space-y-3">
          <div className="flex gap-2">
            <input
              type="text"
              value={guess}
              onChange={(e) => setGuess(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
              placeholder="Type the player's name..."
              className="flex-1 rounded-xl border border-zinc-200 bg-white px-4 py-3 text-zinc-900 focus:outline-none focus:border-violet-400"
              autoFocus
            />
            <button type="button" onClick={handleSubmit} disabled={!guess.trim()} className="btn-primary px-5 py-3 text-sm disabled:opacity-40">
              Submit
            </button>
          </div>
          <p className="text-center text-sm text-zinc-400">{attemptsLeft} attempts left</p>
        </div>
      )}

      {guesses.length > 0 && !roundOver && (
        <div className="space-y-2">
          {guesses.map((g, i) => {
            const correct = checkScrambleAnswer(g, round.player);
            return (
              <div key={i} className={`rounded-lg px-3 py-2 text-sm ${correct ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-zinc-700"}`}>
                <span className="text-zinc-400">#{i + 1} {g}</span>
                {!correct && SCRAMBLE_HINTS[i] && (
                  <span className="block mt-1 text-zinc-500">💡 {SCRAMBLE_HINTS[i](round.player)}</span>
                )}
              </div>
            );
          })}
        </div>
      )}

      {roundOver && (
        <button type="button" onClick={handleNext} className="btn-primary w-full py-3 text-sm">
          {roundIndex >= PUZZLES_PER_DAY - 1 ? "See Results" : "Next Scramble →"}
        </button>
      )}

      <AdBanner placement="puzzles" />
    </PuzzleShell>
  );
}
