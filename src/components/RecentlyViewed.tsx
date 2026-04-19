'use client';

import Image from 'next/image';
import { Clock, ExternalLink } from 'lucide-react';
import { useRecentlyViewed } from '@/store';
import { trackClick } from '@/lib/utils';

export default function RecentlyViewed({ excludeId }: { excludeId?: string }) {
  const { items } = useRecentlyViewed();
  const shown = items.filter(p => p.id !== excludeId).slice(0, 6);

  if (shown.length === 0) return null;

  return (
    <section className="py-10 border-t border-ink-ghost/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center gap-2 mb-5">
          <Clock className="w-4 h-4 text-ink-muted" />
          <h3 className="text-sm font-semibold text-ink-muted uppercase tracking-wider">
            Recently Viewed
          </h3>
        </div>

        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
          {shown.map((p) => (
            <a
              key={p.id}
              href={p.affiliateLink}
              target="_blank"
              rel="noopener noreferrer sponsored"
              onClick={() => trackClick(p)}
              className="group flex-shrink-0 w-36 sm:w-44 bg-surface-1 border border-ink-ghost/60 rounded-xl overflow-hidden hover:border-accent-300 hover:shadow-soft transition-all duration-200"
            >
              <div className="aspect-square bg-surface-2 overflow-hidden">
                <Image
                  src={p.image}
                  alt={p.title}
                  width={176}
                  height={176}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
              </div>
              <div className="p-2.5">
                <p className="text-xs font-medium text-ink line-clamp-2 leading-snug group-hover:text-accent-600 transition-colors">
                  {p.title}
                </p>
                <div className="flex items-center justify-between mt-1.5">
                  <span className="text-xs font-bold text-ink">{p.price}</span>
                  <ExternalLink className="w-3 h-3 text-ink-ghost group-hover:text-accent-500 transition-colors" />
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
