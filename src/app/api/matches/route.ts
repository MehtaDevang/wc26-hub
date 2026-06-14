import { NextRequest, NextResponse } from "next/server";
import { getMatchesByParams } from "@/lib/espn/services";

export const revalidate = 60;
export const maxDuration = 30;

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const date = searchParams.get("date");
  const range = searchParams.get("range");

  try {
    const matches = await getMatchesByParams({ date, range });

    return NextResponse.json({
      matches,
      source: "espn",
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to fetch matches", matches: [] },
      { status: 500 }
    );
  }
}
