import { Suspense } from "react";
import Link from "next/link";
import { NewsHub } from "@/components/NewsHub";
import { WC26PageBanner } from "@/components/WC26Brand";
import { AdBanner } from "@/components/AdBanner";
import { HomeSectionSkeleton } from "@/components/home/HomeSections";
import { createPageMetadata } from "@/lib/seo";
import { getWorldCupNews } from "@/lib/espn/services";

export const metadata = createPageMetadata({
  title: "World Cup 2026 News - Exclusive Stories & FIFA Headlines",
  description:
    "Latest FIFA World Cup 2026 news from The Goal Posts exclusives and ESPN - previews, results, video, and tournament analysis.",
  path: "/news",
  keywords: [
    "World Cup 2026 news",
    "FIFA World Cup headlines",
    "World Cup exclusive",
    "World Cup match preview",
  ],
});

export const revalidate = 120;

async function NewsHubSection() {
  const articles = await getWorldCupNews(40);
  return <NewsHub articles={articles} />;
}

export default function NewsPage() {
  return (
    <div className="space-y-6">
      <WC26PageBanner
        title="World Cup News"
        subtitle="Goal Posts exclusives, match stories, and FIFA headlines"
      />
      <p className="text-sm text-zinc-500">
        <Link href="/" className="text-blue-600 hover:underline font-medium">
          ← Back to live scores
        </Link>
      </p>
      <AdBanner placement="inline" />
      <Suspense fallback={<HomeSectionSkeleton height={400} />}>
        <NewsHubSection />
      </Suspense>
    </div>
  );
}
