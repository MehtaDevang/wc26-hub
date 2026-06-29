import { getAdsTxtContent } from "@/lib/adsense";

export const revalidate = 86400;

export function GET() {
  return new Response(getAdsTxtContent(), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=86400",
    },
  });
}
