export function PuzzleProgress({
  current,
  total,
  score,
}: {
  current: number;
  total: number;
  score?: number;
}) {
  const pct = total > 0 ? ((current) / total) * 100 : 0;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm">
        <span className="text-zinc-500">
          Question <span className="font-semibold text-zinc-900">{Math.min(current + 1, total)}</span> of {total}
        </span>
        {score !== undefined && (
          <span className="font-semibold text-blue-600">{score}/{total} correct</span>
        )}
      </div>
      <div className="h-1.5 rounded-full bg-zinc-100 overflow-hidden">
        <div
          className="h-full bg-blue-600 rounded-full transition-all duration-300"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
