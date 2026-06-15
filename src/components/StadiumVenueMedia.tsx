import { Building2 } from "lucide-react";
import type { VenueMeta } from "@/lib/venues";

export function stadiumImageAlt(venue: Pick<VenueMeta, "name" | "city" | "country" | "imageAlt">): string {
  return venue.imageAlt ?? `${venue.name}, ${venue.city}, ${venue.country}`;
}

export function StadiumVenueMedia({
  venue,
  className = "",
}: {
  venue: VenueMeta;
  className?: string;
}) {
  const alt = stadiumImageAlt(venue);

  if (venue.imageUrl) {
    return (
      <div className={`aspect-[16/9] bg-zinc-100 overflow-hidden ${className}`.trim()}>
        <img
          src={venue.imageUrl}
          alt={alt}
          className="h-full w-full object-cover"
        />
      </div>
    );
  }

  return (
    <div
      className={`aspect-[16/9] bg-gradient-to-br from-zinc-50 to-zinc-100 flex flex-col items-center justify-center gap-2 px-4 text-center ${className}`.trim()}
      role="img"
      aria-label={alt}
    >
      <Building2 size={28} className="text-zinc-300 shrink-0" aria-hidden />
      <p className="text-xs font-semibold text-zinc-500 leading-snug line-clamp-2">{venue.name}</p>
      <p className="text-[10px] text-zinc-400">{venue.city}</p>
    </div>
  );
}
