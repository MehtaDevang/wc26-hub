import { HelpCircle } from "lucide-react";
import { JsonLd } from "@/components/JsonLd";
import { buildFaqJsonLd, type FaqEntry } from "@/lib/structured-data";

/**
 * Renders visible FAQ content plus matching FAQPage structured data.
 * Visible text and JSON-LD must stay in sync for rich-result eligibility.
 */
export function FaqSection({
  heading = "Frequently asked questions",
  items,
}: {
  heading?: string;
  items: FaqEntry[];
}) {
  if (items.length === 0) return null;

  return (
    <section className="card-surface rounded-2xl p-5 sm:p-6" aria-labelledby="faq-heading">
      <JsonLd data={buildFaqJsonLd(items)} />
      <h2 id="faq-heading" className="flex items-center gap-2 text-lg font-bold text-zinc-900 mb-4">
        <HelpCircle size={18} className="text-blue-600" />
        {heading}
      </h2>
      <dl className="divide-y divide-zinc-100">
        {items.map((item) => (
          <div key={item.question} className="py-3 first:pt-0 last:pb-0">
            <dt className="text-sm font-semibold text-zinc-900">{item.question}</dt>
            <dd className="mt-1.5 text-sm text-zinc-600 leading-relaxed">{item.answer}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
