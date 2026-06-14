import { NextResponse } from "next/server";
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
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Failed to fetch highlights",
        highlights: [],
      },
      { status: 500 }
    );
  }
}
