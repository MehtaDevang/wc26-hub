import { Globe2, Sparkles } from "lucide-react";
import {
  formatQualificationDate,
  getConfederationLabel,
  getQualificationMethodLabel,
  type TeamQualification,
} from "@/lib/team-qualification";

const METHOD_STYLES: Record<TeamQualification["method"], string> = {
  host: "bg-violet-100 text-violet-700",
  "group-winner": "bg-emerald-100 text-emerald-700",
  "group-top-two": "bg-emerald-50 text-emerald-600",
  "confederation-round": "bg-blue-100 text-blue-700",
  "uefa-playoff": "bg-amber-100 text-amber-700",
  "intercontinental-playoff": "bg-orange-100 text-orange-700",
};

interface TeamQualificationProps {
  teamName: string;
  qualification: TeamQualification;
}

export function TeamQualificationCard({ teamName, qualification }: TeamQualificationProps) {
  const { confederation, method, headline, detail, qualifiedDate, firstWorldCup } = qualification;

  return (
    <section>
      <h2 className="section-title mb-3 text-base flex items-center gap-2">
        <Globe2 size={18} className="text-[var(--wc-usa)]" />
        Road to 2026
      </h2>
      <div className="card-surface rounded-xl p-4 sm:p-5 space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-zinc-100 text-zinc-600">
            {getConfederationLabel(confederation)}
          </span>
          <span
            className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${METHOD_STYLES[method]}`}
          >
            {getQualificationMethodLabel(method)}
          </span>
          {firstWorldCup && (
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-pink-100 text-pink-700 flex items-center gap-1">
              <Sparkles size={10} />
              World Cup debut
            </span>
          )}
        </div>

        <div>
          <p className="font-bold text-zinc-900">{headline}</p>
          <p className="text-sm text-zinc-600 mt-1.5 leading-relaxed">{detail}</p>
        </div>

        {qualifiedDate && (
          <p className="text-xs text-zinc-400 pt-1 border-t border-zinc-100">
            {teamName} secured their place on {formatQualificationDate(qualifiedDate)}.
          </p>
        )}
      </div>
    </section>
  );
}
