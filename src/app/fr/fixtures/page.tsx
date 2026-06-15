import { fetchEspnScoreboard } from "@/lib/espn/client";
import { transformEvents } from "@/lib/espn/transform";
import { LiveFixturesList } from "@/components/LiveFixturesList";
import { createLocalizedMetadata, getStrings } from "@/lib/i18n";
import { getServerTimezone } from "@/lib/timezone";

export const metadata = createLocalizedMetadata({
  locale: "fr",
  title: "Coupe du monde 2026 — Calendrier et résultats",
  description:
    "Calendrier complet de la Coupe du monde FIFA 2026 avec horaires, stades, groupes et scores en direct.",
  path: "/fixtures",
});

export const revalidate = 60;

export default async function FrenchFixturesPage() {
  const timeZone = await getServerTimezone();
  const scoreboard = await fetchEspnScoreboard({ dates: "20260611-20260719" });
  const matches = transformEvents(scoreboard.events ?? [], timeZone);
  const t = getStrings("fr");

  return (
    <div className="space-y-6">
      <div>
        <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 mb-1">Français</p>
        <h1 className="section-title">{t.fixturesTitle}</h1>
        <p className="text-zinc-500 text-sm mt-1">{t.fixturesSubtitle(matches.length)}</p>
      </div>
      <LiveFixturesList initialMatches={matches} />
    </div>
  );
}
