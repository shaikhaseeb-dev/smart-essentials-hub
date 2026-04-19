import type { Metadata } from 'next';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import type { Product } from '@/types';
import { getProducts } from '@/lib/getProducts';

export const metadata: Metadata = {
  title: 'Trending Products India 2026',
  description: 'Most-bought trending products in India right now. Updated every Monday.',
};

export default async function TrendingPage() {
  const products = await getProducts('trending');

  return (
    <>
      <Navbar />
      <main className="min-h-screen">
        {/* Header */}
        <div className="bg-surface-1 border-b border-ink-ghost/60 py-10 sm:py-14">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <nav className="flex items-center gap-1.5 text-xs text-ink-muted mb-4">
              <a href="/" className="hover:text-accent-600 transition-colors">Home</a>
              <span>/</span>
              <span className="text-ink font-medium">Trending</span>
            </nav>
            <div className="flex items-center gap-2 mb-1">
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold bg-orange-100 text-orange-700 border border-orange-200 px-2.5 py-1 rounded-full">
                <span className="w-1.5 h-1.5 bg-orange-500 rounded-full animate-pulse" />
                Updated this week
              </span>
            </div>
            <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-ink mt-3 mb-2">
              🔥 Trending This Week
            </h1>
            <p className="text-ink-muted max-w-xl">
              The most-bought products by Indian shoppers right now — ranked by demand and reviews.
            </p>
            <p className="text-xs text-ink-ghost mt-3">{products.length} products</p>
          </div>
        </div>

        {/* Grid */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5 stagger">
            {products.map((p, i) => (
              <ProductCard key={p.id} product={p} priority={i < 4} />
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
