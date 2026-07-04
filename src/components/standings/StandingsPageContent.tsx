import { cache, Suspense } from "react";
import { InteractiveStandingsGrid } from "@/components/InteractiveStandingsGrid";
import { LiveKnockoutBracket } from "@/components/LiveKnockoutBracket";
import { PageLoading } from "@/components/PageLoading";
import { fetchAllGroupStandings } from "@/lib/espn/standings";
import { getKnockoutBracket } from "@/lib/espn/services";
import { getServerTimezone } from "@/lib/timezone";

const loadStandings = cache(async () => {
  try {
    return await fetchAllGroupStandings();
  } catch {
    return [];
  }
});

async function StandingsTables() {
  const standings = await loadStandings();
  return <InteractiveStandingsGrid groups={standings} />;
}

async function StandingsBracket() {
  const [timeZone, standings] = await Promise.all([
    getServerTimezone(),
    loadStandings(),
  ]);
  const bracket = await getKnockoutBracket(timeZone, standings);
  return <LiveKnockoutBracket initialData={bracket} showLink />;
}

export function StandingsTablesSection() {
  return (
    <Suspense
      fallback={
        <PageLoading label="Loading group tables" subtitle="All 12 World Cup groups" />
      }
    >
      <StandingsTables />
    </Suspense>
  );
}

export function StandingsBracketSection() {
  return (
    <Suspense
      fallback={
        <PageLoading label="Loading knockout bracket" subtitle="Live elimination stage" />
      }
    >
      <StandingsBracket />
    </Suspense>
  );
}
