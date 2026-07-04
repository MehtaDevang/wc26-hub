import { getTopScorers } from "@/lib/espn/player-profile";
import { LiveFeaturedPlayersStrip } from "@/components/LiveFeaturedPlayersStrip";

export async function FeaturedPlayersStrip() {
  try {
    const scorers = await getTopScorers(8);
    return <LiveFeaturedPlayersStrip initialScorers={scorers} />;
  } catch {
    return null;
  }
}
