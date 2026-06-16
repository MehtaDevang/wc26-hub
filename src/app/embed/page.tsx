import { Code2 } from "lucide-react";
import { createPageMetadata } from "@/lib/seo";
import { getSiteUrl } from "@/lib/site";

export const metadata = createPageMetadata({
  title: "Embeddable World Cup 2026 Live Scores Widget",
  description:
    "Add free FIFA World Cup 2026 live scores to your blog or site with a lightweight iframe embed from The Goal Posts.",
  path: "/embed",
  keywords: ["World Cup embed widget", "live scores widget", "football scores embed"],
});

export default function EmbedDocsPage() {
  const siteUrl = getSiteUrl();
  const snippet = `<script src="${siteUrl}/embed.js" data-host="${siteUrl}"></script>`;
  const iframeSnippet = `<iframe src="${siteUrl}/embed/live-scores" title="World Cup 2026 Live Scores" style="width:100%;min-height:320px;border:0;border-radius:12px;" loading="lazy"></iframe>`;

  return (
    <div className="space-y-8 max-w-2xl">
      <div className="card-surface rounded-2xl overflow-hidden">
        <div className="host-stripe" />
        <div className="p-6">
          <h1 className="section-title text-2xl flex items-center gap-2">
            <Code2 size={26} className="text-blue-600" />
            Live Scores Embed
          </h1>
          <p className="text-sm text-zinc-500 mt-2 leading-relaxed">
            Drop today&apos;s World Cup scores on any site. Free for blogs, fan pages, and newsletters.
          </p>
        </div>
      </div>

      <section className="card-surface rounded-2xl p-6 space-y-3">
        <h2 className="font-bold text-zinc-900">Option 1 - Script tag</h2>
        <p className="text-sm text-zinc-500">Auto-resizes iframe to content height.</p>
        <pre className="rounded-xl bg-zinc-900 text-zinc-100 p-4 text-xs overflow-x-auto leading-relaxed">
          {snippet}
        </pre>
      </section>

      <section className="card-surface rounded-2xl p-6 space-y-3">
        <h2 className="font-bold text-zinc-900">Option 2 - iframe</h2>
        <p className="text-sm text-zinc-500">Paste directly into HTML or CMS embed blocks.</p>
        <pre className="rounded-xl bg-zinc-900 text-zinc-100 p-4 text-xs overflow-x-auto leading-relaxed">
          {iframeSnippet}
        </pre>
      </section>

      <section className="card-surface rounded-2xl p-6">
        <h2 className="font-bold text-zinc-900 mb-3">Preview</h2>
        <iframe
          src="/embed/live-scores"
          title="World Cup 2026 Live Scores preview"
          className="w-full min-h-[320px] rounded-xl border border-zinc-200"
          loading="lazy"
        />
      </section>
    </div>
  );
}
