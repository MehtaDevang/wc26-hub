"use client";

import { useEffect, useRef, useState } from "react";
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
  Globe,
  MapPin,
  ChevronDown,
  GitBranch,
  Calculator,
  Tv,
  BarChart3,
  Star,
} from "lucide-react";
import clsx from "clsx";
import { SITE_NAME } from "@/lib/site";
import { MascotFootballPlay } from "@/components/MascotFootballPlay";
import { WC26MascotIcon } from "./mascots/WC26Mascots";

const NAV_BEFORE_HOSTS = [
  { href: "/", label: "Home", icon: Trophy },
  { href: "/fixtures", label: "Fixtures", icon: Calendar },
  { href: "/standings", label: "Tables", icon: Table2 },
  { href: "/teams", label: "Teams", icon: Users },
  { href: "/players", label: "Players", icon: Target },
] as const;

const HOSTS_VENUES_LINKS = [
  { href: "/hosts", label: "Host Nations", icon: Globe },
  { href: "/stadiums", label: "Stadiums", icon: MapPin },
] as const;

const FAN_TOOLS_LINKS = [
  { href: "/bracket/predict", label: "Bracket Predictor", icon: GitBranch },
  { href: "/scenarios", label: "Qualification Scenarios", icon: Calculator },
  { href: "/watch", label: "Where to Watch", icon: Tv },
  { href: "/leaders", label: "Stat Leaders", icon: BarChart3 },
] as const;

const NAV_AFTER_HOSTS = [
  { href: "/history", label: "History", icon: History },
  { href: "/puzzles", label: "Puzzles", icon: Puzzle },
] as const;

function isNavLinkActive(pathname: string, href: string): boolean {
  if (pathname === href) return true;
  if (href === "/puzzles" && pathname.startsWith("/puzzles")) return true;
  if (href === "/history" && pathname.startsWith("/history")) return true;
  if (href === "/teams" && pathname.startsWith("/teams")) return true;
  if (href === "/players" && pathname.startsWith("/players")) return true;
  if (href === "/hosts" && pathname.startsWith("/hosts")) return true;
  if (href === "/stadiums" && pathname.startsWith("/stadiums")) return true;
  if (href === "/bracket/predict" && pathname.startsWith("/bracket/predict")) return true;
  if (href === "/scenarios" && pathname.startsWith("/scenarios")) return true;
  if (href === "/watch" && pathname.startsWith("/watch")) return true;
  if (href === "/leaders" && pathname.startsWith("/leaders")) return true;
  return false;
}

function isHostsVenuesActive(pathname: string): boolean {
  return HOSTS_VENUES_LINKS.some((item) => isNavLinkActive(pathname, item.href));
}

function NavLink({
  href,
  label,
  icon: Icon,
  pathname,
  className,
}: {
  href: string;
  label: string;
  icon: React.ComponentType<{ size?: number; strokeWidth?: number }>;
  pathname: string;
  className?: string;
}) {
  const active = isNavLinkActive(pathname, href);
  return (
    <Link
      href={href}
      className={clsx(
        "flex items-center gap-1.5 rounded-lg px-2.5 lg:px-3 py-2 text-[13px] font-medium transition-colors",
        active
          ? "bg-[var(--wc-usa-light)] text-[var(--wc-usa)]"
          : "text-zinc-500 hover:text-zinc-900 hover:bg-zinc-50",
        className
      )}
    >
      <Icon size={15} strokeWidth={active ? 2.5 : 2} />
      <span className="hidden lg:inline">{label}</span>
    </Link>
  );
}

function isFanToolsActive(pathname: string): boolean {
  return FAN_TOOLS_LINKS.some((item) => isNavLinkActive(pathname, item.href));
}

function FanToolsDropdown({ pathname }: { pathname: string }) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const active = isFanToolsActive(pathname);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    const onEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onEscape);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onEscape);
    };
  }, [open]);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-haspopup="menu"
        className={clsx(
          "flex items-center gap-1 rounded-lg px-2.5 lg:px-3 py-2 text-[13px] font-medium transition-colors",
          active || open
            ? "bg-[var(--wc-usa-light)] text-[var(--wc-usa)]"
            : "text-zinc-500 hover:text-zinc-900 hover:bg-zinc-50"
        )}
      >
        <Star size={15} strokeWidth={active ? 2.5 : 2} />
        <span className="hidden lg:inline">Fan Tools</span>
        <ChevronDown
          size={14}
          className={clsx("transition-transform opacity-70", open && "rotate-180")}
        />
      </button>

      {open && (
        <div
          role="menu"
          className="nav-dropdown-panel absolute left-0 top-full z-50 mt-1 min-w-[12rem] rounded-xl border border-zinc-200 bg-white py-1 shadow-lg"
        >
          {FAN_TOOLS_LINKS.map(({ href, label, icon: Icon }) => {
            const itemActive = isNavLinkActive(pathname, href);
            return (
              <Link
                key={href}
                href={href}
                role="menuitem"
                className={clsx(
                  "flex items-center gap-2 px-3 py-2.5 text-sm font-medium transition-colors",
                  itemActive
                    ? "bg-[var(--wc-usa-light)] text-[var(--wc-usa)]"
                    : "text-zinc-700 hover:bg-zinc-50"
                )}
                onClick={() => setOpen(false)}
              >
                <Icon size={16} strokeWidth={itemActive ? 2.5 : 2} />
                {label}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}

function HostsVenuesDropdown({ pathname }: { pathname: string }) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const active = isHostsVenuesActive(pathname);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    const onEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onEscape);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onEscape);
    };
  }, [open]);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-haspopup="menu"
        className={clsx(
          "flex items-center gap-1 rounded-lg px-2.5 lg:px-3 py-2 text-[13px] font-medium transition-colors",
          active || open
            ? "bg-[var(--wc-usa-light)] text-[var(--wc-usa)]"
            : "text-zinc-500 hover:text-zinc-900 hover:bg-zinc-50"
        )}
      >
        <Globe size={15} strokeWidth={active ? 2.5 : 2} />
        <span className="hidden lg:inline">Hosts & Venues</span>
        <ChevronDown
          size={14}
          className={clsx("transition-transform opacity-70", open && "rotate-180")}
        />
      </button>

      {open && (
        <div
          role="menu"
          className="nav-dropdown-panel absolute left-0 top-full z-50 mt-1 min-w-[11rem] rounded-xl border border-zinc-200 bg-white py-1 shadow-lg"
        >
          {HOSTS_VENUES_LINKS.map(({ href, label, icon: Icon }) => {
            const itemActive = isNavLinkActive(pathname, href);
            return (
              <Link
                key={href}
                href={href}
                role="menuitem"
                className={clsx(
                  "flex items-center gap-2 px-3 py-2.5 text-sm font-medium transition-colors",
                  itemActive
                    ? "bg-[var(--wc-usa-light)] text-[var(--wc-usa)]"
                    : "text-zinc-700 hover:bg-zinc-50"
                )}
                onClick={() => setOpen(false)}
              >
                <Icon size={16} strokeWidth={itemActive ? 2.5 : 2} />
                {label}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}

function MobileNavLink({
  href,
  label,
  icon: Icon,
  pathname,
}: {
  href: string;
  label: string;
  icon: React.ComponentType<{ size?: number; strokeWidth?: number }>;
  pathname: string;
}) {
  const active = isNavLinkActive(pathname, href);
  return (
    <Link
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

          <div className="hidden md:flex items-center shrink-0">
            <MascotFootballPlay />
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
          {NAV_BEFORE_HOSTS.map((item) => (
            <NavLink key={item.href} {...item} pathname={pathname} />
          ))}
          <HostsVenuesDropdown pathname={pathname} />
          <FanToolsDropdown pathname={pathname} />
          {NAV_AFTER_HOSTS.map((item) => (
            <NavLink key={item.href} {...item} pathname={pathname} />
          ))}
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
              {NAV_BEFORE_HOSTS.map((item) => (
                <MobileNavLink key={item.href} {...item} pathname={pathname} />
              ))}

              <div className="col-span-2 rounded-xl border border-zinc-100 bg-zinc-50/80 p-2">
                <p className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                  Hosts & Venues
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {HOSTS_VENUES_LINKS.map((item) => (
                    <MobileNavLink key={item.href} {...item} pathname={pathname} />
                  ))}
                </div>
              </div>

              <div className="col-span-2 rounded-xl border border-zinc-100 bg-zinc-50/80 p-2">
                <p className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                  Fan Tools
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {FAN_TOOLS_LINKS.map((item) => (
                    <MobileNavLink key={item.href} {...item} pathname={pathname} />
                  ))}
                </div>
              </div>

              {NAV_AFTER_HOSTS.map((item) => (
                <MobileNavLink key={item.href} {...item} pathname={pathname} />
              ))}
            </div>
          </nav>
        </>
      )}
    </header>
  );
}
