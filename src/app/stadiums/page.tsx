import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { StadiumVenueCard } from "@/components/StadiumVenueCard";
import { createPageMetadata } from "@/lib/seo";
import { getAllVenues } from "@/lib/venues";

const COUNTRY_FLAGS: Record<string, string> = {
  Mexico: "🇲🇽",
  USA: "🇺🇸",
  Canada: "🇨🇦",
};

export const metadata = createPageMetadata({
  title: "World Cup 2026 Stadiums - All 16 Venues & Capacities",
  description:
    "Every FIFA World Cup 2026 stadium - Estadio Azteca, MetLife Stadium, SoFi Stadium, BC Place, and all 16 host venues with cities and capacities.",
  path: "/stadiums",
  keywords: [
    "World Cup 2026 stadiums",
    "World Cup venues",
    "MetLife Stadium final",
    "Estadio Azteca",
    "SoFi Stadium World Cup",
  ],
});

export default function StadiumsPage() {
  const venues = getAllVenues();
  const byCountry = ["Mexico", "USA", "Canada"] as const;

  return (
    <div className="space-y-8">
      <div className="card-surface rounded-2xl overflow-hidden">
        <div className="host-stripe" />
        <div className="p-5 sm:p-6">
          <h1 className="section-title text-2xl sm:text-3xl">World Cup 2026 Stadiums</h1>
          <p className="text-sm text-zinc-500 mt-2 max-w-2xl leading-relaxed">
            {venues.length} venues across Mexico, the United States, and Canada - tap a stadium
            for capacity, location, and the full match schedule at that venue.
          </p>
        </div>
      </div>

      {byCountry.map((country) => {
        const countryVenues = venues.filter((v) => v.country === country);
        if (countryVenues.length === 0) return null;

        return (
          <section key={country}>
            <h2 className="section-title mb-4 text-base flex items-center gap-2">
              <span className="text-xl">{COUNTRY_FLAGS[country]}</span>
              {country}
              <span className="text-xs font-normal text-zinc-400">
                ({countryVenues.length} venues)
              </span>
            </h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {countryVenues.map((venue) => (
                <StadiumVenueCard key={`${venue.name}-${venue.city}`} venue={venue} />
              ))}
            </div>
          </section>
        );
      })}

      <Link
        href="/hosts"
        className="card-surface rounded-2xl p-5 flex items-center justify-between gap-4 hover:shadow-md transition-all group"
      >
        <div>
          <h2 className="font-bold text-zinc-900 group-hover:text-blue-600 transition-colors">
            Host nations guide
          </h2>
          <p className="text-sm text-zinc-500 mt-1">Mexico, USA & Canada - cities and mascots</p>
        </div>
        <ArrowRight size={18} className="text-zinc-300 group-hover:text-blue-600 shrink-0" />
      </Link>
    </div>
  );
}
