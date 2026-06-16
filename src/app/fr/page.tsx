import { createLocalizedMetadata } from "@/lib/i18n";
import { LocalizedHomePage } from "@/components/LocalizedHomePage";

export const metadata = createLocalizedMetadata({
  locale: "fr",
  title: "Coupe du monde FIFA 2026 - Scores en direct",
  description:
    "Scores en direct de la Coupe du monde 2026, calendrier complet, groupes et statistiques. Mis à jour toute la journée.",
  path: "/",
});

export default function FrenchHomePage() {
  return <LocalizedHomePage locale="fr" />;
}
