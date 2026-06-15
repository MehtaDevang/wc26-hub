import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, MapPin, Plane, Train, Sun, PartyPopper, Building2 } from "lucide-react";
import { AdBanner } from "@/components/AdBanner";
import { createPageMetadata } from "@/lib/seo";
import { getAllCityGuides, getCityGuide } from "@/lib/city-guides";
import { getVenueBySlug } from "@/lib/venues";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getAllCityGuides().map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const guide = getCityGuide(slug);
  if (!guide) {
    return createPageMetadata({
      title: "City Not Found",
      description: "Host city guide not found.",
      path: `/cities/${slug}`,
      noIndex: true,
    });
  }
  return createPageMetadata({
    title: `${guide.city} World Cup 2026 Fan Travel Guide`,
    description: `How to get to World Cup 2026 matches in ${guide.city}, ${guide.country}. Airport (${guide.airportCode}), stadium transit, fan zones, weather, and travel tips.`,
    path: `/cities/${guide.slug}`,
    keywords: [
      `${guide.city} World Cup travel`,
      `${guide.city} stadium guide`,
      `World Cup 2026 ${guide.city}`,
      guide.airportCode,
    ],
  });
}

export default async function CityGuidePage({ params }: PageProps) {
  const { slug } = await params;
  const guide = getCityGuide(slug);
  if (!guide) notFound();

  const stadiums = guide.stadiumSlugs
    .map((s) => getVenueBySlug(s))
    .filter(Boolean);

  return (
    <div className="space-y-8">
      <Link
        href="/cities"
        className="inline-flex items-center gap-2 text-sm text-zinc-500 hover:text-zinc-900 transition-colors"
      >
        <ArrowLeft size={16} />
        All city guides
      </Link>

      <div className="card-elevated rounded-2xl overflow-hidden">
        <div className="host-stripe" />
        <div className="p-6 sm:p-8">
          <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 mb-2">
            {guide.flag} {guide.country} · {guide.timezone}
          </p>
          <h1 className="section-title text-2xl sm:text-3xl">{guide.city}</h1>
          <p className="text-sm text-zinc-500 mt-2 max-w-2xl leading-relaxed">
            Your fan travel guide for World Cup 2026 in {guide.city} — from touchdown to kickoff.
          </p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <section className="card-surface rounded-2xl p-5">
          <h2 className="font-bold text-zinc-900 flex items-center gap-2 mb-3">
            <Plane size={18} className="text-blue-600" />
            Airport
          </h2>
          <p className="text-sm text-zinc-600 leading-relaxed">
            <span className="font-semibold text-zinc-800">{guide.airportCode}</span> — {guide.airport}
          </p>
        </section>

        <section className="card-surface rounded-2xl p-5">
          <h2 className="font-bold text-zinc-900 flex items-center gap-2 mb-3">
            <Train size={18} className="text-emerald-600" />
            Stadium transit
          </h2>
          <p className="text-sm text-zinc-600 leading-relaxed">{guide.transitToStadium}</p>
        </section>

        <section className="card-surface rounded-2xl p-5">
          <h2 className="font-bold text-zinc-900 flex items-center gap-2 mb-3">
            <MapPin size={18} className="text-violet-600" />
            Getting around
          </h2>
          <p className="text-sm text-zinc-600 leading-relaxed">{guide.gettingAround}</p>
        </section>

        <section className="card-surface rounded-2xl p-5">
          <h2 className="font-bold text-zinc-900 flex items-center gap-2 mb-3">
            <PartyPopper size={18} className="text-amber-600" />
            Fan zones
          </h2>
          <p className="text-sm text-zinc-600 leading-relaxed">{guide.fanZone}</p>
        </section>

        <section className="card-surface rounded-2xl p-5 sm:col-span-2">
          <h2 className="font-bold text-zinc-900 flex items-center gap-2 mb-3">
            <Sun size={18} className="text-orange-500" />
            Weather in June
          </h2>
          <p className="text-sm text-zinc-600 leading-relaxed">{guide.weatherNote}</p>
        </section>
      </div>

      {stadiums.length > 0 && (
        <section>
          <h2 className="section-title text-base mb-4 flex items-center gap-2">
            <Building2 size={18} className="text-zinc-500" />
            Stadiums in {guide.city}
          </h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {guide.stadiumSlugs.map((slug) => {
              const venue = getVenueBySlug(slug);
              if (!venue) return null;
              return (
                <Link
                  key={slug}
                  href={`/stadiums/${slug}`}
                  className="card-surface rounded-xl p-4 hover:shadow-md hover:border-blue-200 transition-all group"
                >
                  <p className="font-bold text-zinc-900 group-hover:text-blue-600 transition-colors">
                    {venue.name}
                  </p>
                  {venue.capacity > 0 && (
                    <p className="text-xs text-zinc-400 mt-1">
                      {venue.capacity.toLocaleString()} capacity
                      {venue.highlight ? ` · ${venue.highlight}` : ""}
                    </p>
                  )}
                </Link>
              );
            })}
          </div>
        </section>
      )}

      <section className="card-surface rounded-2xl p-6">
        <h2 className="font-bold text-zinc-900 mb-4">Travel tips</h2>
        <ul className="space-y-2">
          {guide.tips.map((tip) => (
            <li key={tip} className="text-sm text-zinc-600 leading-relaxed flex gap-2">
              <span className="text-blue-500 shrink-0">•</span>
              {tip}
            </li>
          ))}
        </ul>
      </section>

      <AdBanner placement="inline" />

      <div className="flex flex-wrap gap-3">
        <Link href="/hosts" className="btn-usa inline-flex items-center gap-2 px-5 py-2.5 text-sm">
          Host nations
        </Link>
        <Link href="/stadiums" className="btn-primary inline-flex items-center gap-2 px-5 py-2.5 text-sm">
          All stadiums
        </Link>
      </div>
    </div>
  );
}
