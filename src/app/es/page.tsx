import { createLocalizedMetadata } from "@/lib/i18n";
import { LocalizedHomePage } from "@/components/LocalizedHomePage";

export const metadata = createLocalizedMetadata({
  locale: "es",
  title: "Mundial FIFA 2026 - Resultados en vivo hoy",
  description:
    "Resultados en vivo del Mundial 2026, calendario completo, grupos y estadísticas. Actualizado durante todo el día.",
  path: "/",
});

export default function SpanishHomePage() {
  return <LocalizedHomePage locale="es" />;
}
