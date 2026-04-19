import type { Metadata } from 'next';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import type { Product } from '@/types';
import { getProducts } from '@/lib/getProducts';

export const metadata: Metadata = {
  title: 'Best Deals Today India 2026 | SmartEssentials Hub',
  description: 'Today\'s best deals on Amazon India. Handpicked flash deals updated daily — all with big discounts.',
};

// Products with biggest discounts
function getTopDeals(products: Product[], n: number): Product[] {
  return [...products]
    .filter(p => p.originalPrice)
    .sort((a, b) => {
      const discA = a.originalPrice ? (parseInt(a.originalPrice.replace(/[^0-9]/g, '')) - parseInt(a.price.replace(/[^0-9]/g, ''))) / parseInt(a.originalPrice.replace(/[^0-9]/g, '')) : 0;
      const discB = b.originalPrice ? (parseInt(b.originalPrice.replace(/[^0-9]/g, '')) - parseInt(b.price.replace(/[^0-9]/g, ''))) / parseInt(b.originalPrice.replace(/[^0-9]/g, '')) : 0;
      return discB - discA;
    })
    .slice(0, n);
}

export default async function DealsPage() {
  const all = await getProducts();
  const topDeals    = getTopDeals(all, 8);
  const trending    = all.filter(p => p.category === 'trending').slice(0, 4);
  const budgetDeals = all.filter(p => p.category === 'budget');

  return (
    <>
      <Navbar />
      <main className="min-h-screen">
        {/* Hero header */}
        <div className="bg-ink text-white py-10 sm:py-14">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="flex items-center gap-2 mb-3">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500" />
              </span>
              <span className="text-red-400 text-xs font-bold uppercase tracking-widest">Live Deals</span>
            </div>
            <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-white mb-2">
              🔥 Today's Best Deals
            </h1>
            <p className="text-white/60 max-w-xl">
              Handpicked daily deals from Amazon India — biggest discounts, highest rated. Updated every 24 hours.
            </p>
          </div>
        </div>

        {/* Top deals by discount */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
          <div className="flex items-center gap-3 mb-8">
            <h2 className="font-display font-extrabold text-2xl text-ink">Biggest Discounts Today</h2>
            <span className="text-xs bg-red-100 text-red-700 border border-red-200 font-semibold px-2.5 py-1 rounded-full">
              Up to 74% off
            </span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5 stagger">
            {topDeals.map((p, i) => (
              <ProductCard key={p.id} product={p} priority={i < 4} />
            ))}
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-ink-ghost/40" />

        {/* Budget deals */}
        <div className="bg-blue-50 py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <h2 className="font-display font-extrabold text-2xl text-ink mb-2">💸 All Under ₹999</h2>
            <p className="text-ink-muted text-sm mb-8">Great quality products that won't hurt your wallet.</p>
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5 stagger">
              {budgetDeals.map((p, i) => (
                <ProductCard key={p.id} product={p} priority={false} />
              ))}
            </div>
          </div>
        </div>

        {/* Trending */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
          <h2 className="font-display font-extrabold text-2xl text-ink mb-8">
            🔥 Also Trending Right Now
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-5 stagger">
            {trending.map((p, i) => (
              <ProductCard key={p.id} product={p} priority={false} />
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
