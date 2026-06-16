import Link from "next/link";
import { Target, Shield, ChevronRight, User, Activity, Sparkles, BookOpen, Trophy } from "lucide-react";
import { getTeam } from "@/lib/data";
import { getPlayerPath } from "@/lib/espn/player-profile";
import type { PlayerCountrySection, PlayerListItem, PlayerWorldCupProfile } from "@/lib/types";

export function PlayerPageView({ player }: { player: PlayerWorldCupProfile }) {
  const team = getTeam(player.teamCode, player.teamName);
  const rich = player.richProfile;

  const personalInfo = [
    { label: "Age", value: player.age > 0 ? String(player.age) : undefined },
    { label: "Date of Birth", value: player.dateOfBirth },
    { label: "Height", value: player.displayHeight },
    { label: "Weight", value: player.displayWeight },
    { label: "Nationality", value: player.nationality },
    { label: "Club", value: player.club },
    { label: "Born", value: player.birthPlace },
  ].filter((item) => item.value);

  return (
    <div className="space-y-6">
      <div className="card-surface rounded-2xl overflow-hidden">
        <div className="host-stripe" />
        <div className="p-5 sm:p-6">
          <div className="flex items-start gap-4">
            <div className="flex h-24 w-24 sm:h-28 sm:w-28 items-center justify-center rounded-2xl bg-zinc-50 border border-zinc-100 shrink-0 overflow-hidden">
              {player.headshot ? (
                <img src={player.headshot} alt="" className="h-full w-full object-cover" />
              ) : (
                <span className="text-4xl">{player.flag}</span>
              )}
            </div>
            <div className="min-w-0 flex-1">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-900">{player.name}</h1>
              <p className="text-sm text-zinc-500 mt-1">
                {player.position}
                {player.number > 0 && ` · #${player.number}`}
                {" · "}
                <Link href={`/teams/${player.teamCode}`} className="text-blue-600 hover:underline">
                  {team.flag} {team.name}
                </Link>
              </p>
              {player.club && (
                <p className="text-sm text-zinc-500 mt-1 flex items-center gap-2">
                  {player.clubLogo && (
                    <img src={player.clubLogo} alt="" className="h-4 w-4 object-contain" />
                  )}
                  {player.club}
                </p>
              )}
              <p className="text-sm text-zinc-600 mt-3 leading-relaxed">
                {rich?.overview[0] ?? player.bio}
              </p>
              {rich?.hasEditorial && (
                <span className="inline-flex items-center gap-1 mt-2 rounded-full bg-violet-50 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-violet-700">
                  <Sparkles size={11} /> Featured profile
                </span>
              )}
              {player.espnId && (
                <a
                  href={`https://www.espn.com/soccer/player/_/id/${player.espnId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block mt-3 text-sm text-blue-600 hover:underline"
                >
                  View on ESPN →
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      {rich && rich.badges.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {rich.badges.map((badge) => (
            <span
              key={badge.label}
              className={`rounded-full px-3 py-1 text-xs font-semibold ${
                badge.highlight
                  ? "bg-[var(--wc-usa-light)] text-[var(--wc-usa)]"
                  : "bg-zinc-100 text-zinc-700"
              }`}
            >
              {badge.label}
            </span>
          ))}
        </div>
      )}

      {rich && rich.overview.length > 1 && (
        <section>
          <h2 className="section-title mb-4 text-base flex items-center gap-2">
            <BookOpen size={18} className="text-[var(--wc-usa)]" />
            Profile
          </h2>
          <div className="card-surface rounded-2xl p-5 space-y-3">
            {rich.overview.map((paragraph) => (
              <p key={paragraph} className="text-sm text-zinc-600 leading-relaxed">
                {paragraph}
              </p>
            ))}
          </div>
        </section>
      )}

      {rich?.playStyle && (
        <section>
          <h2 className="section-title mb-4 text-base">How they play</h2>
          <div className="card-surface rounded-2xl p-5">
            <p className="text-sm text-zinc-600 leading-relaxed">{rich.playStyle}</p>
          </div>
        </section>
      )}

      {rich?.journey && rich.journey.length > 0 && (
        <section>
          <h2 className="section-title mb-4 text-base">Career journey</h2>
          <div className="card-surface rounded-2xl p-5 space-y-3">
            {rich.journey.map((step) => (
              <p key={step} className="text-sm text-zinc-600 leading-relaxed pl-3 border-l-2 border-blue-200">
                {step}
              </p>
            ))}
          </div>
        </section>
      )}

      {(rich?.highlights?.length || rich?.records?.length) && (
        <section>
          <h2 className="section-title mb-4 text-base flex items-center gap-2">
            <Trophy size={18} className="text-amber-500" />
            Notable facts
          </h2>
          <div className="card-surface rounded-2xl p-5 space-y-2">
            {[...(rich.highlights ?? []), ...(rich.records ?? [])].map((fact) => (
              <p key={fact} className="text-sm text-zinc-600 leading-relaxed flex gap-2">
                <span className="text-amber-500 shrink-0">•</span>
                <span>{fact}</span>
              </p>
            ))}
          </div>
        </section>
      )}

      {personalInfo.length > 0 && (
        <section>
          <h2 className="section-title mb-4 text-base flex items-center gap-2">
            <User size={18} className="text-[var(--wc-usa)]" />
            Personal Info
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {personalInfo.map((item) => (
              <div key={item.label} className="card-surface rounded-xl px-4 py-3">
                <p className="text-[10px] text-zinc-400 uppercase tracking-wider font-semibold">
                  {item.label}
                </p>
                <p className="text-sm font-semibold text-zinc-900 mt-1">{item.value}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {[
          { label: "Goals", value: player.worldCupGoals, icon: Target, highlight: true },
          { label: "Matches", value: player.matchesPlayed, icon: Shield },
          { label: "Yellow", value: player.yellowCards },
          { label: "Red", value: player.redCards },
        ].map((stat) => (
          <div
            key={stat.label}
            className={`rounded-xl px-3 py-4 text-center card-surface ${
              stat.highlight ? "bg-[var(--wc-usa-light)] border-[var(--wc-usa)]/15" : ""
            }`}
          >
            <p className={`text-2xl font-extrabold tabular-nums ${stat.highlight ? "text-[var(--wc-usa)]" : "text-zinc-900"}`}>
              {stat.value}
            </p>
            <p className="text-[10px] text-zinc-400 uppercase tracking-wider font-semibold mt-1">
              {stat.label}
            </p>
          </div>
        ))}
      </div>

      {player.seasonStats.length > 0 && (
        <section>
          <h2 className="section-title mb-4 text-base">Club Season Stats</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {player.seasonStats.slice(0, 8).map((stat) => (
              <div key={stat.name} className="card-surface rounded-xl px-3 py-3 text-center">
                <p className="text-xl font-extrabold tabular-nums text-zinc-900">{stat.displayValue}</p>
                <p className="text-[10px] text-zinc-400 uppercase tracking-wider font-semibold mt-1">
                  {stat.name}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {player.goals.length > 0 && (
        <section>
          <h2 className="section-title mb-4 text-base">World Cup Goals</h2>
          <div className="space-y-2">
            {player.goals.map((goal, index) => (
              <Link
                key={`${goal.matchId}-${goal.minute}-${index}`}
                href={`/match/${goal.matchId}`}
                className="flex items-center justify-between gap-3 card-surface rounded-xl px-4 py-3 hover:border-blue-200 transition-colors group"
              >
                <div className="min-w-0">
                  <p className="font-semibold text-zinc-900">
                    {goal.minute}&apos; vs {goal.opponent}
                  </p>
                  <p className="text-xs text-zinc-500 mt-0.5 truncate">{goal.description}</p>
                  {goal.assist && (
                    <p className="text-xs text-zinc-400 mt-0.5">Assist: {goal.assist}</p>
                  )}
                </div>
                <ChevronRight size={16} className="text-zinc-300 group-hover:text-blue-500 shrink-0" />
              </Link>
            ))}
          </div>
        </section>
      )}

      {player.appearances.length > 0 && (
        <section>
          <h2 className="section-title mb-4 text-base">World Cup Matches</h2>
          <div className="card-surface rounded-2xl overflow-hidden divide-y divide-zinc-50">
            {player.appearances.map((app) => (
              <Link
                key={app.matchId}
                href={`/match/${app.matchId}`}
                className="flex items-center justify-between gap-3 px-4 py-3 hover:bg-zinc-50 transition-colors"
              >
                <div>
                  <p className="font-medium text-zinc-900">vs {app.opponent}</p>
                  <p className="text-xs text-zinc-400 mt-0.5">
                    {app.date} · {app.started ? "Started" : "Sub"}
                  </p>
                </div>
                <ChevronRight size={14} className="text-zinc-300" />
              </Link>
            ))}
          </div>
        </section>
      )}

      {player.recentMatches.length > 0 && (
        <section>
          <h2 className="section-title mb-4 text-base flex items-center gap-2">
            <Activity size={18} className="text-[var(--wc-usa)]" />
            Recent Club Performances
          </h2>
          <div className="card-surface rounded-2xl overflow-hidden divide-y divide-zinc-50">
            {player.recentMatches.map((match) => (
              <div
                key={match.eventId}
                className="flex items-center justify-between gap-3 px-4 py-3"
              >
                <div className="min-w-0">
                  <p className="font-medium text-zinc-900">
                    vs {match.opponent}
                    {match.score && (
                      <span className="text-zinc-500 font-normal"> · {match.score}</span>
                    )}
                  </p>
                  <p className="text-xs text-zinc-400 mt-0.5">
                    {match.date}
                    {match.competition && ` · ${match.competition}`}
                    {match.result && ` · ${match.result === "W" ? "Win" : match.result === "L" ? "Loss" : "Draw"}`}
                  </p>
                </div>
                <div className="text-right shrink-0">
                  {match.goals > 0 && (
                    <p className="text-sm font-bold text-[var(--wc-usa)]">{match.goals}G</p>
                  )}
                  {match.assists > 0 && (
                    <p className="text-xs text-zinc-500">{match.assists}A</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

export function PlayerSquadCard({ player }: { player: PlayerListItem }) {
  return (
    <Link
      href={getPlayerPath(player)}
      className="card-surface rounded-xl p-3 flex items-center gap-3 hover:border-blue-200 hover:shadow-sm transition-all group"
    >
      <div className="h-10 w-10 rounded-lg bg-zinc-50 border border-zinc-100 shrink-0 overflow-hidden flex items-center justify-center">
        {player.headshot ? (
          <img src={player.headshot} alt="" className="h-full w-full object-cover" />
        ) : (
          <span className="text-lg">{player.flag}</span>
        )}
      </div>
      <div className="min-w-0 flex-1">
        <p className="font-semibold text-sm text-zinc-900 group-hover:text-blue-600 transition-colors truncate">
          {player.name}
        </p>
        <p className="text-xs text-zinc-500 mt-0.5 truncate">
          {player.position}
          {player.number > 0 && ` · #${player.number}`}
          {player.goals > 0 && (
            <span className="text-[var(--wc-usa)] font-semibold"> · {player.goals}G</span>
          )}
        </p>
      </div>
      <ChevronRight size={14} className="text-zinc-300 group-hover:text-blue-500 shrink-0" />
    </Link>
  );
}

export function PlayersByCountry({ sections }: { sections: PlayerCountrySection[] }) {
  return (
    <div className="space-y-8">
      {sections.map((section) => (
        <section key={section.teamCode} id={section.teamCode}>
          <div className="flex items-center justify-between gap-3 mb-4">
            <h2 className="section-title text-base flex items-center gap-2">
              <span className="text-xl">{section.flag}</span>
              <Link href={`/teams/${section.teamCode}`} className="hover:text-blue-600 transition-colors">
                {section.teamName}
              </Link>
            </h2>
            <span className="text-xs text-zinc-400 font-medium tabular-nums">
              {section.players.length} players
            </span>
          </div>
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {section.players.map((player) => (
              <PlayerSquadCard key={player.id} player={player} />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}

export function PlayerListCard({ player }: { player: PlayerListItem }) {
  return (
    <div className="card-surface rounded-xl p-4 hover:border-blue-200 hover:shadow-sm transition-all group">
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0 flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-zinc-50 border border-zinc-100 shrink-0 overflow-hidden flex items-center justify-center">
            {player.headshot ? (
              <img src={player.headshot} alt="" className="h-full w-full object-cover" />
            ) : (
              <span className="text-lg">{player.flag}</span>
            )}
          </div>
          <div className="min-w-0">
            <Link
              href={getPlayerPath(player)}
              className="font-bold text-zinc-900 group-hover:text-blue-600 transition-colors truncate block"
            >
              {player.name}
            </Link>
            <p className="text-xs text-zinc-500 mt-0.5">
              {player.flag}{" "}
              <Link href={`/teams/${player.teamCode}`} className="hover:text-blue-600">
                {player.teamName}
              </Link>
            </p>
          </div>
        </div>
        <Link
          href={getPlayerPath(player)}
          className="text-2xl font-extrabold tabular-nums text-[var(--wc-usa)] shrink-0 hover:opacity-80"
        >
          {player.goals}
        </Link>
      </div>
    </div>
  );
}
