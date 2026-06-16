import { fetchEspnScoreboard } from "@/lib/espn/client";
import { transformEvents } from "@/lib/espn/transform";
import { LiveFixturesList } from "@/components/LiveFixturesList";
import { createLocalizedMetadata, getStrings } from "@/lib/i18n";
import { getServerTimezone } from "@/lib/timezone";

export const metadata = createLocalizedMetadata({
  locale: "es",
  title: "Mundial 2026 - Calendario y resultados",
  description:
    "Calendario completo del Mundial FIFA 2026 con horarios, sedes, grupos y resultados en vivo.",
  path: "/fixtures",
});

export const revalidate = 60;

export default async function SpanishFixturesPage() {
  const timeZone = await getServerTimezone();
  const scoreboard = await fetchEspnScoreboard({ dates: "20260611-20260719" });
  const matches = transformEvents(scoreboard.events ?? [], timeZone);
  const t = getStrings("es");

  return (
    <div className="space-y-6">
      <div>
        <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 mb-1">Español</p>
        <h1 className="section-title">{t.fixturesTitle}</h1>
        <p className="text-zinc-500 text-sm mt-1">{t.fixturesSubtitle(matches.length)}</p>
      </div>
      <LiveFixturesList initialMatches={matches} />
    </div>
  );
}
