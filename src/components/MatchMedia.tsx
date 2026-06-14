"use client";

import { useState } from "react";
import { Play, ExternalLink } from "lucide-react";
import type { MatchPhoto, MatchVideo } from "@/lib/types";

function WatchOnEspnLink({ url, className }: { url?: string; className?: string }) {
  if (!url) return null;
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={className ?? "inline-flex items-center gap-1.5 text-sm text-blue-600 hover:underline font-medium"}
    >
      Watch on ESPN
      <ExternalLink size={14} />
    </a>
  );
}

export function MatchMedia({ videos = [], photos = [] }: {
  videos?: MatchVideo[];
  photos?: MatchPhoto[];
}) {
  const [activeVideo, setActiveVideo] = useState<string | null>(
    videos[0]?.videoUrl ?? videos[0]?.webUrl ?? null
  );
  const active = videos.find((v) => v.videoUrl === activeVideo || v.webUrl === activeVideo) ?? videos[0];

  if (!videos.length && !photos.length) {
    return (
      <p className="text-sm text-zinc-400 text-center py-8">No photos or videos available yet.</p>
    );
  }

  return (
    <div className="space-y-6">
      {videos.length > 0 && (
        <div className="space-y-4">
          {active?.videoUrl ? (
            <div className="card-surface rounded-2xl overflow-hidden">
              <video
                key={active.videoUrl}
                src={active.videoUrl}
                controls
                poster={active.thumbnail}
                className="w-full aspect-video bg-black"
                playsInline
              />
              <div className="p-4 space-y-2">
                <p className="font-semibold text-zinc-900 text-sm">{active.title}</p>
                {active.description && (
                  <p className="text-xs text-zinc-500">{active.description}</p>
                )}
                <WatchOnEspnLink url={active.webUrl} />
              </div>
            </div>
          ) : active?.thumbnail && active?.webUrl ? (
            <a
              href={active.webUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="block card-surface rounded-2xl overflow-hidden group"
            >
              <div className="relative aspect-video">
                <img src={active.thumbnail} alt={active.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/40 transition-colors">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/90">
                    <Play size={24} className="text-blue-600 ml-1" fill="currentColor" />
                  </div>
                </div>
              </div>
              <div className="p-4 flex items-center justify-between gap-3">
                <p className="font-semibold text-zinc-900 text-sm">{active.title}</p>
                <ExternalLink size={14} className="text-zinc-400 shrink-0" />
              </div>
            </a>
          ) : active ? (
            <div className="card-surface rounded-2xl p-4 space-y-2">
              <p className="font-semibold text-zinc-900 text-sm">{active.title}</p>
              <WatchOnEspnLink url={active.webUrl} />
            </div>
          ) : null}

          {videos.length > 1 && (
            <div className="grid gap-3 sm:grid-cols-2">
              {videos.map((v) => {
                const isActive = (v.videoUrl ?? v.webUrl) === activeVideo;
                const href = v.webUrl;

                if (href && !v.videoUrl) {
                  return (
                    <a
                      key={v.id}
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`card-surface rounded-xl overflow-hidden text-left transition-all hover:shadow-md ${
                        isActive ? "ring-2 ring-blue-500" : ""
                      }`}
                    >
                      <div className="relative aspect-video">
                        {v.thumbnail && (
                          <img src={v.thumbnail} alt="" className="w-full h-full object-cover" />
                        )}
                        <div className="absolute bottom-2 right-2 rounded bg-black/70 px-1.5 py-0.5 text-[10px] text-white font-medium">
                          ESPN
                        </div>
                      </div>
                      <p className="p-3 text-xs font-medium text-zinc-800 line-clamp-2">{v.title}</p>
                    </a>
                  );
                }

                return (
                  <button
                    key={v.id}
                    type="button"
                    onClick={() => setActiveVideo(v.videoUrl ?? v.webUrl ?? null)}
                    className={`card-surface rounded-xl overflow-hidden text-left transition-all touch-manipulation ${
                      isActive ? "ring-2 ring-blue-500" : "hover:shadow-md"
                    }`}
                  >
                    <div className="relative aspect-video">
                      {v.thumbnail && (
                        <img src={v.thumbnail} alt="" className="w-full h-full object-cover" />
                      )}
                      <div className="absolute bottom-2 right-2 rounded bg-black/70 px-1.5 py-0.5 text-[10px] text-white font-medium">
                        {v.duration ? `${v.duration}s` : "▶"}
                      </div>
                    </div>
                    <p className="p-3 text-xs font-medium text-zinc-800 line-clamp-2">{v.title}</p>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}

      {photos.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-zinc-900 mb-3">Match Photos</h3>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {photos.map((p) => (
              <a
                key={p.id}
                href={p.url}
                target="_blank"
                rel="noopener noreferrer"
                className="card-surface rounded-xl overflow-hidden hover:shadow-md transition-shadow"
              >
                <div className="relative aspect-video">
                  <img src={p.url} alt={p.caption ?? ""} className="w-full h-full object-cover" />
                </div>
                {p.caption && (
                  <p className="p-2.5 text-[11px] text-zinc-500 line-clamp-2">{p.caption}</p>
                )}
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
