"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  TIMEZONE_COOKIE,
  DEFAULT_TIMEZONE,
  detectBrowserTimezone,
  resolveTimezone,
} from "@/lib/timezone";

const TimezoneContext = createContext<string>(DEFAULT_TIMEZONE);

export function TimezoneProvider({
  children,
  initialTimezone = DEFAULT_TIMEZONE,
}: {
  children: ReactNode;
  initialTimezone?: string;
}) {
  const [timezone, setTimezone] = useState(() =>
    resolveTimezone(initialTimezone)
  );

  useEffect(() => {
    const detected = detectBrowserTimezone();
    setTimezone(detected);
    document.cookie = `${TIMEZONE_COOKIE}=${encodeURIComponent(detected)};path=/;max-age=31536000;SameSite=Lax`;
  }, []);

  const value = useMemo(() => timezone, [timezone]);

  return (
    <TimezoneContext.Provider value={value}>{children}</TimezoneContext.Provider>
  );
}

export function useTimezone(): string {
  return useContext(TimezoneContext);
}
