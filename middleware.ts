import { NextRequest, NextResponse } from "next/server";
import * as jose from "jose";

export async function middleware(req: NextRequest) {
  const sessionCookie = req.cookies.get("session");

  // If no session cookie, redirect to login
  if (!sessionCookie) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  try {
    // Verify the JWT
    const secret = new TextEncoder().encode(process.env.JWT_SECRET || "your-super-secret-jwt-key-with-at-least-32-characters");
    await jose.jwtVerify(sessionCookie.value, secret);

    // If token is valid, proceed
    return NextResponse.next();
  } catch (error) {
    // If token is invalid, redirect to login
    console.error("JWT Verification Error:", error);
    const response = NextResponse.redirect(new URL("/login", req.url));
    // Clear the invalid cookie
    response.cookies.delete("session");
    return response;
  }
}

export const config = {
  // Match all routes except for the ones that start with:
  // - api (API routes)
  // - _next/static (static files)
  // - _next/image (image optimization files)
  // - favicon.ico (favicon file)
  // - login (the login page itself)
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|login).*)"],
};
