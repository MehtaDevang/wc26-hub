import Link from "next/link";
import { ArrowRight, Route } from "lucide-react";
import { TEAMS } from "@/lib/data";

const FEATURED = ["USA", "MEX", "BRA", "ARG", "FRA", "ENG"] as const;

export function TeamJourneyPromo() {
  return (
    <section>
      <div className="flex items-end justify-between gap-4 mb-5">
        <div>
          <h2 className="section-title flex items-center gap-2">
            <Route size={22} className="text-violet-600" />
            Team Journey
          </h2>
          <p className="text-sm text-zinc-500 mt-1">
            Follow every result, fixture, and knockout path for your nation.
          </p>
        </div>
        <Link
          href="/teams"
          className="hidden sm:inline-flex items-center gap-1 text-sm font-semibold text-blue-600 hover:underline shrink-0"
        >
          All teams <ArrowRight size={14} />
        </Link>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {FEATURED.map((code) => {
          const team = TEAMS[code];
          if (!team) return null;
          return (
            <Link
              key={code}
              href={`/teams/${code}`}
              className="card-surface rounded-2xl p-4 hover:shadow-md hover:border-violet-200 transition-all group flex items-center gap-3"
            >
              <span className="text-3xl shrink-0">{team.flag}</span>
              <div className="min-w-0 flex-1">
                <p className="font-bold text-zinc-900 group-hover:text-violet-600 transition-colors truncate">
                  {team.name}
                </p>
                <p className="text-xs text-zinc-500 mt-0.5">Results · fixtures · knockout path</p>
              </div>
              <ArrowRight size={16} className="text-zinc-300 group-hover:text-violet-500 shrink-0" />
            </Link>
          );
        })}
      </div>

      <Link
        href="/teams"
        className="sm:hidden inline-flex items-center gap-1 text-sm font-semibold text-blue-600 mt-4 hover:underline"
      >
        Browse all 48 teams <ArrowRight size={14} />
      </Link>
    </section>
  );
}
