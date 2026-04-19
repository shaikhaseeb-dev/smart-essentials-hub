'use client';

import { Share2, Link, Check } from 'lucide-react';
import { useState } from 'react';
import type { Product } from '@/types';

interface Props {
  product: Product;
  className?: string;
}

export default function ShareButton({ product, className = '' }: Props) {
  const [copied, setCopied] = useState(false);

  const handleShare = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const shareData = {
      title: product.title,
      text: `${product.title} — ${product.price} on Amazon India 🛒`,
      url: typeof window !== 'undefined' ? window.location.href : product.affiliateLink,
    };

    // Try native share (mobile)
    if (navigator.share) {
      try {
        await navigator.share(shareData);
        return;
      } catch {}
    }

    // Fallback: copy to clipboard
    try {
      await navigator.clipboard.writeText(shareData.url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  return (
    <button
      onClick={handleShare}
      aria-label="Share product"
      title={copied ? 'Link copied!' : 'Share this product'}
      className={`flex items-center justify-center w-8 h-8 rounded-full bg-white border border-ink-ghost/60 text-ink-ghost hover:text-ink hover:border-ink-soft transition-all duration-200 ${className}`}
    >
      {copied ? (
        <Check className="w-3.5 h-3.5 text-green-500" />
      ) : (
        <Share2 className="w-3.5 h-3.5" />
      )}
    </button>
  );
}
