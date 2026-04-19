'use client';

import { Heart } from 'lucide-react';
import { useWishlist } from '@/store';
import type { Product } from '@/types';

interface Props {
  product: Product;
  className?: string;
}

export default function WishlistButton({ product, className = '' }: Props) {
  const { toggle, has } = useWishlist();
  const saved = has(product.id);

  return (
    <button
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggle(product);
      }}
      aria-label={saved ? 'Remove from wishlist' : 'Save to wishlist'}
      title={saved ? 'Remove from wishlist' : 'Save to wishlist'}
      className={`group flex items-center justify-center w-8 h-8 rounded-full transition-all duration-200 ${
        saved
          ? 'bg-red-50 border border-red-200 text-red-500 hover:bg-red-100'
          : 'bg-white border border-ink-ghost/60 text-ink-ghost hover:text-red-400 hover:border-red-200'
      } ${className}`}
    >
      <Heart
        className={`w-4 h-4 transition-all duration-200 ${
          saved ? 'fill-red-500 text-red-500' : 'group-hover:fill-red-100'
        }`}
      />
    </button>
  );
}
