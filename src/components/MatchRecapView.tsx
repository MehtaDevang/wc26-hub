import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import type { Match, MatchDetail } from "@/lib/types";
import { MatchRecapContent } from "./MatchRecapContent";

export function MatchRecapView({
  match,
  detail,
}: {
  match: Match;
  detail: MatchDetail;
  timeZone: string;
}) {
  return (
    <div className="space-y-6">
      <Link
        href={`/match/${match.id}`}
        className="inline-flex items-center gap-2 text-sm text-zinc-500 hover:text-zinc-900 transition-colors"
      >
        <ArrowLeft size={16} />
        Back to match
      </Link>
      <MatchRecapContent match={match} detail={detail} variant="full" />
    </div>
  );
}
