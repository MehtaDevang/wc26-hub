import Link from "next/link";
import type { LucideIcon } from "lucide-react";

type PanelAccent = "scores" | "bracket" | "gold" | "news";

interface HomeDashboardPanelProps {
  title: string;
  subtitle?: string;
  icon: LucideIcon;
  accent?: PanelAccent;
  href?: string;
  hrefLabel?: string;
  children: React.ReactNode;
  className?: string;
  fill?: boolean;
}

export function HomeDashboardPanel({
  title,
  subtitle,
  icon: Icon,
  accent = "scores",
  href,
  hrefLabel,
  children,
  className = "",
  fill = true,
}: HomeDashboardPanelProps) {
  return (
    <div
      className={`home-dash-panel home-dash-panel--${accent} ${fill ? "home-dash-panel--fill" : ""} ${className}`}
    >
      <div className="home-dash-panel-stripe" aria-hidden />
      <div className="home-dash-panel-head">
        <div className="home-dash-panel-head-icon">
          <Icon size={18} strokeWidth={2.25} />
        </div>
        <div className="home-dash-panel-head-text min-w-0 flex-1">
          <h2 className="home-dash-panel-title">{title}</h2>
          {subtitle && <p className="home-dash-panel-subtitle">{subtitle}</p>}
        </div>
        {href && hrefLabel && (
          <Link href={href} className="home-dash-panel-link shrink-0">
            {hrefLabel}
          </Link>
        )}
      </div>
      <div className="home-dash-panel-body">{children}</div>
    </div>
  );
}
