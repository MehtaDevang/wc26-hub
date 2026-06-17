import { getPhotoWallpaper } from "@/lib/wallpapers";

export const revalidate = 86400;

/**
 * Streams a Wikimedia Commons photo through our own domain so the download
 * happens on-site (no redirect) and at higher resolution. Attribution is shown
 * on the wallpapers page for license compliance.
 */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const photo = getPhotoWallpaper(id);
  if (!photo) {
    return new Response("Not found", { status: 404 });
  }

  let upstream: Response;
  try {
    upstream = await fetch(photo.downloadUrl, {
      headers: {
        // Wikimedia requires a descriptive User-Agent or it blocks the request.
        "User-Agent": "TheGoalPostsBot/1.0 (+https://www.thegoalposts.in; wallpapers)",
        Accept: "image/*",
      },
    });
  } catch {
    return new Response("Upstream fetch failed", { status: 502 });
  }

  if (!upstream.ok) {
    // Fall back to the original (un-upscaled) URL if the hi-res variant 404s.
    try {
      upstream = await fetch(photo.imageUrl, {
        headers: {
          "User-Agent": "TheGoalPostsBot/1.0 (+https://www.thegoalposts.in; wallpapers)",
          Accept: "image/*",
        },
      });
    } catch {
      return new Response("Upstream fetch failed", { status: 502 });
    }
    if (!upstream.ok) {
      return new Response("Upstream error", { status: 502 });
    }
  }

  const contentType = upstream.headers.get("content-type") ?? "image/jpeg";
  const ext = contentType.includes("png") ? "png" : "jpg";
  const body = await upstream.arrayBuffer();

  return new Response(body, {
    headers: {
      "Content-Type": contentType,
      "Content-Disposition": `attachment; filename="goalposts-${id}.${ext}"`,
      "Cache-Control": "public, max-age=604800, immutable",
    },
  });
}
