"use client";

import { useCallback, useEffect, useState } from "react";
import { Check, Download, Monitor, Share2, Smartphone, X } from "lucide-react";
import type { Wallpaper } from "@/lib/wallpapers";
import type { DbWallpaperMeta } from "@/lib/db-wallpapers";

type DesignItem = Pick<
  Wallpaper,
  "slug" | "headline" | "match" | "venue" | "caption" | "year"
>;

type Tab = "design" | "library";

type Lightbox =
  | { kind: "design"; item: DesignItem }
  | { kind: "library"; item: DbWallpaperMeta }
  | null;

export function WallpaperGallery({
  designs,
  library = [],
}: {
  designs: DesignItem[];
  library?: DbWallpaperMeta[];
}) {
  const [tab, setTab] = useState<Tab>(library.length > 0 ? "library" : "design");
  const [lightbox, setLightbox] = useState<Lightbox>(null);

  const close = useCallback(() => setLightbox(null), []);

  return (
    <div>
      <div className="mb-4 inline-flex flex-wrap rounded-full bg-zinc-100 p-1">
        {library.length > 0 && (
          <TabButton active={tab === "library"} onClick={() => setTab("library")}>
            HD Gallery
          </TabButton>
        )}
        <TabButton active={tab === "design"} onClick={() => setTab("design")}>
          Design wallpapers
        </TabButton>
      </div>

      {tab === "design" && (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {designs.map((item) => (
            <DesignCard
              key={item.slug}
              item={item}
              onEnlarge={() => setLightbox({ kind: "design", item })}
            />
          ))}
        </div>
      )}

      {tab === "library" && (
        <>
          <p className="mb-4 text-[11px] text-zinc-400">
            HD wallpapers, downloaded straight from this site.
          </p>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {library.map((item) => (
              <LibraryCard
                key={item.id}
                item={item}
                onEnlarge={() => setLightbox({ kind: "library", item })}
              />
            ))}
          </div>
        </>
      )}

      {lightbox && <LightboxModal lightbox={lightbox} onClose={close} />}
    </div>
  );
}

function TabButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-colors ${
        active ? "bg-zinc-900 text-white" : "text-zinc-600 hover:text-zinc-900"
      }`}
    >
      {children}
    </button>
  );
}

function DesignCard({ item, onEnlarge }: { item: DesignItem; onEnlarge: () => void }) {
  const { slug, headline, match, venue, year } = item;
  const [shared, setShared] = useState(false);

  async function share() {
    const url =
      typeof window !== "undefined"
        ? `${window.location.origin}/wallpapers/${slug}/phone`
        : `/wallpapers/${slug}/phone`;
    const nav = navigator as Navigator & { share?: (data: ShareData) => Promise<void> };
    try {
      if (nav.share) {
        await nav.share({ title: `${headline} - World Cup wallpaper`, url });
        return;
      }
      await navigator.clipboard.writeText(url);
      setShared(true);
      setTimeout(() => setShared(false), 1800);
    } catch {
      /* cancelled */
    }
  }

  return (
    <div className="card-surface flex flex-col overflow-hidden rounded-2xl">
      <button
        type="button"
        onClick={onEnlarge}
        className="relative block bg-zinc-100 transition-opacity hover:opacity-95"
        aria-label={`Enlarge ${headline} wallpaper`}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={`/wallpapers/${slug}/thumb`}
          alt={`${headline} - ${match} World Cup ${year} wallpaper`}
          width={640}
          height={853}
          loading="lazy"
          decoding="async"
          className="aspect-[3/4] w-full object-cover"
        />
      </button>
      <div className="flex flex-1 flex-col p-3">
        <p className="text-sm font-bold text-zinc-900 leading-tight">{headline}</p>
        <p className="mt-0.5 text-[11px] text-zinc-500 leading-snug">{match}</p>
        <p className="mt-0.5 text-[11px] text-zinc-400">{venue}</p>

        <div className="mt-3 flex items-center gap-1.5">
          <a
            href={`/wallpapers/${slug}/phone`}
            download={`goalposts-${slug}-phone.png`}
            className="flex flex-1 items-center justify-center gap-1 rounded-lg bg-[var(--wc-usa)] px-2 py-1.5 text-[11px] font-semibold text-white transition-opacity hover:opacity-90"
          >
            <Smartphone size={13} />
            Phone
          </a>
          <a
            href={`/wallpapers/${slug}/desktop`}
            download={`goalposts-${slug}-laptop.png`}
            className="flex flex-1 items-center justify-center gap-1 rounded-lg border border-zinc-200 px-2 py-1.5 text-[11px] font-semibold text-zinc-700 transition-colors hover:bg-zinc-50"
          >
            <Monitor size={13} />
            Laptop
          </a>
          <button
            type="button"
            onClick={share}
            aria-label={`Share ${headline} wallpaper`}
            className="flex items-center justify-center rounded-lg border border-zinc-200 px-2 py-1.5 text-zinc-600 transition-colors hover:bg-zinc-50"
          >
            {shared ? <Check size={14} className="text-emerald-600" /> : <Share2 size={14} />}
          </button>
        </div>
      </div>
    </div>
  );
}

function LibraryCard({ item, onEnlarge }: { item: DbWallpaperMeta; onEnlarge: () => void }) {
  return (
    <div className="group card-surface flex flex-col overflow-hidden rounded-2xl">
      <button
        type="button"
        onClick={onEnlarge}
        className="relative block aspect-[3/4] overflow-hidden bg-zinc-100"
        aria-label={`Enlarge: ${item.title}`}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={`/wallpapers/db/${item.id}`}
          alt={item.title}
          loading="lazy"
          decoding="async"
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        {item.year && (
          <span className="absolute left-3 top-3 rounded-md bg-black/65 px-2 py-1 text-[10px] font-bold text-white">
            {item.year}
          </span>
        )}
      </button>
      <div className="flex flex-1 flex-col p-3">
        <p className="line-clamp-2 text-sm font-semibold leading-snug text-zinc-900">
          {item.title}
        </p>
        {item.teams && <p className="mt-0.5 text-[11px] text-zinc-500 leading-snug">{item.teams}</p>}
        <a
          href={`/wallpapers/db/${item.id}?dl=1`}
          download
          className="mt-2 flex items-center justify-center gap-1.5 rounded-lg bg-[var(--wc-usa)] px-2 py-1.5 text-[11px] font-semibold text-white transition-opacity hover:opacity-90"
        >
          <Download size={13} />
          Download HD
        </a>
        {item.credit && (
          <p className="mt-1.5 text-center text-[10px] text-zinc-400">{item.credit}</p>
        )}
      </div>
    </div>
  );
}

function LibraryLightboxBody({ item }: { item: DbWallpaperMeta }) {
  return (
    <div className="flex flex-col overflow-hidden rounded-2xl bg-white">
      <div className="flex items-center justify-center bg-zinc-900">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={`/wallpapers/db/${item.id}`}
          alt={item.title}
          className="max-h-[62vh] w-auto object-contain"
        />
      </div>
      <div className="p-4">
        {(item.teams || item.year) && (
          <p className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400">
            {[item.teams, item.year].filter(Boolean).join(" · ")}
          </p>
        )}
        <p className="mt-1 text-base font-bold text-zinc-900 leading-snug">{item.title}</p>
        <div className="mt-3 flex items-center justify-between gap-3">
          {item.credit ? (
            <span className="text-[11px] text-zinc-400">{item.credit}</span>
          ) : (
            <span />
          )}
          <a
            href={`/wallpapers/db/${item.id}?dl=1`}
            download
            className="flex shrink-0 items-center gap-1.5 rounded-lg bg-[var(--wc-usa)] px-3 py-2 text-xs font-semibold text-white hover:opacity-90"
          >
            <Download size={14} /> Download HD
          </a>
        </div>
      </div>
    </div>
  );
}

function LightboxModal({ lightbox, onClose }: { lightbox: NonNullable<Lightbox>; onClose: () => void }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[120] flex items-center justify-center p-3 sm:p-6"
      role="dialog"
      aria-modal="true"
    >
      <button
        type="button"
        className="absolute inset-0 cursor-pointer bg-black/80 backdrop-blur-sm"
        onClick={onClose}
        aria-label="Close"
      />
      <div className="relative z-10 flex max-h-[92vh] w-full max-w-3xl flex-col">
        <button
          type="button"
          onClick={onClose}
          className="absolute -top-1 right-0 z-20 flex h-9 w-9 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur-sm transition-colors hover:bg-white/25 sm:-top-10"
          aria-label="Close"
        >
          <X size={18} />
        </button>

        {lightbox.kind === "design" ? (
          <DesignLightboxBody item={lightbox.item} />
        ) : (
          <LibraryLightboxBody item={lightbox.item} />
        )}
      </div>
    </div>
  );
}

function DesignLightboxBody({ item }: { item: DesignItem }) {
  const { slug, headline, match, venue, caption } = item;
  return (
    <div className="flex flex-col overflow-hidden rounded-2xl bg-white">
      <div className="flex items-center justify-center bg-zinc-900">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={`/wallpapers/${slug}/phone`}
          alt={`${headline} - ${match}`}
          className="max-h-[60vh] w-auto object-contain"
        />
      </div>
      <div className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-base font-bold text-zinc-900">{headline}</p>
          <p className="text-xs text-zinc-500">
            {match} · {venue}
          </p>
          <p className="mt-1 text-xs text-zinc-400">{caption}</p>
        </div>
        <div className="flex shrink-0 gap-2">
          <a
            href={`/wallpapers/${slug}/phone`}
            download={`goalposts-${slug}-phone.png`}
            className="flex items-center gap-1.5 rounded-lg bg-[var(--wc-usa)] px-3 py-2 text-xs font-semibold text-white hover:opacity-90"
          >
            <Smartphone size={14} /> Phone
          </a>
          <a
            href={`/wallpapers/${slug}/desktop`}
            download={`goalposts-${slug}-laptop.png`}
            className="flex items-center gap-1.5 rounded-lg border border-zinc-200 px-3 py-2 text-xs font-semibold text-zinc-700 hover:bg-zinc-50"
          >
            <Monitor size={14} /> Laptop
          </a>
        </div>
      </div>
    </div>
  );
}