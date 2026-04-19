import type { BadgeType } from "@/types";

// ─── Price ────────────────────────────────────────────────
export function parsePrice(priceStr: string): number {
  return parseInt(priceStr.replace(/[^0-9]/g, ""), 10) || 0;
}

export function calcDiscount(price: string, original: string): number {
  const curr = parsePrice(price);
  const orig = parsePrice(original);
  if (!curr || !orig || orig <= curr) return 0;
  return Math.round(((orig - curr) / orig) * 100);
}

// ─── Badge ────────────────────────────────────────────────
export const badgeCssMap: Record<BadgeType, string> = {
  trending: "badge-trending",
  bestseller: "badge-seller",
  budget: "badge-budget",
  new: "badge-new",
  ai: "badge-ai",
  deal: "badge-deal",
  hot: "badge-hot",
};

// ─── Analytics ────────────────────────────────────────────
const CLICK_KEY = "seh_clicks";

export function trackClick(product: {
  id: string;
  title: string;
  price?: string;
  affiliateLink: string;
  source?: string; // ✅ ADD THIS
}) {
  try {
    const raw = localStorage.getItem(CLICK_KEY);
    const log: Array<{
      ts: number;
      id: string;
      title: string;
      price?: string;
      source?: string;
    }> = raw ? JSON.parse(raw) : [];
    log.push({
      ts: Date.now(),
      id: product.id,
      title: product.title,
      price: product.price,
      source: product.source || "unknown",
    });
    if (log.length > 300) log.splice(0, log.length - 300);
    localStorage.setItem(CLICK_KEY, JSON.stringify(log));
  } catch (_) {}

  // GA4
  if (
    typeof window !== "undefined" &&
    typeof (window as any).gtag === "function"
  ) {
    (window as any).gtag("event", "affiliate_click", {
      product_id: product.id,
      product_title: product.title,
      product_price: product.price,
      source: product.source || "unknown",
    });
  }
}

export function getClickLog(): Array<{
  ts: number;
  id: string;
  title: string;
  price?: string;
}> {
  try {
    const raw = localStorage.getItem(CLICK_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (_) {
    return [];
  }
}

// ─── Search ───────────────────────────────────────────────
import type { Product } from "@/types";

export function searchProducts(products: Product[], query: string): Product[] {
  const q = query.toLowerCase().trim();
  if (q.length < 2) return [];
  return products
    .map((p) => {
      let score = 0;
      const title = p.title.toLowerCase();
      const desc = (p.description + " " + p.benefit1).toLowerCase();
      if (title.includes(q)) score += 10;
      if (title.startsWith(q)) score += 5;
      if (desc.includes(q)) score += 3;
      p.tags?.forEach((t) => {
        if (t.toLowerCase().includes(q)) score += 2;
      });
      return { ...p, _score: score };
    })
    .filter((p) => (p as any)._score > 0)
    .sort((a, b) => (b as any)._score - (a as any)._score)
    .map(({ ...p }) => {
      delete (p as any)._score;
      return p;
    });
}

// ─── Format ───────────────────────────────────────────────
export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function slugify(str: string): string {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function cn(...classes: (string | undefined | false | null)[]): string {
  return classes.filter(Boolean).join(" ");
}
