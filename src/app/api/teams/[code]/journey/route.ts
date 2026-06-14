import { NextResponse } from "next/server";
import { getTeamJourney } from "@/lib/espn/team-journey";

export const revalidate = 120;
export const maxDuration = 30;

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ code: string }> }
) {
  const { code } = await params;

  try {
    const journey = await getTeamJourney(code);
    if (!journey) {
      return NextResponse.json({ error: "Team not found" }, { status: 404 });
    }
    return NextResponse.json({ journey });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to load team journey" },
      { status: 500 }
    );
  }
}
