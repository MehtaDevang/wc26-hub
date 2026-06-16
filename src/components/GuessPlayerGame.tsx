"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { Lock } from "lucide-react";
import {
  getDailyPlayers,
  checkGuess,
  MAX_GUESSES_PER_ROUND,
  getVisibleClues,
  getPlayerFlag,
  CLUE_TIER_STYLES,
} from "@/lib/guess-player";
import {
  getGuessState,
  saveGuessState,
  clearStalePuzzleState,
  countWins,
  PUZZLES_PER_DAY,
} from "@/lib/storage";
import type { RoundResult } from "@/lib/storage";
import { recordPuzzleSessionEnd } from "@/lib/puzzle-streaks";
import { useTodayKey } from "@/lib/hooks/useTodayKey";
import { AdBanner } from "./AdBanner";
import { PuzzleShell } from "./PuzzleShell";
import { PuzzleProgress } from "./PuzzleProgress";
import { PuzzleDailyBanner } from "./PuzzleDailyBanner";
import { PuzzleCelebration } from "./PuzzleCelebration";

export function GuessPlayerGame() {
  const { today, ready: dateReady } = useTodayKey();
  const players = useMemo(
    () => (today ? getDailyPlayers(today) : []),
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
    const state = getGuessState();
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

  const maxGuesses = MAX_GUESSES_PER_ROUND;
  const attemptsLeft = maxGuesses - guesses.length;

  if (!dateReady || !ready || !today) {
    return (
      <PuzzleShell title="Guess the Player" subtitle="Loading today's puzzle…">
        <div className="card-elevated rounded-2xl p-8 text-center text-sm text-zinc-500">
          Preparing your daily set…
        </div>
      </PuzzleShell>
    );
  }

  if (finished) {
    const wins = countWins(rounds);
    return (
      <PuzzleShell title="Guess the Player" subtitle={`Daily set complete · ${today}`}>
        <div className="card-elevated rounded-2xl p-8 text-center">
          <p className="text-4xl font-extrabold text-blue-600 mb-2">{wins}/{PUZZLES_PER_DAY}</p>
          <p className="text-lg font-semibold text-zinc-900">Players guessed correctly</p>
          <div className="mt-6 space-y-2 text-left">
            {rounds.map((r, i) => (
              <div key={i} className="flex justify-between text-sm py-2 border-b border-zinc-50">
                <span className="text-zinc-600">#{i + 1} {players[i]?.name ?? " - "}</span>
                <span>{r.won ? "✅" : "❌"}</span>
              </div>
            ))}
          </div>
        </div>
        <AdBanner placement="puzzles" />
      </PuzzleShell>
    );
  }

  const player = players[roundIndex];
  if (!player) {
    return (
      <PuzzleShell title="Guess the Player" subtitle={today}>
        <div className="card-elevated rounded-2xl p-8 text-center space-y-4">
          <p className="text-zinc-600">Could not load today&apos;s puzzle. Your saved progress may be out of date.</p>
          <button type="button" onClick={resetSession} className="btn-primary px-5 py-2.5 text-sm">
            Start fresh
          </button>
        </div>
      </PuzzleShell>
    );
  }
  const wrongGuesses = guesses.filter((g) => !checkGuess(g, player)).length;
  const { revealed, locked, total, revealedCount } = getVisibleClues(wrongGuesses, player);

  function persist(nextRound: number, nextRounds: typeof rounds, done: boolean) {
    if (!today) return;
    saveGuessState({ date: today, currentRound: nextRound, rounds: nextRounds, finished: done });
    if (done) recordPuzzleSessionEnd(today);
  }

  function handleGuess() {
    if (!guess.trim() || roundOver || finished) return;

    const newGuesses = [...guesses, guess.trim()];
    const correct = checkGuess(guess, player);
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
    const result = {
      guesses,
      won: roundWon,
      gaveUp: !roundWon,
    };
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
    <PuzzleShell title="Guess the Player" subtitle={`5 players · ${today}`}>
      <PuzzleCelebration
        show={showCelebration}
        message="Correct!"
        subtitle={`That's ${player.name}!`}
        onComplete={() => setShowCelebration(false)}
      />
      <PuzzleDailyBanner />
      <PuzzleProgress current={roundIndex} total={PUZZLES_PER_DAY} score={countWins(rounds)} />

      <div className="card-elevated rounded-2xl p-6">
        <div className="flex items-center gap-4 mb-5">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-4xl shrink-0">
            {getPlayerFlag(player)}
          </div>
          <div>
            <p className="text-xs text-zinc-400 uppercase tracking-wider font-semibold">Who is this player?</p>
            <p className="text-sm text-zinc-600 mt-0.5">
              {revealedCount}/{total} clues revealed · wrong guesses unlock more
            </p>
          </div>
        </div>

        <div className="mb-4">
          <div className="flex justify-between text-[10px] font-semibold uppercase tracking-wider text-zinc-400 mb-1.5">
            <span>Clue progress</span>
            <span>{revealedCount} of {total}</span>
          </div>
          <div className="h-1.5 rounded-full bg-zinc-100 overflow-hidden">
            <div
              className="h-full rounded-full bg-blue-500 transition-all duration-300"
              style={{ width: `${(revealedCount / total) * 100}%` }}
            />
          </div>
        </div>

        <div className="space-y-2">
          {revealed.map((clue, i) => {
            const tier = CLUE_TIER_STYLES[clue.tier];
            const isNew = i === revealedCount - 1 && wrongGuesses > 0 && !roundOver;
            return (
              <div
                key={clue.label}
                className={`flex gap-3 rounded-lg border px-3 py-2.5 text-sm ${tier.border} ${isNew ? "bg-blue-50/50 ring-1 ring-blue-100" : "bg-zinc-50"}`}
              >
                <div className="w-20 shrink-0 space-y-1">
                  <span className="block text-[10px] font-bold text-zinc-500 uppercase tracking-wider">
                    {clue.label}
                  </span>
                  <span className={`inline-block text-[9px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded ${tier.badge}`}>
                    {clue.tier}
                  </span>
                </div>
                <span className="text-zinc-800 pt-0.5">{clue.text}</span>
              </div>
            );
          })}

          {locked.length > 0 && !roundOver && (
            <div className="space-y-1.5 pt-1">
              {locked.slice(0, 3).map((clue) => (
                <div
                  key={clue.label}
                  className="flex items-center gap-3 rounded-lg border border-dashed border-zinc-200 px-3 py-2 text-sm text-zinc-300"
                >
                  <Lock size={12} className="shrink-0" />
                  <span className="text-[10px] font-bold uppercase tracking-wider w-20 shrink-0">{clue.label}</span>
                  <span className="text-xs italic">Guess wrong to unlock</span>
                </div>
              ))}
              {locked.length > 3 && (
                <p className="text-center text-xs text-zinc-300 pt-0.5">+{locked.length - 3} more clues locked</p>
              )}
            </div>
          )}
        </div>

        {roundOver && locked.length > 0 && (
          <div className="mt-3 space-y-2">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400">Remaining clues</p>
            {locked.map((clue) => (
              <div key={clue.label} className="flex gap-3 rounded-lg bg-zinc-50 px-3 py-2 text-sm opacity-80">
                <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider w-20 shrink-0">{clue.label}</span>
                <span className="text-zinc-600">{clue.text}</span>
              </div>
            ))}
          </div>
        )}

        {roundOver && (
          <div className={`mt-4 rounded-lg px-4 py-3 text-sm font-medium ${roundWon ? "bg-emerald-50 text-emerald-800" : "bg-amber-50 text-amber-900"}`}>
            {roundWon ? "Correct!" : `Answer: ${player.name}`}
          </div>
        )}
      </div>

      {!roundOver && (
        <div className="space-y-3">
          <div className="flex gap-2">
            <input
              type="text"
              value={guess}
              onChange={(e) => setGuess(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleGuess()}
              placeholder="Type player name..."
              className="flex-1 rounded-xl border border-zinc-200 bg-white px-4 py-3 text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-blue-400"
              autoFocus
            />
            <button
              onClick={handleGuess}
              disabled={!guess.trim()}
              className="btn-primary px-5 py-3 text-sm disabled:opacity-40"
            >
              Guess
            </button>
          </div>
          <p className="text-center text-sm text-zinc-400">
            {attemptsLeft} guess{attemptsLeft !== 1 ? "es" : ""} left · {locked.length} clue{locked.length !== 1 ? "s" : ""} still hidden
          </p>
        </div>
      )}

      {guesses.length > 0 && !roundOver && (
        <div className="flex flex-wrap gap-2">
          {guesses.map((g, i) => (
            <span
              key={i}
              className={`text-xs px-2.5 py-1 rounded-full ${
                checkGuess(g, player) ? "bg-emerald-100 text-emerald-700" : "bg-red-50 text-red-600"
              }`}
            >
              {g}
            </span>
          ))}
        </div>
      )}

      {roundOver && (
        <button onClick={handleNext} className="btn-primary w-full py-3 text-sm">
          {roundIndex >= PUZZLES_PER_DAY - 1 ? "See Results" : "Next Player →"}
        </button>
      )}

      <AdBanner placement="puzzles" />
    </PuzzleShell>
  );
}
