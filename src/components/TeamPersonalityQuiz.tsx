"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { RotateCcw, Sparkles, ArrowRight, Check } from "lucide-react";
import {
  QUESTIONS,
  scoreQuiz,
  type QuizResult,
} from "@/lib/quiz/team-personality";
import {
  getSavedTeamResult,
  saveTeamResult,
} from "@/lib/quiz/team-personality-storage";
import { buildTeamPersonalitySharePayload } from "@/lib/share";
import { firePuzzleConfetti } from "@/lib/puzzle-celebration";
import { getTeam } from "@/lib/data";
import { TeamPersonalityResultCard } from "./TeamPersonalityResultCard";
import { ShareButtons } from "./ShareButtons";

type Phase = "intro" | "playing" | "result";

const FLAGS = ["🇧🇷", "🇦🇷", "🇫🇷", "🇪🇸", "🇵🇹", "🇳🇱", "🇯🇵", "🇲🇦", "🇩🇪", "🇺🇸"];
const LETTERS = ["A", "B", "C", "D"];

export function TeamPersonalityQuiz() {
  const [phase, setPhase] = useState<Phase>("intro");
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [saved, setSaved] = useState<ReturnType<typeof getSavedTeamResult>>(null);

  useEffect(() => {
    setSaved(getSavedTeamResult());
  }, []);

  const result: QuizResult | null = useMemo(
    () => (phase === "result" && answers.length === QUESTIONS.length ? scoreQuiz(answers) : null),
    [phase, answers]
  );

  useEffect(() => {
    if (phase === "result") firePuzzleConfetti();
  }, [phase]);

  const finish = useCallback((finalAnswers: number[]) => {
    const computed = scoreQuiz(finalAnswers);
    saveTeamResult(computed.top.code, finalAnswers);
    if (typeof window !== "undefined") {
      window.history.replaceState(null, "", `/which-team/${computed.top.code.toLowerCase()}`);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
    setAnswers(finalAnswers);
    setPhase("result");
  }, []);

  const start = useCallback(() => {
    setAnswers([]);
    setStep(0);
    setPhase("playing");
  }, []);

  const choose = useCallback(
    (optionIndex: number) => {
      const next = [...answers.slice(0, step), optionIndex];
      if (next.length === QUESTIONS.length) {
        finish(next);
      } else {
        setAnswers(next);
        setStep(next.length);
      }
    },
    [answers, step, finish]
  );

  const back = useCallback(() => {
    if (step === 0) {
      setPhase("intro");
      return;
    }
    setStep((s) => Math.max(0, s - 1));
  }, [step]);

  const retake = useCallback(() => {
    if (typeof window !== "undefined") {
      window.history.replaceState(null, "", "/which-team");
    }
    start();
  }, [start]);

  const replaySaved = useCallback(() => {
    if (!saved || saved.answers.length !== QUESTIONS.length) return;
    finish(saved.answers);
  }, [saved, finish]);

  /* ----------------------------- RESULT ----------------------------- */
  if (phase === "result" && result) {
    const share = buildTeamPersonalitySharePayload(
      result.top.code,
      result.top.name,
      result.top.flag
    );
    return (
      <div className="mx-auto max-w-xl space-y-5">
        <div className="wt-pop">
          <TeamPersonalityResultCard
            top={result.top}
            traits={result.traits}
            runnersUp={result.runnersUp}
          >
            <div className="space-y-3 pt-1">
              <ShareButtons
                url={share.url}
                title={share.title}
                text={share.text}
                label={share.label}
                className="justify-center"
              />
              <button
                type="button"
                onClick={retake}
                className="mx-auto flex items-center gap-1.5 text-sm font-medium text-zinc-500 hover:text-zinc-900"
              >
                <RotateCcw size={14} /> Take the quiz again
              </button>
            </div>
          </TeamPersonalityResultCard>
        </div>
        <p className="text-center text-xs text-zinc-400">
          Just for fun — based on your vibe, not a real prediction.
        </p>
      </div>
    );
  }

  /* ---------------------------- PLAYING ----------------------------- */
  if (phase === "playing") {
    const question = QUESTIONS[step];
    return (
      <div className="mx-auto max-w-xl">
        <div className="mb-5">
          <div className="flex items-center justify-between text-xs font-semibold text-zinc-500">
            <button
              type="button"
              onClick={back}
              className="inline-flex items-center gap-1 hover:text-zinc-900"
            >
              ← Back
            </button>
            <span className="tabular-nums">
              <span className="text-zinc-900">{String(step + 1).padStart(2, "0")}</span>
              <span className="text-zinc-300"> / {String(QUESTIONS.length).padStart(2, "0")}</span>
            </span>
          </div>
          <div className="mt-2 flex gap-1.5">
            {QUESTIONS.map((q, i) => (
              <span
                key={q.id}
                className={`h-1.5 flex-1 rounded-full transition-colors duration-300 ${
                  i < step ? "bg-fuchsia-500" : i === step ? "bg-blue-500" : "bg-zinc-200"
                }`}
              />
            ))}
          </div>
        </div>

        <div key={question.id} className="wt-fade-up">
          <h2 className="text-center text-xl font-extrabold leading-snug text-zinc-900 sm:text-2xl">
            {question.prompt}
          </h2>

          <div className="mt-6 space-y-3">
            {question.options.map((option, index) => (
              <button
                key={option.label}
                type="button"
                onClick={() => choose(index)}
                className="group flex w-full items-center gap-3 rounded-2xl border border-zinc-200 bg-white px-4 py-4 text-left text-zinc-800 shadow-sm transition-all hover:border-blue-400 hover:bg-blue-50/60 hover:shadow-md active:scale-[0.99]"
              >
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-zinc-100 text-sm font-bold text-zinc-500 transition-colors group-hover:bg-blue-600 group-hover:text-white">
                  {LETTERS[index]}
                </span>
                <span className="flex-1 font-medium">{option.label}</span>
                <ArrowRight
                  size={16}
                  className="shrink-0 text-zinc-300 transition-all group-hover:translate-x-0.5 group-hover:text-blue-600"
                />
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  /* ----------------------------- INTRO ------------------------------ */
  return (
    <div className="mx-auto max-w-xl">
      <div
        className="relative overflow-hidden rounded-3xl px-6 py-10 text-center text-white shadow-lg sm:px-8 sm:py-12"
        style={{ background: "linear-gradient(135deg, #6d28d9 0%, #c026d3 50%, #2563eb 100%)" }}
      >
        <div className="pointer-events-none absolute -right-8 -top-10 select-none text-[160px] leading-none opacity-10">
          ⚽
        </div>
        <div className="relative">
          <div className="wt-ball-bob mx-auto mb-3 w-fit text-6xl">⚽</div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1 text-xs font-bold uppercase tracking-wider backdrop-blur-sm">
            <Sparkles size={13} /> Personality quiz
          </span>
          <h1 className="mt-3 text-3xl font-extrabold leading-tight sm:text-4xl">
            Which World Cup team are you?
          </h1>
          <p className="mx-auto mt-3 max-w-md text-sm text-white/85 sm:text-base">
            Answer {QUESTIONS.length} quick questions about your style and we&apos;ll match you with
            your World Cup 2026 team.
          </p>
          <div className="mt-4 flex justify-center gap-1 text-2xl" aria-hidden>
            {FLAGS.map((flag) => (
              <span key={flag}>{flag}</span>
            ))}
          </div>
          <button
            type="button"
            onClick={start}
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-white px-7 py-3.5 text-base font-bold text-violet-700 shadow-md transition-transform hover:scale-105"
          >
            Start the quiz <ArrowRight size={18} />
          </button>
          <p className="mt-3 text-xs text-white/70">
            {QUESTIONS.length} questions · under a minute · free
          </p>
        </div>
      </div>

      {saved && (
        <button
          type="button"
          onClick={replaySaved}
          className="mt-4 flex w-full items-center gap-3 rounded-2xl border border-zinc-200 bg-white p-4 text-left transition-all hover:border-fuchsia-300 hover:shadow-sm"
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-fuchsia-50 text-2xl">
            {getTeam(saved.code).flag}
          </span>
          <span className="flex-1 text-sm text-zinc-600">
            Last time you matched with{" "}
            <span className="font-semibold text-zinc-900">{getTeam(saved.code).name}</span>
          </span>
          <span className="inline-flex items-center gap-1 text-sm font-semibold text-fuchsia-600">
            <Check size={14} /> See result
          </span>
        </button>
      )}
    </div>
  );
}
