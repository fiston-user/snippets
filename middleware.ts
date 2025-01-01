import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Add routes that require authentication
const protectedRoutes = [
  "/snippets/create",
  "/snippets/my",
  "/profile",
  "/bookmarks",
];

// Add routes that are only accessible to non-authenticated users
const authRoutes = ["/auth/signin", "/auth/signup"];

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request });
  const isAuthenticated = !!token;
  const path = request.nextUrl.pathname;

  // Check if the route is protected
  if (protectedRoutes.some((route) => path.startsWith(route))) {
    if (!isAuthenticated) {
      const url = new URL("/auth/signin", request.url);
      url.searchParams.set("callbackUrl", path);
      return NextResponse.redirect(url);
    }
  }

  // Redirect authenticated users away from auth pages
  if (authRoutes.some((route) => path.startsWith(route))) {
    if (isAuthenticated) {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  return NextResponse.next();
}
