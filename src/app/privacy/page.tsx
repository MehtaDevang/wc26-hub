import Link from "next/link";
import { WC26PageBanner } from "@/components/WC26Brand";
import { createPageMetadata } from "@/lib/seo";
import { SITE_NAME, SITE_TWITTER_HANDLE, getSiteUrl } from "@/lib/site";

export const metadata = createPageMetadata({
  title: "Privacy Policy",
  description: `How ${SITE_NAME} handles your data, cookies, analytics and advertising. We do not require accounts and store your preferences locally in your browser.`,
  path: "/privacy",
  keywords: ["privacy policy", "cookie policy", "data protection"],
});

const LAST_UPDATED = "17 June 2026";

export default function PrivacyPage() {
  const host = getSiteUrl().replace(/^https?:\/\//, "");

  return (
    <div className="space-y-6">
      <WC26PageBanner
        title="Privacy Policy"
        subtitle={`How ${SITE_NAME} handles data, cookies and advertising`}
      />

      <article className="card-surface rounded-2xl p-5 sm:p-7 space-y-6 text-sm leading-relaxed text-zinc-600">
        <p className="text-xs text-zinc-400">Last updated: {LAST_UPDATED}</p>

        <p>
          {SITE_NAME} (&ldquo;we&rdquo;, &ldquo;us&rdquo;, &ldquo;our&rdquo;) operates the website at{" "}
          <span className="font-medium text-zinc-800">{host}</span>. This policy explains what
          information we collect, how we use it, and the choices you have. We have tried to keep it
          plain and honest. {SITE_NAME} is an independent fan project and is not affiliated with,
          endorsed by, or associated with FIFA.
        </p>

        <Section title="Accounts and personal data">
          <p>
            You do <strong>not</strong> need an account to use {SITE_NAME}, and we do not ask you to
            register or provide your name, email or other personal details to browse the site. We do
            not sell personal data.
          </p>
        </Section>

        <Section title="Information stored in your browser">
          <p>
            Several features remember your choices using your browser&rsquo;s local storage. This data
            stays on your device and is <strong>not transmitted to our servers</strong>. It includes
            things like:
          </p>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            <li>the teams you follow and your &ldquo;My World Cup&rdquo; preferences;</li>
            <li>your bracket predictions and saved pool entries;</li>
            <li>puzzle progress and scores;</li>
            <li>your preferred language, timezone and cookie-consent choice;</li>
            <li>whether you have dismissed prompts such as the install banner.</li>
          </ul>
          <p className="mt-2">
            You can clear this at any time by clearing your browser&rsquo;s site data.
          </p>
        </Section>

        <Section title="Analytics">
          <p>
            We use privacy-friendly, aggregate analytics (Vercel Analytics) to understand which pages
            are popular and how the site performs. These measurements are aggregated and are not used
            to identify you personally.
          </p>
        </Section>

        <Section title="Advertising and cookies">
          <p>
            We display advertising through Google AdSense to keep the site free. Google and its
            partners may use cookies and similar identifiers to serve and measure ads. Depending on
            your consent and region, these ads may be personalised or non-personalised.
          </p>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            <li>
              If you are in the EEA, UK or Switzerland, we ask for your consent before personalised
              advertising and non-essential cookies are enabled, using a consent banner. You can
              change your choice at any time by clearing the site data and reloading the page.
            </li>
            <li>
              You can learn more and control how Google uses data at{" "}
              <a
                href="https://policies.google.com/technologies/ads"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                policies.google.com/technologies/ads
              </a>
              .
            </li>
          </ul>
        </Section>

        <Section title="Third-party data and links">
          <p>
            Live scores, fixtures, statistics and some imagery are sourced from third-party providers
            (including ESPN). Our pages may link to external sites such as broadcasters or social
            networks. We are not responsible for the privacy practices or content of those third
            parties; please review their own policies.
          </p>
        </Section>

        <Section title="Children">
          <p>
            {SITE_NAME} is a general-audience sports site and is not directed at children under 13. We
            do not knowingly collect personal information from children.
          </p>
        </Section>

        <Section title="Your rights">
          <p>
            Depending on where you live (for example, under the EU/UK GDPR or India&rsquo;s Digital
            Personal Data Protection Act), you may have rights to access, correct or delete personal
            data and to withdraw consent. Because we do not collect personal data directly, most of
            this is in your control via your browser. For any request, contact us at the address
            below.
          </p>
        </Section>

        <Section title="Changes to this policy">
          <p>
            We may update this policy as the site evolves. Material changes will be reflected by the
            &ldquo;Last updated&rdquo; date above.
          </p>
        </Section>

        <Section title="Contact">
          <p>
            Questions about privacy?{" "}
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
