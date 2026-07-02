import Link from "next/link";
import { Calendar, GitBranch, Puzzle, Star, Trophy, Tv } from "lucide-react";
import { WC26PageBanner } from "@/components/WC26Brand";
import { FollowOnX } from "@/components/FollowOnX";
import { createPageMetadata } from "@/lib/seo";
import { SITE_NAME, getSiteUrl } from "@/lib/site";

export const metadata = createPageMetadata({
  title: "About Us",
  description: `${SITE_NAME} is an independent FIFA World Cup 2026 fan hub - live scores, fixtures, standings, tools, puzzles, and history in one free place.`,
  path: "/about",
  keywords: ["about The Goal Posts", "World Cup 2026 website", "football fan site"],
});

export default function AboutPage() {
  const host = getSiteUrl().replace(/^https?:\/\//, "");

  return (
    <div className="space-y-6">
      <WC26PageBanner
        title="About Us"
        subtitle={`Who we are and what ${SITE_NAME} is for`}
      />

      <article className="card-surface rounded-2xl p-5 sm:p-7 space-y-6 text-sm leading-relaxed text-zinc-600">
        <p>
          <strong className="text-zinc-900">{SITE_NAME}</strong> is an independent fan project built
          for the FIFA World Cup 2026 across the United States, Mexico, and Canada. We bring live
          scores, fixtures, standings, stats, and fan tools together at{" "}
          <span className="font-medium text-zinc-800">{host}</span> - free to use, with no account
          required.
        </p>

        <Section title="What we do">
          <p>
            We help fans follow the tournament without jumping between a dozen apps and sites. That
            means live and upcoming matches, group tables, the knockout bracket, Golden Boot
            leaders, team and player pages, where-to-watch guides, and original editorial when we
            have something worth saying.
          </p>
        </Section>

        <Section title="Fan tools & games">
          <ul className="mt-2 grid gap-3 sm:grid-cols-2">
            <Feature icon={Star} label="My World Cup" href="/my">
              Follow your nations and see their matches first on your device.
            </Feature>
            <Feature icon={GitBranch} label="Live knockout bracket" href="/bracket">
              Follow Round of 32 through the Final with live scores.
            </Feature>
            <Feature icon={Calendar} label="Daily digest" href="/daily">
              Yesterday&apos;s results, today&apos;s fixtures, and what&apos;s live now.
            </Feature>
            <Feature icon={Puzzle} label="Daily puzzles" href="/puzzles">
              Guess the player, name scramble, and World Cup trivia - new every day.
            </Feature>
            <Feature icon={Trophy} label="History & moments" href="/history">
              Past winners, records, rivalries, and iconic World Cup stories.
            </Feature>
            <Feature icon={Tv} label="Where to watch" href="/watch">
              Broadcast and streaming pointers by country.
            </Feature>
          </ul>
        </Section>

        <Section title="Our data">
          <p>
            Live scores, fixtures, and most statistics come from third-party sports data providers
            (including ESPN). We refresh them throughout the day, but delays and errors can happen -
            always double-check kickoff times and official results when it matters.
          </p>
        </Section>

        <Section title="Editorial & original content" id="editorial">
          <p>
            {SITE_NAME} is more than a live-score widget. We publish original articles (marked
            &ldquo;Exclusive&rdquo; on our news hub), hand-written team qualification stories for
            every nation, curated player profiles for marquee stars, travel guides for all 20 host
            cities, rivalry deep-dives, and a full{" "}
            <Link href="/history" className="text-blue-600 hover:underline font-medium">
              World Cup history
            </Link>{" "}
            section covering every tournament since 1930.
          </p>
          <p>
            Headlines from external providers appear as short briefs with a link to the full story at
            the source; we do not republish those articles in full. Syndicated news pages are not
            indexed by search engines. Player pages without a curated profile are stats-only and
            similarly excluded from search indexing so we surface our best editorial work first.
          </p>
          <p>
            We follow Google&apos;s publisher policies: clear attribution, no scraped full-text
            republishing, and substantive guides alongside live data. Questions or corrections:{" "}
            <Link href="/contact" className="text-blue-600 hover:underline font-medium">
              contact us on X
            </Link>
            .
          </p>
        </Section>

        <Section title="Not affiliated with FIFA">
          <p>
            {SITE_NAME} is not affiliated with, endorsed by, or connected to FIFA, any national
            football association, broadcaster, or team. Team names, logos, and tournament marks
            belong to their respective owners and are used for identification and editorial purposes
            only.
          </p>
        </Section>

        <Section title="Free & on your device">
          <p>
            The site is free and supported by advertising. Personal features - your followed teams,
            bracket picks, puzzle streaks, and preferences - are stored locally in your browser, not
            on our servers. You can install it as an app on your phone or desktop for quick access
            during the tournament.
          </p>
        </Section>

        <p>
          Questions or feedback?{" "}
          <Link href="/contact" className="text-blue-600 hover:underline font-medium">
            Reach us on X
          </Link>
          . For privacy and terms, see our{" "}
          <Link href="/privacy" className="text-blue-600 hover:underline">
            Privacy Policy
          </Link>{" "}
          and{" "}
          <Link href="/terms" className="text-blue-600 hover:underline">
            Terms of Use
          </Link>
          .
        </p>
      </article>

      <FollowOnX />
    </div>
  );
}

function Section({
  title,
  children,
  id,
}: {
  title: string;
  children: React.ReactNode;
  id?: string;
}) {
  return (
    <section className="space-y-2" id={id}>
      <h2 className="text-base font-bold text-zinc-900">{title}</h2>
      {children}
    </section>
  );
}

function Feature({
  icon: Icon,
  label,
  href,
  children,
}: {
  icon: React.ComponentType<{ size?: number; className?: string }>;
  label: string;
  href: string;
  children: React.ReactNode;
}) {
  return (
    <li className="rounded-xl border border-zinc-100 bg-zinc-50/80 p-3">
      <Link href={href} className="group flex gap-3">
        <Icon size={18} className="mt-0.5 shrink-0 text-[var(--wc-usa)]" />
        <div>
          <p className="font-semibold text-zinc-900 group-hover:text-[var(--wc-usa)] transition-colors">
            {label}
          </p>
          <p className="mt-0.5 text-xs text-zinc-500 leading-snug">{children}</p>
        </div>
      </Link>
    </li>
  );
}
