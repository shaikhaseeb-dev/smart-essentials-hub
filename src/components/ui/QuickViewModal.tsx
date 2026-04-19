'use client';

import { useEffect } from 'react';
import Image from 'next/image';
import { X, ShoppingCart, ExternalLink, Star, CheckCircle, TrendingUp, GitCompare } from 'lucide-react';
import { useQuickView, useCompare, useRecentlyViewed } from '@/store';
import { calcDiscount, trackClick } from '@/lib/utils';
import WishlistButton from './WishlistButton';
import ShareButton from './ShareButton';

export default function QuickViewModal() {
  const { product, close } = useQuickView();
  const { toggle: compareToggle, has: compareHas } = useCompare();
  const { record } = useRecentlyViewed();

  // Record view + prevent body scroll
  useEffect(() => {
    if (product) {
      record(product);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [product, record]);

  // Escape key
  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === 'Escape') close(); };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [close]);

  if (!product) return null;

  const discount = product.originalPrice ? calcDiscount(product.price, product.originalPrice) : 0;
  const inCompare = compareHas(product.id);

  const handleBuy = () => {
    trackClick(product);
    fetch('/api/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productId: product.id, title: product.title, price: product.price }),
    }).catch(() => {});
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-[60] bg-ink/40 backdrop-blur-sm animate-fade-in"
        onClick={close}
      />

      {/* Modal */}
      <div className="fixed inset-x-4 top-1/2 -translate-y-1/2 z-[61] max-w-2xl mx-auto animate-fade-up">
        <div className="bg-white rounded-3xl shadow-card-hover overflow-hidden max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-ink-ghost/60">
            <p className="text-xs font-semibold text-ink-muted uppercase tracking-wider">Quick View</p>
            <div className="flex items-center gap-2">
              <WishlistButton product={product} />
              <ShareButton product={product} />
              <button
                onClick={close}
                className="w-8 h-8 rounded-full border border-ink-ghost/60 flex items-center justify-center text-ink-muted hover:text-ink hover:border-ink-soft transition-all"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Body */}
          <div className="flex flex-col sm:flex-row">
            {/* Image */}
            <div className="sm:w-2/5 bg-surface-1 flex items-center justify-center p-8 min-h-[240px] relative">
              <Image
                src={product.image}
                alt={product.title}
                width={280}
                height={280}
                className="object-contain w-full max-h-[240px]"
              />
              {discount > 0 && (
                <div className="absolute top-4 right-4 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                  -{discount}%
                </div>
              )}
              {product.badge && (
                <div className="absolute top-4 left-4">
                  <span className="text-[11px] font-semibold bg-white border border-ink-ghost/60 text-ink-soft px-2 py-0.5 rounded-full shadow-soft">
                    {product.badge}
                  </span>
                </div>
              )}
            </div>

            {/* Info */}
            <div className="flex-1 p-6">
              {/* Category */}
              <span className="text-[11px] font-semibold text-accent-600 uppercase tracking-wider">
                {product.category.replace('-', ' ')}
              </span>

              {/* Title */}
              <h2 className="font-display font-extrabold text-xl text-ink leading-snug mt-1 mb-3">
                {product.title}
              </h2>

              {/* Description */}
              <p className="text-sm text-ink-muted leading-relaxed mb-4">{product.description}</p>

              {/* Benefits */}
              <ul className="space-y-2 mb-4">
                <li className="flex items-start gap-2 text-sm text-ink-soft">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                  {product.benefit1}
                </li>
                {product.benefit2 && (
                  <li className="flex items-start gap-2 text-sm text-ink-soft">
                    <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                    {product.benefit2}
                  </li>
                )}
              </ul>

              {/* Rating */}
              <div className="flex items-center gap-2 mb-3">
                <div className="flex">
                  {[1,2,3,4,5].map(i => (
                    <Star key={i} className={`w-3.5 h-3.5 ${i <= Math.round(product.rating) ? 'fill-amber-400 text-amber-400' : 'text-ink-ghost fill-ink-ghost/20'}`} />
                  ))}
                </div>
                <span className="text-sm font-semibold text-ink-soft">{product.rating}</span>
                <span className="text-xs text-ink-ghost">({product.reviews} reviews)</span>
              </div>

              {/* Social proof */}
              {product.bought && (
                <p className="flex items-center gap-1.5 text-xs text-green-700 bg-green-50 border border-green-100 px-3 py-1.5 rounded-lg mb-4 w-fit">
                  <TrendingUp className="w-3.5 h-3.5 shrink-0" />
                  {product.bought}
                </p>
              )}

              {/* Price */}
              <div className="flex items-baseline gap-2.5 mb-5">
                <span className="font-display font-extrabold text-3xl text-ink">{product.price}</span>
                {product.originalPrice && (
                  <span className="text-base text-ink-ghost line-through">{product.originalPrice}</span>
                )}
              </div>

              {/* Actions */}
              <div className="flex flex-col gap-2.5">
                <a
                  href={product.affiliateLink}
                  target="_blank"
                  rel="noopener noreferrer sponsored"
                  onClick={handleBuy}
                  className="btn-primary w-full py-3 text-sm"
                >
                  <ShoppingCart className="w-4 h-4" />
                  View Deal on Amazon
                  <ExternalLink className="w-3.5 h-3.5 opacity-60 ml-auto" />
                </a>

                <button
                  onClick={() => compareToggle(product)}
                  className={`btn-ghost w-full py-2.5 text-sm ${inCompare ? 'border-accent-400 text-accent-600 bg-accent-50' : ''}`}
                >
                  <GitCompare className="w-4 h-4" />
                  {inCompare ? 'Remove from Compare' : 'Add to Compare'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
