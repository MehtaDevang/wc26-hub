import Link from "next/link";
import { ArrowRight, Building2, MapPin } from "lucide-react";
import { AdBanner } from "@/components/AdBanner";
import { WC26MascotIcon } from "@/components/mascots/WC26Mascots";
import { createPageMetadata } from "@/lib/seo";
import { getHostNations } from "@/lib/hosts";
import { getVenueSlug } from "@/lib/venues";
import { MASCOTS, type MascotId } from "@/lib/wc26-brand";

const MASCOT_IDS: Record<string, MascotId> = {
  Mexico: "zayu",
  USA: "clutch",
  Canada: "maple",
};

export const metadata = createPageMetadata({
  title: "World Cup 2026 Host Nations — Mexico, USA & Canada",
  description:
    "FIFA World Cup 2026 host countries — Mexico, United States, and Canada. Host cities, stadiums, mascots, and venue guide for the first tri-nation tournament.",
  path: "/hosts",
  keywords: [
    "World Cup 2026 hosts",
    "USA Mexico Canada World Cup",
    "host cities",
    "tri-nation World Cup",
  ],
});

export default function HostsPage() {
  const hosts = getHostNations();

  return (
    <div className="space-y-8">
      <div className="card-surface rounded-2xl overflow-hidden">
        <div className="host-stripe" />
        <div className="p-5 sm:p-6">
          <h1 className="section-title text-2xl sm:text-3xl">Host Nations</h1>
          <p className="text-sm text-zinc-500 mt-2 max-w-2xl leading-relaxed">
            FIFA World Cup 2026 is the first edition hosted across three countries — 48 teams, 104
            matches, and 16 stadiums from Vancouver to Mexico City.
          </p>
        </div>
      </div>

      <AdBanner placement="inline" />

      <div className="grid gap-6 lg:grid-cols-3">
        {hosts.map((host) => {
          const mascotId = MASCOT_IDS[host.country];
          const mascot = mascotId ? MASCOTS[mascotId] : null;

          return (
            <section
              key={host.id}
              className="card-elevated rounded-2xl overflow-hidden flex flex-col"
            >
              <div
                className="h-1.5"
                style={{ background: host.color }}
              />
              <div className="p-5 sm:p-6 flex flex-col flex-1">
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div>
                    <p className="text-3xl mb-1">{host.flag}</p>
                    <h2 className="text-xl font-extrabold text-zinc-900">{host.country}</h2>
                    <p className="text-xs text-zinc-400 mt-1 uppercase tracking-wider font-semibold">
                      {host.stadiums.length} stadium{host.stadiums.length !== 1 ? "s" : ""} ·{" "}
                      {host.cities.length} cit{host.cities.length !== 1 ? "ies" : "y"}
                    </p>
                  </div>
                  {mascot && mascotId && (
                    <div
                      className="rounded-xl p-2 border shrink-0"
                      style={{
                        background: host.colorLight,
                        borderColor: `${host.color}22`,
                      }}
                    >
                      <WC26MascotIcon id={mascotId} size={48} />
                    </div>
                  )}
                </div>

                {mascot && (
                  <p className="text-sm text-zinc-600 mb-4">
                    <span className="font-semibold text-zinc-900">{mascot.name}</span>
                    <span className="text-zinc-400"> · </span>
                    {host.mascotTagline}
                  </p>
                )}

                <p className="text-sm text-zinc-500 leading-relaxed mb-4">{host.blurb}</p>

                <div className="mb-4">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 mb-2 flex items-center gap-1">
                    <MapPin size={12} />
                    Host cities
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {host.cities.map((city) => (
                      <span
                        key={city}
                        className="rounded-full px-2.5 py-1 text-xs font-medium border"
                        style={{
                          background: host.colorLight,
                          borderColor: `${host.color}22`,
                          color: host.color,
                        }}
                      >
                        {city}
                      </span>
                    ))}
                  </div>
                </div>

                <ul className="space-y-2 text-sm border-t border-zinc-100 pt-4 mt-auto">
                  {host.stadiums.map((stadium) => (
                    <li key={stadium.name}>
                      <Link
                        href={`/stadiums/${getVenueSlug(stadium)}`}
                        className="flex items-center gap-2 text-zinc-600 hover:text-blue-600 transition-colors group/stadium"
                      >
                        <Building2 size={14} className="shrink-0 text-zinc-400 group-hover/stadium:text-blue-500" />
                        <span className="font-medium text-zinc-800 group-hover/stadium:text-blue-600">
                          {stadium.name}
                        </span>
                        <span className="text-zinc-400">· {stadium.city}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </section>
          );
        })}
      </div>

      <Link
        href="/cities"
        className="card-surface rounded-2xl p-5 flex items-center justify-between gap-4 hover:shadow-md transition-all group"
      >
        <div>
          <h2 className="font-bold text-zinc-900 group-hover:text-blue-600 transition-colors">
            Host city travel guides
          </h2>
          <p className="text-sm text-zinc-500 mt-1">
            Airports, stadium transit, fan zones & tips for every host city
          </p>
        </div>
        <ArrowRight size={18} className="text-zinc-300 group-hover:text-blue-600 shrink-0" />
      </Link>

      <Link
        href="/stadiums"
        className="card-surface rounded-2xl p-5 flex items-center justify-between gap-4 hover:shadow-md transition-all group"
      >
        <div>
          <h2 className="font-bold text-zinc-900 group-hover:text-blue-600 transition-colors">
            All 16 World Cup stadiums
          </h2>
          <p className="text-sm text-zinc-500 mt-1">Capacities, cities, and venue details</p>
        </div>
        <ArrowRight size={18} className="text-zinc-300 group-hover:text-blue-600 shrink-0" />
      </Link>
    </div>
  );
}
