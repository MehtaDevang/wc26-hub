import { apiErrorResponse, apiJsonResponse } from "@/lib/api-security";
import { getTournamentLeaders } from "@/lib/espn/tournament-stats";

export const revalidate = 60;
export const maxDuration = 60;

export async function GET() {
  try {
    const leaders = await getTournamentLeaders();
    return apiJsonResponse({ leaders, source: "espn" });
  } catch (error) {
    return apiErrorResponse("Failed to fetch tournament leaders", 500, error);
  }
}
