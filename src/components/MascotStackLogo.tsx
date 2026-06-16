import { WC26MascotIcon } from "@/components/mascots/WC26Mascots";

interface MascotStackLogoProps {
  className?: string;
}

/**
 * Three host-nation mascots (Zayu · Clutch · Maple) - site logo on all screen sizes.
 * Single SVG stack (no duplicate mobile/desktop instances).
 */
export function MascotStackLogo({ className = "" }: MascotStackLogoProps) {
  return (
    <div
      className={`mascot-stack-logo flex shrink-0 origin-left scale-[0.92] items-center -space-x-1.5 sm:scale-100 ${className}`}
      aria-hidden
    >
      <div className="relative z-10 flex h-6 w-6 sm:h-7 sm:w-7 items-center justify-center overflow-hidden rounded-lg border border-[var(--wc-mexico)]/15 bg-[var(--wc-mexico-light)]">
        <WC26MascotIcon id="zayu" size={26} />
      </div>
      <div className="relative z-20 flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center overflow-hidden rounded-lg border border-[var(--wc-usa)]/15 bg-[var(--wc-usa-light)] shadow-sm">
        <WC26MascotIcon id="clutch" size={30} />
      </div>
      <div className="relative z-10 flex h-6 w-6 sm:h-7 sm:w-7 items-center justify-center overflow-hidden rounded-lg border border-[var(--wc-canada)]/15 bg-[var(--wc-canada-light)]">
        <WC26MascotIcon id="maple" size={26} />
      </div>
    </div>
  );
}
