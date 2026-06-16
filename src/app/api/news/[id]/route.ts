import { apiErrorResponse, apiJsonResponse, isValidNewsId } from "@/lib/api-security";
import { getWorldCupNewsArticle } from "@/lib/espn/services";

export const revalidate = 300;
export const maxDuration = 15;

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  if (!isValidNewsId(id)) {
    return apiJsonResponse({ error: "Invalid news id" }, { status: 400 });
  }

  try {
    const article = await getWorldCupNewsArticle(id);

    if (!article) {
      return apiJsonResponse({ error: "Article not found" }, { status: 404 });
    }

    return apiJsonResponse({
      article,
      source: "espn",
      updatedAt: new Date().toISOString(),
    });
  } catch (error) {
    return apiErrorResponse("Failed to fetch news article", 500, error);
  }
}
