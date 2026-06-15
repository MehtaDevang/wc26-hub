import Link from "next/link";
import { ChevronRight, MapPin, Users } from "lucide-react";
import { StadiumVenueMedia } from "@/components/StadiumVenueMedia";
import { getVenueSlug, type VenueMeta } from "@/lib/venues";

const COUNTRY_FLAGS: Record<string, string> = {
  Mexico: "🇲🇽",
  USA: "🇺🇸",
  Canada: "🇨🇦",
};

export function StadiumVenueCard({ venue }: { venue: VenueMeta }) {
  const slug = getVenueSlug(venue);

  return (
    <Link
      href={`/stadiums/${slug}`}
      className="card-elevated rounded-2xl overflow-hidden group hover:shadow-md transition-all hover:-translate-y-0.5"
    >
      <StadiumVenueMedia venue={venue} />
      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-bold text-zinc-900 leading-snug group-hover:text-blue-600 transition-colors">
            {venue.name}
          </h3>
          {venue.highlight && (
            <span className="shrink-0 rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-amber-700">
              {venue.highlight}
            </span>
          )}
        </div>
        <p className="text-sm text-zinc-500 mt-1 flex items-center gap-1">
          <MapPin size={13} className="shrink-0" />
          {COUNTRY_FLAGS[venue.country]} {venue.city}, {venue.country}
        </p>
        {venue.capacity > 0 && (
          <p className="text-sm text-zinc-600 mt-2 flex items-center gap-1.5">
            <Users size={14} className="text-zinc-400" />
            <span className="font-semibold tabular-nums">
              {venue.capacity.toLocaleString()}
            </span>
            <span className="text-zinc-400">capacity</span>
          </p>
        )}
        <p className="mt-3 flex items-center gap-0.5 text-xs font-medium text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity">
          View venue <ChevronRight size={12} />
        </p>
      </div>
    </Link>
  );
}
