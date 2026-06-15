import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  Building2,
  Calendar,
  ExternalLink,
  MapPin,
  Users,
} from "lucide-react";
import { AdBanner } from "@/components/AdBanner";
import { MatchClashRow } from "@/components/MatchBattleGraphic";
import { StadiumVenueMedia } from "@/components/StadiumVenueMedia";
import { JsonLd } from "@/components/JsonLd";
import { createPageMetadata } from "@/lib/seo";
import { getMatchesAtVenue } from "@/lib/venue-matches";
import { getVenueBySlug, getVenueSlug } from "@/lib/venues";
import { getServerTimezone } from "@/lib/timezone";
import { buildBreadcrumbJsonLd } from "@/lib/structured-data";

const COUNTRY_FLAGS: Record<string, string> = {
  Mexico: "🇲🇽",
  USA: "🇺🇸",
  Canada: "🇨🇦",
};

const HOST_LINKS: Record<string, { href: string; label: string }> = {
  Mexico: { href: "/hosts", label: "Mexico host guide" },
  USA: { href: "/hosts", label: "USA host guide" },
  Canada: { href: "/hosts", label: "Canada host guide" },
};

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const { getAllVenues } = await import("@/lib/venues");
  return getAllVenues().map((venue) => ({ slug: getVenueSlug(venue) }));
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const venue = getVenueBySlug(slug);

  if (!venue) {
    return createPageMetadata({
      title: "Stadium Not Found",
      description: "World Cup 2026 stadium page not found.",
      path: `/stadiums/${slug}`,
      noIndex: true,
    });
  }

  return createPageMetadata({
    title: `${venue.name} — World Cup 2026 Venue Guide`,
    description: `${venue.name} in ${venue.city}, ${venue.country} — capacity ${venue.capacity.toLocaleString()}, fixtures, and World Cup 2026 match schedule at this stadium.`,
    path: `/stadiums/${slug}`,
    keywords: [
      venue.name,
      `${venue.name} World Cup`,
      venue.city,
      "World Cup 2026 stadium",
    ],
  });
}

export const revalidate = 300;

export default async function StadiumDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const venue = getVenueBySlug(slug);
  if (!venue) notFound();

  const timeZone = await getServerTimezone();
  const matches = await getMatchesAtVenue(venue, timeZone);

  const live = matches.filter((m) => m.status === "live");
  const upcoming = matches.filter((m) => m.status === "upcoming");
  const finished = matches.filter((m) => m.status === "finished");

  const mapUrl =
    venue.lat && venue.lon
      ? `https://www.google.com/maps/search/?api=1&query=${venue.lat},${venue.lon}`
      : null;

  const hostLink = HOST_LINKS[venue.country];

  return (
    <div className="space-y-8">
      <JsonLd
        data={buildBreadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Stadiums", path: "/stadiums" },
          { name: venue.name, path: `/stadiums/${slug}` },
        ])}
      />

      <Link
        href="/stadiums"
        className="inline-flex items-center gap-2 text-sm text-zinc-500 hover:text-zinc-900 transition-colors"
      >
        <ArrowLeft size={16} />
        All stadiums
      </Link>

      <article className="card-elevated rounded-2xl overflow-hidden">
        <div className="host-stripe" />
        <StadiumVenueMedia venue={venue} className="rounded-none" />
        <div className="p-5 sm:p-8">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            {venue.highlight && (
              <span className="rounded-full bg-amber-50 border border-amber-200 px-3 py-1 text-xs font-bold uppercase tracking-wide text-amber-800">
                {venue.highlight}
              </span>
            )}
            <span className="text-sm text-zinc-500">
              {COUNTRY_FLAGS[venue.country]} {venue.city}, {venue.country}
            </span>
          </div>

          <h1 className="section-title text-2xl sm:text-3xl">{venue.name}</h1>

          {venue.description && (
            <p className="text-sm sm:text-base text-zinc-600 mt-4 max-w-2xl leading-relaxed">
              {venue.description}
            </p>
          )}

          <div className="mt-6 flex flex-wrap gap-4 text-sm">
            {venue.capacity > 0 && (
              <div className="flex items-center gap-2 rounded-xl bg-zinc-50 px-4 py-3">
                <Users size={18} className="text-zinc-400" />
                <div>
                  <p className="font-bold text-zinc-900 tabular-nums">
                    {venue.capacity.toLocaleString()}
                  </p>
                  <p className="text-xs text-zinc-400">Seating capacity</p>
                </div>
              </div>
            )}
            <div className="flex items-center gap-2 rounded-xl bg-zinc-50 px-4 py-3">
              <Calendar size={18} className="text-zinc-400" />
              <div>
                <p className="font-bold text-zinc-900 tabular-nums">{matches.length}</p>
                <p className="text-xs text-zinc-400">World Cup matches</p>
              </div>
            </div>
            <div className="flex items-center gap-2 rounded-xl bg-zinc-50 px-4 py-3">
              <Building2 size={18} className="text-zinc-400" />
              <div>
                <p className="font-bold text-zinc-900">{venue.city}</p>
                <p className="text-xs text-zinc-400">Host city</p>
              </div>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            {mapUrl && (
              <a
                href={mapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary inline-flex items-center gap-2 px-4 py-2 text-sm"
              >
                <MapPin size={15} />
                View on map
                <ExternalLink size={13} className="opacity-60" />
              </a>
            )}
            {hostLink && (
              <Link
                href={hostLink.href}
                className="btn-secondary inline-flex items-center gap-2 px-4 py-2 text-sm"
              >
                {hostLink.label}
              </Link>
            )}
          </div>
        </div>
      </article>

      <AdBanner placement="inline" />

      <section>
        <h2 className="section-title mb-4 text-base flex items-center gap-2">
          <Calendar size={18} className="text-blue-600" />
          Matches at {venue.name}
        </h2>

        {matches.length === 0 ? (
          <p className="text-sm text-zinc-400 text-center py-10 card-surface rounded-2xl">
            No fixtures listed for this venue yet.
          </p>
        ) : (
          <div className="card-elevated overflow-hidden rounded-2xl">
            <div className="host-stripe" />
            <div className="match-clash-list">
              {live.length > 0 && (
                <div>
                  <p className="px-4 pt-3 pb-1 text-[10px] uppercase tracking-widest text-red-500 font-bold">
                    Live
                  </p>
                  {live.map((m) => (
                    <MatchClashRow key={m.id} match={m} />
                  ))}
                </div>
              )}
              {upcoming.length > 0 && (
                <div>
                  <p className="px-4 pt-3 pb-1 text-[10px] uppercase tracking-widest text-zinc-400 font-semibold">
                    Upcoming
                  </p>
                  {upcoming.map((m) => (
                    <MatchClashRow key={m.id} match={m} />
                  ))}
                </div>
              )}
              {finished.length > 0 && (
                <div>
                  <p className="px-4 pt-3 pb-1 text-[10px] uppercase tracking-widest text-zinc-400 font-semibold">
                    Full Time
                  </p>
                  {finished.map((m) => (
                    <MatchClashRow key={m.id} match={m} />
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
