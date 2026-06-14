import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getClientIp, isRateLimited } from "@/lib/api-security";

export function proxy(request: NextRequest) {
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
  matcher: "/api/:path*",
};
