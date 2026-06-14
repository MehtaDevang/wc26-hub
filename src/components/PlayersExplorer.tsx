"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Search, X, ChevronLeft, Users } from "lucide-react";
import { PlayerSquadCard } from "@/components/PlayerPageView";
import type { PlayerCountrySection } from "@/lib/types";

function normalize(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function matchesQuery(text: string, query: string): boolean {
  return normalize(text).includes(normalize(query));
}

interface PlayersExplorerProps {
  sections: PlayerCountrySection[];
}

export function PlayersExplorer({ sections }: PlayersExplorerProps) {
  const [query, setQuery] = useState("");
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);

  const trimmedQuery = query.trim();

  const filteredSections = useMemo(() => {
    return sections
      .filter((section) => {
        if (selectedCountry && section.teamCode !== selectedCountry) return false;
        if (!trimmedQuery) return true;
        if (
          matchesQuery(section.teamName, trimmedQuery) ||
          matchesQuery(section.teamCode, trimmedQuery)
        ) {
          return true;
        }
        return section.players.some(
          (player) =>
            matchesQuery(player.name, trimmedQuery) ||
            matchesQuery(player.position, trimmedQuery)
        );
      })
      .map((section) => {
        const countryMatches =
          trimmedQuery &&
          (matchesQuery(section.teamName, trimmedQuery) ||
            matchesQuery(section.teamCode, trimmedQuery));

        if (!trimmedQuery || countryMatches) return section;

        return {
          ...section,
          players: section.players.filter(
            (player) =>
              matchesQuery(player.name, trimmedQuery) ||
              matchesQuery(player.position, trimmedQuery)
          ),
        };
      });
  }, [sections, selectedCountry, trimmedQuery]);

  const resultCount = filteredSections.reduce((sum, s) => sum + s.players.length, 0);
  const selectedSection = selectedCountry
    ? sections.find((s) => s.teamCode === selectedCountry)
    : undefined;

  const isBrowsing = !trimmedQuery && !selectedCountry;
  const hasFilters = !!trimmedQuery || !!selectedCountry;

  function clearFilters() {
    setQuery("");
    setSelectedCountry(null);
  }

  function selectCountry(code: string) {
    setSelectedCountry(code);
    setQuery("");
  }

  return (
    <div className="space-y-4">
      <div className="sticky top-14 z-30 -mx-4 px-4 py-3 bg-white/95 backdrop-blur-md border-b border-zinc-100 sm:static sm:mx-0 sm:px-0 sm:py-0 sm:bg-transparent sm:backdrop-blur-none sm:border-0">
        <div className="relative">
          <Search
            size={18}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none"
          />
          <input
            type="search"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              if (e.target.value.trim()) setSelectedCountry(null);
            }}
            placeholder="Search player or country..."
            className="w-full rounded-xl border border-zinc-200 bg-white pl-10 pr-10 py-3 text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
            aria-label="Search players or countries"
          />
          {hasFilters && (
            <button
              type="button"
              onClick={clearFilters}
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600 transition-colors"
              aria-label="Clear search and filters"
            >
              <X size={16} />
            </button>
          )}
        </div>

        <div className="mt-3 flex gap-2 overflow-x-auto pb-1 scrollbar-none">
          <button
            type="button"
            onClick={() => setSelectedCountry(null)}
            className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-semibold transition-colors ${
              !selectedCountry
                ? "bg-zinc-900 text-white"
                : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
            }`}
          >
            All countries
          </button>
          {sections.map((section) => (
            <button
              key={section.teamCode}
              type="button"
              onClick={() =>
                setSelectedCountry((current) =>
                  current === section.teamCode ? null : section.teamCode
                )
              }
              className={`shrink-0 flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition-colors ${
                selectedCountry === section.teamCode
                  ? "bg-[var(--wc-usa)] text-white"
                  : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
              }`}
            >
              <span>{section.flag}</span>
              <span>{section.teamCode}</span>
            </button>
          ))}
        </div>
      </div>

      {hasFilters && (
        <div className="flex items-center justify-between gap-3 text-sm">
          <p className="text-zinc-500">
            {resultCount} player{resultCount !== 1 ? "s" : ""}
            {selectedSection && !trimmedQuery && (
              <>
                {" "}
                in <span className="font-semibold text-zinc-700">{selectedSection.teamName}</span>
              </>
            )}
            {trimmedQuery && (
              <>
                {" "}
                matching <span className="font-semibold text-zinc-700">&ldquo;{trimmedQuery}&rdquo;</span>
              </>
            )}
          </p>
          {selectedCountry && (
            <button
              type="button"
              onClick={() => setSelectedCountry(null)}
              className="inline-flex items-center gap-1 text-blue-600 hover:underline shrink-0"
            >
              <ChevronLeft size={14} />
              All countries
            </button>
          )}
        </div>
      )}

      {isBrowsing ? (
        <div>
          <h2 className="section-title mb-4 text-base flex items-center gap-2">
            <Users size={18} className="text-[var(--wc-usa)]" />
            Browse by country
          </h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {sections.map((section) => (
              <button
                key={section.teamCode}
                type="button"
                onClick={() => selectCountry(section.teamCode)}
                className="card-surface rounded-xl px-4 py-3 flex items-center gap-3 hover:border-blue-200 hover:shadow-sm transition-all text-left group"
              >
                <span className="text-2xl shrink-0">{section.flag}</span>
                <div className="min-w-0 flex-1">
                  <p className="font-bold text-zinc-900 group-hover:text-blue-600 transition-colors truncate">
                    {section.teamName}
                  </p>
                  <p className="text-xs text-zinc-400 mt-0.5">
                    {section.players.length} players · {section.teamCode}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>
      ) : resultCount > 0 ? (
        <div className="space-y-4">
          {selectedSection && !trimmedQuery && filteredSections.length === 1 && (
            <div className="flex items-center gap-3">
              <span className="text-3xl">{selectedSection.flag}</span>
              <div>
                <h2 className="section-title text-lg">{selectedSection.teamName}</h2>
                <p className="text-xs text-zinc-400 mt-0.5">
                  {selectedSection.players.length} squad players ·{" "}
                  <Link href={`/teams/${selectedSection.teamCode}`} className="text-blue-600 hover:underline">
                    Team page
                  </Link>
                </p>
              </div>
            </div>
          )}

          {trimmedQuery && filteredSections.length > 1 ? (
          <div className="space-y-6">
            {filteredSections.map((section) => (
              <section key={section.teamCode}>
                <div className="flex items-center justify-between gap-3 mb-3">
                  <h2 className="section-title text-base flex items-center gap-2">
                    <span className="text-xl">{section.flag}</span>
                    <Link
                      href={`/teams/${section.teamCode}`}
                      className="hover:text-blue-600 transition-colors"
                    >
                      {section.teamName}
                    </Link>
                  </h2>
                  <span className="text-xs text-zinc-400 font-medium tabular-nums">
                    {section.players.length}
                  </span>
                </div>
                <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                  {section.players.map((player) => (
                    <PlayerSquadCard key={player.id} player={player} />
                  ))}
                </div>
              </section>
            ))}
          </div>
        ) : (
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {filteredSections.flatMap((section) =>
              section.players.map((player) => (
                <PlayerSquadCard key={player.id} player={player} />
              ))
            )}
          </div>
        )}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-sm text-zinc-500">No players match your search.</p>
          <button
            type="button"
            onClick={clearFilters}
            className="mt-3 text-sm text-blue-600 hover:underline"
          >
            Clear filters
          </button>
        </div>
      )}
    </div>
  );
}
