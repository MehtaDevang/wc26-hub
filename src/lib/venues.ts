export interface VenueMeta {
  name: string;
  city: string;
  country: string;
  capacity: number;
  lat: number;
  lon: number;
}

const VENUES: VenueMeta[] = [
  { name: "BC Place", city: "Vancouver", country: "Canada", capacity: 54500, lat: 49.2768, lon: -123.112 },
  { name: "BMO Field", city: "Toronto", country: "Canada", capacity: 45736, lat: 43.6332, lon: -79.4186 },
  { name: "Commonwealth Stadium", city: "Edmonton", country: "Canada", capacity: 56418, lat: 53.5597, lon: -113.4761 },
  { name: "Estadio Azteca", city: "Mexico City", country: "Mexico", capacity: 87523, lat: 19.3029, lon: -99.1505 },
  { name: "Estadio Banorte", city: "Mexico City", country: "Mexico", capacity: 87523, lat: 19.3029, lon: -99.1505 },
  { name: "Estadio Akron", city: "Guadalajara", country: "Mexico", capacity: 48071, lat: 20.6818, lon: -103.4626 },
  { name: "Estadio BBVA", city: "Monterrey", country: "Mexico", capacity: 53460, lat: 25.6866, lon: -100.2455 },
  { name: "MetLife Stadium", city: "East Rutherford", country: "USA", capacity: 82500, lat: 40.8128, lon: -74.0742 },
  { name: "SoFi Stadium", city: "Inglewood", country: "USA", capacity: 70240, lat: 33.9535, lon: -118.339 },
  { name: "AT&T Stadium", city: "Arlington", country: "USA", capacity: 80000, lat: 32.7473, lon: -97.0945 },
  { name: "Mercedes-Benz Stadium", city: "Atlanta", country: "USA", capacity: 71000, lat: 33.7553, lon: -84.4006 },
  { name: "Levi's Stadium", city: "Santa Clara", country: "USA", capacity: 68500, lat: 37.403, lon: -121.9694 },
  { name: "Lincoln Financial Field", city: "Philadelphia", country: "USA", capacity: 69796, lat: 39.9008, lon: -75.1675 },
  { name: "Lumen Field", city: "Seattle", country: "USA", capacity: 69000, lat: 47.5952, lon: -122.3316 },
  { name: "Gillette Stadium", city: "Foxborough", country: "USA", capacity: 65878, lat: 42.0909, lon: -71.2643 },
  { name: "Hard Rock Stadium", city: "Miami Gardens", country: "USA", capacity: 64767, lat: 25.958, lon: -80.2389 },
  { name: "Arrowhead Stadium", city: "Kansas City", country: "USA", capacity: 76416, lat: 39.0489, lon: -94.4839 },
  { name: "NRG Stadium", city: "Houston", country: "USA", capacity: 72220, lat: 29.6847, lon: -95.4107 },
];

function normalize(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]/g, "");
}

export function lookupVenue(name: string, city?: string, country?: string): VenueMeta {
  const normName = normalize(name);
  const exact = VENUES.find((v) => normalize(v.name) === normName);
  if (exact) return exact;

  const partial = VENUES.find(
    (v) => normName.includes(normalize(v.name)) || normalize(v.name).includes(normName)
  );
  if (partial) return partial;

  if (city) {
    const byCity = VENUES.find((v) => normalize(v.city) === normalize(city));
    if (byCity) return { ...byCity, name: name || byCity.name };
  }

  return {
    name: name || "TBD",
    city: city ?? "",
    country: country ?? "",
    capacity: 0,
    lat: 0,
    lon: 0,
  };
}
