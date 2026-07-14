import Link from "next/link";
import {
  GitBranch,
  Calendar,
  Tv,
  BarChart3,
  Puzzle,
  Star,
  Swords,
} from "lucide-react";

const LINKS = [
  { href: "/bracket", label: "Bracket", icon: GitBranch, accent: "home-quick-link-icon--usa" },
  { href: "/fixtures", label: "Fixtures", icon: Calendar, accent: "home-quick-link-icon--violet" },
  { href: "/watch", label: "Watch", icon: Tv, accent: "home-quick-link-icon--green" },
  { href: "/leaders", label: "Leaders", icon: BarChart3, accent: "home-quick-link-icon--gold" },
  { href: "/my", label: "My WC", icon: Star, accent: "home-quick-link-icon--red" },
  { href: "/puzzles", label: "Puzzles", icon: Puzzle, accent: "home-quick-link-icon--purple" },
  { href: "/rivalries", label: "Rivalries", icon: Swords, accent: "home-quick-link-icon--slate" },
] as const;

export function HomeQuickLinks() {
  return (
    <nav aria-label="Quick links" className="home-quick-links">
      {LINKS.map(({ href, label, icon: Icon, accent }) => (
        <Link key={href} href={href} className="home-quick-link group">
          <span className={`home-quick-link-icon ${accent}`}>
            <Icon size={16} strokeWidth={2.25} />
          </span>
          <span className="home-quick-link-label">{label}</span>
        </Link>
      ))}
    </nav>
  );
}
