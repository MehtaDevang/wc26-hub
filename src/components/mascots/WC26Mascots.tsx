import type { MascotId } from "@/lib/wc26-brand";

interface MascotSvgProps {
  size?: number;
  className?: string;
}

/** Zayu — Mexico jaguar mascot */
export function ZayuMascot({ size = 48, className }: MascotSvgProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      className={className}
      aria-hidden
    >
      <circle cx="32" cy="34" r="22" fill="#F59E0B" />
      <circle cx="32" cy="34" r="22" fill="url(#zayu-fur)" />
      <ellipse cx="32" cy="38" rx="14" ry="12" fill="#D97706" />
      <circle cx="22" cy="28" r="3" fill="#1a1a1a" opacity="0.7" />
      <circle cx="30" cy="26" r="2.5" fill="#1a1a1a" opacity="0.6" />
      <circle cx="38" cy="27" r="2" fill="#1a1a1a" opacity="0.5" />
      <circle cx="26" cy="34" r="2" fill="#1a1a1a" opacity="0.45" />
      <circle cx="34" cy="32" r="2.5" fill="#1a1a1a" opacity="0.55" />
      <circle cx="40" cy="35" r="1.5" fill="#1a1a1a" opacity="0.4" />
      <ellipse cx="24" cy="30" rx="5" ry="6" fill="#FBBF24" />
      <ellipse cx="40" cy="30" rx="5" ry="6" fill="#FBBF24" />
      <circle cx="24" cy="30" r="2" fill="#1e3a1a" />
      <circle cx="40" cy="30" r="2" fill="#1e3a1a" />
      <ellipse cx="32" cy="36" rx="3" ry="2" fill="#92400e" />
      <path d="M28 40 Q32 43 36 40" stroke="#92400e" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      <path d="M18 22 L14 14 M46 22 L50 14" stroke="#D97706" strokeWidth="3" strokeLinecap="round" />
      <rect x="20" y="48" width="24" height="10" rx="3" fill="#006847" />
      <rect x="22" y="50" width="8" height="6" rx="1" fill="#fff" opacity="0.3" />
      <defs>
        <radialGradient id="zayu-fur" cx="0.4" cy="0.3">
          <stop offset="0%" stopColor="#FCD34D" />
          <stop offset="100%" stopColor="#D97706" />
        </radialGradient>
      </defs>
    </svg>
  );
}

/** Clutch — USA eagle mascot */
export function ClutchMascot({ size = 48, className }: MascotSvgProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      className={className}
      aria-hidden
    >
      <ellipse cx="32" cy="38" rx="18" ry="16" fill="#002868" />
      <circle cx="32" cy="28" r="14" fill="#fff" />
      <circle cx="32" cy="28" r="12" fill="#f8fafc" />
      <path d="M20 26 L32 34 L44 26" fill="#002868" />
      <circle cx="28" cy="26" r="2.5" fill="#1e293b" />
      <circle cx="36" cy="26" r="2.5" fill="#1e293b" />
      <circle cx="28.5" cy="25.5" r="1" fill="#fff" />
      <circle cx="36.5" cy="25.5" r="1" fill="#fff" />
      <path d="M30 31 L32 33 L34 31" stroke="#f59e0b" strokeWidth="2" fill="none" strokeLinecap="round" />
      <path d="M8 36 Q20 48 32 52 Q44 48 56 36" stroke="#002868" strokeWidth="4" fill="none" />
      <path d="M12 34 L4 28 M52 34 L60 28" stroke="#002868" strokeWidth="3" strokeLinecap="round" />
      <rect x="22" y="48" width="20" height="10" rx="3" fill="#D80621" />
      <rect x="24" y="50" width="6" height="2" fill="#fff" opacity="0.8" />
      <rect x="24" y="53" width="6" height="2" fill="#fff" opacity="0.8" />
      <rect x="34" y="50" width="6" height="2" fill="#fff" opacity="0.8" />
      <rect x="34" y="53" width="6" height="2" fill="#fff" opacity="0.8" />
    </svg>
  );
}

/** Maple — Canada moose mascot */
export function MapleMascot({ size = 48, className }: MascotSvgProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      className={className}
      aria-hidden
    >
      <ellipse cx="32" cy="40" rx="16" ry="14" fill="#8B4513" />
      <circle cx="32" cy="30" r="13" fill="#A0522D" />
      <ellipse cx="32" cy="32" rx="10" ry="9" fill="#CD853F" />
      <circle cx="27" cy="28" r="2" fill="#3d2817" />
      <circle cx="37" cy="28" r="2" fill="#3d2817" />
      <ellipse cx="32" cy="33" rx="4" ry="3" fill="#6B3A2A" />
      <path d="M18 18 L12 8 M18 20 L8 16" stroke="#8B4513" strokeWidth="4" strokeLinecap="round" />
      <path d="M46 18 L52 8 M46 20 L56 16" stroke="#8B4513" strokeWidth="4" strokeLinecap="round" />
      <circle cx="12" cy="8" r="3" fill="#A0522D" />
      <circle cx="52" cy="8" r="3" fill="#A0522D" />
      <path
        d="M32 14 L33 18 L37 18 L34 21 L35 25 L32 22 L29 25 L30 21 L27 18 L31 18 Z"
        fill="#D80621"
      />
      <rect x="22" y="48" width="20" height="10" rx="3" fill="#D80621" />
      <rect x="24" y="50" width="16" height="6" rx="1" fill="#fff" opacity="0.25" />
    </svg>
  );
}

const MASCOT_MAP = {
  zayu: ZayuMascot,
  clutch: ClutchMascot,
  maple: MapleMascot,
} as const;

export function WC26MascotIcon({ id, size = 40 }: { id: MascotId; size?: number }) {
  const Component = MASCOT_MAP[id];
  return <Component size={size} />;
}
