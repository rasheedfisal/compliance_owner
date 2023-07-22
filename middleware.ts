import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  const cookie_name = "AT";
  const verify = request.cookies.get(cookie_name);
  if (!verify) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (
    verify &&
    (request.nextUrl.pathname.startsWith("/login") ||
      request.nextUrl.pathname === "/")
  ) {
    return NextResponse.redirect(new URL("/home", request.url));
  }
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    "/home",
    "/domains",
    "/profile",
    "/controls",
    "/invitations",
    "/logs",
    "/onboardings",
    "/organizations",
    "/regulators",
    "/verified",
    "/users",
  ],
};
