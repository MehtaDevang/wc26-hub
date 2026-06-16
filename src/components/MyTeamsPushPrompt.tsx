"use client";

import { useEffect, useState } from "react";
import { Bell, BellOff } from "lucide-react";
import { getMyTeams } from "@/lib/my-teams";
import { fetchMatches } from "@/lib/matches";
import { useTimezone } from "@/components/TimezoneProvider";
import {
  isPushEnabled,
  requestPushPermission,
  setPushEnabled,
  showMatchNotification,
  getNotifiedMatchIds,
  markMatchNotified,
} from "@/lib/push-notifications";

export function MyTeamsPushPrompt() {
  const timezone = useTimezone();
  const [enabled, setEnabled] = useState(false);
  const [teams, setTeams] = useState<string[]>([]);
  const [supported, setSupported] = useState(true);

  useEffect(() => {
    setSupported("Notification" in window);
    setEnabled(isPushEnabled());
    setTeams(getMyTeams());
    const refresh = () => setTeams(getMyTeams());
    window.addEventListener("wc26-my-teams-changed", refresh);
    return () => window.removeEventListener("wc26-my-teams-changed", refresh);
  }, []);

  useEffect(() => {
    if (!enabled || teams.length === 0) return;

    const poll = async () => {
      try {
        const matches = await fetchMatches({ range: "full", timeZone: timezone });
        const notified = getNotifiedMatchIds();
        for (const m of matches) {
          if (m.status !== "live") continue;
          const mine = teams.includes(m.home) || teams.includes(m.away);
          if (!mine || notified.has(m.id)) continue;
          markMatchNotified(m.id);
          showMatchNotification(
            `⚽ ${m.homeName} vs ${m.awayName}`,
            `Live now - ${m.homeScore ?? 0}–${m.awayScore ?? 0}`,
            `/match/${m.id}`
          );
        }
      } catch {
        // ignore
      }
    };

    poll();
    const id = setInterval(poll, 90_000);
    return () => clearInterval(id);
  }, [enabled, teams, timezone]);

  if (!supported || teams.length === 0) return null;

  async function toggle() {
    if (enabled) {
      setPushEnabled(false);
      setEnabled(false);
      return;
    }
    const ok = await requestPushPermission();
    setEnabled(ok);
  }

  return (
    <button
      type="button"
      onClick={toggle}
      className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
        enabled
          ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
          : "bg-zinc-50 text-zinc-600 border border-zinc-200 hover:border-blue-200"
      }`}
    >
      {enabled ? <Bell size={14} /> : <BellOff size={14} />}
      {enabled ? "Match alerts on" : "Enable match alerts"}
    </button>
  );
}
