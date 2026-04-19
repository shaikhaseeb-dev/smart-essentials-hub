/**
 * POST /api/admin-auth
 *
 * Server-side password check. The real password lives ONLY in
 * ADMIN_SECRET (no NEXT_PUBLIC_ prefix) so it is never sent to the browser.
 *
 * Returns a signed session token stored in an HttpOnly cookie.
 * HttpOnly means JavaScript on the page CANNOT read the cookie —
 * XSS attacks cannot steal the session.
 */

import { cookies } from 'next/headers';

const ADMIN_SECRET   = process.env.ADMIN_SECRET!;          // Server-only — never exposed
const SESSION_TOKEN  = process.env.SESSION_TOKEN_SECRET     // Random string you set in .env.local
  ?? 'change-this-to-a-long-random-string-in-env';
const COOKIE_NAME    = 'seh_admin_session';
const SESSION_HOURS  = 8; // Session expires after 8 hours

/** Simple constant-time string comparison to prevent timing attacks */
function safeCompare(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) {
    diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return diff === 0;
}

/** Generate a session token tied to timestamp */
function makeSessionToken(): string {
  const ts = Date.now().toString(36);
  const rand = Math.random().toString(36).slice(2);
  return `${SESSION_TOKEN}-${ts}-${rand}`;
}

function isValidSessionToken(token: string): boolean {
  // Token format: `${SESSION_TOKEN}-${ts}-${rand}`
  if (!token.startsWith(SESSION_TOKEN + '-')) return false;
  const parts = token.split('-');
  if (parts.length < 3) return false;
  const ts = parseInt(parts[parts.length - 2], 36);
  const ageMs = Date.now() - ts;
  const maxMs = SESSION_HOURS * 60 * 60 * 1000;
  return ageMs >= 0 && ageMs < maxMs;
}

// ─── POST — Login ─────────────────────────────────────────
export async function POST(req: Request) {
  try {
    const { password } = await req.json();

    if (!ADMIN_SECRET) {
      console.error('[AdminAuth] ADMIN_SECRET is not set in environment variables!');
      return Response.json(
        { error: 'Server misconfiguration. Set ADMIN_SECRET in .env.local' },
        { status: 500 }
      );
    }

    if (!password || !safeCompare(password, ADMIN_SECRET)) {
      // Always wait 500ms on failure — slows brute-force attacks
      await new Promise(r => setTimeout(r, 500));
      return Response.json({ error: 'Incorrect password.' }, { status: 401 });
    }

    // Set secure HttpOnly cookie
    const token = makeSessionToken();
    const cookieStore = cookies();
    cookieStore.set(COOKIE_NAME, token, {
      httpOnly:  true,                              // JS cannot read this
      secure:    process.env.NODE_ENV === 'production', // HTTPS only in prod
      sameSite:  'strict',                          // No CSRF
      maxAge:    SESSION_HOURS * 60 * 60,           // Seconds
      path:      '/admin',                          // Only sent to /admin routes
    });

    return Response.json({ ok: true, message: 'Authenticated.' });
  } catch {
    return Response.json({ error: 'Server error.' }, { status: 500 });
  }
}

// ─── GET — Verify session (check if still logged in) ──────
export async function GET() {
  const cookieStore = cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;

  if (!token || !isValidSessionToken(token)) {
    return Response.json({ authenticated: false }, { status: 401 });
  }

  return Response.json({ authenticated: true });
}

// ─── DELETE — Logout ──────────────────────────────────────
export async function DELETE() {
  const cookieStore = cookies();
  cookieStore.delete(COOKIE_NAME);
  return Response.json({ ok: true });
}
