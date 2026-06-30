import Link from "next/link";
import type { HubIntro } from "@/lib/editorial-hub-intros";

export function EditorialHubIntro({ intro }: { intro: HubIntro }) {
  return (
    <section className="card-surface rounded-2xl p-5 sm:p-6 text-sm leading-relaxed text-zinc-600 space-y-3">
      <h2 className="text-base font-bold text-zinc-900">{intro.title}</h2>
      {intro.paragraphs.map((paragraph) => (
        <p key={paragraph.slice(0, 48)}>{paragraph}</p>
      ))}
      {intro.links && intro.links.length > 0 && (
        <p className="flex flex-wrap gap-x-3 gap-y-1 pt-1 text-sm">
          {intro.links.map((link, i) => (
            <span key={link.href} className="inline-flex items-center gap-3">
              {i > 0 && <span className="text-zinc-300">·</span>}
              <Link href={link.href} className="font-medium text-blue-600 hover:underline">
                {link.label}
              </Link>
            </span>
          ))}
        </p>
      )}
    </section>
  );
}
