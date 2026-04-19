/**
 * POST /api/track
 * Server-side affiliate click logging → appears in Vercel Function Logs.
 * For persistent storage, uncomment the Supabase/Firebase block.
 */
export async function POST(req: Request) {
  try {
    const { productId, title, price } = await req.json();

    if (!productId || !title) {
      return Response.json({ error: 'Missing fields' }, { status: 400 });
    }

    const entry = {
      ts: new Date().toISOString(),
      productId,
      title,
      price,
      ref: req.headers.get('referer') || 'direct',
      ua: (req.headers.get('user-agent') || '').slice(0, 80),
    };

    // Appears in Vercel → Functions → Logs
    console.log('[CLICK]', JSON.stringify(entry));

    // ── Supabase ─────────────────────────────────────────
    // import { createClient } from '@supabase/supabase-js';
    // const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
    // await supabase.from('affiliate_clicks').insert(entry);

    // ── Firebase ──────────────────────────────────────────
    // import { logClick } from '@/lib/firebase';
    // await logClick({ productId, title, price });

    return Response.json({ ok: true });
  } catch {
    return Response.json({ error: 'Server error' }, { status: 500 });
  }
}
