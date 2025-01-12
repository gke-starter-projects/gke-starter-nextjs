'use server';

import { NextResponse } from 'next/server';
import { verifyJwtToken } from './app/utils/jwt-serverside';

// Add paths that should be excluded from authentication
const publicPaths = [
  '/api/signup',
  '/api/login',
  '/api/logout',
  '/login',
  '/signup',
];

export async function middleware(request) {
  // Check if the path should be public
  const isPublicPath = publicPaths.some((path) => request.nextUrl.pathname.startsWith(path));

  if (isPublicPath) {
    return NextResponse.next();
  }

  try {
    // Verify the token
    await verifyJwtToken(request);

    // If token is valid, continue
    return NextResponse.next();
  } catch (error) {
    // If token is invalid, clear the cookie and redirect to login
    const response = NextResponse.redirect(new URL('/login', request.url));
    response.cookies.delete('auth_token');
    return response;
  }
}

// Configure which routes should be handled by middleware
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|public/).*)',
  ],
};
