// middleware.js or middleware.ts
import { withAuth } from "@kinde-oss/kinde-auth-nextjs/middleware";
import { NextRequest, NextResponse } from "next/server";

export default function middleware(req: NextRequest) {
  // Check if the request is to the /dashboard route or any of its subpaths
  if (req.nextUrl.pathname.startsWith('/dashboard')) {
    // Perform Kinde authentication
    return withAuth(req);
  }

  // For all other routes, handle CORS
  const response = NextResponse.next();

  // Set CORS headers
  response.headers.set('Access-Control-Allow-Origin', '*'); // Replace '*' with specific origins if needed
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    response.headers.set('Access-Control-Max-Age', '86400'); // Cache preflight response for 24 hours
    return new Response(null, { status: 204 });
  }

  return response;
}

export const config = {
  matcher: ['/dashboard/:path*', '/api/:path*'], // Adjust the paths as needed
};