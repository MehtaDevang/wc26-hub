import type { NewsArticleDetail } from "./types";
import { getDb } from "./mongodb";

/**
 * Original Goal Posts editorial - written in-house and stored in MongoDB
 * (collection `news`), not aggregated from ESPN.
 *
 * Documents match the {@link NewsArticleDetail} shape and carry a string `id`
 * field. IDs use a 9-digit range starting with 9 to stay valid (\d{6,15}) and
 * avoid collisions with ESPN's ~8-digit article ids.
 */

const COLLECTION = "news";

type NewsDoc = NewsArticleDetail & { _id?: unknown };

function toArticle({ _id, ...rest }: NewsDoc): NewsArticleDetail {
  void _id;
  return rest;
}

export async function getOwnNews(): Promise<NewsArticleDetail[]> {
  try {
    const db = await getDb();
    const docs = await db
      .collection<NewsDoc>(COLLECTION)
      .find({})
      .sort({ publishedAt: -1 })
      .toArray();
    return docs.map(toArticle);
  } catch (error) {
    console.error("[own-news] Failed to load news from MongoDB:", error);
    return [];
  }
}

export async function getOwnNewsArticle(
  id: string
): Promise<NewsArticleDetail | null> {
  try {
    const db = await getDb();
    const doc = await db.collection<NewsDoc>(COLLECTION).findOne({ id });
    return doc ? toArticle(doc) : null;
  } catch (error) {
    console.error(`[own-news] Failed to load article ${id} from MongoDB:`, error);
    return null;
  }
}
