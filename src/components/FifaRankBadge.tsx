import { getFifaRank, formatFifaRank } from "@/lib/fifa-rankings";

export function FifaRankBadge({
  code,
  variant = "inline",
  className = "",
}: {
  code: string;
  variant?: "inline" | "pill" | "compact";
  className?: string;
}) {
  const rank = getFifaRank(code);
  if (rank == null) return null;

  if (variant === "pill") {
    return (
      <span
        className={`inline-flex items-center rounded-full bg-zinc-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-zinc-500 ${className}`}
      >
        FIFA #{rank}
      </span>
    );
  }

  if (variant === "compact") {
    return (
      <span className={`text-[10px] font-semibold tabular-nums text-zinc-400 ${className}`}>
        {formatFifaRank(rank)}
      </span>
    );
  }

  return (
    <span className={`text-xs text-zinc-400 tabular-nums ${className}`}>
      {formatFifaRank(rank, "label")}
    </span>
  );
}

export function FifaRankMatchup({
  homeCode,
  awayCode,
  className = "",
}: {
  homeCode: string;
  awayCode: string;
  className?: string;
}) {
  const homeRank = getFifaRank(homeCode);
  const awayRank = getFifaRank(awayCode);
  if (homeRank == null || awayRank == null) return null;

  return (
    <span className={`text-xs text-zinc-500 tabular-nums ${className}`}>
      FIFA {formatFifaRank(homeRank)} vs {formatFifaRank(awayRank)}
    </span>
  );
}
