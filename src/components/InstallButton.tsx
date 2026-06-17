"use client";

import { useState } from "react";
import { Check, Download, Share } from "lucide-react";
import { useInstall } from "@/components/InstallProvider";
import { useIsNativeApp } from "@/components/NativeAppProvider";

export function InstallButton() {
  const isNativeApp = useIsNativeApp();
  const { canInstall, isIOS, isStandalone, promptInstall } = useInstall();
  const [hint, setHint] = useState<string | null>(null);

  if (isNativeApp) return null;

  if (isStandalone) {
    return (
      <div className="flex items-center gap-2 rounded-xl bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700">
        <Check size={18} />
        You&rsquo;re using the installed app. Enjoy the World Cup!
      </div>
    );
  }

  if (isIOS) {
    return (
      <div className="rounded-xl border border-blue-100 bg-blue-50/60 px-4 py-3 text-sm text-zinc-700">
        <p className="flex items-center gap-2 font-semibold text-zinc-900">
          <Share size={16} className="text-blue-600" />
          Install on iPhone &amp; iPad
        </p>
        <p className="mt-1 leading-relaxed">
          Tap the <strong>Share</strong> button in Safari, then choose{" "}
          <strong>Add to Home Screen</strong>.
        </p>
      </div>
    );
  }

  if (canInstall) {
    return (
      <button
        type="button"
        onClick={async () => {
          const outcome = await promptInstall();
          if (outcome === "unavailable") {
            setHint("Open your browser menu and choose “Install app”.");
          }
        }}
        className="btn-primary inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold"
      >
        <Download size={18} />
        Install app
      </button>
    );
  }

  return (
    <div className="rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm text-zinc-600">
      {hint ?? "Open your browser menu and choose “Install app” or “Add to Home screen”."}
    </div>
  );
}
