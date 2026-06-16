import Link from "next/link";
import { Sparkles, ArrowRight } from "lucide-react";

const FLAGS = ["🇧🇷", "🇦🇷", "🇫🇷", "🇪🇸", "🇵🇹", "🇯🇵", "🇲🇦", "🇳🇱"];

export function WhichTeamPromo() {
  return (
    <Link
      href="/which-team"
      aria-label="Take the quiz: which World Cup team are you?"
      className="group relative block overflow-hidden rounded-3xl p-6 sm:p-8 text-white shadow-lg transition-transform hover:-translate-y-0.5"
      style={{
        background:
          "linear-gradient(120deg, #6d28d9 0%, #c026d3 45%, #2563eb 100%)",
      }}
    >
      <div className="pointer-events-none absolute -right-6 -top-8 select-none text-[120px] leading-none opacity-15 sm:text-[180px]">
        ⚽
      </div>

      <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="max-w-xl">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1 text-xs font-bold uppercase tracking-wider backdrop-blur-sm">
            <Sparkles size={13} /> New · Fun quiz
          </span>
          <h2 className="mt-3 text-2xl font-extrabold leading-tight sm:text-3xl">
            Which World Cup team are you?
          </h2>
          <p className="mt-2 text-sm text-white/85 sm:text-base">
            Answer 8 quick questions about your style and get matched with your
            World Cup 2026 team. Then share it with your friends.
          </p>
          <div className="mt-3 flex gap-1 text-2xl sm:text-3xl" aria-hidden>
            {FLAGS.map((flag) => (
              <span key={flag} className="drop-shadow-sm">
                {flag}
              </span>
            ))}
          </div>
        </div>

        <span className="inline-flex shrink-0 items-center gap-2 self-start rounded-full bg-white px-5 py-3 text-sm font-bold text-violet-700 shadow-md transition-transform group-hover:scale-105 sm:self-center">
          Take the quiz
          <ArrowRight size={16} className="transition-transform group-hover:translate-x-0.5" />
        </span>
      </div>
    </Link>
  );
}
