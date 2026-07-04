import { PageShellSkeleton } from "@/components/PageShellSkeleton";
import { PageLoading } from "@/components/PageLoading";

export default function Loading() {
  return (
    <>
      <PageLoading label="Loading The Goal Posts" subtitle="Live scores, fixtures & standings" />
      <div className="sr-only" aria-hidden>
        <PageShellSkeleton />
      </div>
    </>
  );
}
