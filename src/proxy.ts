import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getClientIp, isRateLimited } from "@/lib/api-security";

const APEX_HOSTS = new Set(["thegoalposts.in", "thegoalposts.com"]);

function redirectToCanonicalWww(request: NextRequest): NextResponse | null {
  const host = request.headers.get("host")?.split(":")[0]?.toLowerCase() ?? "";

  if (!APEX_HOSTS.has(host)) return null;

  const url = request.nextUrl.clone();
  url.protocol = "https";
  url.host = host.endsWith(".in") ? "www.thegoalposts.in" : "www.thegoalposts.com";
  return NextResponse.redirect(url, 308);
}

export function proxy(request: NextRequest) {
  const canonicalRedirect = redirectToCanonicalWww(request);
  if (canonicalRedirect) return canonicalRedirect;

  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/api/")) {
    const ip = getClientIp(request);
    const key = `${ip}:${pathname.split("/")[2] ?? "api"}`;

    if (isRateLimited(key)) {
      return NextResponse.json(
        { error: "Too many requests. Please try again shortly." },
        { status: 429, headers: { "Retry-After": "60" } }
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/api/:path*",
    "/((?!_next/static|_next/image|favicon.ico|favicon.svg|apple-touch-icon.svg|robots.txt|ads.txt|sitemap.xml|opengraph-image|manifest.webmanifest|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};
