"use client";

import { useState, useEffect } from "react";
import {
  Plus,
  Edit3,
  Trash2,
  Save,
  X,
  BarChart3,
  Package,
  Users,
  MousePointerClick,
  LogOut,
  Eye,
  EyeOff,
} from "lucide-react";
import type { Product, ProductFormData, Category, BadgeType } from "@/types";
import { mapRow, toDbRow } from "@/lib/getProducts";
import { supabase } from "@/lib/supabase";
import { getClickLog } from "@/lib/utils";

const normalizeCategory = (val?: string): Category => {
  const v = val?.trim().toLowerCase();

  if (v === "trending") return "trending";
  if (v === "student") return "student";
  if (v === "budget") return "budget";
  if (v === "ai-tools") return "ai-tools";

  return "trending"; // fallback
};

const BADGE_TYPES: Array<BadgeType | ""> = [
  "",
  "trending",
  "bestseller",
  "budget",
  "new",
  "ai",
  "deal",
  "hot",
];
const CATEGORIES: Category[] = ["trending", "student", "budget", "ai-tools"];

// ── Empty form defaults (all strings for input binding) ──
const emptyForm = (): ProductFormData => ({
  id: "",
  title: "",
  description: "",
  benefit1: "",
  benefit2: "",
  price: "",
  originalPrice: "",
  image: "",
  affiliateLink: "",
  category: "trending",
  badge: "",
  badgeType: "",
  rating: "4.0", // string for <input type="number">
  reviews: "",
  bought: "",
  tags: "", // comma-separated string for <input>
  featured: false,
});

// ── Convert form data → Product for UI rendering ─────────
function formToProduct(f: ProductFormData): Product {
  return {
    id: f.id,
    title: f.title,
    description: f.description,
    benefit1: f.benefit1,
    benefit2: f.benefit2,
    price: f.price,
    originalPrice: f.originalPrice,
    image: f.image,
    affiliateLink: f.affiliateLink,
    category: f.category,
    badge: f.badge,
    badgeType: f.badgeType,
    rating: parseFloat(f.rating) || 0, // string → number
    reviews: f.reviews,
    bought: f.bought,
    tags: f.tags
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean),
    featured: f.featured,
    createdAt: "",
  };
}

// ── Convert Product → form data for editing ──────────────
function productToForm(p: Product): ProductFormData {
  return {
    id: p.id,
    title: p.title,
    description: p.description,
    benefit1: p.benefit1,
    benefit2: p.benefit2,
    price: p.price,
    originalPrice: p.originalPrice,
    image: p.image,
    affiliateLink: p.affiliateLink,
    category: p.category,
    badge: p.badge,
    badgeType: p.badgeType,
    rating: String(p.rating), // number → string for input
    reviews: p.reviews,
    bought: p.bought,
    tags: p.tags.join(", "), // array → comma string for input
    featured: p.featured,
  };
}

// ── Stat card ─────────────────────────────────────────────
function StatCard({
  icon: Icon,
  label,
  value,
  color = "text-ink",
}: {
  icon: React.ElementType;
  label: string;
  value: string | number;
  color?: string;
}) {
  return (
    <div className="bg-white rounded-2xl border border-ink-ghost/60 p-5 shadow-card">
      <div className="flex items-center gap-3 mb-3">
        <div className="w-9 h-9 rounded-xl bg-surface-2 flex items-center justify-center">
          <Icon className={`w-4.5 h-4.5 ${color}`} />
        </div>
        <span className="text-xs text-ink-muted font-medium uppercase tracking-wider">
          {label}
        </span>
      </div>
      <p className={`font-display font-extrabold text-2xl ${color}`}>{value}</p>
    </div>
  );
}

// ── Product form ──────────────────────────────────────────
function ProductForm({
  initial,
  onSave,
  onCancel,
  saving,
}: {
  initial?: ProductFormData | null;
  onSave: (f: ProductFormData) => Promise<void>;
  onCancel: () => void;
  saving: boolean;
}) {
  const [form, setForm] = useState<ProductFormData>(initial ?? emptyForm());
  useEffect(() => {
    if (initial) {
      setForm(initial);
    } else {
      setForm(emptyForm());
    }
  }, [initial]);

  const set = <K extends keyof ProductFormData>(k: K, v: ProductFormData[K]) =>
    setForm((f) => ({ ...f, [k]: v }));

  const textFields: Array<[keyof ProductFormData, string, string]> = [
    ["title", "Product Title", "text"],
    ["description", "Short Description", "text"],
    ["benefit1", "Benefit 1", "text"],
    ["benefit2", "Benefit 2 (optional)", "text"],
    ["price", "Price (e.g. ₹1,299)", "text"],
    ["originalPrice", "Original Price (optional)", "text"],
    ["image", "Image URL", "url"],
    ["affiliateLink", "Amazon Affiliate Link", "url"],
    ["rating", "Rating (0–5)", "number"],
    ["reviews", "Reviews (e.g. 50K+)", "text"],
    ["bought", "Bought text (e.g. 500+ this week)", "text"],
  ];

  return (
    <div className="bg-white rounded-2xl border border-accent-200 shadow-card p-6">
      <h3 className="font-display font-bold text-lg text-ink mb-5">
        {initial ? "Edit Product" : "Add New Product"}
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        {textFields.map(([key, label, type]) => (
          <div
            key={key}
            className={
              key === "title" ||
              key === "description" ||
              key === "affiliateLink"
                ? "sm:col-span-2"
                : ""
            }
          >
            <label className="block text-xs font-semibold text-ink-muted uppercase tracking-wider mb-1.5">
              {label}
            </label>
            <input
              type={type}
              value={form[key] as string}
              onChange={(e) => set(key, e.target.value as never)}
              step={key === "rating" ? "0.1" : undefined}
              min={key === "rating" ? "0" : undefined}
              max={key === "rating" ? "5" : undefined}
              className="input-base"
            />
          </div>
        ))}

        <div>
          <label className="block text-xs font-semibold text-ink-muted uppercase tracking-wider mb-1.5">
            Category
          </label>
          <select
            value={form.category}
            onChange={(e) => set("category", e.target.value as Category)}
            className="input-base"
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-ink-muted uppercase tracking-wider mb-1.5">
            Badge Type
          </label>
          <select
            value={form.badgeType}
            onChange={(e) => set("badgeType", e.target.value as BadgeType | "")}
            className="input-base"
          >
            {BADGE_TYPES.map((b) => (
              <option key={b} value={b}>
                {b || "— none —"}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-ink-muted uppercase tracking-wider mb-1.5">
            Badge Label
          </label>
          <input
            value={form.badge}
            onChange={(e) => set("badge", e.target.value)}
            placeholder="e.g. 🔥 Trending"
            className="input-base"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-ink-muted uppercase tracking-wider mb-1.5">
            Tags (comma separated)
          </label>
          <input
            value={form.tags}
            onChange={(e) => set("tags", e.target.value)}
            placeholder="earbuds, audio, budget"
            className="input-base"
          />
        </div>

        <div className="sm:col-span-2">
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={form.featured}
              onChange={(e) => set("featured", e.target.checked)}
              className="w-4 h-4 accent-accent-600"
            />
            <span className="text-sm font-medium text-ink">
              Featured product (shows in Editor's Picks)
            </span>
          </label>
        </div>
      </div>

      <div className="flex gap-3">
        <button
          onClick={() => onSave(form)}
          disabled={saving || !form.title}
          className="btn-primary text-sm disabled:opacity-60"
        >
          {saving ? (
            <>
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              {initial ? "Updating…" : "Adding…"}
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              {initial ? "Update" : "Add"} Product
            </>
          )}
        </button>
        <button onClick={onCancel} className="btn-ghost text-sm">
          <X className="w-4 h-4" /> Cancel
        </button>
      </div>
    </div>
  );
}

// ── Main admin page ───────────────────────────────────────
export default function AdminPage() {
  const [authed, setAuthed] = useState(true); // Middleware guards this route
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<ProductFormData | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [filterCat, setFilterCat] = useState<string>("all");
  const [clicks, setClicks] = useState<ReturnType<typeof getClickLog>>([]);
  const [tab, setTab] = useState<"products" | "analytics">("products");
  const [saving, setSaving] = useState(false);
  const [toastMsg, setToastMsg] = useState("");

  // Load products from Supabase
  useEffect(() => {
    if (!authed) return;
    loadProducts();
    setClicks(getClickLog());
  }, [authed]);

  const toast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(""), 3000);
  };

  async function loadProducts() {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setProducts((data ?? []).map(mapRow));
    } catch (err: any) {
      console.error("[Admin] Load error:", err.message);
      toast("❌ Failed to load products.");
    } finally {
      setLoading(false);
    }
  }

  // ── Save (insert or update) ───────────────────────────
  const handleSave = async (form: ProductFormData) => {
    setSaving(true);
    try {
      let product = formToProduct(form);

      // ✅ generate id ONLY if new product
      if (!product.id) {
        product.id = crypto.randomUUID();
      }

      product.category = normalizeCategory(product.category);
      const dbRow = toDbRow(product);

      if (editing) {
        // ✅ ALWAYS update when editing
        const { error } = await supabase
          .from("products")
          .update(dbRow)
          .eq("id", product.id);

        if (error) throw error;
        toast("✅ Product updated.");
      } else {
        // ✅ insert new
        const { error } = await supabase.from("products").insert(dbRow);

        if (error) throw error;
        toast("✅ Product added.");
      }

      await loadProducts();
      setShowForm(false);
      setEditing(null);
    } catch (err: any) {
      console.error("[Admin] Save error:", err.message);
      toast(`❌ Save failed: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  // ── Delete ────────────────────────────────────────────
  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase.from("products").delete().eq("id", id);
      if (error) throw error;
      setProducts((prev) => prev.filter((p) => p.id !== id));
      setDeleting(null);
      toast("🗑️ Product deleted.");
    } catch (err: any) {
      console.error("[Admin] Delete error:", err.message);
      toast(`❌ Delete failed: ${err.message}`);
    }
  };

  const normalize = (val?: string) => val?.trim().toLowerCase();

  const filtered =
    filterCat === "all"
      ? products
      : products.filter((p) => normalize(p.category) === normalize(filterCat));

  // Analytics
  const clickCounts = clicks.reduce<Record<string, number>>((acc, e) => {
    acc[e.id] = (acc[e.id] || 0) + 1;
    return acc;
  }, {});
  const topClicked = Object.entries(clickCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5);
  const todayClicks = clicks.filter(
    (e) => e.ts >= new Date().setHours(0, 0, 0, 0),
  ).length;

  // Redirect if not authed (middleware should handle this, but safety check)
  if (!authed)
    return (
      <div className="min-h-screen bg-surface-1 flex items-center justify-center">
        <div className="text-center">
          <p className="text-sm text-ink-muted mb-4">
            Checking authentication…
          </p>
          <a href="/admin/login" className="btn-primary text-sm">
            Go to Login
          </a>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-surface-1">
      {/* ── Toast ── */}
      {toastMsg && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-ink text-white text-sm font-medium px-5 py-2.5 rounded-xl shadow-card-hover animate-fade-up">
          {toastMsg}
        </div>
      )}

      {/* ── Admin nav ── */}
      <header className="bg-white border-b border-ink-ghost/60 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg bg-ink flex items-center justify-center">
              <span className="text-white text-xs font-bold">SE</span>
            </div>
            <span className="font-display font-bold text-ink text-sm">
              Admin
            </span>
            <span className="text-ink-ghost text-sm">·</span>
            <span className="text-sm text-ink-muted">SmartEssentials Hub</span>
          </div>
          <div className="flex items-center gap-3">
            <a
              href="/admin/revenue"
              className="text-xs text-accent-600 hover:text-accent-700 flex items-center gap-1 font-medium"
            >
              <BarChart3 className="w-3.5 h-3.5" /> Revenue Calculator
            </a>
            <span className="text-ink-ghost text-sm">·</span>
            <a
              href="/"
              target="_blank"
              className="text-xs text-ink-muted hover:text-ink flex items-center gap-1"
            >
              <Eye className="w-3.5 h-3.5" /> View Site
            </a>
            <button
              onClick={async () => {
                await fetch("/api/admin-auth", { method: "DELETE" });
                window.location.href = "/admin/login";
              }}
              className="btn-ghost text-xs px-3 py-1.5"
            >
              <LogOut className="w-3.5 h-3.5" /> Sign Out
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* ── Stats ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard
            icon={Package}
            label="Total Products"
            value={loading ? "…" : products.length}
          />
          <StatCard
            icon={MousePointerClick}
            label="Total Clicks"
            value={clicks.length}
            color="text-accent-600"
          />
          <StatCard
            icon={BarChart3}
            label="Today's Clicks"
            value={todayClicks}
            color="text-green-600"
          />
          <StatCard icon={Users} label="Categories" value={CATEGORIES.length} />
        </div>

        {/* ── Tab bar ── */}
        <div className="flex gap-2 mb-6">
          {(["products", "analytics"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all capitalize ${
                tab === t ? "bg-ink text-white" : "btn-ghost"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {/* ── Products tab ── */}
        {tab === "products" && (
          <>
            <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
              {/* Category filter */}
              <div className="flex gap-2 flex-wrap">
                {["all", ...CATEGORIES].map((c) => (
                  <button
                    key={c}
                    onClick={() => setFilterCat(c)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all border ${
                      filterCat === c
                        ? "bg-ink text-white border-ink"
                        : "border-ink-ghost text-ink-muted hover:text-ink hover:border-ink-soft"
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
              <button
                onClick={() => {
                  setEditing(null);
                  setShowForm(true);
                }}
                className="btn-accent text-sm"
              >
                <Plus className="w-4 h-4" /> Add Product
              </button>
            </div>

            {showForm && (
              <div className="mb-6">
                <ProductForm
                  initial={editing}
                  onSave={handleSave}
                  onCancel={() => {
                    setShowForm(false);
                    setEditing(null);
                  }}
                  saving={saving}
                />
              </div>
            )}

            <div className="bg-white rounded-2xl border border-ink-ghost/60 shadow-card overflow-hidden">
              {loading ? (
                <div className="py-16 text-center text-ink-muted text-sm">
                  <span className="inline-block w-5 h-5 border-2 border-ink-ghost border-t-accent-500 rounded-full animate-spin mb-3" />
                  <p>Loading products…</p>
                </div>
              ) : (
                <table className="w-full admin-table">
                  <thead>
                    <tr>
                      <th>Product</th>
                      <th className="hidden sm:table-cell">Category</th>
                      <th className="hidden md:table-cell">Price</th>
                      <th className="hidden lg:table-cell">Rating</th>
                      <th className="hidden lg:table-cell">Clicks</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((p) => (
                      <tr key={p.id}>
                        <td>
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-surface-2 shrink-0 overflow-hidden">
                              {p.image && (
                                <img
                                  src={p.image}
                                  alt={p.title}
                                  className="w-full h-full object-cover"
                                />
                              )}
                            </div>
                            <div>
                              <p className="font-medium text-ink text-sm line-clamp-1 max-w-[200px]">
                                {p.title}
                              </p>
                              {p.featured && (
                                <span className="text-[10px] badge-new px-1.5 py-0.5 rounded">
                                  Featured
                                </span>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="hidden sm:table-cell">
                          <span className="text-xs capitalize text-ink-muted bg-surface-2 px-2 py-1 rounded-lg">
                            {p.category}
                          </span>
                        </td>
                        <td className="hidden md:table-cell">
                          <span className="font-semibold text-ink text-sm">
                            {p.price || "—"}
                          </span>
                        </td>
                        <td className="hidden lg:table-cell">
                          <span className="text-sm text-ink-soft">
                            ⭐ {p.rating}
                          </span>
                        </td>
                        <td className="hidden lg:table-cell">
                          <span className="font-semibold text-accent-600">
                            {clickCounts[p.id] || 0}
                          </span>
                        </td>
                        <td>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => {
                                setEditing(productToForm(p));
                                setShowForm(true);
                              }}
                              className="w-8 h-8 rounded-lg border border-ink-ghost flex items-center justify-center text-ink-muted hover:text-ink hover:border-ink-soft transition-all"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                            {deleting === p.id ? (
                              <div className="flex gap-1">
                                <button
                                  onClick={() => handleDelete(p.id)}
                                  className="text-xs btn-danger px-2 py-1"
                                >
                                  Yes
                                </button>
                                <button
                                  onClick={() => setDeleting(null)}
                                  className="text-xs btn-ghost px-2 py-1"
                                >
                                  No
                                </button>
                              </div>
                            ) : (
                              <button
                                onClick={() => setDeleting(p.id)}
                                className="w-8 h-8 rounded-lg border border-ink-ghost flex items-center justify-center text-red-400 hover:text-red-600 hover:border-red-200 hover:bg-red-50 transition-all"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
              {!loading && filtered.length === 0 && (
                <div className="py-16 text-center text-ink-muted text-sm">
                  No products in this category.
                </div>
              )}
            </div>
          </>
        )}

        {/* ── Analytics tab ── */}
        {tab === "analytics" && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-ink-ghost/60 shadow-card p-6">
              <h3 className="font-display font-bold text-lg text-ink mb-4 flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-accent-600" /> Top Clicked
                Products
              </h3>
              {topClicked.length === 0 ? (
                <p className="text-ink-muted text-sm py-8 text-center">
                  No clicks recorded yet.
                </p>
              ) : (
                <div className="space-y-4">
                  {topClicked.map(([id, count], i) => {
                    const p = products.find((x) => x.id === id);
                    const maxCount = topClicked[0][1];
                    const pct = Math.round((count / maxCount) * 100);
                    return (
                      <div key={id}>
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-sm text-ink font-medium">
                            <span className="text-ink-ghost mr-2">
                              #{i + 1}
                            </span>
                            {p?.title || id}
                          </span>
                          <span className="text-sm font-bold text-accent-600">
                            {count} clicks
                          </span>
                        </div>
                        <div className="h-2 bg-surface-2 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-accent-gradient rounded-full transition-all duration-500"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6">
              <h3 className="font-semibold text-amber-900 mb-2 flex items-center gap-2">
                📊 Enable Google Analytics 4
              </h3>
              <p className="text-sm text-amber-800 mb-4">
                Click data above is browser-local only. For cross-device
                tracking, connect GA4.
              </p>
              <div className="bg-amber-100 rounded-xl p-3 font-mono text-xs text-amber-900 mb-3">
                {
                  "// In src/app/layout.tsx — uncomment GA4 scripts, replace G-XXXXXXXXXX"
                }
              </div>
              <a
                href="https://analytics.google.com"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary text-sm inline-flex"
              >
                Open Google Analytics →
              </a>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
