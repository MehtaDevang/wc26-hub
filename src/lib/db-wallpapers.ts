import { Binary } from "mongodb";
import { getDb } from "./mongodb";

/**
 * DB-backed wallpapers (collection `wallpapers`).
 *
 * Images are fetched from a source URL and stored as binary in MongoDB via
 * `scripts/add-wallpaper.mjs`, then served from our own domain by the
 * `/wallpapers/db/[id]` route. The page lists metadata only (the binary blob is
 * projected out) and renders each image from that route.
 */

const COLLECTION = "wallpapers";

export interface DbWallpaperMeta {
  id: string;
  title: string;
  teams?: string;
  year?: number;
  category?: string;
  credit?: string;
  source?: string;
  width?: number;
  height?: number;
  createdAt?: string;
}

interface DbWallpaperDoc extends DbWallpaperMeta {
  contentType?: string;
  data?: unknown;
}

function toBuffer(data: unknown): Buffer | null {
  if (!data) return null;
  if (Buffer.isBuffer(data)) return data;
  if (data instanceof Binary) return Buffer.from(data.buffer);
  const maybe = data as { buffer?: ArrayBufferLike };
  if (maybe.buffer) return Buffer.from(maybe.buffer as ArrayBuffer);
  return null;
}

export async function getDbWallpapers(limit = 200): Promise<DbWallpaperMeta[]> {
  try {
    const db = await getDb();
    const docs = await db
      .collection<DbWallpaperDoc>(COLLECTION)
      .find({}, { projection: { data: 0 } })
      .sort({ createdAt: -1 })
      .limit(limit)
      .toArray();
    return docs.map((d) => ({
      id: d.id,
      title: d.title,
      teams: d.teams,
      year: d.year,
      category: d.category,
      credit: d.credit,
      source: d.source,
      width: d.width,
      height: d.height,
      createdAt: d.createdAt,
    }));
  } catch (error) {
    console.error("[db-wallpapers] Failed to list wallpapers:", error);
    return [];
  }
}

export async function getDbWallpaperImage(
  id: string
): Promise<{ contentType: string; buffer: Buffer } | null> {
  try {
    const db = await getDb();
    const doc = await db.collection<DbWallpaperDoc>(COLLECTION).findOne({ id });
    if (!doc) return null;
    const buffer = toBuffer(doc.data);
    if (!buffer) return null;
    return { contentType: doc.contentType ?? "image/jpeg", buffer };
  } catch (error) {
    console.error(`[db-wallpapers] Failed to load image ${id}:`, error);
    return null;
  }
}
