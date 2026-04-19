import type { Metadata } from 'next';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import type { Product } from '@/types';
import { getProducts } from '@/lib/getProducts';

export const metadata: Metadata = {
  title: 'Best Student Essentials India 2026',
  description: 'Top-rated products for Indian college students. Laptops, earbuds, stationery, and more.',
};

export default async function StudentPage() {
  const products = await getProducts('student');

  return (
    <>
      <Navbar />
      <main className="min-h-screen">
        <div className="bg-surface-1 border-b border-ink-ghost/60 py-10 sm:py-14">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <nav className="flex items-center gap-1.5 text-xs text-ink-muted mb-4">
              <a href="/" className="hover:text-accent-600 transition-colors">Home</a>
              <span>/</span>
              <span className="text-ink font-medium">Student Essentials</span>
            </nav>
            <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-ink mb-2">
              🎓 Student Essentials
            </h1>
            <p className="text-ink-muted max-w-xl">
              Curated gear to survive college — from study tools to hostel room upgrades.
            </p>
            <p className="text-xs text-ink-ghost mt-3">{products.length} products</p>
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
