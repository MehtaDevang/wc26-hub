import { GuessPlayerGame } from "@/components/GuessPlayerGame";

export const metadata = {
  title: "Guess the Player — WC26 Hub",
  description: "Daily World Cup player guessing game with progressive clues.",
};

export default function GuessPlayerPage() {
  return <GuessPlayerGame />;
}
