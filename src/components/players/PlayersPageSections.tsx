import { getTopScorers } from "@/lib/espn/player-profile";
import { PlayerListCard } from "@/components/PlayerPageView";

export async function PlayersTopScorersSection() {
  const scorers = await getTopScorers(16);
  if (scorers.length === 0) return null;

  return (
    <section>
      <h2 className="section-title mb-4 text-base">Top Goal Scorers</h2>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {scorers.map((player) => (
          <PlayerListCard key={player.id} player={player} />
        ))}
      </div>
    </section>
  );
}
