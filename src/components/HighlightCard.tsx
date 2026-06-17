import { ExternalLink, Play } from "lucide-react";
import { CdnFillImage } from "@/components/CdnImage";
import type { Highlight, Match } from "@/lib/types";
import { MediaShareButton } from "./MediaShareButton";
import { buildHighlightSharePayload } from "@/lib/share";

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
  match?: Pick<
    Match,
    "id" | "homeName" | "awayName" | "homeScore" | "awayScore" | "status"
  >;
}

function HighlightImage({ highlight, compact, hasLink }: { highlight: Highlight; compact?: boolean; hasLink: boolean }) {
  if (highlight.imageUrl) {
    return (
      <div className={`relative overflow-hidden bg-zinc-100 ${compact ? "aspect-[16/10]" : "aspect-video"}`}>
        <CdnFillImage
          src={highlight.imageUrl}
          alt={highlight.imageAlt ?? highlight.title}
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          sizes={compact ? "(max-width: 640px) 50vw, 280px" : "(max-width: 768px) 100vw, 360px"}
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
        {hasLink && (
          <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity group-hover:opacity-100">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white/95 shadow-lg">
              <Play size={18} className="ml-0.5 text-blue-600" fill="currentColor" />
            </div>
          </div>
        )}
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

function HighlightBody({
  highlight,
  hasExternalWatch,
  match,
}: {
  highlight: Highlight;
  hasExternalWatch: boolean;
  match?: HighlightCardProps["match"];
}) {
  const share = match ? buildHighlightSharePayload(match, highlight) : null;

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
      <div className="mt-3 flex flex-wrap items-center gap-2">
        {share && !highlight.imageUrl && (
          <MediaShareButton
            url={share.url}
            title={share.title}
            text={share.text}
            label={share.label}
          />
        )}
        {hasExternalWatch && (
          <p className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600">
            Watch on ESPN
            <ExternalLink size={12} />
          </p>
        )}
      </div>
    </div>
  );
}

export function HighlightCard({ highlight, href, compact, match }: HighlightCardProps) {
  const className =
    "group card-surface overflow-hidden rounded-xl transition-all hover:-translate-y-0.5 hover:shadow-md";

  const externalHref = highlight.webUrl ?? highlight.videoUrl;
  const linkHref = href ?? externalHref;
  const hasLink = Boolean(linkHref);
  const hasExternalWatch = Boolean(externalHref);
  const share = match ? buildHighlightSharePayload(match, highlight) : null;

  const content = (
    <>
      <div className="relative">
        <HighlightImage highlight={highlight} compact={compact} hasLink={hasExternalWatch} />
        {share && (
          <div className="absolute right-3 top-3 z-10">
            <MediaShareButton
              url={share.url}
              title={share.title}
              text={share.text}
              label={share.label}
              variant="overlay"
            />
          </div>
        )}
      </div>
      <HighlightBody highlight={highlight} hasExternalWatch={hasExternalWatch} match={match} />
    </>
  );

  if (linkHref) {
    const isExternal = !href && Boolean(externalHref);
    return (
      <a
        href={linkHref}
        className={`${className} block cursor-pointer`}
        {...(isExternal
          ? { target: "_blank", rel: "noopener noreferrer" }
          : {})}
      >
        {content}
      </a>
    );
  }

  return <div className={className}>{content}</div>;
}
