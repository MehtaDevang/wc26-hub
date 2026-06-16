import { getAllVenues, getVenueSlug } from "./venues";
import { getTeamFlag } from "./teams";

export interface CityGuide {
  slug: string;
  city: string;
  country: string;
  countryCode: "CAN" | "MEX" | "USA";
  flag: string;
  timezone: string;
  airport: string;
  airportCode: string;
  transitToStadium: string;
  gettingAround: string;
  fanZone: string;
  weatherNote: string;
  tips: string[];
}

const CITY_DATA: Omit<CityGuide, "slug" | "flag">[] = [
  {
    city: "Vancouver",
    country: "Canada",
    countryCode: "CAN",
    timezone: "America/Vancouver (PT)",
    airport: "Vancouver International (YVR)",
    airportCode: "YVR",
    transitToStadium: "Canada Line SkyTrain from YVR to Stadium–Chinatown station - BC Place is a short walk.",
    gettingAround: "SkyTrain, SeaBus, and buses cover the metro. Downtown is walkable; rideshare works well for late nights.",
    fanZone: "FIFA Fan Festival at Hastings Park / PNE - big screens, food, and live entertainment during the tournament.",
    weatherNote: "June is mild (15–22°C) with occasional rain - pack a light jacket.",
    tips: ["Book accommodation early - Vancouver hotels fill up fast.", "Arrive SkyTrain early on match days; Stadium station gets busy."],
  },
  {
    city: "Toronto",
    country: "Canada",
    countryCode: "CAN",
    timezone: "America/Toronto (ET)",
    airport: "Toronto Pearson (YYZ)",
    airportCode: "YYZ",
    transitToStadium: "UP Express train from Pearson to Union Station, then walk or streetcar to BMO Field on the Exhibition grounds.",
    gettingAround: "TTC subway and streetcars; Union Station is the main hub. Traffic on the Gardiner can be heavy on match days.",
    fanZone: "Fan events typically cluster around Exhibition Place and downtown harbourfront.",
    weatherNote: "Warm summers (20–28°C) with humidity - sunscreen and water for afternoon kickoffs.",
    tips: ["BMO Field is on the lakeshore - breezy evenings even in summer.", "Consider staying downtown for easy transit to matches."],
  },
  {
    city: "Edmonton",
    country: "Canada",
    countryCode: "CAN",
    timezone: "America/Edmonton (MT)",
    airport: "Edmonton International (YEG)",
    airportCode: "YEG",
    transitToStadium: "LRT Capital Line to Stadium station - Commonwealth Stadium is adjacent to the stop.",
    gettingAround: "LRT is the best option on match days. Downtown is compact; rideshare for late returns.",
    fanZone: "Ice District and downtown fan zones with screens and local food trucks.",
    weatherNote: "Long daylight in June; temperatures 15–25°C. Evening matches can cool down quickly.",
    tips: ["Commonwealth Stadium is one of Canada's largest - allow extra time for security.", "Book hotels near LRT for easiest access."],
  },
  {
    city: "Mexico City",
    country: "Mexico",
    countryCode: "MEX",
    timezone: "America/Mexico_City (CT)",
    airport: "Benito Juárez International (MEX)",
    airportCode: "MEX",
    transitToStadium: "Metro Line 2 to Estadio Azteca (or Uber from Polanco/Roma - allow 45–90 min in traffic).",
    gettingAround: "Metro is cheap and fast but crowded on match days. Official taxis and Uber are widely used.",
    fanZone: "Zócalo and Reforma fan festivals; Condesa and Roma for bars and watch parties.",
    weatherNote: "High altitude (2,240 m) - stay hydrated. Afternoon rain showers are common in June.",
    tips: ["Estadio Azteca hosts the opening match - book months ahead.", "Altitude affects stamina; pace yourself if walking long distances."],
  },
  {
    city: "Guadalajara",
    country: "Mexico",
    countryCode: "MEX",
    timezone: "America/Mexico_City (CT)",
    airport: "Miguel Hidalgo y Costilla (GDL)",
    airportCode: "GDL",
    transitToStadium: "Uber or taxi from centro (~30 min). Limited direct public transit to Estadio Akron in Zapopan.",
    gettingAround: "Macrobús and taxis serve the metro area. Centro Histórico is walkable.",
    fanZone: "Plaza de los Mariachis area and Andares mall district for fan gatherings.",
    weatherNote: "Warm and dry in June (25–32°C) - afternoon sun is intense.",
    tips: ["Try birria and tortas ahogadas between matches.", "Akron is in Zapopan - factor traffic from downtown."],
  },
  {
    city: "Monterrey",
    country: "Mexico",
    countryCode: "MEX",
    timezone: "America/Monterrey (CT)",
    airport: "Monterrey International (MTY)",
    airportCode: "MTY",
    transitToStadium: "Uber/taxi from centro to Estadio BBVA in Guadalupe (~25–40 min).",
    gettingAround: "Metrorrey covers key corridors; many fans use rideshare to the stadium in the foothills.",
    fanZone: "Macroplaza and Barrio Antiguo for watch parties and live music.",
    weatherNote: "Hot and humid in June (30–38°C) - plan shade and hydration for day games.",
    tips: ["BBVA's mountain backdrop makes for great photos - arrive early.", "Monterrey is a major business hub - book hotels near San Pedro or centro."],
  },
  {
    city: "Inglewood",
    country: "USA",
    countryCode: "USA",
    timezone: "America/Los_Angeles (PT)",
    airport: "Los Angeles International (LAX)",
    airportCode: "LAX",
    transitToStadium: "Metro K Line to Downtown Inglewood station, then walk to SoFi Stadium. LAX FlyAway + Metro also works.",
    gettingAround: "Metro expanding for 2026; rideshare is common. SoFi is in a dense entertainment district.",
    fanZone: "Hollywood Park complex around SoFi - restaurants, retail, and fan activations on site.",
    weatherNote: "June gloom possible mornings; afternoons warm (22–28°C).",
    tips: ["SoFi is indoor-outdoor - weather rarely cancels play.", "Allow 60+ minutes from LAX in traffic."],
  },
  {
    city: "East Rutherford",
    country: "USA",
    countryCode: "USA",
    timezone: "America/New_York (ET)",
    airport: "Newark Liberty (EWR) or JFK",
    airportCode: "EWR",
    transitToStadium: "NJ Transit train from Penn Station NYC to Meadowlands Rail Station - MetLife Stadium is a short walk.",
    gettingAround: "NYC subway + NJ Transit for match days. Driving and parking at MetLife is possible but slow.",
    fanZone: "Times Square and Hudson Yards fan zones; Jersey City waterfront for NYC skyline views.",
    weatherNote: "Warm, humid June (22–30°C). Thunderstorms possible - check forecasts.",
    tips: ["MetLife hosts the World Cup Final - expect peak demand.", "Stay in Manhattan or Jersey City for best transit access."],
  },
  {
    city: "Arlington",
    country: "USA",
    countryCode: "USA",
    timezone: "America/Chicago (CT)",
    airport: "Dallas/Fort Worth International (DFW)",
    airportCode: "DFW",
    transitToStadium: "Limited direct transit - DART Orange Line to CentrePort, then rideshare to AT&T Stadium (~15 min).",
    gettingAround: "Car-centric metro; rideshare and shuttles on match days. Downtown Dallas/Fort Worth for nightlife.",
    fanZone: "AT&T Stadium district events; Sundance Square in Fort Worth for watch parties.",
    weatherNote: "Very hot in June (32–38°C) - essential hydration for afternoon games.",
    tips: ["AT&T Stadium's retractable roof helps with heat.", "Combine with a Texas BBQ tour between match days."],
  },
  {
    city: "Atlanta",
    country: "USA",
    countryCode: "USA",
    timezone: "America/New_York (ET)",
    airport: "Hartsfield–Jackson Atlanta International (ATL)",
    airportCode: "ATL",
    transitToStadium: "MARTA Gold/Red Line to Vine City or GWCC/CNN Center - Mercedes-Benz Stadium is walkable.",
    gettingAround: "MARTA connects airport to downtown. BeltLine and rideshare for neighborhoods.",
    fanZone: "Centennial Olympic Park and The Gulch district for fan festivals.",
    weatherNote: "Hot and humid (28–34°C) - afternoon storms possible.",
    tips: ["MARTA from airport to stadium without a car is one of the easiest US host city trips.", "Mercedes-Benz Stadium is downtown - many hotels within walking distance."],
  },
  {
    city: "Santa Clara",
    country: "USA",
    countryCode: "USA",
    timezone: "America/Los_Angeles (PT)",
    airport: "San Jose Mineta (SJC) or SFO",
    airportCode: "SJC",
    transitToStadium: "VTA Light Rail to Great America station, then walk to Levi's Stadium.",
    gettingAround: "VTA and Caltrain serve Silicon Valley. San Francisco is ~45 min north.",
    fanZone: "San Jose downtown and Santana Row for watch parties; SF Embarcadero fan events.",
    weatherNote: "Mild and sunny (20–28°C) - classic California summer weather.",
    tips: ["Levi's is in the South Bay - consider staying in San Jose vs San Francisco.", "Caltrain + VTA combo works from SF."],
  },
  {
    city: "Philadelphia",
    country: "USA",
    countryCode: "USA",
    timezone: "America/New_York (ET)",
    airport: "Philadelphia International (PHL)",
    airportCode: "PHL",
    transitToStadium: "SEPTA Broad Street Line (Orange) to AT&T Station - Lincoln Financial Field is steps away.",
    gettingAround: "SEPTA subway and trolleys; Center City is walkable. Sports Complex is in South Philly.",
    fanZone: "Xfinity Live! complex near the stadium; Reading Terminal Market for local food.",
    weatherNote: "Warm June (24–30°C) with occasional humidity spikes.",
    tips: ["Broad Street Line is the fastest match-day route.", "Try a cheesesteak debate - Pat's vs Geno's is touristy but fun."],
  },
  {
    city: "Seattle",
    country: "USA",
    countryCode: "USA",
    timezone: "America/Los_Angeles (PT)",
    airport: "Seattle-Tacoma International (SEA)",
    airportCode: "SEA",
    transitToStadium: "Link Light Rail from SEA to Stadium station - Lumen Field is adjacent.",
    gettingAround: "Link Light Rail, streetcars, and ferries. Downtown is compact and walkable.",
    fanZone: "Pike Place Market area and Seattle Center for fan activations.",
    weatherNote: "Mild (18–24°C) with light rain possible - always pack a rain layer.",
    tips: ["One of the best transit-to-stadium experiences of any US host.", "Lumen Field's atmosphere is legendary - arrive early for pre-match energy."],
  },
  {
    city: "Foxborough",
    country: "USA",
    countryCode: "USA",
    timezone: "America/New_York (ET)",
    airport: "Boston Logan (BOS)",
    airportCode: "BOS",
    transitToStadium: "No direct rail to Gillette - drive, rideshare, or match-day shuttles from Boston (~45–75 min).",
    gettingAround: "Car or shuttle recommended. Boston proper is 35 miles northeast.",
    fanZone: "Boston Common and Seaport fan zones; Patriot Place retail at the stadium.",
    weatherNote: "Pleasant June (20–28°C); evenings can be cool.",
    tips: ["Plan transport in advance - Gillette is suburban.", "Combine with a Boston history tour between matches."],
  },
  {
    city: "Miami Gardens",
    country: "USA",
    countryCode: "USA",
    timezone: "America/New_York (ET)",
    airport: "Miami International (MIA)",
    airportCode: "MIA",
    transitToStadium: "Uber/taxi from MIA or downtown (~30–50 min). Limited public transit to Hard Rock Stadium.",
    gettingAround: "Rideshare essential for stadium trips. Metrorail serves parts of Miami-Dade.",
    fanZone: "Wynwood and South Beach fan festivals; Bayside Marketplace events.",
    weatherNote: "Hot and tropical (28–34°C) - afternoon thunderstorms common.",
    tips: ["Hard Rock has a roof but sides are open - rain won't stop play.", "Book hotels in Miami Beach or Brickell for nightlife."],
  },
  {
    city: "Kansas City",
    country: "USA",
    countryCode: "USA",
    timezone: "America/Chicago (CT)",
    airport: "Kansas City International (MCI)",
    airportCode: "MCI",
    transitToStadium: "Rideshare from downtown (~20 min) or match-day shuttles. No direct rail to Arrowhead.",
    gettingAround: "Streetcar in downtown KC; car/rideshare to Arrowhead in the suburbs.",
    fanZone: "Power & Light District downtown; BBQ tailgate culture around the stadium.",
    weatherNote: "Warm with possible storms (25–32°C).",
    tips: ["Arrowhead holds the Guinness record for loudest crowd - embrace the noise.", "Don't leave without Kansas City BBQ."],
  },
  {
    city: "Houston",
    country: "USA",
    countryCode: "USA",
    timezone: "America/Chicago (CT)",
    airport: "George Bush Intercontinental (IAH) or Hobby (HOU)",
    airportCode: "IAH",
    transitToStadium: "METRO Rail Red Line to NRG Park station - NRG Stadium is on the complex.",
    gettingAround: "METRO rail and buses; rideshare widely available. Sprawling city - plan travel times.",
    fanZone: "Discovery Green downtown and NRG Park fan zone on match days.",
    weatherNote: "Very hot and humid (30–36°C) - indoor concourses are air-conditioned.",
    tips: ["METRO Rail to NRG is reliable on match days.", "Houston's food scene (Tex-Mex, BBQ, Viet-Cajun) is world-class."],
  },
];

function citySlug(city: string): string {
  return city
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function stadiumSlugsForCity(city: string): string[] {
  return getAllVenues()
    .filter((v) => v.city === city)
    .map((v) => getVenueSlug(v));
}

export function getAllCityGuides(): CityGuide[] {
  return CITY_DATA.map((data) => ({
    ...data,
    slug: citySlug(data.city),
    flag: getTeamFlag(data.countryCode),
  })).sort((a, b) => a.country.localeCompare(b.country) || a.city.localeCompare(b.city));
}

export function getCityGuide(slug: string): (CityGuide & { stadiumSlugs: string[] }) | null {
  const guide = getAllCityGuides().find((c) => c.slug === slug.toLowerCase());
  if (!guide) return null;
  return { ...guide, stadiumSlugs: stadiumSlugsForCity(guide.city) };
}

export function getCityGuidesByCountry(country: string): CityGuide[] {
  return getAllCityGuides().filter((c) => c.country === country);
}
