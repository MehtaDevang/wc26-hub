import { Suspense } from "react";
import Link from "next/link";
import { LiveKnockoutBracket } from "@/components/LiveKnockoutBracket";
import { PageLoading } from "@/components/PageLoading";
import { getKnockoutBracket } from "@/lib/espn/services";
import { getServerTimezone } from "@/lib/timezone";

async function BracketData() {
  const timeZone = await getServerTimezone();
  const bracket = await getKnockoutBracket(timeZone);
  return <LiveKnockoutBracket initialData={bracket} />;
}

export function BracketPageContent() {
  return (
    <Suspense
      fallback={
        <PageLoading label="Loading knockout bracket" subtitle="Round of 32 through the Final" />
      }
    >
      <BracketData />
    </Suspense>
  );
}

export function BracketPageLinks() {
  return (
    <p className="text-sm text-zinc-500 flex flex-wrap gap-x-3 gap-y-1">
      <Link href="/fixtures" className="text-blue-600 hover:underline font-medium">
        Knockout fixtures →
      </Link>
      <span className="text-zinc-300">·</span>
      <Link href="/leaders" className="text-blue-600 hover:underline font-medium">
        Golden Boot leaders →
      </Link>
      <span className="text-zinc-300">·</span>
      <Link href="/standings" className="text-blue-600 hover:underline font-medium">
        Final group tables →
      </Link>
    </p>
  );
}
