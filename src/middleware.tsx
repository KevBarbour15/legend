import { withAuth } from "@kinde-oss/kinde-auth-nextjs/middleware";
import { NextRequest, NextResponse } from "next/server";

export default function middleware(req: NextRequest) {
  // Check if the request is to the /dashboard route or any of its subpaths
  if (req.nextUrl.pathname.startsWith('/dashboard')) {
    // Perform Kinde authentication
    return withAuth(req);
  }

  // Create a NextResponse instance for other routes
  const response = NextResponse.next();

  // Set CORS headers for all other requests
  response.headers.set('Access-Control-Allow-Origin', '*'); // Specify allowed origins for better security
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    response.headers.set('Access-Control-Max-Age', '86400'); // Cache preflight response for 24 hours
    return new NextResponse(null, { status: 204, headers: response.headers });
  }

  return response;
}

export const config = {
  matcher: ['/dashboard/:path*', '/api/events/:path*', '/api/message/:path*', '/api/subscribe/:path*'], // Adjust paths as needed
};