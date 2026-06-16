/** FIFA World Cup 2026 host branding - Mexico, USA, Canada */

export const WC26_HOSTS = [
  {
    id: "mexico",
    country: "Mexico",
    flag: "🇲🇽",
    color: "#006847",
    colorLight: "#e6f4ef",
    mascot: "Zayu",
    mascotRole: "The Jaguar",
    mascotTagline: "Pride of Mexico",
  },
  {
    id: "usa",
    country: "USA",
    flag: "🇺🇸",
    color: "#002868",
    colorLight: "#e8edf7",
    mascot: "Clutch",
    mascotRole: "The Eagle",
    mascotTagline: "Spirit of America",
  },
  {
    id: "canada",
    country: "Canada",
    flag: "🇨🇦",
    color: "#D80621",
    colorLight: "#fde8eb",
    mascot: "Maple",
    mascotRole: "The Moose",
    mascotTagline: "Heart of Canada",
  },
] as const;

export const WC26_TROPHY_GOLD = "#C9A227";

export type MascotId = "maple" | "zayu" | "clutch";

export const MASCOTS: Record<
  MascotId,
  { name: string; host: string; flag: string; color: string; colorLight: string; role: string }
> = {
  zayu: {
    name: "Zayu",
    host: "Mexico",
    flag: "🇲🇽",
    color: "#006847",
    colorLight: "#e6f4ef",
    role: "Jaguar",
  },
  clutch: {
    name: "Clutch",
    host: "USA",
    flag: "🇺🇸",
    color: "#002868",
    colorLight: "#e8edf7",
    role: "Eagle",
  },
  maple: {
    name: "Maple",
    host: "Canada",
    flag: "🇨🇦",
    color: "#D80621",
    colorLight: "#fde8eb",
    role: "Moose",
  },
};
