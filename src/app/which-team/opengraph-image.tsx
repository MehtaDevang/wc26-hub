import { ImageResponse } from "next/og";
import { OgWhichTeamLayout, OG_SIZE } from "@/lib/og-image";

export const alt = "Which World Cup 2026 team are you? Take the quiz.";
export const size = OG_SIZE;
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(<OgWhichTeamLayout />, { ...size });
}
