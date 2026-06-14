import { NextRequest, NextResponse } from "next/server";
import { apiErrorResponse, parseMatchesQuery } from "@/lib/api-security";
import { getMatchesByParams } from "@/lib/espn/services";
import { resolveTimezone } from "@/lib/timezone";

export const revalidate = 60;
export const maxDuration = 30;

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const parsed = parseMatchesQuery(
    searchParams.get("date"),
    searchParams.get("range"),
    searchParams.get("tz")
  );

  if (!parsed.ok) {
    return NextResponse.json({ error: parsed.error }, { status: 400 });
  }

  const timeZone = resolveTimezone(parsed.timeZone);

  try {
    const matches = await getMatchesByParams({
      date: parsed.date,
      range: parsed.range,
      timeZone,
    });

    return NextResponse.json({
      matches,
      source: "espn",
      timeZone,
    });
  } catch (error) {
    return apiErrorResponse("Failed to fetch matches", 500, error);
  }
}
