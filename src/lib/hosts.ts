import { WC26_HOSTS } from "./wc26-brand";
import { getVenuesByCountry } from "./venues";

const HOST_BLURBS: Record<string, string> = {
  Mexico:
    "Three iconic cities - Mexico City, Guadalajara, and Monterrey - including the legendary Estadio Azteca, host of two World Cup finals.",
  USA:
    "Eleven venues across the country, from MetLife Stadium (Final) and SoFi Stadium to Arrowhead, NRG, and more.",
  Canada:
    "Vancouver, Toronto, and Edmonton welcome the world with BC Place, BMO Field, and Commonwealth Stadium.",
};

export interface HostNation {
  id: string;
  country: string;
  flag: string;
  color: string;
  colorLight: string;
  mascot: string;
  mascotRole: string;
  mascotTagline: string;
  blurb: string;
  cities: string[];
  stadiums: ReturnType<typeof getVenuesByCountry>;
}

export function getHostNations(): HostNation[] {
  return WC26_HOSTS.map((host) => {
    const stadiums = getVenuesByCountry(host.country);
    const cities = [...new Set(stadiums.map((s) => s.city))].sort();
    return {
      ...host,
      blurb: HOST_BLURBS[host.country] ?? "",
      cities,
      stadiums,
    };
  });
}
