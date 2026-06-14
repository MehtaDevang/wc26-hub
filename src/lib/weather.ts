export interface WeatherInfo {
  temperature?: number;
  condition: string;
  icon: string;
  humidity?: number;
  windSpeed?: number;
}

const WEATHER_CODES: Record<number, { label: string; icon: string }> = {
  0: { label: "Clear sky", icon: "☀️" },
  1: { label: "Mainly clear", icon: "🌤️" },
  2: { label: "Partly cloudy", icon: "⛅" },
  3: { label: "Overcast", icon: "☁️" },
  45: { label: "Foggy", icon: "🌫️" },
  48: { label: "Foggy", icon: "🌫️" },
  51: { label: "Light drizzle", icon: "🌦️" },
  53: { label: "Drizzle", icon: "🌦️" },
  55: { label: "Heavy drizzle", icon: "🌧️" },
  61: { label: "Light rain", icon: "🌧️" },
  63: { label: "Rain", icon: "🌧️" },
  65: { label: "Heavy rain", icon: "🌧️" },
  71: { label: "Snow", icon: "❄️" },
  80: { label: "Rain showers", icon: "🌦️" },
  95: { label: "Thunderstorm", icon: "⛈️" },
};

export async function fetchMatchWeather(
  lat: number,
  lon: number,
  date: string
): Promise<WeatherInfo | null> {
  if (!lat || !lon) return null;

  const today = new Date().toISOString().slice(0, 10);
  const isPast = date < today;
  const base = isPast
    ? "https://archive-api.open-meteo.com/v1/archive"
    : "https://api.open-meteo.com/v1/forecast";

  const params = new URLSearchParams({
    latitude: String(lat),
    longitude: String(lon),
    timezone: "auto",
    ...(isPast
      ? {
          start_date: date,
          end_date: date,
          daily: "temperature_2m_max,temperature_2m_min,weathercode",
        }
      : {
          daily: "temperature_2m_max,temperature_2m_min,weathercode",
          forecast_days: "7",
        }),
  });

  try {
    const res = await fetch(`${base}?${params}`, { next: { revalidate: 3600 } });
    if (!res.ok) return null;
    const data = await res.json();
    const daily = data.daily;
    if (!daily?.time?.length) return null;

    const idx = isPast ? 0 : daily.time.findIndex((d: string) => d === date);
    const i = idx >= 0 ? idx : 0;
    const code = daily.weathercode?.[i] ?? 0;
    const meta = WEATHER_CODES[code] ?? { label: "Unknown", icon: "🌡️" };
    const max = daily.temperature_2m_max?.[i];
    const min = daily.temperature_2m_min?.[i];
    const temp = max != null && min != null ? Math.round((max + min) / 2) : max;

    return {
      temperature: temp,
      condition: meta.label,
      icon: meta.icon,
    };
  } catch {
    return null;
  }
}
