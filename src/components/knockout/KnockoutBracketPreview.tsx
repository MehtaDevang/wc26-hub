import Link from "next/link";
import { KnockoutBracket } from "@/components/KnockoutBracket";
import type { KnockoutBracketData } from "@/lib/types";

export function KnockoutBracketPreview({ bracket }: { bracket: KnockoutBracketData }) {
  const r32 = bracket.rounds.find((r) => r.id === "round-of-32");
  const hasR32 = r32 && r32.matches.some((m) => !m.home.placeholder || !m.away.placeholder);

  if (!hasR32) {
    return (
      <section className="card-surface rounded-2xl p-6 text-center">
        <h2 className="font-bold text-zinc-900">Knockout bracket preview</h2>
        <p className="text-sm text-zinc-500 mt-2 max-w-md mx-auto">
          Round of 32 pairings will appear here as groups are decided and FIFA confirms the
          knockout draw path.
        </p>
        <Link
          href="/bracket"
          className="inline-block mt-4 text-sm font-semibold text-[var(--wc-usa)] hover:underline"
        >
          View live bracket →
        </Link>
      </section>
    );
  }

  return (
    <section className="space-y-3">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="font-bold text-zinc-900">Round of 32 preview</h2>
          <p className="text-sm text-zinc-500">Projected knockout ties from the live bracket</p>
        </div>
        <Link href="/bracket" className="text-sm font-semibold text-[var(--wc-usa)] hover:underline">
          Full bracket →
        </Link>
      </div>
      <KnockoutBracket data={bracket} compact />
    </section>
  );
}
