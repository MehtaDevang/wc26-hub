import Link from "next/link";
import { WC26PageBanner } from "@/components/WC26Brand";
import { AdBanner } from "@/components/AdBanner";
import { FaqSection } from "@/components/FaqSection";
import { JsonLd } from "@/components/JsonLd";
import { BracketPageContent } from "@/components/bracket/BracketPageContent";
import { createPageMetadata } from "@/lib/seo";
import { mergeKeywords, LIVE_SCORES_KEYWORDS } from "@/lib/seo-keywords";
import { getKnockoutHubData } from "@/lib/knockout-hub-data";
import { FINAL_FAQ } from "@/lib/knockout-hub-faq";
import { buildBreadcrumbJsonLd } from "@/lib/structured-data";
import { getTeam } from "@/lib/data";

export const revalidate = 60;

export async function generateMetadata() {
  try {
    const { state } = await getKnockoutHubData();
    const final = state.finalMatch;
    let description =
      "World Cup 2026 Final on 19 July — live score, kick-off time, lineups, stats, and highlights. Third-place match on 18 July.";

    if (final?.home.code && final?.away.code) {
      const home = getTeam(final.home.code, final.home.name).name;
      const away = getTeam(final.away.code, final.away.name).name;
      description = `${home} vs ${away} in the World Cup 2026 Final — live score, kick-off time, preview, and full match recap on 19 July.`;
    } else if (state.champion) {
      const champ = getTeam(state.champion.code ?? "", state.champion.name).name;
      description = `${champ} are World Cup 2026 champions. Relive the Final, every goal, and the full knockout bracket.`;
    }

    const title =
      state.stage === "champions" && state.champion
        ? `${getTeam(state.champion.code ?? "", state.champion.name).name} Win World Cup 2026 - Final Result`
        : "World Cup 2026 Final - Date, Time, Live Score & Preview";

    return createPageMetadata({
      title,
      description,
      path: "/final",
      keywords: mergeKeywords(LIVE_SCORES_KEYWORDS, [
        "World Cup 2026 final",
        "World Cup final date",
        "World Cup final time",
        "World Cup final live score",
        "World Cup 2026 final teams",
      ]),
    });
  } catch {
    return createPageMetadata({
      title: "World Cup 2026 Final - Date, Time, Live Score & Preview",
      description:
        "World Cup 2026 Final on 19 July — live score, kick-off time, lineups, stats, and highlights.",
      path: "/final",
      keywords: mergeKeywords(LIVE_SCORES_KEYWORDS, ["World Cup 2026 final"]),
    });
  }
}

function FinalMatchupCard({
  homeName,
  awayName,
  homeFlag,
  awayFlag,
  date,
  time,
  status,
  homeScore,
  awayScore,
  matchId,
}: {
  homeName: string;
  awayName: string;
  homeFlag: string;
  awayFlag: string;
  date?: string;
  time?: string;
  status?: string;
  homeScore?: number;
  awayScore?: number;
  matchId?: string;
}) {
  const showScore = status === "live" || status === "finished";
  const href = matchId
    ? status === "upcoming"
      ? `/match/${matchId}/preview`
      : status === "finished"
        ? `/match/${matchId}/recap`
        : `/match/${matchId}`
    : "/bracket";

  return (
    <Link
      href={href}
      className="card-surface block rounded-2xl p-5 sm:p-6 hover:border-blue-200 transition-colors"
    >
      <p className="text-xs font-bold uppercase tracking-wider text-[var(--wc-gold)] mb-3">
        The Final · 19 July 2026
      </p>
      <div className="flex items-center justify-between gap-4">
        <div className="text-center flex-1 min-w-0">
          <span className="text-3xl">{homeFlag}</span>
          <p className="font-display text-lg sm:text-xl text-zinc-900 mt-1 truncate">{homeName}</p>
        </div>
        <div className="text-center shrink-0">
          {showScore ? (
            <p className="font-display text-3xl sm:text-4xl tabular-nums text-zinc-900">
              {homeScore ?? 0} – {awayScore ?? 0}
            </p>
          ) : (
            <p className="text-sm font-semibold text-zinc-500">
              {date}
              {time ? ` · ${time}` : ""}
            </p>
          )}
          {status === "live" && (
            <span className="inline-flex items-center gap-1 mt-1 text-xs font-bold uppercase text-[var(--wc-canada)]">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[var(--wc-canada)]" /> Live
            </span>
          )}
        </div>
        <div className="text-center flex-1 min-w-0">
          <span className="text-3xl">{awayFlag}</span>
          <p className="font-display text-lg sm:text-xl text-zinc-900 mt-1 truncate">{awayName}</p>
        </div>
      </div>
    </Link>
  );
}

export default async function FinalPage() {
  const { state, finalFixtures } = await getKnockoutHubData();
  const final = state.finalMatch;
  const third = state.thirdPlaceMatch;

  const finalMatchId = final
    ? finalFixtures.find(
        (m) =>
          (m.home === final.home.code && m.away === final.away.code) ||
          (m.home === final.away.code && m.away === final.home.code)
      )?.id
    : undefined;

  return (
    <div className="space-y-6">
      <JsonLd
        data={buildBreadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "The Final", path: "/final" },
        ])}
      />

      <WC26PageBanner
        title={
          state.champion
            ? `${getTeam(state.champion.code ?? "", state.champion.name).name} — World Cup Champions`
            : "World Cup 2026 Final"
        }
        subtitle={
          state.champion
            ? "The trophy has been lifted. Relive the Final and the full knockout run."
            : "MetLife Stadium, New Jersey · Sunday 19 July 2026"
        }
      />

      {state.champion ? (
        <p className="text-sm text-zinc-600 leading-relaxed max-w-3xl">
          {getTeam(state.champion.code ?? "", state.champion.name).name} won the 2026 World Cup.
          Explore the{" "}
          <Link href="/bracket" className="text-blue-600 hover:underline font-medium">
            full bracket
          </Link>
          , Golden Boot race, and{" "}
          <Link href="/history" className="text-blue-600 hover:underline font-medium">
            World Cup history
          </Link>
          .
        </p>
      ) : final?.home.code && final?.away.code ? (
        <>
          <p className="text-sm text-zinc-600 leading-relaxed max-w-3xl">
            {getTeam(final.home.code, final.home.name).name} and{" "}
            {getTeam(final.away.code, final.away.name).name} contest the biggest match in football.
            Follow live scores, lineups, and highlights — or read the{" "}
            <Link
              href={finalMatchId ? `/match/${finalMatchId}/preview` : "/fixtures"}
              className="text-blue-600 hover:underline font-medium"
            >
              match preview
            </Link>
            .
          </p>
          <FinalMatchupCard
            homeName={getTeam(final.home.code, final.home.name).name}
            awayName={getTeam(final.away.code, final.away.name).name}
            homeFlag={getTeam(final.home.code, final.home.name).flag}
            awayFlag={getTeam(final.away.code, final.away.name).flag}
            date={final.date}
            time={final.time}
            status={final.status}
            homeScore={final.home.score}
            awayScore={final.away.score}
            matchId={finalMatchId}
          />
        </>
      ) : (
        <p className="text-sm text-zinc-600 leading-relaxed max-w-3xl">
          The Final is on 19 July 2026 at MetLife Stadium. Follow the{" "}
          <Link href="/semi-finals" className="text-blue-600 hover:underline font-medium">
            semi-finals
          </Link>{" "}
          to see who advances.
        </p>
      )}

      {third?.home.code && third?.away.code && (
        <div className="card-surface rounded-2xl p-4 sm:p-5">
          <p className="text-xs font-bold uppercase tracking-wider text-zinc-500 mb-2">
            Third-place match · 18 July
          </p>
          <p className="font-semibold text-zinc-900">
            {getTeam(third.home.code, third.home.name).name} vs{" "}
            {getTeam(third.away.code, third.away.name).name}
          </p>
        </div>
      )}

      <AdBanner placement="inline" />

      <div className="stadium-head">
        <h2 className="stadium-head-title">Knockout Bracket</h2>
        <p className="stadium-head-sub">Every result on the road to the trophy</p>
      </div>
      <BracketPageContent />

      <FaqSection heading="World Cup 2026 Final — FAQ" items={FINAL_FAQ} />
    </div>
  );
}
