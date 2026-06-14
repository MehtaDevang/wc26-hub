import { NextResponse } from "next/server";
import { apiErrorResponse } from "@/lib/api-security";
import { fetchAllGroupStandings } from "@/lib/espn/standings";

export const revalidate = 120;

export async function GET() {
  try {
    const standings = await fetchAllGroupStandings();
    return NextResponse.json({ standings, source: "espn" });
  } catch (error) {
    return apiErrorResponse("Failed to fetch standings", 500, error);
  }
}
