import { ExternalLink } from "lucide-react";
import {
  SITE_TWITTER_FOLLOW_URL,
  SITE_TWITTER_HANDLE,
  SITE_TWITTER_URL,
} from "@/lib/site";

function XIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

export function FollowOnX({
  variant = "banner",
  className = "",
}: {
  variant?: "banner" | "footer" | "compact";
  className?: string;
}) {
  if (variant === "footer") {
    return (
      <a
        href={SITE_TWITTER_FOLLOW_URL}
        target="_blank"
        rel="noopener noreferrer"
        className={`inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-zinc-50 px-4 py-2 text-xs font-semibold text-zinc-700 transition-colors hover:border-zinc-300 hover:bg-white hover:text-zinc-900 ${className}`.trim()}
      >
        <XIcon size={14} />
        Follow @{SITE_TWITTER_HANDLE}
        <ExternalLink size={12} className="text-zinc-400" />
      </a>
    );
  }

  if (variant === "compact") {
    return (
      <a
        href={SITE_TWITTER_FOLLOW_URL}
        target="_blank"
        rel="noopener noreferrer"
        className={`inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--wc-usa)] hover:underline ${className}`.trim()}
      >
        <XIcon size={14} />
        @{SITE_TWITTER_HANDLE}
      </a>
    );
  }

  return (
    <section
      className={`card-surface rounded-2xl overflow-hidden ${className}`.trim()}
      aria-label="Follow on X"
    >
      <div className="host-stripe" />
      <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
        <div className="min-w-0">
          <div className="mb-2 flex items-center gap-2 text-zinc-900">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-zinc-900 text-white">
              <XIcon size={15} />
            </span>
            <h3 className="font-bold text-base sm:text-lg">Follow us on X</h3>
          </div>
          <p className="text-sm text-zinc-500 leading-relaxed max-w-lg">
            Live score updates, match takes, and World Cup 2026 moments - follow{" "}
            <a
              href={SITE_TWITTER_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-zinc-700 hover:text-[var(--wc-usa)]"
            >
              @{SITE_TWITTER_HANDLE}
            </a>{" "}
            for the latest from The Goal Posts.
          </p>
        </div>
        <a
          href={SITE_TWITTER_FOLLOW_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-primary inline-flex shrink-0 items-center justify-center gap-2 px-5 py-2.5 text-sm"
        >
          <XIcon size={15} />
          Follow on X
        </a>
      </div>
    </section>
  );
}
