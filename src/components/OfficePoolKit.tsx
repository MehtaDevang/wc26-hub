"use client";

import Link from "next/link";
import { Download, Printer, Trophy, Users, GitBranch } from "lucide-react";
import { SITE_NAME } from "@/lib/site";

const RULES = [
  "Each participant fills in their predicted winner for every knockout-round match on the bracket sheet.",
  "Award 1 point for each correct Round of 32 winner, 2 for Round of 16, 4 for quarter-finals, 8 for semi-finals, and 16 for the champion.",
  "Optional: add 3 bonus points for predicting the exact final score.",
  "Tiebreaker: closest total goals in the final, then most correct semi-finalists.",
  "Pool manager collects sheets before the first knockout kickoff - no changes after.",
];

export function OfficePoolKit() {
  function handlePrint() {
    window.print();
  }

  return (
    <div className="space-y-8">
      <div className="card-elevated rounded-2xl overflow-hidden print:hidden">
        <div className="host-stripe" />
        <div className="p-6 sm:p-8">
          <h1 className="section-title text-2xl sm:text-3xl flex items-center gap-2">
            <Trophy size={28} className="text-amber-500" />
            Office Pool Kit
          </h1>
          <p className="text-sm text-zinc-500 mt-2 max-w-2xl">
            Free World Cup 2026 bracket pool for your office, friends, or watch party. Rules,
            printable bracket, and links to our bracket predictor.
          </p>
          <div className="flex flex-wrap gap-3 mt-6">
            <button
              type="button"
              onClick={handlePrint}
              className="btn-primary inline-flex items-center gap-2 px-5 py-2.5 text-sm"
            >
              <Printer size={16} />
              Print bracket & rules
            </button>
            <Link href="/bracket/predict" className="btn-usa inline-flex items-center gap-2 px-5 py-2.5 text-sm">
              <GitBranch size={16} />
              Digital bracket predictor
            </Link>
          </div>
        </div>
      </div>

      <section className="card-surface rounded-2xl p-6 print:hidden">
        <h2 className="font-bold text-zinc-900 flex items-center gap-2 mb-4">
          <Users size={18} className="text-blue-600" />
          How to run your pool
        </h2>
        <ol className="space-y-3">
          {RULES.map((rule, i) => (
            <li key={rule} className="flex gap-3 text-sm text-zinc-600 leading-relaxed">
              <span className="shrink-0 flex h-6 w-6 items-center justify-center rounded-full bg-blue-50 text-blue-700 text-xs font-bold">
                {i + 1}
              </span>
              {rule}
            </li>
          ))}
        </ol>
      </section>

      <div className="print-bracket-sheet rounded-2xl border-2 border-zinc-200 bg-white p-6 sm:p-8">
        <div className="text-center border-b border-zinc-200 pb-4 mb-6">
          <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">
            {SITE_NAME} · World Cup 2026
          </p>
          <h2 className="text-xl font-extrabold text-zinc-900 mt-1">Office Pool Bracket</h2>
          <p className="text-sm text-zinc-500 mt-1">Name: _________________________</p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 text-xs">
          {[
            { round: "Round of 32", slots: 16 },
            { round: "Round of 16", slots: 8 },
            { round: "Quarter-finals", slots: 4 },
            { round: "Semi-finals", slots: 2 },
            { round: "Final", slots: 1 },
          ].map(({ round, slots }) => (
            <div key={round} className={round === "Final" ? "sm:col-span-2" : ""}>
              <h3 className="font-bold text-zinc-800 uppercase tracking-wide text-[10px] mb-2">
                {round}
              </h3>
              <div className="space-y-2">
                {Array.from({ length: slots }, (_, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-2 border border-dashed border-zinc-200 rounded px-2 py-1.5"
                  >
                    <span className="text-zinc-400 w-4">{i + 1}.</span>
                    <span className="flex-1 border-b border-zinc-300 min-h-[1rem]" />
                    <span className="text-zinc-300">→</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 pt-4 border-t border-zinc-200 text-center print:block">
          <p className="text-[10px] text-zinc-400">
            Champion pick: _________________________ · Final score: ___ – ___
          </p>
          <p className="text-[9px] text-zinc-400 mt-2 hidden print:block">
            thegoalposts.in/pool · Not affiliated with FIFA
          </p>
        </div>
      </div>

      <p className="text-xs text-zinc-400 text-center print:hidden flex items-center justify-center gap-1">
        <Download size={12} />
        Use Print → Save as PDF to share digitally
      </p>
    </div>
  );
}
