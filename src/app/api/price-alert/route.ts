/**
 * POST /api/price-alert
 * Register a price drop alert for a product.
 *
 * Body: { email: string, productId: string, productTitle: string, targetPrice?: number }
 *
 * Production wiring:
 *   - Write to Firebase 'price_alerts' collection (uncomment block below)
 *   - Cron job checks daily and emails subscribers when price drops
 *   - Use Firebase Functions + Resend/SendGrid for email delivery
 */

const alerts = new Map<
  string,
  Array<{ email: string; targetPrice?: number; createdAt: string }>
>();

export async function POST(req: Request) {
  try {
    const { email, productId, productTitle, targetPrice } = await req.json();

    if (!email || !productId) {
      return Response.json(
        { error: "Email and product ID are required." },
        { status: 400 },
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return Response.json(
        { error: "Please enter a valid email." },
        { status: 400 },
      );
    }

    const existing = alerts.get(productId) || [];
    const alreadySet = existing.some((a) => a.email === email.toLowerCase());

    if (alreadySet) {
      return Response.json(
        {
          message: "✓ You already have an alert for this product.",
        },
        { status: 200 },
      );
    }

    // ── Firebase (uncomment to persist) ─────────────────────
    // import { getDB } from '@/lib/firebase';
    // import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
    // await addDoc(collection(getDB(), 'price_alerts'), {
    //   email: email.toLowerCase(),
    //   productId,
    //   productTitle,
    //   targetPrice: targetPrice || null,
    //   createdAt: serverTimestamp(),
    //   triggered: false,
    // });

    alerts.set(productId, [
      ...existing,
      {
        email: email.toLowerCase(),
        targetPrice,
        createdAt: new Date().toISOString(),
      },
    ]);

    console.log(
      `[PriceAlert] ${email} → ${productTitle} (${productId}) target: ₹${targetPrice || "any drop"}`,
    );

    return Response.json(
      {
        message: `🔔 Alert set! We'll notify you when the price drops${targetPrice ? ` below ₹${targetPrice}` : ""}.`,
      },
      { status: 201 },
    );
  } catch {
    return Response.json(
      { error: "Server error. Please try again." },
      { status: 500 },
    );
  }
}

export async function GET() {
  let total = 0;

  alerts.forEach((arr) => {
    total += arr.length;
  });
  return Response.json({ totalAlerts: total, products: alerts.size });
}
