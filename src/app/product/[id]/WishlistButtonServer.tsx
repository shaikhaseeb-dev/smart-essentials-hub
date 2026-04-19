'use client';

import { Heart } from 'lucide-react';
import { useWishlist } from '@/store';
import type { Product } from '@/types';

export default function WishlistButtonServer({ product }: { product: Product }) {
  const { toggle, has } = useWishlist();
  const saved = has(product.id);

  return (
    <button
      onClick={() => toggle(product)}
      className={`btn-ghost w-full text-sm ${saved ? 'border-red-200 text-red-600 bg-red-50 hover:bg-red-100' : ''}`}
    >
      <Heart className={`w-4 h-4 ${saved ? 'fill-red-500 text-red-500' : ''}`} />
      {saved ? 'Saved to Wishlist' : 'Save to Wishlist'}
    </button>
  );
}
