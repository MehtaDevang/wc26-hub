import type { Highlight } from "./types";

export const HIGHLIGHTS: Highlight[] = [
  {
    id: "h1",
    matchId: "m7",
    title: "Wirtz curls one into the top corner",
    description: "Germany break the deadlock against Curaçao with a stunning strike from Florian Wirtz.",
    type: "goal",
    minute: "23'",
    teams: "GER 1-0 CUW",
    emoji: "⚽",
  },
  {
    id: "h2",
    matchId: "m7",
    title: "Havertz doubles Germany's lead",
    description: "Kai Havertz finishes a sweeping team move to put the World Cup favorites in control.",
    type: "goal",
    minute: "61'",
    teams: "GER 2-0 CUW",
    emoji: "🔥",
  },
  {
    id: "h3",
    matchId: "m4",
    title: "Pulisic hat-trick ignites SoFi Stadium",
    description: "Christian Pulisic scores three as the USA open their World Cup campaign in style.",
    type: "celebration",
    minute: "FT",
    teams: "USA 3-1 PAR",
    emoji: "🇺🇸",
  },
  {
    id: "h4",
    matchId: "m1",
    title: "Mexico roars on opening night",
    description: "Estadio Azteca erupts as El Tri take the lead in the tournament's first match.",
    type: "moment",
    minute: "34'",
    teams: "MEX 2-1 RSA",
    emoji: "🇲🇽",
  },
  {
    id: "h5",
    matchId: "m5",
    title: "Vinícius Jr levels for Brazil",
    description: "A blistering counter-attack ends with Vini Jr firing past the Morocco keeper.",
    type: "goal",
    minute: "78'",
    teams: "BRA 2-2 MAR",
    emoji: "🇧🇷",
  },
  {
    id: "h6",
    matchId: "m3",
    title: "Davies header seals Canada win",
    description: "Alphonso Davies powers home a corner as Canada impress the home crowd in Toronto.",
    type: "goal",
    minute: "55'",
    teams: "CAN 2-0 BIH",
    emoji: "🇨🇦",
  },
];

export function getHighlights(limit?: number): Highlight[] {
  return limit ? HIGHLIGHTS.slice(0, limit) : HIGHLIGHTS;
}

export function getHighlightsForMatch(matchId: string): Highlight[] {
  return HIGHLIGHTS.filter((h) => h.matchId === matchId);
}
