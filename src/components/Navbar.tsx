"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Trophy, Calendar, Table2, Puzzle, History } from "lucide-react";
import clsx from "clsx";
import { SITE_NAME } from "@/lib/site";
import { WC26MascotIcon } from "./mascots/WC26Mascots";

const NAV_ITEMS = [
  { href: "/", label: "Home", icon: Trophy },
  { href: "/fixtures", label: "Fixtures", icon: Calendar },
  { href: "/standings", label: "Tables", icon: Table2 },
  { href: "/history", label: "History", icon: History },
  { href: "/puzzles", label: "Puzzles", icon: Puzzle },
];

export function Navbar() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-zinc-200">
      <div className="host-stripe" />
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 h-14">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="flex items-center -space-x-1.5">
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
          <div>
            <p className="font-bold text-zinc-900 text-[15px] leading-none group-hover:text-[var(--wc-usa)] transition-colors">
              {SITE_NAME}
            </p>
            <p className="text-[10px] text-zinc-400 leading-none mt-0.5 tracking-wide uppercase">
              Scores · Stats · Puzzles
            </p>
          </div>
        </Link>

        <nav className="flex items-center gap-0.5">
          {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
            const active =
              pathname === href ||
              (href === "/puzzles" && pathname.startsWith("/puzzles")) ||
              (href === "/history" && pathname.startsWith("/history"));
            return (
              <Link
                key={href}
                href={href}
                className={clsx(
                  "flex items-center gap-1.5 rounded-lg px-3 py-2 text-[13px] font-medium transition-colors",
                  active
                    ? "bg-[var(--wc-usa-light)] text-[var(--wc-usa)]"
                    : "text-zinc-500 hover:text-zinc-900 hover:bg-zinc-50"
                )}
              >
                <Icon size={15} strokeWidth={active ? 2.5 : 2} />
                <span className="hidden sm:inline">{label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
