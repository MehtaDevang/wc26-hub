import { getPlayersByCountry } from "@/lib/espn/player-profile";
import { PlayersExplorer } from "@/components/PlayersExplorer";

export async function PlayersSquadsSection() {
  const sections = await getPlayersByCountry();

  if (sections.length === 0) {
    return (
      <p className="text-sm text-zinc-400 text-center py-12">
        Squad lists will appear once ESPN publishes full World Cup 2026 rosters.
      </p>
    );
  }

  return <PlayersExplorer sections={sections} />;
}
