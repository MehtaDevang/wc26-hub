"use client";

import { useEffect } from "react";
import { PartyPopper } from "lucide-react";
import { firePuzzleConfetti } from "@/lib/puzzle-celebration";

interface PuzzleCelebrationProps {
  show: boolean;
  message?: string;
  subtitle?: string;
  onComplete?: () => void;
}

export function PuzzleCelebration({
  show,
  message = "Correct!",
  subtitle = "Nice one!",
  onComplete,
}: PuzzleCelebrationProps) {
  useEffect(() => {
    if (!show) return;
    firePuzzleConfetti();
    const timer = setTimeout(() => onComplete?.(), 2400);
    return () => clearTimeout(timer);
  }, [show, onComplete]);

  if (!show) return null;

  return (
    <div className="puzzle-celebration-overlay" role="status" aria-live="polite">
      <div className="puzzle-celebration-pop">
        <div className="puzzle-celebration-burst" aria-hidden />
        <div className="puzzle-celebration-icon">
          <PartyPopper size={36} strokeWidth={2.25} />
        </div>
        <p className="puzzle-celebration-title">{message}</p>
        <p className="puzzle-celebration-sub">{subtitle}</p>
      </div>
    </div>
  );
}
