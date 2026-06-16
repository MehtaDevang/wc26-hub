"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { RotateCcw } from "lucide-react";
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
import { getTeam } from "@/lib/data";
import { TeamPersonalityResultCard } from "./TeamPersonalityResultCard";
import { ShareButtons } from "./ShareButtons";

type Phase = "intro" | "playing" | "result";

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

  const finish = useCallback((finalAnswers: number[]) => {
    const computed = scoreQuiz(finalAnswers);
    saveTeamResult(computed.top.code, finalAnswers);
    if (typeof window !== "undefined") {
      window.history.replaceState(null, "", `/which-team/${computed.top.code.toLowerCase()}`);
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

  if (phase === "result" && result) {
    const share = buildTeamPersonalitySharePayload(
      result.top.code,
      result.top.name,
      result.top.flag
    );
    return (
      <div className="mx-auto max-w-xl space-y-5">
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
        <p className="text-center text-xs text-zinc-400">
          Just for fun — based on your vibe, not a real prediction.
        </p>
      </div>
    );
  }

  if (phase === "playing") {
    const question = QUESTIONS[step];
    const progress = Math.round((step / QUESTIONS.length) * 100);
    return (
      <div className="mx-auto max-w-xl space-y-6">
        <div>
          <div className="flex items-center justify-between text-xs font-medium text-zinc-500">
            <button type="button" onClick={back} className="hover:text-zinc-900">
              ← Back
            </button>
            <span>
              Question {step + 1} of {QUESTIONS.length}
            </span>
          </div>
          <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-zinc-100">
            <div
              className="h-full rounded-full bg-blue-600 transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <h2 className="text-center text-xl font-bold text-zinc-900 sm:text-2xl">
          {question.prompt}
        </h2>

        <div className="space-y-3">
          {question.options.map((option, index) => (
            <button
              key={option.label}
              type="button"
              onClick={() => choose(index)}
              className="w-full rounded-2xl border border-zinc-200 bg-white px-5 py-4 text-left text-zinc-800 transition-all hover:border-blue-300 hover:bg-blue-50 hover:shadow-sm active:scale-[0.99]"
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-xl space-y-6 text-center">
      <div className="text-6xl">⚽️🌍</div>
      <div>
        <h1 className="section-title">
          Which World Cup team <span className="text-blue-600">are you?</span>
        </h1>
        <p className="mt-2 text-zinc-500">
          Answer {QUESTIONS.length} quick questions about your style and we&apos;ll match you with
          your World Cup 2026 team. Takes under a minute.
        </p>
      </div>

      <button
        type="button"
        onClick={start}
        className="btn-primary inline-flex items-center justify-center px-6 py-3 text-base"
      >
        Start the quiz
      </button>

      {saved && (
        <div className="card-surface rounded-2xl p-4 text-sm text-zinc-600">
          Last time you got{" "}
          <span className="font-semibold text-zinc-900">
            {getTeam(saved.code).flag} {getTeam(saved.code).name}
          </span>
          .{" "}
          <button type="button" onClick={replaySaved} className="font-semibold text-blue-600 hover:underline">
            See your result
          </button>
        </div>
      )}
    </div>
  );
}
