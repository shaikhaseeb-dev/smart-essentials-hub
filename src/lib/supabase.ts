/**
 * lib/supabase.ts
 *
 * Exports a pre-configured Supabase client for use in:
 *   - Client components ('use client')
 *   - API route handlers
 *   - Admin panel writes
 *
 * For server components and getProducts(), the client is
 * created inline so each request gets a fresh instance.
 */

import { createClient } from '@supabase/supabase-js';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!url || !key) {
  throw new Error(
    '[Supabase] NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY must be set in .env.local\n' +
    'Copy .env.example to .env.local and fill in your Supabase project values.'
  );
}

export const supabase = createClient(url, key);

// ── Service role client (admin writes — only used in API routes) ──
// Only created when SUPABASE_SERVICE_ROLE_KEY is present.
// This client bypasses RLS — never expose to the browser.
export function getServiceClient() {
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!serviceKey) return null;
  return createClient(url, serviceKey);
}
