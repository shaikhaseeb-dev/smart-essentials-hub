import type { Metadata } from 'next';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import type { Product } from '@/types';
import { getProducts } from '@/lib/getProducts';

export const metadata: Metadata = {
  title: 'Best Products Under ₹999 India 2026',
  description: 'Top-rated budget products under ₹999 in India. Quality picks without breaking the bank.',
};

export default async function BudgetPage() {
  const products = await getProducts('budget');

  return (
    <>
      <Navbar />
      <main className="min-h-screen">
        <div className="bg-blue-50 border-b border-blue-100 py-10 sm:py-14">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <nav className="flex items-center gap-1.5 text-xs text-ink-muted mb-4">
              <a href="/" className="hover:text-accent-600 transition-colors">Home</a>
              <span>/</span>
              <span className="text-ink font-medium">Under ₹999</span>
            </nav>
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold bg-blue-100 text-blue-700 border border-blue-200 px-2.5 py-1 rounded-full mb-3">
              💸 Budget Picks
            </div>
            <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-ink mb-2">
              💸 Best Under ₹999
            </h1>
            <p className="text-ink-muted max-w-xl">
              Great quality at honest prices — every product here costs under ₹999.
            </p>
            <p className="text-xs text-ink-ghost mt-3">{products.length} products · All under ₹999</p>
          </div>
        </div>
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
