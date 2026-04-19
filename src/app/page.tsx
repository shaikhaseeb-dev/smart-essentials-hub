// force-dynamic disables Next.js full-route cache for this page.
// Without this, Next.js caches the rendered HTML at build time —
// new products added to Supabase would NOT appear until the next build.
// force-dynamic makes every request hit Supabase fresh.
export const dynamic = "force-dynamic";

import Navbar from "@/components/Navbar";
import NewsletterCTA from "@/components/ui/NewsletterCTA";

import Footer from "@/components/Footer";
import Section from "@/components/Section";
import RecentlyViewed from "@/components/RecentlyViewed";
import Link from "next/link";
import { ArrowRight, Star, Shield, RefreshCw, Zap } from "lucide-react";
import { getProducts, getLatestProducts } from "@/lib/getProducts";
import dynamicImport from "next/dynamic";

const DealOfTheDay = dynamicImport(() => import("@/components/DealOfTheDay"), {
  ssr: false,
});
const SocialProofTicker = dynamicImport(
  () => import("@/components/ui/SocialProofTicker"),
  { ssr: false },
);
import blogData from "@/data/blog.json";
import type { Product } from "@/types";

const TRUST = [
  {
    icon: Star,
    label: "Expert Curated",
    desc: "Every product researched and hand-picked by our team",
  },
  {
    icon: RefreshCw,
    label: "Updated Weekly",
    desc: "Fresh picks every Monday morning",
  },
  {
    icon: Shield,
    label: "No Paid Rankings",
    desc: "Affiliate income never influences our picks",
  },
  {
    icon: Zap,
    label: "500+ Products",
    desc: "Gadgets, stationery, hostel essentials & more",
  },
];

// ─── Helper: highest-discount product ───────────────────
function pickDealProduct(products: Product[]): Product | null {
  const withDiscount = products.filter((p) => p.originalPrice && p.price);
  if (!withDiscount.length) return null;

  return withDiscount.reduce((best, p) => {
    const discount = (orig: string, curr: string) => {
      const clean = (val: string) => Number(val.replace(/[^\d]/g, ""));
      const o = clean(orig);
      const c = clean(curr);
      return o > 0 ? ((o - c) / o) * 100 : 0;
    };
    return discount(p.originalPrice, p.price) >
      discount(best.originalPrice, best.price)
      ? p
      : best;
  });
}

export default async function HomePage() {
  // Fetch all products (newest-first from Supabase — no caching)
  const all = await getProducts();
  const latest = all.slice(0, 4);

  // Category filters applied AFTER sorting (sort is guaranteed by getProducts)
  // .slice() lives here in the UI layer, NOT inside getProducts

  const normalize = (val?: string) => val?.trim().toLowerCase();

  const trending = all
    .filter((p) => normalize(p.category) === "trending")
    .filter((p) => !latest.some((l) => l.id === p.id))
    .slice(0, 4);

  const student = all
    .filter((p) => normalize(p.category) === "student")
    .slice(0, 4);

  const budget = all
    .filter((p) => normalize(p.category) === "budget")
    .slice(0, 4);

  const aiTools = all
    .filter((p) => normalize(p.category) === "ai-tools")
    .slice(0, 4);

  const featured = all.filter((p) => p.featured === true).slice(0, 3);

  // Deal of the day: product with the highest % discount across ALL products
  const dealProduct = pickDealProduct(all);

  return (
    <>
      <Navbar />

      <main>
        {/* ── Hero ─────────────────────────────────────────────── */}
        <section className="relative py-16 sm:py-24 overflow-hidden">
          <div className="absolute inset-0 hero-dots opacity-50 pointer-events-none" />
          <div className="absolute top-0 right-0 w-96 h-96 bg-accent-100/60 rounded-full blur-3xl pointer-events-none translate-x-1/2 -translate-y-1/2" />

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 bg-accent-50 border border-accent-200 text-accent-700 text-xs font-semibold px-3 py-1.5 rounded-full mb-6">
                <span className="w-1.5 h-1.5 bg-accent-500 rounded-full animate-pulse" />
                Updated this week · April 2026
              </div>

              <h1 className="font-display font-extrabold text-4xl sm:text-5xl md:text-6xl text-ink leading-[1.08] tracking-tight mb-6">
                🔥 Trending Products
                <br />
                <span className="text-gradient">You Need Right Now</span>
              </h1>

              <p className="text-lg sm:text-xl text-ink-soft leading-relaxed mb-10 max-w-xl">
                Handpicked essentials for students & young professionals —
                updated every week with honest recommendations.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 mb-12">
                <Link
                  href="#trending"
                  className="btn-primary text-base px-7 py-3.5"
                >
                  🔥 See Best Deals <ArrowRight className="w-5 h-5" />
                </Link>
                <Link href="/deals" className="btn-ghost text-base px-7 py-3.5">
                  🔥 Today's Flash Deals
                </Link>
              </div>

              <div className="flex items-center gap-8 mb-8">
                {[
                  ["50K+", "Subscribers"],
                  [String(Math.max(all.length, 20)) + "+", "Products"],
                  ["Weekly", "Updates"],
                ].map(([val, label]) => (
                  <div key={label}>
                    <div className="font-display font-extrabold text-2xl text-ink">
                      {val}
                    </div>
                    <div className="text-xs text-ink-muted">{label}</div>
                  </div>
                ))}
              </div>
              {/* Social proof ticker */}
              <div className="max-w-sm">
                <SocialProofTicker />
              </div>
            </div>
          </div>
        </section>

        {/* ── Editor's Picks strip ─────────────────────────────── */}
        {featured.length > 0 && (
          <section className="bg-ink py-10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center gap-3 mb-5">
                <span className="text-xl">⭐</span>
                <h2 className="font-display font-bold text-lg text-white">
                  Editor's Top Picks
                </h2>
                <span className="text-xs text-white/40 ml-auto">
                  Hand-selected this week
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {featured.map((p) => (
                  <a
                    key={p.id}
                    href={p.affiliateLink}
                    target="_blank"
                    rel="noopener noreferrer sponsored"
                    className="flex items-center gap-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl p-4 transition-all group"
                  >
                    <div className="w-12 h-12 rounded-xl bg-white/10 shrink-0 overflow-hidden">
                      <img
                        src={p.image}
                        alt={p.title}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-white line-clamp-1 group-hover:text-accent-300 transition-colors">
                        {p.title}
                      </p>
                      <p className="text-sm font-bold text-accent-400 mt-0.5">
                        {p.price}
                      </p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-white/30 group-hover:text-accent-400 shrink-0 transition-all" />
                  </a>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ── Deal of the Day ──────────────────────────────────── */}
        {dealProduct && <DealOfTheDay product={dealProduct} />}

        {/* ── ✨ Latest Products (always shows newest additions) ── */}
        {latest.length > 0 && (
          <Section
            id="latest"
            icon="✨"
            title="Just Added"
            subtitle="The newest products added to our catalog — fresh this week"
            products={latest}
            viewAllHref="/categories/trending"
            maxShow={4}
          />
        )}

        <div className="border-t border-ink-ghost/40" />

        {/* ── Product Sections ─────────────────────────────────── */}
        <Section
          id="trending"
          icon="🔥"
          title="Trending This Week"
          subtitle="The most-bought products by Indian shoppers right now"
          products={trending}
          viewAllHref="/categories/trending"
          maxShow={4}
        />

        <div className="border-t border-ink-ghost/40" />

        <Section
          id="student"
          icon="🎓"
          title="Student Essentials"
          subtitle="Gear that makes college life easier, smarter, and more productive"
          products={student}
          viewAllHref="/categories/student"
          maxShow={4}
        />

        <div className="bg-blue-50 border-y border-blue-100">
          <Section
            id="budget"
            icon="💸"
            title="Under ₹999"
            subtitle="Great quality without the painful price tag — all under ₹999"
            products={budget}
            viewAllHref="/categories/budget"
            maxShow={4}
          />
        </div>

        <Section
          id="ai-tools"
          icon="🤖"
          title="AI Tools & Productivity"
          subtitle="Hardware for the AI era — built for developers and power users"
          products={aiTools}
          viewAllHref="/categories/ai-tools"
          maxShow={4}
        />

        {/* ── Recently Viewed ──────────────────────────────────── */}
        <RecentlyViewed />

        {/* ── Blog Teaser ──────────────────────────────────────── */}
        <section className="py-14 sm:py-18 border-t border-ink-ghost/40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-end justify-between mb-8">
              <div>
                <span className="text-accent-600 text-sm font-semibold uppercase tracking-wider block mb-2">
                  Buying Guides
                </span>
                <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-ink">
                  📰 From the Blog
                </h2>
              </div>
              <Link
                href="/blog"
                className="group flex items-center gap-1.5 text-sm font-semibold text-accent-600 hover:text-accent-700 transition-colors"
              >
                All Articles{" "}
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>
            <div className="grid sm:grid-cols-3 gap-5">
              {blogData.slice(0, 3).map((post) => (
                <Link
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  className="group card overflow-hidden flex flex-col"
                >
                  <div className="aspect-video overflow-hidden bg-surface-2">
                    <img
                      src={post.coverImage}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                  </div>
                  <div className="p-4 flex flex-col flex-1">
                    <span className="text-[11px] font-semibold text-accent-600 uppercase tracking-wider mb-2">
                      {post.category} · {post.readTime}
                    </span>
                    <h3 className="font-display font-bold text-sm text-ink line-clamp-2 group-hover:text-accent-600 transition-colors flex-1 leading-snug">
                      {post.title}
                    </h3>
                    <div className="mt-3 text-xs font-semibold text-accent-600">
                      Read →
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ── Trust Bar ────────────────────────────────────────── */}
        <section className="py-14 bg-ink">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="font-display font-bold text-2xl text-white text-center mb-10">
              Why 50,000+ readers trust SmartEssentials
            </h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {TRUST.map(({ icon: Icon, label, desc }) => (
                <div
                  key={label}
                  className="flex flex-col items-center text-center gap-3"
                >
                  <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center">
                    <Icon className="w-6 h-6 text-accent-400" />
                  </div>
                  <div>
                    <p className="font-display font-bold text-white text-sm">
                      {label}
                    </p>
                    <p className="text-xs text-white/50 mt-1 leading-relaxed">
                      {desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Newsletter CTA ───────────────────────────────────── */}
        <section className="py-16 sm:py-20">
          <div className="max-w-2xl mx-auto px-4 sm:px-6 text-center">
            <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-ink mb-4">
              Never Miss a Deal
            </h2>
            <p className="text-ink-muted mb-8 max-w-sm mx-auto">
              Fresh picks every Monday. Join 50,000+ smart shoppers.
            </p>

            <NewsletterCTA />
            <p className="text-xs text-ink-ghost mt-3">
              No spam. Unsubscribe anytime.
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
