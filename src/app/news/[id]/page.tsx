import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { NewsArticleContent } from "@/components/NewsArticleContent";
import { createPageMetadata } from "@/lib/seo";
import { getWorldCupNewsArticle } from "@/lib/espn/services";
import { isValidNewsId } from "@/lib/api-security";

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { id } = await params;
  if (!isValidNewsId(id)) return {};

  const article = await getWorldCupNewsArticle(id);
  if (!article) return {};

  return createPageMetadata({
    title: article.headline,
    description: article.summary,
    path: `/news/${id}`,
  });
}

export const revalidate = 300;

export default async function NewsArticlePage({ params }: PageProps) {
  const { id } = await params;

  if (!isValidNewsId(id)) notFound();

  const article = await getWorldCupNewsArticle(id);
  if (!article) notFound();

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <Link
        href="/news"
        className="inline-flex items-center gap-1.5 text-sm font-semibold text-zinc-500 hover:text-blue-600 transition-colors"
      >
        <ArrowLeft size={16} />
        Back to news
      </Link>

      <div className="card-surface rounded-2xl overflow-hidden">
        <div className="host-stripe" />
        <div className="p-5 sm:p-8">
          <NewsArticleContent article={article} />
        </div>
      </div>
    </div>
  );
}
