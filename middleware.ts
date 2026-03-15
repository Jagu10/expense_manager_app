import { NextRequest, NextResponse } from "next/server";
import { decrypt } from "./lib/auth";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const session = request.cookies.get("session")?.value;

  // Paths that are public (but we might redirect if authenticated)
  const isAuthPage = pathname === "/login" || pathname === "/register";
  const isLandingPage = pathname === "/";
  const isPublicApi = pathname.includes("/api/");

  if (isPublicApi) {
    return NextResponse.next();
  }

  if (!session) {
    // If not authenticated and trying to access anything other than login/register, redirect to login
    if (!isAuthPage) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
    return NextResponse.next();
  }

  try {
    const payload = await decrypt(session);
    const userRole = (payload.user?.role || payload.user?.Role || "USER").toUpperCase();

    // If authenticated and trying to access landing, login, or register
    if (isLandingPage || isAuthPage) {
      const dashboard = userRole === "ADMIN" ? "/dashboard" : "/dashboarduser";
      return NextResponse.redirect(new URL(dashboard, request.url));
    }

    // Admin only routes protection
    const adminRoutes = ["/peoples", "/projects/add", "/projects/edit", "/categories", "/subcategories"]; 
    
    if (adminRoutes.some(route => pathname.startsWith(route)) && userRole !== "ADMIN") {
      return NextResponse.redirect(new URL("/dashboarduser", request.url));
    }

    return NextResponse.next();
  } catch (error) {
    // Invalid session, clear and redirect to login
    const response = NextResponse.redirect(new URL("/login", request.url));
    response.cookies.set("session", "", { expires: new Date(0) });
    return response;
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
