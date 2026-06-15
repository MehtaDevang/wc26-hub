"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Languages } from "lucide-react";
import clsx from "clsx";
import { LOCALES, LOCALE_LABELS, localePath, type Locale } from "@/lib/i18n";

function resolveLocale(pathname: string): Locale {
  const seg = pathname.split("/")[1];
  if (seg === "es" || seg === "fr") return seg;
  return "en";
}

function stripLocale(pathname: string): string {
  const parts = pathname.split("/").filter(Boolean);
  if (parts[0] === "es" || parts[0] === "fr") {
    const rest = parts.slice(1).join("/");
    return rest ? `/${rest}` : "/";
  }
  return pathname || "/";
}

export function LocaleSwitcher({ className }: { className?: string }) {
  const pathname = usePathname();
  const current = resolveLocale(pathname);
  const basePath = stripLocale(pathname);

  return (
    <span className={clsx("inline-flex items-center gap-1", className)}>
      <Languages size={14} className="text-zinc-400 shrink-0" aria-hidden />
      {LOCALES.map((locale) => (
        <Link
          key={locale}
          href={localePath(locale, basePath)}
          className={clsx(
            "rounded-md px-2 py-1 text-[11px] font-semibold uppercase tracking-wide transition-colors",
            current === locale
              ? "bg-[var(--wc-usa-light)] text-[var(--wc-usa)]"
              : "text-zinc-400 hover:text-zinc-700 hover:bg-zinc-50"
          )}
          hrefLang={locale}
        >
          {locale}
        </Link>
      ))}
      <span className="sr-only">Language: {LOCALE_LABELS[current]}</span>
    </span>
  );
}
