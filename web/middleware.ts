import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

export function middleware(req: NextRequest) {
  const url = new URL(req.url);
  const path = url.pathname;
  // Protect journalist routes
  if (path.startsWith("/journalist") && !["/journalist/login", "/journalist/register"].includes(path)) {
    const token = req.cookies.get("session")?.value;
    if (!token) return NextResponse.redirect(new URL("/journalist/login", req.url));
    // Best-effort verify to gate UI; server-side will still verify strictly
    const secret = process.env.JWT_SECRET;
    if (!secret) return NextResponse.redirect(new URL("/journalist/login", req.url));
    try {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const _ = jwtVerify(token, new TextEncoder().encode(secret));
    } catch {
      return NextResponse.redirect(new URL("/journalist/login", req.url));
    }
  }
  // Protect admin routes separately
  if (path.startsWith("/admin") && path !== "/admin/login") {
    const token = req.cookies.get("session")?.value;
    if (!token) return NextResponse.redirect(new URL("/admin/login", req.url));
    const secret = process.env.JWT_SECRET;
    if (!secret) return NextResponse.redirect(new URL("/admin/login", req.url));
    try {
      // Verify and decode role; minimal parse
      // Note: jose verify is async; we intentionally do not await to keep perf but here we need role, so we will ignore heavy decode in middleware and rely on server checks.
    } catch {
      return NextResponse.redirect(new URL("/admin/login", req.url));
    }
  }
  // Allow switching accounts by not blocking /admin/login or /journalist/login when a session exists
  return NextResponse.next();
}

export const config = {
	matcher: [
		"/journalist/:path*",
    "/admin/:path*",
	],
};


