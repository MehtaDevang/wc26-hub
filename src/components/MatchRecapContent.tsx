import Link from "next/link";
import { ArrowRight, BarChart3, Target } from "lucide-react";
import type { Match, MatchDetail } from "@/lib/types";
import { getTeam } from "@/lib/data";
import { buildMatchRecapData } from "@/lib/match-recap";

export function MatchRecapContent({
  match,
  detail,
  variant = "full",
}: {
  match: Match;
  detail: MatchDetail;
  variant?: "full" | "embedded";
}) {
  const home = getTeam(match.home, match.homeName, match.homeLogo);
  const away = getTeam(match.away, match.awayName, match.awayLogo);
  const recap = buildMatchRecapData(match, detail);

  return (
    <div className="space-y-5">
      {/* Headline + opener */}
      <section className="card-surface rounded-2xl p-5 sm:p-6 border-l-4 border-emerald-500">
        <h2 className="text-xl sm:text-2xl font-extrabold text-zinc-900 leading-snug">
          {recap.headline}
        </h2>
        <p className="mt-1 text-sm text-zinc-500">{recap.subheadline}</p>
        {recap.paragraphs[0] && (
          <p className="mt-4 text-base text-zinc-700 leading-relaxed font-medium">
            {recap.paragraphs[0]}
          </p>
        )}
      </section>

      {/* Goal timeline */}
      {recap.goals.length > 0 && (
        <section className="card-surface rounded-2xl p-5 sm:p-6">
          <h3 className="section-title mb-5 flex items-center gap-2 text-base">
            <Target size={18} className="text-emerald-600" />
            How the goals went in
          </h3>
          <div className="relative pl-6 sm:pl-8">
            <div className="absolute left-2 sm:left-3 top-2 bottom-2 w-0.5 bg-gradient-to-b from-emerald-400 via-zinc-200 to-emerald-400" />
            <div className="space-y-5">
              {recap.goals.map((goal, i) => {
                const flag = goal.isOwnGoal
                  ? goal.team === "home"
                    ? away.flag
                    : home.flag
                  : goal.team === "home"
                    ? home.flag
                    : away.flag;
                const beneficiary = goal.isOwnGoal
                  ? goal.team === "home"
                    ? away.name
                    : home.name
                  : goal.teamName;

                return (
                  <div key={goal.id} className="relative flex gap-4">
                    <span className="absolute -left-6 sm:-left-8 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500 text-[10px] font-bold text-white ring-4 ring-white">
                      {i + 1}
                    </span>
                    <div className="flex-1 rounded-xl border border-zinc-100 bg-gradient-to-r from-zinc-50 to-white p-4 shadow-sm">
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <span className="rounded-md bg-zinc-900 px-2 py-0.5 text-xs font-bold tabular-nums text-white">
                          {goal.minute}
                        </span>
                        <span className="text-lg">{flag}</span>
                        <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold uppercase text-emerald-800">
                          {goal.isOwnGoal ? "Own goal" : "Goal"}
                        </span>
                        <span className="ml-auto rounded-full bg-zinc-900 px-2.5 py-0.5 text-xs font-extrabold tabular-nums text-white">
                          {goal.scoreAfter}
                        </span>
                      </div>
                      <p className="text-lg font-bold text-zinc-900">{goal.playerName}</p>
                      <p className="text-sm text-zinc-500">
                        {goal.isOwnGoal ? `Credits ${beneficiary}` : goal.teamName}
                        {goal.assist && (
                          <span className="text-zinc-400"> · Assist: {goal.assist}</span>
                        )}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Stats bars — full recap page only (overview has stats elsewhere) */}
      {variant === "full" && recap.stats.length > 0 && (
        <section className="card-surface rounded-2xl p-5 sm:p-6">
          <h3 className="section-title mb-4 flex items-center gap-2 text-base">
            <BarChart3 size={18} className="text-blue-600" />
            By the numbers
          </h3>
          <div className="space-y-4">
            {recap.stats.map((row) => {
              const h = Number(row.home);
              const a = Number(row.away);
              const total = row.isPercent ? 100 : h + a || 1;
              const homePct = row.isPercent ? h : (h / total) * 100;
              return (
                <div key={row.label}>
                  <div className="mb-1.5 flex justify-between text-xs font-semibold tabular-nums">
                    <span className={h > a ? "text-[var(--wc-usa)]" : "text-zinc-500"}>
                      {row.home}{row.isPercent ? "%" : ""}
                    </span>
                    <span className="text-[10px] uppercase tracking-wide text-zinc-400">{row.label}</span>
                    <span className={a > h ? "text-[var(--wc-canada)]" : "text-zinc-500"}>
                      {row.away}{row.isPercent ? "%" : ""}
                    </span>
                  </div>
                  <div className="flex h-2.5 overflow-hidden rounded-full bg-zinc-100">
                    <div className="bg-[var(--wc-usa)]" style={{ width: `${homePct}%` }} />
                    <div className="bg-[var(--wc-canada)]" style={{ width: `${100 - homePct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
          {(recap.cards.homeYellow + recap.cards.awayYellow) > 0 && (
            <p className="mt-4 text-center text-sm text-zinc-500">
              🟨 {home.name} {recap.cards.homeYellow} · {away.name} {recap.cards.awayYellow}
              {(recap.cards.homeRed + recap.cards.awayRed) > 0 &&
                ` · 🟥 ${recap.cards.homeRed + recap.cards.awayRed}`}
            </p>
          )}
        </section>
      )}

      {/* Takeaways */}
      {recap.insights.length > 0 && (
        <section className="card-surface rounded-2xl p-5 sm:p-6">
          <h3 className="section-title mb-3 text-base">What stood out</h3>
          <ul className="grid gap-2 sm:grid-cols-2">
            {recap.insights.slice(0, 6).map((insight, i) => (
              <li
                key={i}
                className="flex gap-2.5 rounded-lg bg-zinc-50 border border-zinc-100 px-3 py-2.5 text-sm text-zinc-700 leading-snug"
              >
                <span className="text-emerald-600 font-bold shrink-0">✓</span>
                {insight}
              </li>
            ))}
          </ul>
        </section>
      )}

      {variant === "embedded" && (
        <div className="text-center">
          <Link
            href={`/match/${match.id}/recap`}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-emerald-600 hover:underline"
          >
            Read full match recap
            <ArrowRight size={14} />
          </Link>
        </div>
      )}
    </div>
  );
}
