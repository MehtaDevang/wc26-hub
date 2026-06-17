"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export type InstallOutcome = "accepted" | "dismissed" | "unavailable";

interface InstallState {
  /** Chromium install prompt is available (Android / desktop Chrome/Edge). */
  canInstall: boolean;
  /** Running on iOS Safari, where install is manual (Share -> Add to Home Screen). */
  isIOS: boolean;
  /** Already installed / launched as a standalone app. */
  isStandalone: boolean;
  promptInstall: () => Promise<InstallOutcome>;
}

const InstallContext = createContext<InstallState>({
  canInstall: false,
  isIOS: false,
  isStandalone: false,
  promptInstall: async () => "unavailable",
});

export function useInstall(): InstallState {
  return useContext(InstallContext);
}

export function InstallProvider({ children }: { children: React.ReactNode }) {
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(null);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    const isApple =
      /iPad|iPhone|iPod/.test(navigator.userAgent) &&
      !(window as Window & { MSStream?: unknown }).MSStream;
    setIsIOS(isApple);

    const standalone =
      window.matchMedia?.("(display-mode: standalone)").matches ||
      (navigator as Navigator & { standalone?: boolean }).standalone === true;
    setIsStandalone(!!standalone);

    const onPrompt = (e: Event) => {
      e.preventDefault();
      setDeferred(e as BeforeInstallPromptEvent);
    };
    const onInstalled = () => {
      setDeferred(null);
      setIsStandalone(true);
    };

    window.addEventListener("beforeinstallprompt", onPrompt);
    window.addEventListener("appinstalled", onInstalled);
    return () => {
      window.removeEventListener("beforeinstallprompt", onPrompt);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  const promptInstall = useCallback(async (): Promise<InstallOutcome> => {
    if (!deferred) return "unavailable";
    await deferred.prompt();
    const { outcome } = await deferred.userChoice;
    if (outcome === "accepted") setDeferred(null);
    return outcome;
  }, [deferred]);

  return (
    <InstallContext.Provider
      value={{ canInstall: !!deferred, isIOS, isStandalone, promptInstall }}
    >
      {children}
    </InstallContext.Provider>
  );
}
