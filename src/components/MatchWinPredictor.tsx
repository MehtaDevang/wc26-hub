"use client";

import { TrendingUp } from "lucide-react";
import type { WinPrediction } from "@/lib/win-predictor";
import { MediaShareButton } from "./MediaShareButton";
import { buildWinPredictionShareText } from "@/lib/win-predictor";
import { absoluteUrl } from "@/lib/share";

function WinProbabilityBar({
  homeName,
  awayName,
  homeWin,
  draw,
  awayWin,
}: {
  homeName: string;
  awayName: string;
  homeWin: number;
  draw: number;
  awayWin: number;
}) {
  const total = homeWin + draw + awayWin || 1;
  const homePct = (homeWin / total) * 100;
  const drawPct = (draw / total) * 100;
  const awayPct = (awayWin / total) * 100;

  return (
    <div className="space-y-2">
      <div className="grid grid-cols-3 gap-2 text-xs">
        <div className="min-w-0 text-left">
          <p className="truncate font-semibold text-zinc-700">{homeName}</p>
          <p className="font-extrabold tabular-nums text-[var(--wc-usa)]">{homeWin}%</p>
        </div>
        <div className="text-center">
          <p className="font-semibold text-zinc-500">Draw</p>
          <p className="font-extrabold tabular-nums text-zinc-500">{draw}%</p>
        </div>
        <div className="min-w-0 text-right">
          <p className="truncate font-semibold text-zinc-700">{awayName}</p>
          <p className="font-extrabold tabular-nums text-[var(--wc-canada)]">{awayWin}%</p>
        </div>
      </div>

      <div
        className="flex h-2 w-full overflow-hidden rounded-full bg-zinc-100"
        role="img"
        aria-label={`${homeName} ${homeWin}%, Draw ${draw}%, ${awayName} ${awayWin}%`}
      >
        {homePct > 0 && (
          <div
            className="h-full bg-[var(--wc-usa)] transition-all duration-500 first:rounded-l-full"
            style={{ width: `${homePct}%` }}
            title={`${homeName} ${homeWin}%`}
          />
        )}
        {drawPct > 0 && (
          <div
            className="h-full bg-zinc-400 transition-all duration-500"
            style={{ width: `${drawPct}%` }}
            title={`Draw ${draw}%`}
          />
        )}
        {awayPct > 0 && (
          <div
            className="h-full bg-[var(--wc-canada)] transition-all duration-500 last:rounded-r-full"
            style={{ width: `${awayPct}%` }}
            title={`${awayName} ${awayWin}%`}
          />
        )}
      </div>
    </div>
  );
}

export function MatchWinPredictor({
  homeName,
  awayName,
  matchId,
  homeScore,
  awayScore,
  status,
  prediction,
}: {
  homeName: string;
  awayName: string;
  matchId: string;
  homeScore?: number;
  awayScore?: number;
  status: "upcoming" | "live";
  prediction: WinPrediction;
}) {
  const shareText = buildWinPredictionShareText(
    homeName,
    awayName,
    homeScore,
    awayScore,
    prediction,
    status
  );

  return (
    <section className="card-surface rounded-2xl overflow-hidden">
      <div className="host-stripe" />
      <div className="p-5 sm:p-6">
        <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
          <div>
            <h2 className="section-title flex items-center gap-2 text-base">
              <TrendingUp size={18} className="text-blue-600" />
              Win Predictor
              {status === "live" && (
                <span className="rounded-full bg-red-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-red-600">
                  Live
                </span>
              )}
            </h2>
            <p className="text-sm font-semibold text-zinc-900 mt-1">{prediction.headline}</p>
            <p className="text-xs text-zinc-500 mt-1 max-w-xl">{prediction.detail}</p>
          </div>
          <MediaShareButton
            url={absoluteUrl(`/match/${matchId}`)}
            title={`Win predictor — ${homeName} vs ${awayName}`}
            text={shareText}
            label="Share prediction"
            variant="overlay"
          />
        </div>

        <WinProbabilityBar
          homeName={homeName}
          awayName={awayName}
          homeWin={prediction.homeWin}
          draw={prediction.draw}
          awayWin={prediction.awayWin}
        />

        <p className="mt-4 text-[10px] text-zinc-400 text-center">
          Model blends FIFA rankings, live score, match clock, stats & cards. Not betting advice.
        </p>
      </div>
    </section>
  );
}
