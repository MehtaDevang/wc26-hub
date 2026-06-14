import { GUESS_PLAYERS, normalizeGuess, checkGuess } from "../guess-player";
import { pickDailySet } from "./daily";
import type { GuessPlayer } from "../types";

function hashSeed(seed: string): number {
  let h = 0;
  for (let i = 0; i < seed.length; i++) {
    h = ((h << 5) - h + seed.charCodeAt(i)) | 0;
  }
  return Math.abs(h);
}

export function scrambleText(text: string, seed: string): string {
  const words = text.split(" ");
  return words
    .map((word, wi) => {
      const letters = word.split("");
      let h = hashSeed(`${seed}-${wi}`);
      for (let i = letters.length - 1; i > 0; i--) {
        h = (h * 1103515245 + 12345) & 0x7fffffff;
        const j = h % (i + 1);
        [letters[i], letters[j]] = [letters[j], letters[i]];
      }
      if (letters.join("").toLowerCase() === word.toLowerCase() && letters.length > 2) {
        [letters[0], letters[1]] = [letters[1], letters[0]];
      }
      return letters.join("").toUpperCase();
    })
    .join("  ");
}

export interface ScrambleRound {
  player: GuessPlayer;
  scrambled: string;
  wordLengths: number[];
}

export function getDailyScrambles(dateKey: string): ScrambleRound[] {
  const players = pickDailySet(GUESS_PLAYERS, 5, dateKey, 3);
  return players.map((player, i) => ({
    player,
    scrambled: scrambleText(player.name, `scramble-${dateKey}-${i}`),
    wordLengths: player.name.split(" ").map((w) => w.length),
  }));
}

export function checkScrambleAnswer(guess: string, player: GuessPlayer): boolean {
  return checkGuess(guess, player);
}

export { normalizeGuess };

export const SCRAMBLE_MAX_GUESSES = 4;

export const SCRAMBLE_HINTS = [
  (p: GuessPlayer) => `Nationality: ${p.nationality}`,
  (p: GuessPlayer) => `Position: ${p.position}`,
  (p: GuessPlayer) => `Club: ${p.club}`,
  (p: GuessPlayer) => p.hint,
];
