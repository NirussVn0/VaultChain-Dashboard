import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { AUTH_COOKIE_NAME } from "./src/lib/auth-constants";

const PUBLIC_ROUTES = ["/login", "/signup", "/forgot-password"];

const STATIC_PATHS = ["/_next", "/favicon.ico", "/assets", "/images", "/api", "/api/auth"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const hasToken = Boolean(request.cookies.get(AUTH_COOKIE_NAME)?.value);

  if (isStaticPath(pathname)) {
    return NextResponse.next();
  }

  if (isPublicRoute(pathname)) {
    if (hasToken && (pathname.startsWith("/login") || pathname.startsWith("/signup"))) {
      const redirectUrl = new URL("/", request.url);
      return NextResponse.redirect(redirectUrl);
    }
    return NextResponse.next();
  }

  if (!hasToken) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirectTo", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

const isPublicRoute = (pathname: string): boolean =>
  PUBLIC_ROUTES.some((route) => pathname === route || pathname.startsWith(`${route}/`));

const isStaticPath = (pathname: string): boolean =>
  STATIC_PATHS.some((route) => pathname === route || pathname.startsWith(`${route}/`));

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|robots.txt).*)"],
};
