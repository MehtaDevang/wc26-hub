import { NextResponse } from "next/server";
import { apiErrorResponse } from "@/lib/api-security";
import { getRecentHighlights } from "@/lib/espn/services";

export const revalidate = 120;
export const maxDuration = 30;

export async function GET() {
  try {
    const highlights = await getRecentHighlights(6);

    return NextResponse.json({
      highlights,
      source: "espn",
    });
  } catch (error) {
    return apiErrorResponse("Failed to fetch highlights", 500, error);
  }
}
