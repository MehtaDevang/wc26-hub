import type { NextConfig } from "next";
import os from "os";

function getLanOrigins(): string[] {
  const origins: string[] = [];
  const nets = os.networkInterfaces();
  for (const iface of Object.values(nets)) {
    for (const net of iface ?? []) {
      if (net.family === "IPv4" && !net.internal) {
        origins.push(net.address);
      }
    }
  }
  return origins;
}

const nextConfig: NextConfig = {
  // Allow phone/tablet testing on LAN (e.g. http://192.168.x.x:3000)
  allowedDevOrigins: getLanOrigins(),
};

export default nextConfig;
