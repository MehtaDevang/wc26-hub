import Link from "next/link";
import { Radio, CalendarCheck, CalendarClock, Trophy, ArrowRight } from "lucide-react";
import { WC26PageBanner } from "@/components/WC26Brand";
import { AdBanner } from "@/components/AdBanner";
import { getTeam } from "@/lib/data";
import { createPageMetadata } from "@/lib/seo";
import { getMatchesByParams } from "@/lib/espn/services";
import { getTournamentLeaders } from "@/lib/espn/tournament-stats";
import { getServerTimezone, formatTodayLabel } from "@/lib/timezone";
import { buildDailyDigest, type DigestMatch } from "@/lib/daily-digest";

export const metadata = createPageMetadata({
  title: "Today at the World Cup 2026 - Daily Results & Fixtures Digest",
  description:
    "Your daily FIFA World Cup 2026 digest - yesterday's results, today's fixtures and kickoff times, live matches, and the current Golden Boot leader, updated automatically.",
  path: "/daily",
  keywords: [
    "World Cup today",
    "World Cup 2026 results today",
    "World Cup daily digest",
    "World Cup fixtures today",
  ],
});

export const revalidate = 120;
export const maxDuration = 60;

function MatchRow({ item, live }: { item: DigestMatch; live?: boolean }) {
  const { match, line } = item;
  const home = getTeam(match.home, match.homeName, match.homeLogo);
  const away = getTeam(match.away, match.awayName, match.awayLogo);

  return (
    <Link
      href={`/match/${match.id}${live ? "?tab=live" : ""}`}
      className="flex items-center gap-3 px-4 py-3 hover:bg-zinc-50/80 transition-colors group"
    >
      <span className="flex items-center gap-1 shrink-0 text-lg">
        <span aria-hidden>{home.flag}</span>
        <span aria-hidden>{away.flag}</span>
      </span>
      <p className="min-w-0 flex-1 text-sm text-zinc-800 group-hover:text-blue-600 transition-colors truncate">
        {line}
      </p>
      {live && (
        <span className="relative flex h-2 w-2 shrink-0">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-500 opacity-60" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-red-600" />
        </span>
      )}
    </Link>
  );
}

function DigestCard({
  title,
  icon: Icon,
  iconClass,
  items,
  live,
  empty,
}: {
  title: string;
  icon: typeof Radio;
  iconClass: string;
  items: DigestMatch[];
  live?: boolean;
  empty: string;
}) {
  return (
    <section className="card-surface rounded-2xl overflow-hidden">
      <h2 className="flex items-center gap-2 px-4 py-3 border-b border-zinc-100 bg-zinc-50/60 text-sm font-bold text-zinc-900">
        <Icon size={16} className={iconClass} />
        {title}
      </h2>
      {items.length === 0 ? (
        <p className="px-4 py-6 text-sm text-zinc-400 text-center">{empty}</p>
      ) : (
        <div className="divide-y divide-zinc-50">
          {items.map((item) => (
            <MatchRow key={item.match.id} item={item} live={live} />
          ))}
        </div>
      )}
    </section>
  );
}

export default async function DailyDigestPage() {
  const timeZone = await getServerTimezone();
  const [matches, leaders] = await Promise.all([
    getMatchesByParams({ range: "recent", timeZone }).catch(() => []),
    getTournamentLeaders().catch(() => null),
  ]);

  const digest = buildDailyDigest(matches, leaders, timeZone);
  const leader = digest.goldenBoot;

  return (
    <div className="space-y-6">
      <WC26PageBanner
        title="Today at the World Cup"
        subtitle={formatTodayLabel(timeZone)}
      />
      <AdBanner placement="inline" />

      {digest.liveNow.length > 0 && (
        <DigestCard
          title="Live now"
          icon={Radio}
          iconClass="text-red-600"
          items={digest.liveNow}
          live
          empty="No live matches right now."
        />
      )}

      <DigestCard
        title="Today's fixtures"
        icon={CalendarClock}
        iconClass="text-blue-600"
        items={digest.todayFixtures}
        empty="No more fixtures scheduled for today."
      />

      <DigestCard
        title="Yesterday's results"
        icon={CalendarCheck}
        iconClass="text-emerald-600"
        items={digest.yesterdayResults}
        empty="No matches were played yesterday."
      />

      {leader && (
        <Link
          href="/leaders"
          className="card-surface group flex items-center gap-3 rounded-2xl px-5 py-4 hover:border-amber-200 transition-colors"
        >
          <Trophy size={18} className="text-[var(--wc-gold)] shrink-0" />
          <div className="min-w-0 flex-1">
            <p className="text-[10px] font-bold uppercase tracking-wider text-amber-700/80">
              Golden Boot leader
            </p>
            <p className="text-sm font-bold text-zinc-900 truncate group-hover:text-blue-600 transition-colors">
              {leader.name} · {leader.goals} {leader.goals === 1 ? "goal" : "goals"}
            </p>
          </div>
          <ArrowRight size={16} className="text-zinc-400 shrink-0" />
        </Link>
      )}

      <p className="text-center text-sm text-zinc-500">
        <Link href="/fixtures" className="text-blue-600 hover:underline font-medium">
          All fixtures →
        </Link>
        {" · "}
        <Link href="/leaders" className="text-blue-600 hover:underline font-medium">
          Stat leaders →
        </Link>
      </p>
    </div>
  );
}
