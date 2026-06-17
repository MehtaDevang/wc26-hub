"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { isNativeRuntime } from "@/lib/native";
import { NativeAppInit } from "@/components/NativeAppInit";

const NativeAppContext = createContext(false);

/** True when the app is running inside the Capacitor native shell. */
export function useIsNativeApp(): boolean {
  return useContext(NativeAppContext);
}

export function NativeAppProvider({
  initialIsNative,
  children,
}: {
  initialIsNative: boolean;
  children: React.ReactNode;
}) {
  const [isNative, setIsNative] = useState(initialIsNative);

  useEffect(() => {
    if (!isNative && isNativeRuntime()) {
      setIsNative(true);
    }
  }, [isNative]);

  return (
    <NativeAppContext.Provider value={isNative}>
      {isNative && <NativeAppInit />}
      {children}
    </NativeAppContext.Provider>
  );
}
