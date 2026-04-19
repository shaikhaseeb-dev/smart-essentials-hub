'use client';

import { useWishlist } from '@/store';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import Link from 'next/link';
import { Heart, ShoppingBag } from 'lucide-react';

export default function WishlistPage() {
  const { items, clear } = useWishlist();

  return (
    <>
      <Navbar />
      <main className="min-h-screen">
        <div className="bg-surface-1 border-b border-ink-ghost/60 py-10 sm:py-14">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Heart className="w-5 h-5 text-red-500 fill-red-500" />
                  <h1 className="font-display font-extrabold text-3xl text-ink">Saved Products</h1>
                </div>
                <p className="text-ink-muted text-sm">{items.length} saved product{items.length !== 1 ? 's' : ''}</p>
              </div>
              {items.length > 0 && (
                <button
                  onClick={clear}
                  className="btn-ghost text-sm text-red-600 border-red-200 hover:bg-red-50"
                >
                  Clear All
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
          {items.length === 0 ? (
            <div className="text-center py-24">
              <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-5">
                <Heart className="w-10 h-10 text-red-300" />
              </div>
              <h2 className="font-display font-bold text-2xl text-ink mb-3">Your wishlist is empty</h2>
              <p className="text-ink-muted mb-8 max-w-sm mx-auto">
                Browse products and tap the heart icon to save items for later.
              </p>
              <Link href="/" className="btn-primary text-sm">
                <ShoppingBag className="w-4 h-4" />
                Browse Products
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5 stagger">
              {items.map((p, i) => (
                <ProductCard key={p.id} product={p} priority={i < 4} />
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
