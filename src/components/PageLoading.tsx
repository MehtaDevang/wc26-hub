import { Loader2 } from "lucide-react";

interface PageLoadingProps {
  label?: string;
  subtitle?: string;
}

export function PageLoading({
  label = "Loading…",
  subtitle = "Fetching live World Cup data",
}: PageLoadingProps) {
  return (
    <div
      className="flex min-h-[50vh] flex-col items-center justify-center gap-4 px-4 py-16"
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <div className="relative">
        <div className="h-14 w-14 rounded-full border-4 border-zinc-100" />
        <Loader2
          className="absolute inset-0 m-auto h-14 w-14 animate-spin text-[var(--wc-usa)]"
          aria-hidden
        />
      </div>
      <div className="text-center">
        <p className="text-base font-bold text-zinc-900">{label}</p>
        <p className="mt-1 text-sm text-zinc-500">{subtitle}</p>
      </div>
      <div className="flex gap-1.5" aria-hidden>
        <span className="h-2 w-2 rounded-full bg-[var(--wc-usa)] animate-bounce [animation-delay:0ms]" />
        <span className="h-2 w-2 rounded-full bg-[var(--wc-mexico)] animate-bounce [animation-delay:150ms]" />
        <span className="h-2 w-2 rounded-full bg-[var(--wc-canada)] animate-bounce [animation-delay:300ms]" />
      </div>
    </div>
  );
}
