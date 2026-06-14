import { redirect } from "next/navigation";

export default function GuessRedirect() {
  redirect("/puzzles/guess-player");
}
