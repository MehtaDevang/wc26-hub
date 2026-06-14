import Link from "next/link";
import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "Page Not Found",
  description: "The page you are looking for does not exist on The Goal Posts.",
  path: "/404",
  noIndex: true,
});

export default function NotFound() {
  return (
    <div className="mx-auto max-w-lg py-16 text-center">
      <p className="text-6xl font-extrabold text-[var(--wc-usa)]">404</p>
      <h1 className="mt-4 text-2xl font-bold text-zinc-900">Page not found</h1>
      <p className="mt-2 text-sm text-zinc-500">
        That match, puzzle, or page may have moved or never existed.
      </p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <Link href="/" className="btn-primary">
          Back to Home
        </Link>
        <Link href="/fixtures" className="btn-secondary">
          View Fixtures
        </Link>
      </div>
    </div>
  );
}
