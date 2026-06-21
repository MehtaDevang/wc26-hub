import { ExternalLink } from "lucide-react";
import { WC26PageBanner } from "@/components/WC26Brand";
import { FollowOnX } from "@/components/FollowOnX";
import { createPageMetadata } from "@/lib/seo";
import { SITE_NAME, SITE_TWITTER_FOLLOW_URL, SITE_TWITTER_HANDLE, SITE_TWITTER_URL } from "@/lib/site";

export const metadata = createPageMetadata({
  title: "Contact Us",
  description: `Get in touch with ${SITE_NAME} on X (Twitter) - questions, feedback, corrections, and partnership enquiries.`,
  path: "/contact",
  keywords: ["contact The Goal Posts", "World Cup site contact", "Twitter"],
});

function XIcon({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

export default function ContactPage() {
  return (
    <div className="space-y-6">
      <WC26PageBanner
        title="Contact Us"
        subtitle={`The best way to reach ${SITE_NAME}`}
      />

      <article className="card-surface rounded-2xl p-5 sm:p-8 text-center space-y-6">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-zinc-900 text-white">
          <XIcon size={28} />
        </div>

        <div className="space-y-2 max-w-md mx-auto">
          <h2 className="text-lg font-bold text-zinc-900">We&apos;re on X</h2>
          <p className="text-sm text-zinc-500 leading-relaxed">
            {SITE_NAME} handles all enquiries through our X account. Send us a message or mention us
            for score corrections, site feedback, bug reports, or general questions about the World
            Cup hub.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <a
            href={SITE_TWITTER_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary inline-flex items-center gap-2 px-6 py-3 text-sm"
          >
            <XIcon size={16} />
            @{SITE_TWITTER_HANDLE}
            <ExternalLink size={14} className="opacity-80" />
          </a>
          <a
            href={SITE_TWITTER_FOLLOW_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-secondary inline-flex items-center gap-2 px-6 py-3 text-sm"
          >
            Follow on X
          </a>
        </div>

        <p className="text-xs text-zinc-400 max-w-sm mx-auto">
          We try to reply when we can, especially during the tournament. For advertising enquiries,
          include &ldquo;ads&rdquo; in your message.
        </p>
      </article>

      <FollowOnX variant="compact" className="block text-center" />
    </div>
  );
}
