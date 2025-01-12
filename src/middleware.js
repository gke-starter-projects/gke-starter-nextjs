'use server';

import { NextResponse } from 'next/server';
import { verifyJwtToken, createJwtToken, setAuthTokenCookie } from './app/utils/jwt-serverside';

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
    // Verify the current token
    const { userId, userName } = await verifyJwtToken(request);

    // Generate a new token
    const newToken = await createJwtToken(userId, userName);

    // Create the response
    const response = NextResponse.next();

    // Set the new token in the cookie
    await setAuthTokenCookie(response, newToken);

    return response;
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
