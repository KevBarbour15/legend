import { withAuth } from "@kinde-oss/kinde-auth-nextjs/middleware";
import { NextRequest, NextResponse } from "next/server";

export default function middleware(req: NextRequest) {
  const protectedRoutes = [
    { path: "/dashboard", methods: ["GET"] },
    { path: "/api/events", methods: ["POST", "PUT", "DELETE"] },
    { path: "api/message", methods: ["GET", "DELETE", "PUT"] },
  ];

  for (const route of protectedRoutes) {
    if (
      req.nextUrl.pathname.startsWith(route.path) &&
      route.methods.includes(req.method)
    ) {
      return withAuth(req);
    }
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
  matcher: ["/dashboard", "/api/message", "/api/events"],
};
