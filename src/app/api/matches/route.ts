import { NextRequest, NextResponse } from "next/server";
import { apiErrorResponse, parseMatchesQuery } from "@/lib/api-security";
import { getMatchesByParams } from "@/lib/espn/services";

export const revalidate = 60;
export const maxDuration = 30;

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const parsed = parseMatchesQuery(
    searchParams.get("date"),
    searchParams.get("range")
  );

  if (!parsed.ok) {
    return NextResponse.json({ error: parsed.error }, { status: 400 });
  }

  try {
    const matches = await getMatchesByParams({
      date: parsed.date,
      range: parsed.range,
    });

    return NextResponse.json({
      matches,
      source: "espn",
    });
  } catch (error) {
    return apiErrorResponse("Failed to fetch matches", 500, error);
  }
}
