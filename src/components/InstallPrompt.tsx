"use client";

import { useEffect, useState } from "react";
import { Download, X } from "lucide-react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

const DISMISS_KEY = "wc26_pwa_install_dismissed";

export function InstallPrompt() {
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(null);
  const [visible, setVisible] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    if (localStorage.getItem(DISMISS_KEY)) return;

    const isApple =
      /iPad|iPhone|iPod/.test(navigator.userAgent) &&
      !(window as Window & { MSStream?: unknown }).MSStream;
    setIsIOS(isApple);

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferred(e as BeforeInstallPromptEvent);
      setVisible(true);
    };

    window.addEventListener("beforeinstallprompt", handler);

    if (isApple && !(navigator as Navigator & { standalone?: boolean }).standalone) {
      setVisible(true);
    }

    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  async function handleInstall() {
    if (deferred) {
      await deferred.prompt();
      await deferred.userChoice;
      setVisible(false);
      setDeferred(null);
      return;
    }
    setVisible(false);
  }

  function dismiss() {
    localStorage.setItem(DISMISS_KEY, "1");
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div className="fixed bottom-20 left-4 right-4 z-50 sm:left-auto sm:right-4 sm:max-w-sm">
      <div className="card-elevated rounded-2xl p-4 shadow-lg border border-blue-100">
        <div className="flex items-start justify-between gap-2 mb-2">
          <p className="font-bold text-zinc-900 text-sm flex items-center gap-2">
            <Download size={16} className="text-blue-600" />
            Install The Goal Posts
          </p>
          <button type="button" onClick={dismiss} className="text-zinc-400 hover:text-zinc-600 p-1">
            <X size={16} />
          </button>
        </div>
        <p className="text-xs text-zinc-500 leading-relaxed">
          {isIOS
            ? "Tap Share → Add to Home Screen for quick access to live scores."
            : "Add to your home screen for faster live scores and offline fixtures."}
        </p>
        {!isIOS && deferred && (
          <button
            type="button"
            onClick={handleInstall}
            className="mt-3 w-full btn-primary py-2 text-xs font-semibold"
          >
            Install app
          </button>
        )}
      </div>
    </div>
  );
}
