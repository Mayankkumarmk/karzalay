import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
  const authToken = request.cookies.get('sessionId')?.value;
  const { pathname } = request.nextUrl;

  // Protected routes — require sessionId cookie
  const protectedPrefixes = ['/dashboard', '/onboarding'];
  const isProtected = protectedPrefixes.some((p) => pathname.startsWith(p));

  if (isProtected && !authToken) {
    // No flash: redirect happens server-side before any page renders
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('next', pathname); // preserve intended destination
    return NextResponse.redirect(loginUrl);
  }

  // Auth routes — redirect logged-in users away from login/register
  const isAuthRoute = pathname === '/login' || pathname === '/register';
  if (isAuthRoute && authToken) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/onboarding/:path*', '/login', '/register'],
};
