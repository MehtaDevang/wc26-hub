import Link from "next/link";
import { notFound } from "next/navigation";
import { getGroupPageData } from "@/lib/espn/groups";
import { GroupPageView } from "@/components/GroupPageView";
import { AdBanner } from "@/components/AdBanner";
import { createPageMetadata } from "@/lib/seo";
import { isValidGroupLetter } from "@/lib/api-security";
import { normalizeGroupLetter } from "@/lib/espn/groups";
import { getServerTimezone } from "@/lib/timezone";

interface PageProps {
  params: Promise<{ letter: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { letter } = await params;
  const group = normalizeGroupLetter(letter);

  if (!isValidGroupLetter(letter)) {
    return createPageMetadata({
      title: "Group Not Found",
      description: "World Cup 2026 group page not found.",
      path: `/groups/${letter}`,
      noIndex: true,
    });
  }

  return createPageMetadata({
    title: `World Cup 2026 Group ${group} — Standings & Fixtures`,
    description: `FIFA World Cup 2026 Group ${group} live standings, points table, fixtures, results, and team links.`,
    path: `/groups/${group}`,
  });
}

export const revalidate = 120;
export const maxDuration = 30;

export default async function GroupPage({ params }: PageProps) {
  const { letter } = await params;

  if (!isValidGroupLetter(letter)) notFound();

  const timeZone = await getServerTimezone();
  const data = await getGroupPageData(letter, timeZone);
  if (!data) notFound();

  return (
    <div className="space-y-6">
      <nav className="text-sm text-zinc-400">
        <Link href="/groups" className="hover:text-blue-600">Groups</Link>
        <span className="mx-2">/</span>
        <span className="text-zinc-600">{data.label}</span>
      </nav>
      <AdBanner placement="standings" />
      <GroupPageView data={data} />
    </div>
  );
}
