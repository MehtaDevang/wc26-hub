"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Trophy,
  Calendar,
  Table2,
  Users,
  Star,
  Menu,
  X,
  Globe,
  MapPin,
  ChevronDown,
  GitBranch,
  Calculator,
  Tv,
  BarChart3,
  Compass,
  Wrench,
  Swords,
  Code2,
  History,
  Puzzle,
  Target,
  Sparkles,
  Newspaper,
} from "lucide-react";
import clsx from "clsx";
import { SITE_NAME, SITE_SHORT_NAME } from "@/lib/site";
import { MascotStackLogo } from "@/components/MascotStackLogo";
import { LocaleSwitcher } from "@/components/LocaleSwitcher";
import { CommandPalette } from "@/components/CommandPalette";

const PRIMARY_LINKS = [
  { href: "/", label: "Today", icon: Trophy },
  { href: "/my", label: "My WC", icon: Star },
  { href: "/fixtures", label: "Fixtures", icon: Calendar },
  { href: "/standings", label: "Tables", icon: Table2 },
  { href: "/teams", label: "Teams", icon: Users },
] as const;

const EXPLORE_LINKS = [
  { href: "/daily", label: "Today at the World Cup", icon: Calendar },
  { href: "/news", label: "News", icon: Newspaper },
  { href: "/players", label: "Players", icon: Target },
  { href: "/history", label: "FIFA World Cup History", icon: History },
  { href: "/hosts", label: "Host Nations", icon: Globe },
  { href: "/cities", label: "City Guides", icon: MapPin },
  { href: "/stadiums", label: "Stadiums", icon: MapPin },
  { href: "/rivalries", label: "Rivalries", icon: Swords },
  { href: "/puzzles", label: "Puzzles", icon: Puzzle },
  { href: "/which-team", label: "Which Team Are You?", icon: Sparkles },
] as const;

const TOOL_LINKS = [
  { href: "/bracket", label: "Live Bracket", icon: Trophy },
  { href: "/bracket/predict", label: "Bracket Predictor", icon: GitBranch },
  { href: "/bracket/pool", label: "Bracket Pool", icon: Users },
  { href: "/scenarios", label: "Qualification Scenarios", icon: Calculator },
  { href: "/watch", label: "Where to Watch", icon: Tv },
  { href: "/leaders", label: "Stat Leaders", icon: BarChart3 },
  { href: "/pool", label: "Office Pool", icon: Users },
  { href: "/embed", label: "Embed Widget", icon: Code2 },
] as const;

function isActive(pathname: string, href: string): boolean {
  if (pathname === href) return true;
  if (href === "/daily" && pathname.startsWith("/daily")) return true;
  if (href === "/my" && pathname.startsWith("/my")) return true;
  if (href === "/puzzles" && pathname.startsWith("/puzzles")) return true;
  if (href === "/history" && pathname.startsWith("/history")) return true;
  if (href === "/teams" && pathname.startsWith("/teams")) return true;
  if (href === "/news" && pathname.startsWith("/news")) return true;
  if (href === "/players" && pathname.startsWith("/players")) return true;
  if (href === "/hosts" && pathname.startsWith("/hosts")) return true;
  if (href === "/cities" && pathname.startsWith("/cities")) return true;
  if (href === "/stadiums" && pathname.startsWith("/stadiums")) return true;
  if (href === "/rivalries" && pathname.startsWith("/rivalries")) return true;
  if (href === "/which-team" && pathname.startsWith("/which-team")) return true;
  if (href === "/bracket/predict" && pathname.startsWith("/bracket/predict")) return true;
  if (href === "/bracket/pool" && pathname.startsWith("/bracket/pool")) return true;
  if (href === "/bracket" && pathname === "/bracket") return true;
  if (href === "/scenarios" && pathname.startsWith("/scenarios")) return true;
  if (href === "/watch" && pathname.startsWith("/watch")) return true;
  if (href === "/leaders" && pathname.startsWith("/leaders")) return true;
  if (href === "/pool" && pathname.startsWith("/pool")) return true;
  if (href === "/embed" && pathname.startsWith("/embed")) return true;
  return false;
}

function isGroupActive(pathname: string, links: readonly { href: string }[]): boolean {
  return links.some((l) => isActive(pathname, l.href));
}

function NavDropdown({
  label,
  icon: Icon,
  links,
  pathname,
}: {
  label: string;
  icon: React.ComponentType<{ size?: number; strokeWidth?: number }>;
  links: readonly { href: string; label: string; icon: React.ComponentType<{ size?: number; strokeWidth?: number }> }[];
  pathname: string;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const active = isGroupActive(pathname, links);

  useEffect(() => {
    if (!open) return;
    const close = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    const esc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", close);
    document.addEventListener("keydown", esc);
    return () => {
      document.removeEventListener("mousedown", close);
      document.removeEventListener("keydown", esc);
    };
  }, [open]);

  useEffect(() => setOpen(false), [pathname]);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className={clsx(
          "flex items-center gap-1 rounded-lg px-2.5 py-2 text-[13px] font-medium transition-colors",
          active || open
            ? "bg-[var(--wc-usa-light)] text-[var(--wc-usa)]"
            : "text-zinc-500 hover:text-zinc-900 hover:bg-zinc-50"
        )}
      >
        <Icon size={15} strokeWidth={active ? 2.5 : 2} />
        <span>{label}</span>
        <ChevronDown size={13} className={clsx("opacity-60 transition-transform", open && "rotate-180")} />
      </button>
      {open && (
        <div className="nav-dropdown-panel absolute left-0 top-full z-50 mt-1 min-w-[12.5rem] rounded-xl border border-zinc-200 bg-white py-1 shadow-lg">
          {links.map(({ href, label: itemLabel, icon: ItemIcon }) => (
            <Link
              key={href}
              href={href}
              className={clsx(
                "flex items-center gap-2 px-3 py-2.5 text-sm font-medium transition-colors",
                isActive(pathname, href)
                  ? "bg-[var(--wc-usa-light)] text-[var(--wc-usa)]"
                  : "text-zinc-700 hover:bg-zinc-50"
              )}
              onClick={() => setOpen(false)}
            >
              <ItemIcon size={16} />
              {itemLabel}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

function BrandLogo() {
  return (
    <Link href="/" className="flex items-center gap-2 min-w-0 shrink-0 group">
      <MascotStackLogo />
      <div className="min-w-0">
        <p className="font-bold text-zinc-900 text-sm sm:text-[15px] leading-tight truncate group-hover:text-[var(--wc-usa)] transition-colors">
          <span className="sm:hidden">{SITE_SHORT_NAME}</span>
          <span className="hidden sm:inline">{SITE_NAME}</span>
        </p>
        <p className="hidden lg:block text-[10px] text-zinc-400 leading-none mt-0.5 tracking-wide uppercase">
          All football updates
        </p>
      </div>
    </Link>
  );
}

export function Navbar() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => setMenuOpen(false), [pathname]);
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  return (
    <>
      <CommandPalette />
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-zinc-200">
        <div className="host-stripe" />
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 h-14">
          <BrandLogo />

          <nav className="hidden lg:flex items-center gap-0.5 flex-1 justify-center">
            {PRIMARY_LINKS.map(({ href, label }) => {
              const active = isActive(pathname, href);
              return (
                <Link
                  key={href}
                  href={href}
                  className={clsx(
                    "rounded-lg px-3 py-2 text-[13px] font-medium transition-colors",
                    active
                      ? "bg-[var(--wc-usa-light)] text-[var(--wc-usa)]"
                      : "text-zinc-500 hover:text-zinc-900 hover:bg-zinc-50"
                  )}
                >
                  {label}
                </Link>
              );
            })}
            <NavDropdown label="Explore" icon={Compass} links={EXPLORE_LINKS} pathname={pathname} />
            <NavDropdown label="Tools" icon={Wrench} links={TOOL_LINKS} pathname={pathname} />
          </nav>

          <div className="hidden lg:flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => window.dispatchEvent(new Event("wc26-open-search"))}
              className="flex items-center gap-2 rounded-lg border border-zinc-200 bg-zinc-50/80 px-2.5 py-1.5 text-xs text-zinc-500 hover:border-zinc-300 hover:bg-white transition-colors"
              aria-label="Search"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
              <span>Search…</span>
              <kbd className="rounded bg-white border border-zinc-200 px-1.5 py-0.5 text-[10px] font-mono text-zinc-400">⌘K</kbd>
            </button>
            <LocaleSwitcher />
          </div>

          <div className="flex lg:hidden items-center gap-1">
            <button
              type="button"
              onClick={() => window.dispatchEvent(new Event("wc26-open-search"))}
              className="flex h-9 w-9 items-center justify-center rounded-lg text-zinc-600 hover:bg-zinc-100 lg:hidden"
              aria-label="Search"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
            </button>
            <button
              type="button"
              onClick={() => setMenuOpen((o) => !o)}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-zinc-600 hover:bg-zinc-100"
              aria-expanded={menuOpen}
              aria-label={menuOpen ? "Close menu" : "Open menu"}
            >
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {menuOpen && (
          <>
            <button
              type="button"
              className="lg:hidden fixed inset-0 top-14 z-30 bg-black/20"
              aria-label="Close menu"
              onClick={() => setMenuOpen(false)}
            />
            <nav className="lg:hidden relative z-40 border-t border-zinc-100 bg-white px-4 py-4 shadow-lg max-h-[calc(100vh-3.5rem)] overflow-y-auto">
              <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 px-1 mb-2">Main</p>
              <div className="grid grid-cols-2 gap-2 mb-4">
                {[...PRIMARY_LINKS, { href: "/players", label: "Players", icon: Target }].map(({ href, label, icon }) => {
                  const Icon = icon;
                  const active = isActive(pathname, href);
                  return (
                    <Link
                      key={href}
                      href={href}
                      className={clsx(
                        "flex items-center gap-2 rounded-xl px-3 py-3 text-sm font-medium",
                        active ? "bg-[var(--wc-usa-light)] text-[var(--wc-usa)]" : "text-zinc-700 hover:bg-zinc-50"
                      )}
                    >
                      <Icon size={18} />
                      {label}
                    </Link>
                  );
                })}
              </div>

              <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 px-1 mb-2">Explore</p>
              <div className="grid grid-cols-2 gap-2 mb-4">
                {EXPLORE_LINKS.map(({ href, label, icon }) => {
                  const Icon = icon;
                  return (
                    <Link
                      key={href}
                      href={href}
                      className={clsx(
                        "flex items-center gap-2 rounded-xl px-3 py-3 text-sm font-medium",
                        isActive(pathname, href) ? "bg-[var(--wc-usa-light)] text-[var(--wc-usa)]" : "text-zinc-700 hover:bg-zinc-50"
                      )}
                    >
                      <Icon size={18} />
                      {label}
                    </Link>
                  );
                })}
              </div>

              <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 px-1 mb-2">Tools</p>
              <div className="grid grid-cols-1 gap-1 mb-4">
                {TOOL_LINKS.map(({ href, label, icon }) => {
                  const Icon = icon;
                  return (
                    <Link
                      key={href}
                      href={href}
                      className={clsx(
                        "flex items-center gap-2 rounded-xl px-3 py-3 text-sm font-medium",
                        isActive(pathname, href) ? "bg-[var(--wc-usa-light)] text-[var(--wc-usa)]" : "text-zinc-700 hover:bg-zinc-50"
                      )}
                    >
                      <Icon size={18} />
                      {label}
                    </Link>
                  );
                })}
              </div>

              <LocaleSwitcher />
            </nav>
          </>
        )}
      </header>
    </>
  );
}
