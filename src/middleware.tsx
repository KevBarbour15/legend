import { withAuth } from "@kinde-oss/kinde-auth-nextjs/middleware";
import { NextRequest, NextResponse } from "next/server";

export default function middleware(req: NextRequest) {
  // Check if the request is to the /dashboard route or any of its subpaths

  // TODO: protect routes here
  if (req.nextUrl.pathname.startsWith("/dashboard")) {
    return withAuth(req);
  }

  const response = NextResponse.next();

  // Set CORS headers for all other requests
  response.headers.set("Access-Control-Allow-Origin", "*");
  response.headers.set(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS",
  );
  response.headers.set(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization",
  );

  if (req.method === "OPTIONS") {
    response.headers.set("Access-Control-Max-Age", "86400"); // Cache preflight response for 24 hours
    return new NextResponse(null, { status: 204, headers: response.headers });
  }

  return response;
}

export const config = {
  matcher: ["/dashboard"],
};
