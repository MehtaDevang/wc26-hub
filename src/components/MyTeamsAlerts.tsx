"use client";

import { useEffect, useState } from "react";
import { CalendarPlus, Mail, Bell } from "lucide-react";
import { getTeam } from "@/lib/data";
import { getMyTeams } from "@/lib/my-teams";
import { fetchMatches } from "@/lib/matches";
import { buildTournamentICS, downloadICS } from "@/lib/calendar";
import { useTimezone } from "@/components/TimezoneProvider";
import { SITE_CONTACT_EMAIL } from "@/lib/site";

export function MyTeamsAlerts() {
  const timezone = useTimezone();
  const [codes, setCodes] = useState<string[]>([]);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    const refresh = () => setCodes(getMyTeams());
    refresh();
    window.addEventListener("wc26-my-teams-changed", refresh);
    window.addEventListener("storage", refresh);
    return () => {
      window.removeEventListener("wc26-my-teams-changed", refresh);
      window.removeEventListener("storage", refresh);
    };
  }, []);

  if (codes.length === 0) return null;

  const teamNames = codes.map((c) => getTeam(c).name).join(", ");
  const digestMailto = `mailto:${SITE_CONTACT_EMAIL}?subject=${encodeURIComponent(
    "World Cup 2026 match digest"
  )}&body=${encodeURIComponent(
    `Hi — I'd like a daily match digest for my teams: ${teamNames}.\n\nEmail: `
  )}`;

  async function handleCalendar() {
    setDownloading(true);
    try {
      const matches = await fetchMatches({ range: "full", timeZone: timezone });
      const filtered = matches.filter(
        (m) => codes.includes(m.home) || codes.includes(m.away)
      );
      downloadICS(buildTournamentICS(filtered), "my-teams-wc26.ics");
    } finally {
      setDownloading(false);
    }
  }

  return (
    <div className="rounded-xl border border-amber-100 bg-amber-50/40 p-4 mt-4 space-y-3">
      <p className="text-sm font-semibold text-zinc-900 flex items-center gap-2">
        <Bell size={16} className="text-amber-600" />
        Stay on top of your teams
      </p>
      <p className="text-xs text-zinc-500 leading-relaxed">
        Sync fixtures to your calendar or request a daily email digest when it launches.
      </p>
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={handleCalendar}
          disabled={downloading}
          className="inline-flex items-center gap-1.5 rounded-lg bg-white border border-zinc-200 px-3 py-2 text-xs font-semibold text-zinc-700 hover:border-blue-200 hover:text-blue-700 transition-colors disabled:opacity-50"
        >
          <CalendarPlus size={14} />
          {downloading ? "Preparing…" : "Add to calendar"}
        </button>
        <a
          href={digestMailto}
          className="inline-flex items-center gap-1.5 rounded-lg bg-white border border-zinc-200 px-3 py-2 text-xs font-semibold text-zinc-700 hover:border-violet-200 hover:text-violet-700 transition-colors"
        >
          <Mail size={14} />
          Request daily digest
        </a>
      </div>
    </div>
  );
}
