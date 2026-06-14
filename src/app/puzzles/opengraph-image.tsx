import { ImageResponse } from "next/og";
import { OgPuzzlesLayout, OG_SIZE } from "@/lib/og-image";

export const alt = "Daily World Cup puzzles";
export const size = OG_SIZE;
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(<OgPuzzlesLayout />, { ...size });
}
