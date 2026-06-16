import { Sparkles } from "lucide-react";
import clsx from "clsx";

export function FeaturedPlayerBadge({
  size = "sm",
  className,
}: {
  size?: "sm" | "md";
  className?: string;
}) {
  return (
    <span
      className={clsx(
        "inline-flex shrink-0 items-center gap-0.5 rounded-full bg-violet-50 font-bold uppercase tracking-wider text-violet-700 ring-1 ring-violet-100",
        size === "sm" ? "px-1.5 py-0.5 text-[9px]" : "px-2 py-0.5 text-[10px]",
        className
      )}
      title="Featured profile with career background and play style"
    >
      <Sparkles size={size === "sm" ? 9 : 11} aria-hidden />
      Featured
    </span>
  );
}
