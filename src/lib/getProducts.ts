/**
 * lib/getProducts.ts
 *
 * Single source of truth for all product data fetching.
 * Supabase ONLY — no JSON fallback.
 *
 * DB columns are snake_case. Frontend fields are camelCase.
 * mapRow() is the ONLY place this translation happens.
 */

import { createClient, SupabaseClient } from "@supabase/supabase-js";
import type { Product, Category, SupabaseProductRow } from "@/types";

// ─── Singleton Supabase client ────────────────────────────
let _client: SupabaseClient | null = null;

function getClient(): SupabaseClient {
  if (_client) return _client;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) {
    throw new Error(
      "[Supabase] NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY must be set in .env.local",
    );
  }
  _client = createClient(url, key);
  return _client;
}

// ─── Row → Product mapping ────────────────────────────────
/**
 * Maps a raw Supabase row (snake_case, nullable) to a
 * fully-typed frontend Product (camelCase, no nulls).
 */

// ─── Category normalization (ADD HERE) ───
const normalizeCategory = (val?: string | null): Category => {
  const v = val?.trim().toLowerCase();
  if (v === "trending") return "trending";
  if (v === "student") return "student";
  if (v === "budget") return "budget";
  if (v === "ai-tools") return "ai-tools";
  return "trending";
};

export function mapRow(row: SupabaseProductRow): Product {
  return {
    id: row.id,
    title: row.title ?? "",
    description: row.description ?? "",
    benefit1: row.benefit1 ?? "",
    benefit2: row.benefit2 ?? "",
    price: row.price ?? "",
    originalPrice: row.original_price ?? "",
    image: row.image ?? "",
    affiliateLink: row.affiliate_link ?? "",
    category: normalizeCategory(row.category),
    badge: row.badge ?? "",
    badgeType: (row.badge_type ?? "") as Product["badgeType"],
    rating: typeof row.rating === "number" ? row.rating : 0,
    reviews: row.reviews ?? "",
    bought: row.bought ?? "",
    tags: Array.isArray(row.tags) ? row.tags : [],
    featured: row.featured === true,
    createdAt: row.created_at ?? "",
  };
}

// ─── Product → DB row mapping (for admin writes) ─────────
export function toDbRow(
  p: Omit<Product, "createdAt">,
): Omit<SupabaseProductRow, "created_at"> {
  return {
    id: p.id,
    title: p.title,
    description: p.description || null,
    benefit1: p.benefit1 || null,
    benefit2: p.benefit2 || null,
    price: p.price || null,
    original_price: p.originalPrice || null,
    image: p.image || null,
    affiliate_link: p.affiliateLink || null,
    category: p.category,
    badge: p.badge || null,
    badge_type: p.badgeType || null,
    rating: typeof p.rating === "number" ? p.rating : null,
    reviews: p.reviews || null,
    bought: p.bought || null,
    tags: p.tags.length > 0 ? p.tags : null,
    featured: p.featured,
  };
}

// ─── Shared query builder ─────────────────────────────────
/**
 * Returns a base query that ALWAYS sorts newest-first.
 * All read functions use this so ordering is consistent.
 */
function baseQuery(supabase: SupabaseClient) {
  return supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: false });
}

// ─── getProducts ──────────────────────────────────────────
/**
 * Fetch ALL products sorted newest-first.
 * Optionally filter by category — filter applied AFTER sorting.
 * Returns [] on error, never throws.
 *
 * NOTE: caller is responsible for .slice() — this function
 * returns the full sorted list so the UI decides how many to show.
 */
export async function getProducts(category?: Category): Promise<Product[]> {
  try {
    const supabase = getClient();
    let query = baseQuery(supabase);
    if (category && category !== "all") {
      query = query.eq("category", category.toLowerCase());
    }
    const { data, error } = await query;
    if (error) {
      console.error("[getProducts] error:", error.message);
      return [];
    }
    return (data as SupabaseProductRow[]).map(mapRow);
  } catch (err) {
    console.error("[getProducts] fatal:", err);
    return [];
  }
}

// ─── getLatestProducts ────────────────────────────────────
/**
 * Fetch the N most recently added products across ALL categories.
 * Used for the "Latest Products" section — always shows newest additions.
 */
export async function getLatestProducts(limit = 4): Promise<Product[]> {
  try {
    const supabase = getClient();
    const { data, error } = await baseQuery(supabase).limit(limit);
    if (error) {
      console.error("[getLatestProducts] error:", error.message);
      return [];
    }
    return (data as SupabaseProductRow[]).map(mapRow);
  } catch (err) {
    console.error("[getLatestProducts] fatal:", err);
    return [];
  }
}

// ─── getProductById ───────────────────────────────────────
/**
 * Fetch a single product by ID.
 * Returns null if not found or on error.
 */
export async function getProductById(id: string): Promise<Product | null> {
  if (!id) return null;
  try {
    const supabase = getClient();
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("id", id)
      .single();
    if (error) {
      if (error.code !== "PGRST116") {
        console.error("[getProductById] error:", error.message);
      }
      return null;
    }
    return mapRow(data as SupabaseProductRow);
  } catch (err) {
    console.error("[getProductById] fatal:", err);
    return null;
  }
}

// ─── getFeaturedProducts ──────────────────────────────────
/**
 * Fetch featured products, newest-first.
 */
export async function getFeaturedProducts(limit = 3): Promise<Product[]> {
  try {
    const supabase = getClient();
    const { data, error } = await baseQuery(supabase)
      .eq("featured", true)
      .limit(limit);
    if (error) {
      console.error("[getFeaturedProducts] error:", error.message);
      return [];
    }
    return (data as SupabaseProductRow[]).map(mapRow);
  } catch (err) {
    console.error("[getFeaturedProducts] fatal:", err);
    return [];
  }
}

// ─── getProductsByIds ─────────────────────────────────────
/**
 * Fetch products by multiple IDs (wishlist hydration).
 */
export async function getProductsByIds(ids: string[]): Promise<Product[]> {
  if (!ids.length) return [];
  try {
    const supabase = getClient();
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .in("id", ids)
      .order("created_at", { ascending: false });
    if (error) {
      console.error("[getProductsByIds] error:", error.message);
      return [];
    }
    return (data as SupabaseProductRow[]).map(mapRow);
  } catch (err) {
    console.error("[getProductsByIds] fatal:", err);
    return [];
  }
}
