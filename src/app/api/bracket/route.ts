import { NextRequest, NextResponse } from "next/server";
import { apiErrorResponse } from "@/lib/api-security";
import { getKnockoutBracket } from "@/lib/espn/services";
import { resolveTimezone } from "@/lib/timezone";

export const revalidate = 60;
export const maxDuration = 30;

export async function GET(request: NextRequest) {
  const timeZone = resolveTimezone(request.nextUrl.searchParams.get("tz"));

  try {
    const bracket = await getKnockoutBracket(timeZone);
    return NextResponse.json({
      bracket,
      source: "espn",
      timeZone,
    });
  } catch (error) {
    return apiErrorResponse("Failed to fetch bracket", 500, error);
  }
}
