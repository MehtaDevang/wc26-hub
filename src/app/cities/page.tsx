import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { AdBanner } from "@/components/AdBanner";
import { createPageMetadata } from "@/lib/seo";
import { getAllCityGuides } from "@/lib/city-guides";

export const metadata = createPageMetadata({
  title: "World Cup 2026 Host City Travel Guides",
  description:
    "Fan travel guides for every FIFA World Cup 2026 host city — airports, stadium transit, fan zones, weather, and local tips across USA, Mexico, and Canada.",
  path: "/cities",
  keywords: [
    "World Cup 2026 travel",
    "host city guide",
    "fan travel World Cup",
    "stadium transit",
    "World Cup fan zones",
  ],
});

export default function CitiesPage() {
  const cities = getAllCityGuides();
  const byCountry = ["Canada", "Mexico", "USA"].map((country) => ({
    country,
    cities: cities.filter((c) => c.country === country),
  }));

  return (
    <div className="space-y-8">
      <div className="card-surface rounded-2xl overflow-hidden">
        <div className="host-stripe" />
        <div className="p-5 sm:p-6">
          <h1 className="section-title text-2xl sm:text-3xl">Host City Guides</h1>
          <p className="text-sm text-zinc-500 mt-2 max-w-2xl leading-relaxed">
            Plan your World Cup 2026 trip — airports, getting to the stadium, fan zones, and local
            tips for all {cities.length} host cities across North America.
          </p>
        </div>
      </div>

      <AdBanner placement="inline" />

      {byCountry.map(({ country, cities: list }) => (
        <section key={country}>
          <h2 className="text-sm font-bold uppercase tracking-wider text-zinc-400 mb-4">
            {list[0]?.flag} {country}
          </h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {list.map((city) => (
              <Link
                key={city.slug}
                href={`/cities/${city.slug}`}
                className="card-surface rounded-2xl p-5 hover:shadow-md hover:border-blue-200 transition-all group"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-bold text-zinc-900 group-hover:text-blue-600 transition-colors">
                      {city.city}
                    </h3>
                    <p className="text-xs text-zinc-400 mt-1">{city.timezone}</p>
                  </div>
                  <ArrowRight size={16} className="text-zinc-300 group-hover:text-blue-500 shrink-0 mt-1" />
                </div>
                <p className="text-sm text-zinc-500 mt-3 line-clamp-2">{city.gettingAround}</p>
              </Link>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
