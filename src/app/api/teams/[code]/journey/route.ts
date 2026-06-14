import { NextResponse } from "next/server";
import { apiErrorResponse, isValidTeamCode } from "@/lib/api-security";
import { getTeamJourney } from "@/lib/espn/team-journey";

export const revalidate = 120;
export const maxDuration = 30;

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ code: string }> }
) {
  const { code } = await params;

  if (!isValidTeamCode(code)) {
    return NextResponse.json({ error: "Invalid team code" }, { status: 400 });
  }

  try {
    const journey = await getTeamJourney(code);
    if (!journey) {
      return NextResponse.json({ error: "Team not found" }, { status: 404 });
    }
    return NextResponse.json({ journey });
  } catch (error) {
    return apiErrorResponse("Failed to load team journey", 500, error);
  }
}
