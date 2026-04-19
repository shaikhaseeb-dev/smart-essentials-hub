/**
 * POST /api/subscribe
 *
 * PRODUCTION WIRING:
 *  Option A — Firebase: uncomment the Firebase block (uses addSubscriber from lib/firebase.ts)
 *  Option B — Mailchimp: set MAILCHIMP_API_KEY + MAILCHIMP_LIST_ID in .env.local
 *  Option C — ConvertKit: set CONVERTKIT_API_KEY + CONVERTKIT_FORM_ID
 */

// Dev-only in-memory store (lost on server restart)
const subs = new Set<string>();

export async function POST(req: Request) {
  try {
    const { email } = await req.json();
    const e = (email || '').trim().toLowerCase();

    if (!e || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e)) {
      return Response.json({ error: 'Please enter a valid email.' }, { status: 400 });
    }

    if (subs.has(e)) {
      return Response.json({ message: "You're already subscribed! 🎉" }, { status: 200 });
    }

    // ── Option A: Firebase ───────────────────────────────
    // import { addSubscriber } from '@/lib/firebase';
    // await addSubscriber(e);

    // ── Option B: Mailchimp ──────────────────────────────
    // const KEY = process.env.MAILCHIMP_API_KEY!;
    // const LIST = process.env.MAILCHIMP_LIST_ID!;
    // const DC = KEY.split('-').pop();
    // await fetch(`https://${DC}.api.mailchimp.com/3.0/lists/${LIST}/members`, {
    //   method: 'POST',
    //   headers: { Authorization: `apikey ${KEY}`, 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ email_address: e, status: 'subscribed' }),
    // });

    // ── Option C: ConvertKit ─────────────────────────────
    // await fetch(`https://api.convertkit.com/v3/forms/${process.env.CONVERTKIT_FORM_ID}/subscribe`, {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ api_key: process.env.CONVERTKIT_API_KEY, email: e }),
    // });

    subs.add(e);
    console.log(`[Subscribe] ${e} (total: ${subs.size})`);

    return Response.json(
      { message: '🎉 Subscribed! Fresh picks hit your inbox every Monday.' },
      { status: 201 }
    );
  } catch {
    return Response.json({ error: 'Server error. Please try again.' }, { status: 500 });
  }
}

export async function GET() {
  return Response.json({ subscribers: subs.size });
}
