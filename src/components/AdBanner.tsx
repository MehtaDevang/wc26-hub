import clsx from "clsx";

interface AdBannerProps {
  slot?: "top" | "sidebar" | "inline";
  label?: string;
}

export function AdBanner({ slot = "inline", label = "Advertisement" }: AdBannerProps) {
  return (
    <div
      className={clsx(
        "flex items-center justify-center rounded-xl border border-dashed border-zinc-200 bg-zinc-50/80 text-center",
        slot === "top" && "h-16 w-full",
        slot === "sidebar" && "h-64 w-full",
        slot === "inline" && "h-20 w-full my-2"
      )}
      data-ad-slot={slot}
    >
      <div className="px-4">
        <p className="text-[10px] uppercase tracking-widest text-zinc-300 mb-0.5">{label}</p>
        <p className="text-xs text-zinc-400">Ad space available</p>
      </div>
    </div>
  );
}
