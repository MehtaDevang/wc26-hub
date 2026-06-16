import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { TeamMatch } from "@/lib/quiz/team-personality";
import { getTeamColors } from "@/lib/team-colors";

export function TeamPersonalityResultCard({
  top,
  traits,
  runnersUp,
  intro = "Your World Cup team is",
  children,
}: {
  top: TeamMatch;
  traits?: string[];
  runnersUp?: TeamMatch[];
  intro?: string;
  children?: React.ReactNode;
}) {
  const colors = getTeamColors(top.code);

  return (
    <div className="card-elevated overflow-hidden rounded-3xl">
      <div
        className="px-6 py-10 text-center text-white sm:py-12"
        style={{ background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.secondary} 100%)` }}
      >
        <p className="text-xs font-semibold uppercase tracking-[0.18em] opacity-90">{intro}</p>
        <div className="mt-3 text-7xl leading-none sm:text-8xl">{top.flag}</div>
        <h2 className="mt-3 text-3xl font-extrabold sm:text-4xl">{top.name}</h2>
        <p className="mx-auto mt-3 max-w-md text-base font-medium opacity-95">{top.tagline}</p>
      </div>

      <div className="space-y-5 p-6 sm:p-7">
        {traits && traits.length > 0 && (
          <div className="flex flex-wrap justify-center gap-2">
            {traits.map((trait) => (
              <span
                key={trait}
                className="rounded-full bg-zinc-100 px-3 py-1 text-xs font-semibold text-zinc-700"
              >
                {trait}
              </span>
            ))}
          </div>
        )}

        <p className="text-center text-zinc-600 leading-relaxed">{top.blurb}</p>

        {runnersUp && runnersUp.length > 0 && (
          <div className="rounded-2xl bg-zinc-50 p-4">
            <p className="text-center text-xs font-semibold uppercase tracking-wider text-zinc-400">
              You&apos;re also a bit of…
            </p>
            <div className="mt-3 flex justify-center gap-6">
              {runnersUp.map((team) => (
                <Link
                  key={team.code}
                  href={`/teams/${team.code}`}
                  className="group flex flex-col items-center"
                >
                  <span className="text-3xl">{team.flag}</span>
                  <span className="mt-1 text-xs font-medium text-zinc-600 group-hover:text-blue-600">
                    {team.name}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        )}

        <Link
          href={`/teams/${top.code}`}
          className="flex items-center justify-center gap-1.5 text-sm font-semibold text-blue-600 hover:underline"
        >
          See {top.name} at World Cup 2026 <ArrowRight size={15} />
        </Link>

        {children}
      </div>
    </div>
  );
}
