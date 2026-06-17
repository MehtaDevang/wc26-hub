"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Cookie } from "lucide-react";
import { CONSENT_STORAGE_KEY, updateConsent } from "@/lib/consent";

export function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      if (!localStorage.getItem(CONSENT_STORAGE_KEY)) {
        setVisible(true);
      }
    } catch {
      setVisible(true);
    }
  }, []);

  function choose(choice: "granted" | "denied") {
    updateConsent(choice);
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div
      className="fixed inset-x-0 bottom-0 z-[150] px-3 pb-3 sm:px-4 sm:pb-4"
      role="dialog"
      aria-live="polite"
      aria-label="Cookie consent"
    >
      <div className="mx-auto max-w-3xl card-elevated rounded-2xl border border-zinc-200 bg-white p-4 shadow-xl sm:p-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="flex items-start gap-3">
            <Cookie size={20} className="mt-0.5 shrink-0 text-[var(--wc-usa)]" />
            <p className="text-xs leading-relaxed text-zinc-600">
              We use cookies for analytics and to show ads that keep this site free. You can accept
              all, or reject non-essential cookies. See our{" "}
              <Link href="/privacy" className="text-blue-600 hover:underline">
                Privacy Policy
              </Link>
              .
            </p>
          </div>
          <div className="flex shrink-0 gap-2 sm:ml-auto">
            <button
              type="button"
              onClick={() => choose("denied")}
              className="btn-secondary flex-1 px-4 py-2 text-xs font-semibold sm:flex-none"
            >
              Reject
            </button>
            <button
              type="button"
              onClick={() => choose("granted")}
              className="btn-primary flex-1 px-4 py-2 text-xs font-semibold sm:flex-none"
            >
              Accept all
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
