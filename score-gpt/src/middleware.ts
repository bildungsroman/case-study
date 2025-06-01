import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// This middleware runs on every request
export function middleware(request: NextRequest) {
  // You can read and modify cookies in middleware
  const token = request.cookies.get("spotify_token")?.value;

  // Redirect if no token is present and trying to access protected routes
  if (!token && request.nextUrl.pathname.startsWith("/protected")) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

// See: https://nextjs.org/docs/app/building-your-application/routing/middleware#matcher
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!_next/static|_next/image|favicon.ico|public).*)",
  ],
};
