import { withAuth } from "@kinde-oss/kinde-auth-nextjs/middleware";
import { NextRequest, NextResponse } from "next/server";

export default function middleware(req: NextRequest) {
  const protectedRoutes = [
    { path: "/dashboard", methods: ["GET"] },
    { path: "/api/events", methods: ["POST", "PUT", "DELETE"] },
    { path: "/api/message", methods: ["GET", "DELETE", "PUT"] },
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

  /*
  const allowedOrigin =
    process.env.NODE_ENV === "production"
      ? "https://your-frontend-domain.com"
      : "*";
*/

  const allowedOrigin = "*";
  response.headers.set("Access-Control-Allow-Origin", allowedOrigin);
  response.headers.set(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS",
  );
  response.headers.set(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization",
  );

  if (req.method === "OPTIONS") {
    response.headers.set("Access-Control-Max-Age", "86400");
    return new NextResponse(null, { status: 204, headers: response.headers });
  }

  return response;
}

export const config = {
  matcher: [
    "/dashboard",
    "/api/message",
    "/api/events",

    "/((?!_next/static|favicon.ico).*)",
  ],
};
