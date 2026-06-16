"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { Check } from "lucide-react";
import { getDailyQuizzes, checkQuizAnswer } from "@/lib/puzzles/quiz";
import {
  getQuizState,
  saveQuizState,
  clearStalePuzzleState,
  PUZZLES_PER_DAY,
} from "@/lib/storage";
import type { QuizRoundResult } from "@/lib/storage";
import { recordPuzzleSessionEnd } from "@/lib/puzzle-streaks";
import { useTodayKey } from "@/lib/hooks/useTodayKey";
import { PuzzleShell } from "./PuzzleShell";
import { PuzzleProgress } from "./PuzzleProgress";
import { PuzzleDailyBanner } from "./PuzzleDailyBanner";
import { PuzzleCelebration } from "./PuzzleCelebration";
import { AdBanner } from "./AdBanner";

export function QuizPuzzle() {
  const { today, ready: dateReady } = useTodayKey();
  const { questions } = useMemo(
    () => (today ? getDailyQuizzes(today) : { questions: [] }),
    [today]
  );

  const [ready, setReady] = useState(false);
  const [roundIndex, setRoundIndex] = useState(0);
  const [rounds, setRounds] = useState<QuizRoundResult[]>([]);
  const [finished, setFinished] = useState(false);
  const [selected, setSelected] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);

  const resetRound = useCallback(() => {
    setSelected(null);
    setSubmitted(false);
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
    const state = getQuizState();
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

  const score = rounds.filter((r) => r.correct).length;

  const persist = useCallback(
    (nextRound: number, nextRounds: QuizRoundResult[], done: boolean) => {
      if (!today) return;
      saveQuizState({ date: today, currentRound: nextRound, rounds: nextRounds, finished: done });
      if (done) recordPuzzleSessionEnd(today);
    },
    [today]
  );

  if (!dateReady || !ready || !today) {
    return (
      <PuzzleShell title="Daily Quiz" subtitle="Loading today's quiz…">
        <div className="card-elevated rounded-2xl p-8 text-center text-sm text-zinc-500">
          Preparing your daily questions…
        </div>
      </PuzzleShell>
    );
  }

  if (finished) {
    return (
      <PuzzleShell title="Daily Quiz" subtitle={`Set complete · ${today}`}>
        <div className="card-elevated rounded-2xl p-8 text-center">
          <p className="text-4xl font-extrabold text-amber-600 mb-2">{score}/{PUZZLES_PER_DAY}</p>
          <p className="text-lg font-semibold text-zinc-900">Questions correct</p>
          <div className="mt-6 space-y-2 text-left">
            {rounds.map((r, i) => (
              <div key={i} className="flex justify-between text-sm py-2 border-b border-zinc-50 gap-2">
                <span className="text-zinc-600 line-clamp-1">#{i + 1} {questions[i]?.question ?? " - "}</span>
                <span className="shrink-0">{r.correct ? "✅" : "❌"}</span>
              </div>
            ))}
          </div>
        </div>
        <AdBanner placement="puzzles" />
      </PuzzleShell>
    );
  }

  const question = questions[roundIndex];
  if (!question) {
    return (
      <PuzzleShell title="Daily Quiz" subtitle={today}>
        <div className="card-elevated rounded-2xl p-8 text-center space-y-4">
          <p className="text-zinc-600">Could not load today&apos;s quiz. Your saved progress may be out of date.</p>
          <button type="button" onClick={resetSession} className="btn-primary px-5 py-2.5 text-sm">
            Start fresh
          </button>
        </div>
      </PuzzleShell>
    );
  }

  function handleSubmit() {
    if (selected === null || submitted) return;
    const correct = checkQuizAnswer(selected, question.correctIndex);
    const result: QuizRoundResult = { selected, correct };
    const nextRounds = [...rounds, result];
    setRounds(nextRounds);
    setSubmitted(true);
    if (correct) setShowCelebration(true);
  }

  function handleNext() {
    const isLast = roundIndex >= PUZZLES_PER_DAY - 1;

    if (isLast) {
      setFinished(true);
      persist(PUZZLES_PER_DAY - 1, rounds, true);
      return;
    }

    const nextIdx = roundIndex + 1;
    setRoundIndex(nextIdx);
    resetRound();
    persist(nextIdx, rounds, false);
  }

  const won = submitted && selected !== null && checkQuizAnswer(selected, question.correctIndex);

  return (
    <PuzzleShell title="Daily Quiz" subtitle={`5 trivia questions · ${today}`}>
      <PuzzleCelebration
        show={showCelebration}
        message="Correct!"
        subtitle="You nailed that one"
        onComplete={() => setShowCelebration(false)}
      />
      <PuzzleDailyBanner />
      <PuzzleProgress current={roundIndex} total={PUZZLES_PER_DAY} score={score} />

      <div className="card-elevated rounded-2xl p-6">
        <p className="text-lg font-semibold text-zinc-900 leading-snug">{question.question}</p>
      </div>

      <div className="space-y-2">
        {question.options.map((option, i) => {
          const isSelected = selected === i;
          const isCorrect = i === question.correctIndex;
          let style = "card-surface border-zinc-200 hover:border-amber-200 hover:bg-amber-50/30";

          if (submitted) {
            if (isCorrect) style = "bg-emerald-50 border-emerald-300 ring-1 ring-emerald-200";
            else if (isSelected) style = "bg-red-50 border-red-200";
            else style = "card-surface opacity-50";
          } else if (isSelected) {
            style = "bg-amber-50 border-amber-300 ring-1 ring-amber-200";
          }

          return (
            <button
              key={i}
              type="button"
              onClick={() => !submitted && setSelected(i)}
              disabled={submitted}
              className={`w-full rounded-xl px-4 py-3.5 text-left text-sm font-medium transition-all flex items-center justify-between gap-3 ${style}`}
            >
              <span className="text-zinc-900">
                <span className="text-zinc-400 mr-2">{String.fromCharCode(65 + i)}.</span>
                {option}
              </span>
              {submitted && isCorrect && <Check size={16} className="text-emerald-600 shrink-0" />}
            </button>
          );
        })}
      </div>

      {!submitted && (
        <button type="button" onClick={handleSubmit} disabled={selected === null} className="btn-primary w-full py-3 text-sm disabled:opacity-40">
          Submit Answer
        </button>
      )}

      {submitted && (
        <div className="space-y-3">
          <div className={`rounded-xl p-4 ${won ? "bg-emerald-50 border border-emerald-200" : "bg-red-50 border border-red-100"}`}>
            <p className="font-bold text-zinc-900 mb-1">{won ? "Correct!" : "Wrong"}</p>
            <p className="text-sm text-zinc-600 leading-relaxed">{question.explanation}</p>
          </div>
          <button type="button" onClick={handleNext} className="btn-primary w-full py-3 text-sm">
            {roundIndex >= PUZZLES_PER_DAY - 1 ? "See Results" : "Next Question →"}
          </button>
        </div>
      )}

      <AdBanner placement="puzzles" />
    </PuzzleShell>
  );
}
