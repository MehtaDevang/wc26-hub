import Link from "next/link";
import type { Highlight } from "@/lib/types";

const IMAGE_TYPE_LABELS: Record<NonNullable<Highlight["imageType"]>, string> = {
  player: "Player",
  stadium: "Stadium",
  team: "Team",
  moment: "Moment",
};

interface HighlightCardProps {
  highlight: Highlight;
  href?: string;
  compact?: boolean;
}

function HighlightImage({ highlight, compact }: { highlight: Highlight; compact?: boolean }) {
  if (highlight.imageUrl) {
    return (
      <div className={`relative overflow-hidden bg-zinc-100 ${compact ? "aspect-[16/10]" : "aspect-video"}`}>
        <img
          src={highlight.imageUrl}
          alt={highlight.imageAlt ?? highlight.title}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />
        <div className="absolute left-3 top-3 flex items-center gap-2">
          <span className="rounded-md bg-black/70 px-2 py-1 text-[10px] font-bold text-white backdrop-blur-sm">
            {highlight.minute}
          </span>
          {highlight.imageType && (
            <span className="rounded-md bg-white/90 px-2 py-1 text-[10px] font-semibold text-zinc-700 backdrop-blur-sm">
              {IMAGE_TYPE_LABELS[highlight.imageType]}
            </span>
          )}
        </div>
        {highlight.playerName && highlight.imageType === "player" && (
          <p className="absolute bottom-3 left-3 right-3 text-sm font-semibold text-white drop-shadow">
            {highlight.playerName}
          </p>
        )}
      </div>
    );
  }

  return (
    <div
      className={`flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-amber-50 ${
        compact ? "aspect-[16/10]" : "aspect-video"
      }`}
    >
      <span className="text-5xl">{highlight.emoji}</span>
    </div>
  );
}

function HighlightBody({ highlight }: { highlight: Highlight }) {
  return (
    <div className="p-4">
      {!highlight.imageUrl && (
        <div className="mb-2 flex items-center gap-2">
          <span className="rounded bg-amber-50 px-1.5 py-0.5 text-[10px] font-bold text-amber-600">
            {highlight.minute}
          </span>
          <span className="truncate text-[10px] text-zinc-400">{highlight.teams}</span>
        </div>
      )}
      <p className="line-clamp-2 text-sm font-semibold leading-snug text-zinc-900 transition-colors group-hover:text-blue-600">
        {highlight.title}
      </p>
      {highlight.imageUrl && (
        <p className="mt-1 truncate text-[10px] text-zinc-400">{highlight.teams}</p>
      )}
      <p className="mt-1 line-clamp-2 text-xs text-zinc-500">{highlight.description}</p>
    </div>
  );
}

export function HighlightCard({ highlight, href, compact }: HighlightCardProps) {
  const className =
    "group card-surface overflow-hidden rounded-xl transition-all hover:-translate-y-0.5 hover:shadow-md";

  if (href) {
    return (
      <Link href={href} className={className}>
        <HighlightImage highlight={highlight} compact={compact} />
        <HighlightBody highlight={highlight} />
      </Link>
    );
  }

  return (
    <div className={className}>
      <HighlightImage highlight={highlight} compact={compact} />
      <HighlightBody highlight={highlight} />
    </div>
  );
}
