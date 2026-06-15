import type { Match, MatchDetail } from "./types";
import { buildMatchInsights } from "./match-insights";

export function buildMatchPreview(match: Match, detail: MatchDetail): string[] {
  const lines: string[] = [];
  const home = match.homeName;
  const away = match.awayName;

  lines.push(
    `${home} meet ${away} in a FIFA World Cup 2026 ${
      match.group !== "?" ? `Group ${match.group}` : match.stageLabel ?? "knockout"
    } fixture.`
  );

  if (detail.homeRecord && detail.awayRecord) {
    lines.push(
      `Form guide: ${home} (${detail.homeRecord.summary}, ${detail.homeRecord.points} pts) vs ${away} (${detail.awayRecord.summary}, ${detail.awayRecord.points} pts).`
    );
  } else if (detail.homeRecord) {
    lines.push(`${home} arrive on ${detail.homeRecord.summary} in the group stage.`);
  } else if (detail.awayRecord) {
    lines.push(`${away} arrive on ${detail.awayRecord.summary} in the group stage.`);
  }

  if (detail.rivalryName) {
    lines.push(`${detail.rivalryName}: ${detail.rivalryNote ?? "A fixture with extra edge."}`);
  }

  if (detail.headToHeadRecord && detail.headToHeadRecord.totalMeetings > 0) {
    const { homeWins, awayWins, draws } = detail.headToHeadRecord;
      lines.push(
        `Head-to-head in recent meetings: ${home} ${homeWins}W, ${draws}D, ${away} ${awayWins}W.`
      );
  }

  if (detail.homeLineup?.formation && detail.awayLineup?.formation) {
    lines.push(
      `Expected shapes: ${home} (${detail.homeLineup.formation}) vs ${away} (${detail.awayLineup.formation}).`
    );
  }

  if (detail.venue?.name) {
    lines.push(
      `Kickoff at ${detail.venue.name}${detail.venue.city ? `, ${detail.venue.city}` : ""}${
        detail.venue.capacity ? ` — capacity ${detail.venue.capacity.toLocaleString()}` : ""
      }.`
    );
  }

  if (detail.weather?.condition) {
    lines.push(
      `Forecast: ${detail.weather.condition}${
        detail.weather.temperature != null ? `, around ${detail.weather.temperature}°C` : ""
      }.`
    );
  }

  if (detail.broadcasts?.length) {
    const networks = detail.broadcasts.slice(0, 3).map((b) => b.network).join(", ");
    lines.push(`Watch on ${networks}.`);
  }

  lines.push(`Keys to watch: midfield control, set-piece threat, and which side handles the big occasion.`);

  return lines.slice(0, 7);
}

export function buildMatchRecap(match: Match, detail: MatchDetail): string[] {
  const home = match.homeName;
  const away = match.awayName;
  const hs = match.homeScore ?? 0;
  const as = match.awayScore ?? 0;

  const opener =
    hs === as
      ? `${home} and ${away} played out a ${hs}–${as} draw.`
      : (() => {
          const winner = hs > as ? home : away;
          const loser = hs > as ? away : home;
          const margin = Math.abs(hs - as);
          return margin >= 3
            ? `${winner} ran out ${Math.max(hs, as)}–${Math.min(hs, as)} winners against ${loser}.`
            : `${winner} beat ${loser} ${Math.max(hs, as)}–${Math.min(hs, as)}.`;
        })();

  const insights = buildMatchInsights({
    match,
    stats: detail.stats,
    events: detail.events,
    homeName: home,
    awayName: away,
    homeLineup: detail.homeLineup,
    awayLineup: detail.awayLineup,
    venue: detail.venue,
    attendance: detail.attendance,
    referee: detail.referee,
  });

  const scorers = detail.events
    .filter((e) => e.type === "goal" || e.type === "penalty")
    .map((e) => {
      const name = e.playerName.replace(/\s+Goal\b.*$/i, "").trim();
      const team = e.team === "home" ? home : away;
      return `${name} (${team}, ${e.minute}')`;
    });

  const recap = [opener];
  if (scorers.length > 0) {
    recap.push(`Scorers: ${scorers.join("; ")}.`);
  }
  recap.push(...insights);

  return recap.slice(0, 8);
}
