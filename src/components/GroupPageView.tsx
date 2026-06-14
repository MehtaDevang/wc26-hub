import Link from "next/link";
import { Calendar, ChevronRight } from "lucide-react";
import { getTeam } from "@/lib/data";
import { resolveTeamCode } from "@/lib/team-lookup";
import { StandingsTeamCell } from "@/components/GroupStandingsTable";
import { MatchKickoffTime } from "@/components/MatchKickoffTime";
import { ShareButtons } from "@/components/ShareButtons";
import { buildGroupSharePayload } from "@/lib/share";
import type { GroupPageData } from "@/lib/types";

function GroupFixtureRow({
  match,
}: {
  match: GroupPageData["matches"][number];
}) {
  const home = getTeam(match.home, match.homeName, match.homeLogo);
  const away = getTeam(match.away, match.awayName, match.awayLogo);
  const hasScore = match.status !== "upcoming";

  return (
    <div className="fixture-row group">
      <div className="row-span-2 self-center text-center">
        <MatchKickoffTime match={match} className="text-[10px] text-zinc-400 tabular-nums" />
        {match.status === "finished" && (
          <span className="mt-0.5 block text-[10px] font-bold text-zinc-400 uppercase">FT</span>
        )}
      </div>

      <div className="col-start-2 row-start-1 min-w-0">
        <Link
          href={`/teams/${match.home}`}
          className="flex items-center gap-2 min-w-0 hover:text-blue-600"
        >
          {home.logo ? (
            <img src={home.logo} alt="" className="h-5 w-5 object-contain shrink-0" />
          ) : (
            <span className="text-sm shrink-0">{home.flag}</span>
          )}
          <span className="text-sm font-medium leading-snug">{home.name}</span>
        </Link>
      </div>

      <div className="col-start-2 row-start-2 min-w-0">
        <Link
          href={`/teams/${match.away}`}
          className="flex items-center gap-2 min-w-0 hover:text-blue-600"
        >
          {away.logo ? (
            <img src={away.logo} alt="" className="h-5 w-5 object-contain shrink-0" />
          ) : (
            <span className="text-sm shrink-0">{away.flag}</span>
          )}
          <span className="text-sm font-medium leading-snug">{away.name}</span>
        </Link>
      </div>

      <Link
        href={`/match/${match.id}`}
        className="col-start-3 row-span-2 self-center justify-self-center hover:opacity-80 transition-opacity"
      >
        {hasScore ? (
          <span className="fixture-score">
            <span className="fixture-score-home tabular-nums">{match.homeScore}</span>
            <span className="fixture-score-sep" aria-hidden>–</span>
            <span className="fixture-score-away tabular-nums">{match.awayScore}</span>
          </span>
        ) : (
          <span className="text-xs font-semibold text-zinc-400">vs</span>
        )}
      </Link>
    </div>
  );
}

export function GroupPageView({ data }: { data: GroupPageData }) {
  const finished = data.matches.filter((m) => m.status === "finished").length;
  const upcoming = data.matches.filter((m) => m.status === "upcoming").length;
  const groupLetter = data.label.replace(/^Group\s+/i, "");
  const share = buildGroupSharePayload(groupLetter, data.label);

  return (
    <div className="space-y-6">
      <div className="card-surface rounded-2xl overflow-hidden">
        <div className="host-stripe" />
        <div className="p-5 sm:p-6">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-900">
            World Cup 2026 {data.label}
          </h1>
          <p className="text-sm text-zinc-500 mt-2">
            Live standings, fixtures, and results for {data.label} — {data.matches.length} matches
            {finished > 0 && ` · ${finished} played`}
            {upcoming > 0 && ` · ${upcoming} upcoming`}
          </p>
          <ShareButtons
            url={share.url}
            title={share.title}
            text={share.text}
            label={share.label}
            className="mt-4 justify-start"
          />
        </div>
      </div>

      <section>
        <h2 className="section-title mb-4 text-base">Standings</h2>
        <div className="card-surface rounded-2xl overflow-hidden">
          <div className="px-4 py-3 border-b border-zinc-100 bg-zinc-50/50">
            <p className="text-xs text-zinc-500">Tap a team name to open their World Cup hub</p>
          </div>
          <div className="px-4 pb-2 pt-1 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-[10px] uppercase tracking-wider text-zinc-400 border-b border-zinc-100">
                  <th className="text-left py-2 pr-2 font-semibold">#</th>
                  <th className="text-left py-2 font-semibold">Team</th>
                  <th className="text-center py-2 px-1 font-semibold">Pts</th>
                  <th className="text-center py-2 px-1 font-semibold">GD</th>
                  <th className="w-6" aria-hidden />
                </tr>
              </thead>
              <tbody>
                {data.standings.rows.map((row) => {
                  const code = row.teamCode ?? resolveTeamCode(row.team) ?? "";
                  return (
                    <tr key={row.team} className="border-b border-zinc-50 last:border-0">
                      <td className="py-3 pr-2 text-zinc-400 font-bold">{row.rank}</td>
                      <td className="py-3 font-semibold text-zinc-900">
                        <Link
                          href={`/teams/${code}`}
                          className="flex items-center gap-2 hover:text-blue-600 transition-colors"
                        >
                          <StandingsTeamCell row={row} />
                        </Link>
                      </td>
                      <td className="py-3 text-center font-bold text-[var(--wc-usa)] tabular-nums">
                        {row.points}
                      </td>
                      <td className="py-3 text-center text-zinc-600 tabular-nums">{row.goalDiff}</td>
                      <td className="py-3 text-right">
                        <ChevronRight size={14} className="text-zinc-300" />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section>
        <h2 className="section-title mb-4 flex items-center gap-2 text-base">
          <Calendar size={18} className="text-blue-600" />
          {data.label} Fixtures
        </h2>
        <div className="card-surface rounded-2xl overflow-hidden">
          {data.matches.length > 0 ? (
            data.matches.map((match) => <GroupFixtureRow key={match.id} match={match} />)
          ) : (
            <p className="text-sm text-zinc-400 text-center py-10">No fixtures listed yet.</p>
          )}
        </div>
      </section>

      <section className="card-surface rounded-2xl p-5">
        <h2 className="section-title mb-3 text-sm">Teams in {data.label}</h2>
        <div className="flex flex-wrap gap-2">
          {data.standings.rows.map((row) => {
            const code = row.teamCode ?? resolveTeamCode(row.team) ?? "";
            const team = getTeam(code, row.team);
            return (
              <Link
                key={row.team}
                href={`/teams/${code}`}
                className="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white px-3 py-1.5 text-sm font-medium text-zinc-800 hover:border-blue-200 hover:text-blue-600 transition-colors"
              >
                <span>{team.flag}</span>
                {team.name}
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}
