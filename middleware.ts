// middleware.ts
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { verifyClientToken } from "@/lib/auth/clientAuth";

// Kaunse routes protected hain
const ADMIN_ROUTES = "/admin";
const CLIENT_ROUTES = "/client";
const ADMIN_LOGIN_PAGE = "/login";
const CLIENT_LOGIN_PAGE = "/client-portal";

export default async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // ==========================================
  // ADMIN ROUTES PROTECTION (NextAuth session)
  // ==========================================
  if (pathname.startsWith(ADMIN_ROUTES)) {
    const session = await auth();

    if (!session?.user) {
      const loginUrl = new URL(ADMIN_LOGIN_PAGE, request.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }

    return NextResponse.next();
  }

  // ==========================================
  // CLIENT ROUTES PROTECTION (Custom JWT)
  // ==========================================
  if (pathname.startsWith(CLIENT_ROUTES)) {
    const token = request.cookies.get("client_token")?.value;

    if (!token) {
      const loginUrl = new URL(CLIENT_LOGIN_PAGE, request.url);
      return NextResponse.redirect(loginUrl);
    }

    const payload = verifyClientToken(token);

    if (!payload) {
      const loginUrl = new URL(CLIENT_LOGIN_PAGE, request.url);
      const response = NextResponse.redirect(loginUrl);
      response.cookies.delete("client_token");
      return response;
    }

    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/client/:path*",
  ],
};