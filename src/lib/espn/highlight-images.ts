import type { Match, Highlight } from "../types";
import { lookupVenue } from "../venues";
import type { EspnKeyEvent, EspnSummary } from "./client";

function normalizeName(name: string): string {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]/g, "");
}

export function extractScorerName(event: EspnKeyEvent): string | undefined {
  if (event.athlete?.displayName) return event.athlete.displayName;

  const short = event.shortText ?? "";
  const shortMatch = short.match(/^(.+?)\s+Goal\b/i);
  if (shortMatch) return shortMatch[1].trim();

  const text = event.text ?? "";
  const textMatch = text.match(
    /([A-Za-zÀ-ÿ' .-]+)\s+\([^)]+\)\s+(?:right footed|left footed|header)/i
  );
  return textMatch?.[1]?.trim();
}

function buildPlayerHeadshotMap(summary: EspnSummary): Map<string, string> {
  const map = new Map<string, string>();

  for (const roster of summary.rosters ?? []) {
    for (const player of roster.roster ?? []) {
      const href = player.athlete?.headshot?.href;
      const name = player.athlete?.displayName;
      if (!href || !name) continue;

      map.set(normalizeName(name), href);
      const lastName = name.split(" ").pop();
      if (lastName) map.set(normalizeName(lastName), href);
    }
  }

  return map;
}

function findPlayerHeadshot(
  scorer: string | undefined,
  headshots: Map<string, string>
): string | undefined {
  if (!scorer) return undefined;

  const direct = headshots.get(normalizeName(scorer));
  if (direct) return direct;

  const lastName = scorer.split(" ").pop();
  if (lastName) return headshots.get(normalizeName(lastName));

  return undefined;
}

function getGoalVideos(summary: EspnSummary) {
  return (summary.videos ?? []).filter((v) => {
    if (!v.thumbnail) return false;
    const headline = (v.headline ?? "").toLowerCase();
    return /goal|celebrate|score|strike|header|stun|finish|net/i.test(headline);
  });
}

function collectMatchPhotos(summary: EspnSummary): Array<{ url: string; caption?: string }> {
  const photos: Array<{ url: string; caption?: string }> = [];
  const seen = new Set<string>();

  for (const img of summary.article?.images ?? []) {
    if (img.url && !seen.has(img.url)) {
      seen.add(img.url);
      photos.push({ url: img.url, caption: img.caption ?? img.name });
    }
  }

  for (const article of summary.news?.articles ?? []) {
    for (const img of article.images ?? []) {
      if (img.url && !seen.has(img.url)) {
        seen.add(img.url);
        photos.push({ url: img.url, caption: img.caption ?? article.headline });
      }
    }
  }

  for (const v of summary.videos ?? []) {
    if (v.thumbnail && !seen.has(v.thumbnail)) {
      seen.add(v.thumbnail);
      photos.push({ url: v.thumbnail, caption: v.headline });
    }
  }

  return photos;
}

function getScoringTeamLogo(
  goal: EspnKeyEvent,
  match: Match
): { url: string; code: string } | undefined {
  const teamName = goal.team?.displayName ?? goal.team?.abbreviation;
  if (!teamName) return undefined;

  const homeHit =
    teamName === match.homeName ||
    teamName === match.home ||
    match.homeName.includes(teamName);
  const awayHit =
    teamName === match.awayName ||
    teamName === match.away ||
    match.awayName.includes(teamName);

  if (homeHit && match.homeLogo) return { url: match.homeLogo, code: match.home };
  if (awayHit && match.awayLogo) return { url: match.awayLogo, code: match.away };

  return undefined;
}

function getStadiumImage(match: Match, summary: EspnSummary): string | undefined {
  const venue = summary.header?.competitions?.[0]?.venue ?? summary.gameInfo?.venue;
  const venueImg = venue?.images?.[0]?.url ?? venue?.images?.[0]?.href;
  if (venueImg) return venueImg;

  return lookupVenue(match.venue, match.venueCity, match.venueCountry).imageUrl;
}

function resolveGoalImage(
  goal: EspnKeyEvent,
  goalIndex: number,
  match: Match,
  summary: EspnSummary,
  headshots: Map<string, string>,
  goalVideos: ReturnType<typeof getGoalVideos>,
  matchPhotos: ReturnType<typeof collectMatchPhotos>,
  usedUrls: Set<string>
): Pick<Highlight, "imageUrl" | "imageAlt" | "imageType" | "playerName"> {
  const scorer = extractScorerName(goal);
  const headshot = findPlayerHeadshot(scorer, headshots);

  if (headshot && !usedUrls.has(headshot)) {
    usedUrls.add(headshot);
    return {
      imageUrl: headshot,
      imageAlt: scorer ?? "Goal scorer",
      imageType: "player",
      playerName: scorer,
    };
  }

  const scorerToken = scorer?.split(" ").pop()?.toLowerCase();
  for (const video of goalVideos) {
    if (!video.thumbnail || usedUrls.has(video.thumbnail)) continue;
    const headline = (video.headline ?? "").toLowerCase();
    const matchesScorer = scorerToken && headline.includes(scorerToken);
    if (matchesScorer) {
      usedUrls.add(video.thumbnail);
      return {
        imageUrl: video.thumbnail,
        imageAlt: video.headline ?? scorer ?? "Goal highlight",
        imageType: "moment",
        playerName: scorer,
      };
    }
  }

  const indexedVideo = goalVideos[goalIndex];
  if (indexedVideo?.thumbnail && !usedUrls.has(indexedVideo.thumbnail)) {
    usedUrls.add(indexedVideo.thumbnail);
    return {
      imageUrl: indexedVideo.thumbnail,
      imageAlt: indexedVideo.headline ?? scorer ?? "Goal highlight",
      imageType: "moment",
      playerName: scorer,
    };
  }

  for (const photo of matchPhotos) {
    if (usedUrls.has(photo.url)) continue;
    const caption = (photo.caption ?? "").toLowerCase();
    const matchesScorer = scorerToken && caption.includes(scorerToken);
    const isAction = /goal|celebrate|score|action|stadium|fans/i.test(caption);
    if (matchesScorer || isAction) {
      usedUrls.add(photo.url);
      return {
        imageUrl: photo.url,
        imageAlt: photo.caption ?? scorer ?? "Match moment",
        imageType: caption.includes("stadium") ? "stadium" : "moment",
        playerName: scorer,
      };
    }
  }

  const teamLogo = getScoringTeamLogo(goal, match);
  if (teamLogo?.url && !usedUrls.has(teamLogo.url)) {
    usedUrls.add(teamLogo.url);
    return {
      imageUrl: teamLogo.url,
      imageAlt: `${scorer ?? "Goal"} — ${teamLogo.code}`,
      imageType: "team",
      playerName: scorer,
    };
  }

  const stadium = getStadiumImage(match, summary);
  if (stadium && !usedUrls.has(stadium)) {
    usedUrls.add(stadium);
    return {
      imageUrl: stadium,
      imageAlt: match.venue,
      imageType: "stadium",
      playerName: scorer,
    };
  }

  const fallbackPhoto = matchPhotos.find((p) => !usedUrls.has(p.url));
  if (fallbackPhoto) {
    usedUrls.add(fallbackPhoto.url);
    return {
      imageUrl: fallbackPhoto.url,
      imageAlt: fallbackPhoto.caption ?? match.venue,
      imageType: "moment",
      playerName: scorer,
    };
  }

  return { playerName: scorer };
}

export function extractMomentHighlights(
  match: Match,
  summary: EspnSummary,
  usedUrls: Set<string>,
  limit: number
): Highlight[] {
  const moments: Highlight[] = [];

  for (const video of summary.videos ?? []) {
    if (!video.thumbnail || usedUrls.has(video.thumbnail)) continue;

    moments.push({
      id: `m-${match.id}-v-${video.id}`,
      matchId: match.id,
      title: video.headline ?? "Match Highlight",
      description:
        video.description ??
        `Watch the latest from ${match.homeName} vs ${match.awayName}.`,
      type: /goal|celebrate|score/i.test(video.headline ?? "")
        ? "celebration"
        : "moment",
      minute: "Clip",
      teams: `${match.homeName} vs ${match.awayName}`,
      emoji: "🎬",
      imageUrl: video.thumbnail,
      imageAlt: video.headline ?? "Match highlight",
      imageType: "moment",
      videoUrl:
        video.links?.source?.href ??
        video.links?.mobile?.source?.href ??
        undefined,
      webUrl: video.links?.web?.href,
    });
    usedUrls.add(video.thumbnail);
    if (moments.length >= limit) return moments;
  }

  for (const img of summary.article?.images ?? []) {
    if (!img.url || usedUrls.has(img.url)) continue;

    moments.push({
      id: `m-${match.id}-p-${img.id ?? moments.length}`,
      matchId: match.id,
      title: img.caption ?? img.name ?? "Match Photo",
      description: `${match.venue} — ${match.homeName} vs ${match.awayName}`,
      type: "moment",
      minute: "Photo",
      teams: `${match.homeName} vs ${match.awayName}`,
      emoji: "📸",
      imageUrl: img.url,
      imageAlt: img.caption ?? match.venue,
      imageType: /stadium|venue|azteca|sofi|metlife/i.test(
        `${img.caption ?? ""} ${match.venue}`
      )
        ? "stadium"
        : "moment",
    });
    usedUrls.add(img.url);
    if (moments.length >= limit) return moments;
  }

  for (const article of summary.news?.articles ?? []) {
    const img = article.images?.[0];
    if (!img?.url || usedUrls.has(img.url)) continue;

    moments.push({
      id: `m-${match.id}-n-${img.id ?? moments.length}`,
      matchId: match.id,
      title: article.headline ?? "Match News",
      description: img.caption ?? `Coverage from ${match.homeName} vs ${match.awayName}`,
      type: "moment",
      minute: "News",
      teams: `${match.homeName} vs ${match.awayName}`,
      emoji: "📰",
      imageUrl: img.url,
      imageAlt: article.headline ?? "Match news",
      imageType: "moment",
      webUrl: article.links?.web?.href,
    });
    usedUrls.add(img.url);
    if (moments.length >= limit) return moments;
  }

  return moments;
}

export function buildGoalHighlights(
  match: Match,
  summary: EspnSummary
): Highlight[] {
  const goals = (summary.keyEvents ?? []).filter(
    (e) => e.type.type === "goal" || e.scoringPlay
  );

  const headshots = buildPlayerHeadshotMap(summary);
  const goalVideos = getGoalVideos(summary);
  const matchPhotos = collectMatchPhotos(summary);
  const usedUrls = new Set<string>();

  return goals.map((goal, index) => {
    const scorer = extractScorerName(goal);
    const image = resolveGoalImage(
      goal,
      index,
      match,
      summary,
      headshots,
      goalVideos,
      matchPhotos,
      usedUrls
    );

    return {
      id: `h-${match.id}-${goal.id}`,
      matchId: match.id,
      title: goal.shortText ?? "Goal",
      description: goal.text ?? "",
      type: "goal" as const,
      minute: goal.clock?.displayValue ?? "",
      teams: `${match.homeName} ${match.homeScore ?? 0}-${match.awayScore ?? 0} ${match.awayName}`,
      emoji: "⚽",
      ...image,
    };
  });
}
