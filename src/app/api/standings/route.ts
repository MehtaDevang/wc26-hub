import { NextResponse } from "next/server";
import { fetchAllGroupStandings } from "@/lib/espn/standings";

export const revalidate = 120;

export async function GET() {
  try {
    const standings = await fetchAllGroupStandings();
    return NextResponse.json({ standings, source: "espn" });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to fetch standings" },
      { status: 500 }
    );
  }
}
