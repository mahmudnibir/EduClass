import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    // Handle redirect for authenticated users trying to access auth pages
    if (
      req.nextUrl.pathname.startsWith("/auth") &&
      req.nextauth.token
    ) {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // Allow access to auth pages without authentication
        if (req.nextUrl.pathname.startsWith("/auth/")) {
          return true;
        }
        // Require authentication for protected routes
        if (
          req.nextUrl.pathname === "/dashboard" ||
          req.nextUrl.pathname === "/groups" ||
          req.nextUrl.pathname === "/resources" ||
          req.nextUrl.pathname === "/quizzes" ||
          req.nextUrl.pathname === "/profile" ||
          req.nextUrl.pathname.startsWith("/dashboard/") ||
          req.nextUrl.pathname.startsWith("/groups/") ||
          req.nextUrl.pathname.startsWith("/resources/") ||
          req.nextUrl.pathname.startsWith("/quizzes/") ||
          req.nextUrl.pathname.startsWith("/profile/")
        ) {
          return !!token;
        }
        // Allow access to public pages
        return true;
      },
    },
  }
);

export const config = {
  matcher: [
    "/",
    "/dashboard",
    "/groups",
    "/resources",
    "/quizzes",
    "/profile",
    "/dashboard/:path*",
    "/groups/:path*",
    "/resources/:path*",
    "/quizzes/:path*",
    "/profile/:path*",
    "/auth/:path*",
  ],
}; 