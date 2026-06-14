"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Trophy,
  Calendar,
  Table2,
  Puzzle,
  History,
  Users,
  Target,
  Menu,
  X,
} from "lucide-react";
import clsx from "clsx";
import { SITE_NAME } from "@/lib/site";
import { WC26MascotIcon } from "./mascots/WC26Mascots";

const NAV_ITEMS = [
  { href: "/", label: "Home", icon: Trophy },
  { href: "/fixtures", label: "Fixtures", icon: Calendar },
  { href: "/standings", label: "Tables", icon: Table2 },
  { href: "/teams", label: "Teams", icon: Users },
  { href: "/players", label: "Players", icon: Target },
  { href: "/history", label: "History", icon: History },
  { href: "/puzzles", label: "Puzzles", icon: Puzzle },
];

function isNavActive(pathname: string, href: string): boolean {
  if (pathname === href) return true;
  if (href === "/puzzles" && pathname.startsWith("/puzzles")) return true;
  if (href === "/history" && pathname.startsWith("/history")) return true;
  if (href === "/teams" && pathname.startsWith("/teams")) return true;
  if (href === "/players" && pathname.startsWith("/players")) return true;
  return false;
}

export function Navbar() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-zinc-200">
      <div className="host-stripe" />
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 h-14">
        <Link href="/" className="flex items-center gap-2 min-w-0 shrink group">
          <div className="md:hidden flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[var(--wc-usa-light)] border border-[var(--wc-usa)]/15 overflow-hidden">
            <WC26MascotIcon id="clutch" size={28} />
          </div>

          <div className="hidden md:flex items-center -space-x-1.5 shrink-0">
            <div className="relative z-10 flex h-7 w-7 items-center justify-center rounded-lg bg-[var(--wc-mexico-light)] border border-[var(--wc-mexico)]/15 overflow-hidden">
              <WC26MascotIcon id="zayu" size={26} />
            </div>
            <div className="relative z-20 flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--wc-usa-light)] border border-[var(--wc-usa)]/15 shadow-sm overflow-hidden">
              <WC26MascotIcon id="clutch" size={30} />
            </div>
            <div className="relative z-10 flex h-7 w-7 items-center justify-center rounded-lg bg-[var(--wc-canada-light)] border border-[var(--wc-canada)]/15 overflow-hidden">
              <WC26MascotIcon id="maple" size={26} />
            </div>
          </div>

          <div className="min-w-0">
            <p className="font-bold text-zinc-900 text-sm sm:text-[15px] leading-tight truncate group-hover:text-[var(--wc-usa)] transition-colors">
              {SITE_NAME}
            </p>
            <p className="hidden lg:block text-[10px] text-zinc-400 leading-none mt-0.5 tracking-wide uppercase">
              Scores · Stats · Puzzles
            </p>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-0.5">
          {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
            const active = isNavActive(pathname, href);
            return (
              <Link
                key={href}
                href={href}
                className={clsx(
                  "flex items-center gap-1.5 rounded-lg px-2.5 lg:px-3 py-2 text-[13px] font-medium transition-colors",
                  active
                    ? "bg-[var(--wc-usa-light)] text-[var(--wc-usa)]"
                    : "text-zinc-500 hover:text-zinc-900 hover:bg-zinc-50"
                )}
              >
                <Icon size={15} strokeWidth={active ? 2.5 : 2} />
                <span className="hidden lg:inline">{label}</span>
              </Link>
            );
          })}
        </nav>

        <button
          type="button"
          onClick={() => setMenuOpen((open) => !open)}
          className="md:hidden flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-zinc-600 hover:bg-zinc-100 transition-colors"
          aria-expanded={menuOpen}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
        >
          {menuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {menuOpen && (
        <>
          <button
            type="button"
            className="md:hidden fixed inset-0 top-14 z-30 bg-black/20"
            aria-label="Close menu"
            onClick={() => setMenuOpen(false)}
          />
          <nav className="md:hidden relative z-40 border-t border-zinc-100 bg-white px-3 py-3 shadow-lg">
            <div className="grid grid-cols-2 gap-2">
              {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
                const active = isNavActive(pathname, href);
                return (
                  <Link
                    key={href}
                    href={href}
                    className={clsx(
                      "flex items-center gap-2.5 rounded-xl px-3 py-3 text-sm font-medium transition-colors",
                      active
                        ? "bg-[var(--wc-usa-light)] text-[var(--wc-usa)]"
                        : "text-zinc-700 hover:bg-zinc-50"
                    )}
                  >
                    <Icon size={18} strokeWidth={active ? 2.5 : 2} />
                    {label}
                  </Link>
                );
              })}
            </div>
          </nav>
        </>
      )}
    </header>
  );
}
