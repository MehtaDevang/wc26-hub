import type { LucideIcon } from "lucide-react";
import { User, Shuffle, Brain } from "lucide-react";

export type PuzzleId = "guess-player" | "scramble" | "quiz";

export interface PuzzleMeta {
  id: PuzzleId;
  title: string;
  description: string;
  href: string;
  icon: LucideIcon;
  color: "blue" | "violet" | "amber" | "emerald";
  badge: string;
}

export const PUZZLE_CATALOG: PuzzleMeta[] = [
  {
    id: "guess-player",
    title: "Guess the Player",
    description: "Identify 5 players from 10+ progressive clues — region, league, caps, trivia, and more.",
    href: "/puzzles/guess-player",
    icon: User,
    color: "blue",
    badge: "Clues",
  },
  {
    id: "scramble",
    title: "Name Scramble",
    description: "Unscramble 5 jumbled player names every day.",
    href: "/puzzles/scramble",
    icon: Shuffle,
    color: "violet",
    badge: "Letters",
  },
  {
    id: "quiz",
    title: "Daily Quiz",
    description: "Answer 5 World Cup trivia questions daily.",
    href: "/puzzles/quiz",
    icon: Brain,
    color: "amber",
    badge: "Trivia",
  },
];
