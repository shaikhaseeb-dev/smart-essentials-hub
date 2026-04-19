'use client';

import { ShoppingCart, ExternalLink } from 'lucide-react';
import { trackClick } from '@/lib/utils';
import { useRecentlyViewed } from '@/store';
import type { Product } from '@/types';

export default function BuyButtonClient({ product }: { product: Product }) {
  const { record } = useRecentlyViewed();

  const handleBuy = () => {
    record(product);
    trackClick(product);
    fetch('/api/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productId: product.id, title: product.title, price: product.price }),
    }).catch(() => {});
  };

  return (
    <a
      href={product.affiliateLink}
      target="_blank"
      rel="noopener noreferrer sponsored"
      onClick={handleBuy}
      className="btn-accent w-full py-3.5 text-base"
      aria-label={`Buy ${product.title} on Amazon`}
    >
      <ShoppingCart className="w-5 h-5" />
      View Deal on Amazon
      <ExternalLink className="w-4 h-4 opacity-70 ml-auto" />
    </a>
  );
}
