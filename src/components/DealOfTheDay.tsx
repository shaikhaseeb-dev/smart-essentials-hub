'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Timer, ShoppingCart, ExternalLink, Star, TrendingUp, Zap } from 'lucide-react';
import { trackClick } from '@/lib/utils';
import WishlistButton from './ui/WishlistButton';
import type { Product } from '@/types';

interface Props {
  product: Product;
}

function useCountdown(hours = 24) {
  const getSecondsLeft = () => {
    // Resets every N hours from midnight
    const now = new Date();
    const midnight = new Date(now);
    midnight.setHours(Math.ceil(now.getHours() / hours) * hours, 0, 0, 0);
    if (midnight <= now) midnight.setHours(midnight.getHours() + hours);
    return Math.max(0, Math.floor((midnight.getTime() - now.getTime()) / 1000));
  };

  const [secs, setSecs] = useState(getSecondsLeft);

  useEffect(() => {
    const id = setInterval(() => setSecs(getSecondsLeft()), 1000);
    return () => clearInterval(id);
  }, []);

  const h = Math.floor(secs / 3600);
  const m = Math.floor((secs % 3600) / 60);
  const s = secs % 60;

  return { h, m, s, secs };
}

function Digit({ val, label }: { val: number; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <div className="bg-ink text-white font-display font-extrabold text-xl sm:text-2xl w-12 sm:w-14 h-12 sm:h-14 rounded-xl flex items-center justify-center tabular-nums">
        {String(val).padStart(2, '0')}
      </div>
      <span className="text-[10px] text-ink-muted mt-1 uppercase tracking-wider">{label}</span>
    </div>
  );
}

export default function DealOfTheDay({ product }: Props) {
  const { h, m, s } = useCountdown(24);

  const handleBuy = () => {
    trackClick(product);
    fetch('/api/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productId: product.id, title: product.title, price: product.price }),
    }).catch(() => {});
  };

  const discount = product.originalPrice
    ? Math.round(((parseInt(product.originalPrice.replace(/[^0-9]/g, '')) - parseInt(product.price.replace(/[^0-9]/g, ''))) / parseInt(product.originalPrice.replace(/[^0-9]/g, ''))) * 100)
    : 0;

  return (
    <section className="py-12 sm:py-16 bg-ink">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 bg-accent-500/20 border border-accent-500/30 text-accent-400 text-xs font-semibold px-3 py-1.5 rounded-full">
              <Zap className="w-3.5 h-3.5" />
              Deal of the Day
            </div>
          </div>
          {/* Countdown */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 text-white/50 text-xs">
              <Timer className="w-3.5 h-3.5" />
              <span>Ends in</span>
            </div>
            <div className="flex items-end gap-2">
              <Digit val={h} label="HRS" />
              <span className="text-white/40 font-bold text-xl mb-3">:</span>
              <Digit val={m} label="MIN" />
              <span className="text-white/40 font-bold text-xl mb-3">:</span>
              <Digit val={s} label="SEC" />
            </div>
          </div>
        </div>

        {/* Product card */}
        <div className="bg-white rounded-3xl overflow-hidden">
          <div className="flex flex-col sm:flex-row">
            {/* Image side */}
            <div className="sm:w-2/5 bg-surface-1 flex items-center justify-center p-10 relative min-h-[220px]">
              <Image
                src={product.image}
                alt={product.title}
                width={280}
                height={280}
                className="object-contain max-h-[220px]"
                priority
              />
              {discount > 0 && (
                <div className="absolute top-5 left-5 bg-red-500 text-white font-bold text-sm px-3 py-1.5 rounded-xl shadow-soft">
                  -{discount}% OFF
                </div>
              )}
              <WishlistButton product={product} className="absolute top-5 right-5 shadow-soft" />
            </div>

            {/* Info side */}
            <div className="flex-1 p-7 sm:p-10 flex flex-col justify-center">
              <span className="text-xs font-semibold text-accent-600 uppercase tracking-wider mb-2">
                {product.category.replace('-', ' ')} · Featured Deal
              </span>
              <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-ink leading-tight mb-3">
                {product.title}
              </h2>
              <p className="text-ink-muted leading-relaxed mb-4">{product.description}</p>

              {/* Rating + social proof */}
              <div className="flex items-center gap-3 mb-5">
                <div className="flex items-center gap-1">
                  {[1,2,3,4,5].map(i => (
                    <Star key={i} className={`w-4 h-4 ${i <= Math.round(product.rating) ? 'fill-amber-400 text-amber-400' : 'text-ink-ghost fill-ink-ghost/20'}`} />
                  ))}
                </div>
                <span className="text-sm font-semibold text-ink-soft">{product.rating}</span>
                <span className="text-sm text-ink-ghost">({product.reviews})</span>
                {product.bought && (
                  <span className="flex items-center gap-1 text-xs text-green-700 bg-green-50 border border-green-100 px-2 py-0.5 rounded-full ml-1">
                    <TrendingUp className="w-3 h-3" />
                    {product.bought}
                  </span>
                )}
              </div>

              {/* Price */}
              <div className="flex items-baseline gap-3 mb-6">
                <span className="font-display font-extrabold text-4xl text-ink">{product.price}</span>
                {product.originalPrice && (
                  <span className="text-lg text-ink-ghost line-through">{product.originalPrice}</span>
                )}
              </div>

              {/* CTA */}
              <a
                href={product.affiliateLink}
                target="_blank"
                rel="noopener noreferrer sponsored"
                onClick={handleBuy}
                className="btn-accent text-base py-3.5 w-full sm:w-auto sm:self-start"
              >
                <ShoppingCart className="w-5 h-5" />
                Grab This Deal
                <ExternalLink className="w-4 h-4 opacity-70 ml-auto sm:ml-0" />
              </a>

              <p className="text-xs text-ink-ghost mt-3">
                ⚡ Price may change after countdown ends. Verify on Amazon before checkout.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
