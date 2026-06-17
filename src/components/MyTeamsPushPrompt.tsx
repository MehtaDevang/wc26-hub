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
  hasNotifiedEvent,
  markNotifiedEvent,
} from "@/lib/push-notifications";
import { getTeam } from "@/lib/data";

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
        const now = Date.now();

        for (const m of matches) {
          const mine = teams.includes(m.home) || teams.includes(m.away);
          if (!mine) continue;

          const home = getTeam(m.home, m.homeName, m.homeLogo);
          const away = getTeam(m.away, m.awayName, m.awayLogo);
          const url = `/match/${m.id}`;
          const matchup = `${home.name} vs ${away.name}`;
          const hs = m.homeScore ?? 0;
          const as = m.awayScore ?? 0;

          if (m.status === "upcoming") {
            const kickoff = m.kickoffAt ? new Date(m.kickoffAt).getTime() : NaN;
            const minsToKickoff = Number.isFinite(kickoff) ? (kickoff - now) / 60000 : NaN;
            const soonKey = `${m.id}:soon`;
            if (
              Number.isFinite(minsToKickoff) &&
              minsToKickoff > 0 &&
              minsToKickoff <= 15 &&
              !hasNotifiedEvent(soonKey)
            ) {
              markNotifiedEvent(soonKey);
              showMatchNotification(
                `⏰ Starting soon: ${matchup}`,
                `Kicks off in about ${Math.max(1, Math.round(minsToKickoff))} min`,
                url
              );
            }
            continue;
          }

          if (m.status === "live") {
            const kickKey = `${m.id}:kickoff`;
            if (!hasNotifiedEvent(kickKey)) {
              markNotifiedEvent(kickKey);
              showMatchNotification(`🟢 Kick-off! ${matchup}`, "It's live now", url);
            }

            const goalKey = `${m.id}:goal:${hs}-${as}`;
            if (hs + as > 0 && !hasNotifiedEvent(goalKey)) {
              markNotifiedEvent(goalKey);
              showMatchNotification(
                `⚽ GOAL! ${home.name} ${hs}–${as} ${away.name}`,
                `${m.minute ? `${m.minute}'` : "Live"} - tap for the live feed`,
                `${url}?tab=live`
              );
            }
            continue;
          }

          if (m.status === "finished") {
            const ftKey = `${m.id}:ft`;
            if (!hasNotifiedEvent(ftKey)) {
              markNotifiedEvent(ftKey);
              showMatchNotification(
                `🏁 Full time: ${home.name} ${hs}–${as} ${away.name}`,
                "Tap for the recap and stats",
                url
              );
            }
          }
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
