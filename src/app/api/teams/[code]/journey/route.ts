import { NextRequest, NextResponse } from "next/server";
import { apiErrorResponse, isValidTeamCode } from "@/lib/api-security";
import { getTeamJourney } from "@/lib/espn/team-journey";
import { resolveTimezone } from "@/lib/timezone";

export const revalidate = 120;
export const maxDuration = 30;

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ code: string }> }
) {
  const { code } = await params;
  const timeZone = resolveTimezone(request.nextUrl.searchParams.get("tz"));

  if (!isValidTeamCode(code)) {
    return NextResponse.json({ error: "Invalid team code" }, { status: 400 });
  }

  try {
    const journey = await getTeamJourney(code, timeZone);
    if (!journey) {
      return NextResponse.json({ error: "Team not found" }, { status: 404 });
    }
    return NextResponse.json({ journey, timeZone });
  } catch (error) {
    return apiErrorResponse("Failed to load team journey", 500, error);
  }
}
