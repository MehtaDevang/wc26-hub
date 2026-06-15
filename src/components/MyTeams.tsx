"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { Star } from "lucide-react";
import clsx from "clsx";
import { getTeam } from "@/lib/data";
import { getMyTeams, isMyTeam, MAX_MY_TEAMS, toggleMyTeam } from "@/lib/my-teams";
import { MyTeamsAlerts } from "@/components/MyTeamsAlerts";
import { MyTeamsPushPrompt } from "@/components/MyTeamsPushPrompt";

interface StarTeamButtonProps {
  teamCode: string;
  className?: string;
  showLabel?: boolean;
}

export function StarTeamButton({ teamCode, className, showLabel = true }: StarTeamButtonProps) {
  const [starred, setStarred] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setStarred(isMyTeam(teamCode));
    setHydrated(true);
  }, [teamCode]);

  const handleClick = useCallback(() => {
    const next = toggleMyTeam(teamCode);
    setStarred(next.includes(teamCode.toUpperCase()));
  }, [teamCode]);

  if (!hydrated) {
    return (
      <button type="button" className={clsx("opacity-40", className)} aria-hidden>
        <Star size={16} />
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      title={starred ? "Remove from My Teams" : `Add to My Teams (max ${MAX_MY_TEAMS})`}
      className={clsx(
        "inline-flex items-center gap-1.5 rounded-lg px-2 py-1 text-xs font-semibold transition-colors",
        starred
          ? "bg-amber-50 text-amber-700 hover:bg-amber-100"
          : "text-zinc-400 hover:text-amber-600 hover:bg-amber-50/50",
        className
      )}
    >
      <Star size={16} className={starred ? "fill-amber-500 text-amber-500" : ""} />
      {showLabel && (starred ? "Following" : "Follow")}
    </button>
  );
}

interface MyTeamsPickerProps {
  className?: string;
}

export function MyTeamsPicker({ className }: MyTeamsPickerProps) {
  const [codes, setCodes] = useState<string[]>([]);

  useEffect(() => {
    setCodes(getMyTeams());
    const onStorage = () => setCodes(getMyTeams());
    window.addEventListener("storage", onStorage);
    window.addEventListener("wc26-my-teams-changed", onStorage);
    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("wc26-my-teams-changed", onStorage);
    };
  }, []);

  if (codes.length === 0) {
    return (
      <div className={clsx("card-surface rounded-2xl p-5", className)}>
        <h2 className="font-bold text-zinc-900 flex items-center gap-2">
          <Star size={18} className="text-amber-500" />
          My Teams
        </h2>
        <p className="text-sm text-zinc-500 mt-2">
          Star up to {MAX_MY_TEAMS} nations on any{" "}
          <Link href="/teams" className="text-blue-600 hover:underline font-medium">
            team page
          </Link>{" "}
          to see their fixtures here.
        </p>
      </div>
    );
  }

  return (
    <div className={clsx("card-surface rounded-2xl p-5", className)}>
      <h2 className="font-bold text-zinc-900 flex items-center gap-2 mb-3">
        <Star size={18} className="text-amber-500 fill-amber-500" />
        My Teams
      </h2>
      <div className="flex flex-wrap gap-2">
        {codes.map((code) => {
          const team = getTeam(code);
          return (
            <Link
              key={code}
              href={`/teams/${code}`}
              className="inline-flex items-center gap-2 rounded-xl bg-amber-50 border border-amber-100 px-3 py-2 text-sm font-semibold text-amber-900 hover:bg-amber-100 transition-colors"
            >
              <span>{team.flag}</span>
              {team.name}
            </Link>
          );
        })}
      </div>
      <MyTeamsAlerts />
      <div className="mt-3">
        <MyTeamsPushPrompt />
      </div>
    </div>
  );
}
