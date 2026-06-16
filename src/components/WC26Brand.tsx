import { MASCOTS, WC26_TROPHY_GOLD, type MascotId } from "@/lib/wc26-brand";
import { WC26MascotIcon } from "./mascots/WC26Mascots";

const ORDER: MascotId[] = ["zayu", "clutch", "maple"];

interface WC26MascotStripProps {
  variant?: "compact" | "hero" | "footer";
  className?: string;
}

export function WC26MascotStrip({ variant = "compact", className = "" }: WC26MascotStripProps) {
  if (variant === "hero") {
    return (
      <div className={`flex items-end justify-center gap-4 sm:gap-8 ${className}`}>
        {ORDER.map((id) => {
          const m = MASCOTS[id];
          return (
            <div key={id} className="flex flex-col items-center gap-1.5 group">
              <div
                className="wc26-mascot-bubble transition-transform group-hover:-translate-y-1"
                style={{ background: m.colorLight, borderColor: `${m.color}22` }}
              >
                <WC26MascotIcon id={id} size={56} />
              </div>
              <div className="text-center">
                <p className="text-xs font-bold text-zinc-900">{m.name}</p>
                <p className="text-[10px] text-zinc-400">{m.flag} {m.host}</p>
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  if (variant === "footer") {
    return (
      <div className={`flex items-center justify-center gap-6 ${className}`}>
        {ORDER.map((id) => {
          const m = MASCOTS[id];
          return (
            <div key={id} className="flex items-center gap-2" title={`${m.name} - ${m.host}`}>
              <WC26MascotIcon id={id} size={28} />
              <span className="text-[10px] font-semibold text-zinc-500 hidden sm:inline">{m.name}</span>
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <div className={`inline-flex items-center gap-2 rounded-full bg-white border border-zinc-200 px-3 py-1.5 shadow-sm ${className}`}>
      {ORDER.map((id, i) => (
        <span key={id} className="flex items-center gap-1.5">
          {i > 0 && <span className="text-zinc-200">·</span>}
          <WC26MascotIcon id={id} size={22} />
          <span className="text-[10px] font-semibold text-zinc-500 hidden xs:inline">{MASCOTS[id].name}</span>
        </span>
      ))}
      <span
        className="ml-1 text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full"
        style={{ background: `${WC26_TROPHY_GOLD}18`, color: WC26_TROPHY_GOLD }}
      >
        WC26
      </span>
    </div>
  );
}

interface WC26PageBannerProps {
  title: string;
  subtitle?: string;
}

export function WC26PageBanner({ title, subtitle }: WC26PageBannerProps) {
  return (
    <div className="wc26-page-banner relative overflow-hidden rounded-2xl">
      <div className="host-stripe absolute top-0 left-0 right-0" />
      <div className="relative px-5 py-6 sm:px-8 sm:py-7 flex flex-col sm:flex-row sm:items-center justify-between gap-5">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400 mb-1">
            FIFA World Cup 2026
          </p>
          <h1 className="section-title text-gradient-wc26">{title}</h1>
          {subtitle && <p className="text-zinc-500 text-sm mt-1.5">{subtitle}</p>}
        </div>
        <div className="flex items-center gap-3 shrink-0">
          {ORDER.map((id) => (
            <div
              key={id}
              className="wc26-mascot-bubble-sm"
              style={{ background: MASCOTS[id].colorLight }}
              title={MASCOTS[id].name}
            >
              <WC26MascotIcon id={id} size={36} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
