import { getDbWallpaperImage } from "@/lib/db-wallpapers";

export const dynamic = "force-dynamic";

/**
 * Serves a DB-stored wallpaper image from our own domain.
 * Add `?dl=1` to force a download (Content-Disposition: attachment).
 */
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const image = await getDbWallpaperImage(id);
  if (!image) {
    return new Response("Not found", { status: 404 });
  }

  const ext = image.contentType.includes("png")
    ? "png"
    : image.contentType.includes("webp")
      ? "webp"
      : "jpg";

  const headers: Record<string, string> = {
    "Content-Type": image.contentType,
    "Cache-Control": "public, max-age=86400",
  };

  if (new URL(request.url).searchParams.get("dl")) {
    headers["Content-Disposition"] = `attachment; filename="goalposts-${id}.${ext}"`;
  }

  return new Response(new Uint8Array(image.buffer), { headers });
}
