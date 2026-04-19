/**
 * middleware.ts  (runs at the CDN edge — before any page renders)
 *
 * This is the REAL security gate for the admin panel.
 * Even if someone knows /admin exists, they cannot see the page
 * without a valid session cookie — the middleware returns 302 → /admin/login.
 *
 * Because this runs at the EDGE (not in the browser), users never receive
 * the admin HTML unless they are authenticated.
 */

import { NextRequest, NextResponse } from 'next/server';

const COOKIE_NAME      = 'seh_admin_session';
const SESSION_TOKEN    = process.env.SESSION_TOKEN_SECRET ?? 'change-this-to-a-long-random-string-in-env';
const SESSION_HOURS    = 8;

function isValidToken(token: string | undefined): boolean {
  if (!token) return false;
  if (!token.startsWith(SESSION_TOKEN + '-')) return false;
  const parts = token.split('-');
  if (parts.length < 3) return false;
  const ts = parseInt(parts[parts.length - 2], 36);
  const ageMs = Date.now() - ts;
  const maxMs = SESSION_HOURS * 60 * 60 * 1000;
  return ageMs >= 0 && ageMs < maxMs;
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Only protect /admin routes (but NOT /admin/login itself)
  if (pathname.startsWith('/admin') && !pathname.startsWith('/admin/login')) {
    const token = request.cookies.get(COOKIE_NAME)?.value;

    if (!isValidToken(token)) {
      // Redirect to login with return URL so user lands back after auth
      const loginUrl = new URL('/admin/login', request.url);
      loginUrl.searchParams.set('from', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  // Run on all /admin/* routes
  matcher: ['/admin/:path*'],
};
