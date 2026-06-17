"use client";

import { useEffect, useState } from "react";
import { Download, X } from "lucide-react";
import { useInstall } from "@/components/InstallProvider";
import { useIsNativeApp } from "@/components/NativeAppProvider";

const DISMISS_KEY = "wc26_pwa_install_dismissed";

export function InstallPrompt() {
  const isNativeApp = useIsNativeApp();
  const { canInstall, isIOS, isStandalone, promptInstall } = useInstall();
  const [dismissed, setDismissed] = useState(true);

  useEffect(() => {
    try {
      setDismissed(!!localStorage.getItem(DISMISS_KEY));
    } catch {
      setDismissed(false);
    }
  }, []);

  if (isNativeApp || isStandalone || dismissed) return null;
  // Show when an install prompt is available (Android) or on iOS (manual install).
  if (!canInstall && !isIOS) return null;

  function dismiss() {
    try {
      localStorage.setItem(DISMISS_KEY, "1");
    } catch {
      // ignore
    }
    setDismissed(true);
  }

  return (
    <div className="fixed bottom-20 left-4 right-4 z-50 sm:left-auto sm:right-4 sm:max-w-sm">
      <div className="card-elevated rounded-2xl p-4 shadow-lg border border-blue-100">
        <div className="flex items-start justify-between gap-2 mb-2">
          <p className="font-bold text-zinc-900 text-sm flex items-center gap-2">
            <Download size={16} className="text-blue-600" />
            Install The Goal Posts
          </p>
          <button
            type="button"
            onClick={dismiss}
            className="text-zinc-400 hover:text-zinc-600 p-1"
            aria-label="Dismiss install prompt"
          >
            <X size={16} />
          </button>
        </div>
        <p className="text-xs text-zinc-500 leading-relaxed">
          {isIOS
            ? "Tap Share → Add to Home Screen for quick access to live scores."
            : "Add to your home screen for faster live scores and offline fixtures."}
        </p>
        {!isIOS && canInstall && (
          <button
            type="button"
            onClick={() => promptInstall()}
            className="mt-3 w-full btn-primary py-2 text-xs font-semibold"
          >
            Install app
          </button>
        )}
      </div>
    </div>
  );
}
