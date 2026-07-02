import Link from "next/link";
import { WC26PageBanner } from "@/components/WC26Brand";
import { createPageMetadata } from "@/lib/seo";
import { SITE_NAME, SITE_TWITTER_HANDLE, getSiteUrl } from "@/lib/site";

export const metadata = createPageMetadata({
  title: "Terms of Use",
  description: `The terms that govern your use of ${SITE_NAME}, including data accuracy disclaimers and our relationship to FIFA and third-party providers.`,
  path: "/terms",
  keywords: ["terms of use", "terms of service", "disclaimer"],
});

const LAST_UPDATED = "17 June 2026";

export default function TermsPage() {
  const host = getSiteUrl().replace(/^https?:\/\//, "");

  return (
    <div className="space-y-6">
      <WC26PageBanner
        title="Terms of Use"
        subtitle={`The rules for using ${SITE_NAME}`}
      />

      <article className="card-surface rounded-2xl p-5 sm:p-7 space-y-6 text-sm leading-relaxed text-zinc-600">
        <p className="text-xs text-zinc-400">Last updated: {LAST_UPDATED}</p>

        <p>
          These Terms of Use govern your access to and use of {SITE_NAME} at{" "}
          <span className="font-medium text-zinc-800">{host}</span> (the &ldquo;Service&rdquo;). By
          using the Service, you agree to these terms. If you do not agree, please do not use the
          Service.
        </p>

        <Section title="Not affiliated with FIFA">
          <p>
            {SITE_NAME} is an independent, fan-made information site. It is not affiliated with,
            authorised by, sponsored by, or otherwise connected to FIFA, the FIFA World Cup, any
            national football association, broadcaster, or team. All trademarks, team names, logos and
            related marks are the property of their respective owners and are used for identification
            and editorial purposes only.
          </p>
        </Section>

        <Section title="Information accuracy">
          <p>
            Live scores, fixtures, statistics, standings, broadcast listings and similar data are
            sourced from third parties (including ESPN) and are provided on an &ldquo;as is&rdquo;
            basis. Data may be delayed, incomplete or inaccurate. Always verify critical information
            (such as kickoff times or where to watch) with official sources.
          </p>
        </Section>

        <Section title="Predictions, simulators and games">
          <p>
            Features such as the live knockout bracket, group simulator, scenario calculator, pools and
            puzzles are provided for entertainment only. They do not constitute betting advice or any
            guarantee of outcomes. {SITE_NAME} does not facilitate gambling and is not responsible for
            any decisions you make based on these features.
          </p>
        </Section>

        <Section title="Acceptable use">
          <p>You agree not to:</p>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            <li>use the Service for any unlawful purpose;</li>
            <li>attempt to disrupt, overload, scrape at scale, or interfere with the Service;</li>
            <li>
              copy, resell or redistribute substantial portions of the content without permission.
            </li>
          </ul>
        </Section>

        <Section title="Third-party links and advertising">
          <p>
            The Service contains advertising and links to third-party websites. We do not control and
            are not responsible for the content, products or practices of those third parties. Your
            use of advertising and the privacy practices around it are described in our{" "}
            <Link href="/privacy" className="text-blue-600 hover:underline">
              Privacy Policy
            </Link>
            .
          </p>
        </Section>

        <Section title="Disclaimer of warranties">
          <p>
            The Service is provided &ldquo;as is&rdquo; and &ldquo;as available&rdquo; without
            warranties of any kind, whether express or implied, including fitness for a particular
            purpose, accuracy, or uninterrupted availability.
          </p>
        </Section>

        <Section title="Limitation of liability">
          <p>
            To the maximum extent permitted by law, {SITE_NAME} and its operators shall not be liable
            for any indirect, incidental, or consequential damages arising from your use of, or
            inability to use, the Service.
          </p>
        </Section>

        <Section title="Changes">
          <p>
            We may update these terms from time to time. Continued use of the Service after changes
            take effect constitutes acceptance of the updated terms.
          </p>
        </Section>

        <Section title="Contact">
          <p>
            Questions about these terms?{" "}
            <Link href="/contact" className="text-blue-600 hover:underline">
              Message us on X (@{SITE_TWITTER_HANDLE})
            </Link>
            .
          </p>
        </Section>
      </article>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-2">
      <h2 className="text-base font-bold text-zinc-900">{title}</h2>
      {children}
    </section>
  );
}
