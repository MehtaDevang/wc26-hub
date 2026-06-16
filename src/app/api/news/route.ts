import { apiErrorResponse, apiJsonResponse } from "@/lib/api-security";
import { getWorldCupNews } from "@/lib/espn/services";

export const revalidate = 300;
export const maxDuration = 15;

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = Math.min(Number(searchParams.get("limit") ?? 8), 20);

    const articles = await getWorldCupNews(limit);

    return apiJsonResponse({
      articles,
      source: "espn",
      updatedAt: new Date().toISOString(),
    });
  } catch (error) {
    return apiErrorResponse("Failed to fetch news", 500, error);
  }
}
