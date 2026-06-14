import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export function PuzzleShell({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="max-w-lg mx-auto space-y-6">
      <Link
        href="/puzzles"
        className="inline-flex items-center gap-2 text-sm text-zinc-500 hover:text-zinc-900 transition-colors"
      >
        <ArrowLeft size={16} />
        All Puzzles
      </Link>
      <div className="text-center">
        <h1 className="section-title">{title}</h1>
        {subtitle && <p className="text-zinc-500 text-sm mt-1">{subtitle}</p>}
      </div>
      {children}
    </div>
  );
}
