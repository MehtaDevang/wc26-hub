"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Trophy, UserPlus, Trash2, Crown, Link2, Check } from "lucide-react";
import { ShareButtons } from "@/components/ShareButtons";
import {
  encodeBracketPicks,
  getBracketPicks,
  countBracketPicks,
} from "@/lib/bracket-picks";
import {
  buildPoolShareUrl,
  extractEncodedFromInput,
  getPoolEntries,
  removePoolEntry,
  savePoolEntries,
  scoreAndRankPool,
  upsertPoolEntry,
  type PoolEntry,
} from "@/lib/bracket-pool";
import { SITE_NAME } from "@/lib/site";
import type { KnockoutBracketData } from "@/lib/types";

const RANK_BADGES = ["🥇", "🥈", "🥉"];

export function BracketPool({ bracket }: { bracket: KnockoutBracketData }) {
  const searchParams = useSearchParams();
  const [entries, setEntries] = useState<PoolEntry[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const [friendName, setFriendName] = useState("");
  const [friendCode, setFriendCode] = useState("");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const myEncoded = useMemo(() => {
    const picks = getBracketPicks();
    if (countBracketPicks(picks, bracket) === 0) return "";
    return encodeBracketPicks(picks, bracket);
  }, [bracket]);

  useEffect(() => {
    let current = getPoolEntries();

    const incomingCode = searchParams.get("p");
    const incomingName = searchParams.get("name");
    if (incomingCode) {
      current = upsertPoolEntry(current, incomingName || "A friend", incomingCode);
      savePoolEntries(current);
      if (typeof window !== "undefined") {
        window.history.replaceState({}, "", "/bracket/pool");
      }
    }

    setEntries(current);
    setHydrated(true);
  }, [searchParams]);

  const persist = useCallback((next: PoolEntry[]) => {
    setEntries(next);
    savePoolEntries(next);
  }, []);

  const addMyBracket = useCallback(() => {
    if (!myEncoded) return;
    persist(upsertPoolEntry(entries, "You", myEncoded, { isYou: true }));
  }, [entries, myEncoded, persist]);

  const addFriend = useCallback(() => {
    setError("");
    const encoded = extractEncodedFromInput(friendCode);
    if (!encoded) {
      setError("Paste a valid bracket share link or code.");
      return;
    }
    persist(upsertPoolEntry(entries, friendName || "A friend", encoded));
    setFriendName("");
    setFriendCode("");
  }, [entries, friendCode, friendName, persist]);

  const ranked = useMemo(
    () => (hydrated ? scoreAndRankPool(entries, bracket) : []),
    [entries, bracket, hydrated]
  );

  const hasYou = entries.some((e) => e.isYou);
  const decidedTotal = ranked[0]?.decided ?? 0;

  const myShareUrl = myEncoded ? buildPoolShareUrl("", myEncoded) : "";

  function copyInvite() {
    if (!myShareUrl || typeof navigator === "undefined") return;
    navigator.clipboard?.writeText(myShareUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  return (
    <div className="space-y-6">
      <div className="card-surface rounded-2xl p-5">
        <h2 className="font-bold text-zinc-900 flex items-center gap-2">
          <Trophy size={18} className="text-[var(--wc-gold)]" />
          Pool leaderboard
        </h2>
        <p className="text-sm text-zinc-500 mt-1">
          {decidedTotal > 0
            ? `Scored against ${decidedTotal} completed knockout match${decidedTotal === 1 ? "" : "es"} so far.`
            : "Brackets are scored automatically as knockout results come in."}
        </p>

        {ranked.length === 0 ? (
          <p className="text-sm text-zinc-400 text-center py-8">
            No brackets yet. Add yours and invite friends below.
          </p>
        ) : (
          <div className="mt-4 divide-y divide-zinc-50">
            {ranked.map((entry, index) => (
              <div key={entry.id} className="flex items-center gap-3 py-3">
                <span className="w-7 text-center text-lg shrink-0">
                  {RANK_BADGES[index] ?? (
                    <span className="text-sm font-bold text-zinc-400">{index + 1}</span>
                  )}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="font-bold text-zinc-900 flex items-center gap-1.5 truncate">
                    {entry.name}
                    {entry.isYou && (
                      <span className="text-[9px] font-bold uppercase rounded bg-blue-100 text-blue-700 px-1.5 py-0.5">
                        You
                      </span>
                    )}
                  </p>
                  {entry.championName && (
                    <p className="text-xs text-zinc-500 flex items-center gap-1">
                      <Crown size={11} className="text-amber-500" />
                      {entry.championName}
                    </p>
                  )}
                </div>
                <div className="text-right shrink-0">
                  <p className="text-lg font-extrabold tabular-nums text-zinc-900">
                    {entry.correct}
                    <span className="text-sm font-medium text-zinc-400">/{entry.decided}</span>
                  </p>
                  <p className="text-[10px] uppercase tracking-wide text-zinc-400">{entry.pct}% right</p>
                </div>
                <button
                  type="button"
                  onClick={() => persist(removePoolEntry(entries, entry.id))}
                  aria-label={`Remove ${entry.name}`}
                  className="text-zinc-300 hover:text-red-500 shrink-0 p-1"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="card-surface rounded-2xl p-5">
          <h3 className="font-bold text-zinc-900 mb-2">Your bracket</h3>
          {myEncoded ? (
            <>
              {!hasYou ? (
                <button
                  type="button"
                  onClick={addMyBracket}
                  className="btn-primary inline-flex items-center gap-2 px-4 py-2 text-sm"
                >
                  <UserPlus size={15} />
                  Add my bracket to the pool
                </button>
              ) : (
                <p className="text-sm text-emerald-700 font-medium flex items-center gap-1.5">
                  <Check size={15} /> Your bracket is in the pool
                </p>
              )}
              <div className="mt-4 flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={copyInvite}
                  className="btn-secondary inline-flex items-center gap-1.5 text-sm px-3 py-2"
                >
                  {copied ? <Check size={14} /> : <Link2 size={14} />}
                  {copied ? "Link copied" : "Copy invite link"}
                </button>
                <ShareButtons
                  url={myShareUrl}
                  title="Join my World Cup 2026 bracket pool"
                  text={`🏆 Beat my FIFA World Cup 2026 bracket on ${SITE_NAME}`}
                  label="Invite friends"
                />
              </div>
              <p className="text-xs text-zinc-400 mt-3">
                Friends who open your link get added to the leaderboard automatically.
              </p>
            </>
          ) : (
            <p className="text-sm text-zinc-500">
              You haven&apos;t made any picks yet.{" "}
              <Link href="/bracket/predict" className="text-blue-600 hover:underline font-medium">
                Fill in your bracket →
              </Link>
            </p>
          )}
        </div>

        <div className="card-surface rounded-2xl p-5">
          <h3 className="font-bold text-zinc-900 mb-2">Add a friend</h3>
          <p className="text-xs text-zinc-500 mb-3">
            Paste a bracket share link (or code) someone sent you.
          </p>
          <div className="space-y-2">
            <input
              type="text"
              value={friendName}
              onChange={(e) => setFriendName(e.target.value)}
              placeholder="Friend's name"
              className="w-full rounded-xl border border-zinc-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30"
            />
            <input
              type="text"
              value={friendCode}
              onChange={(e) => setFriendCode(e.target.value)}
              placeholder="Paste share link or code"
              className="w-full rounded-xl border border-zinc-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30"
            />
            <button
              type="button"
              onClick={addFriend}
              className="btn-primary inline-flex items-center gap-2 px-4 py-2 text-sm w-full justify-center"
            >
              <UserPlus size={15} />
              Add to pool
            </button>
            {error && <p className="text-xs text-red-600">{error}</p>}
          </div>
        </div>
      </div>

      <p className="text-center text-sm text-zinc-500">
        <Link href="/bracket/predict" className="text-blue-600 hover:underline font-medium">
          Edit your bracket
        </Link>
        {" · "}
        <Link href="/bracket" className="text-blue-600 hover:underline font-medium">
          Live knockout bracket →
        </Link>
      </p>
    </div>
  );
}
