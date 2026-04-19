import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import ProductCard from './ProductCard';
import type { Product } from '@/types';

interface Props {
  id?: string;
  icon: string;
  title: string;
  subtitle?: string;
  products: Product[];
  viewAllHref?: string;
  maxShow?: number;
  cols?: 2 | 3 | 4;
}

const colsClass: Record<number, string> = {
  2: 'grid-cols-1 sm:grid-cols-2',
  3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
  4: 'grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4',
};

export default function Section({
  id, icon, title, subtitle, products, viewAllHref, maxShow = 4, cols = 4,
}: Props) {
  const shown = products.slice(0, maxShow);

  return (
    <section id={id} className="py-12 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-end justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2.5 mb-1.5">
              <span className="text-2xl">{icon}</span>
              <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-ink section-title-underline">
                {title}
              </h2>
            </div>
            {subtitle && <p className="text-sm text-ink-muted max-w-lg">{subtitle}</p>}
          </div>
          {viewAllHref && (
            <Link href={viewAllHref}
              className="group flex items-center gap-1.5 text-sm font-semibold text-accent-600 hover:text-accent-700 transition-colors shrink-0">
              View All
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          )}
        </div>

        {/* Grid */}
        {shown.length > 0 ? (
          <div className={`grid ${colsClass[cols]} gap-4 sm:gap-5 stagger`}>
            {shown.map((p, i) => (
              <ProductCard key={p.id} product={p} priority={i < 2} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 text-ink-muted bg-surface-1 rounded-2xl">
            No products in this section yet.
          </div>
        )}

        {/* Mobile view all */}
        {viewAllHref && products.length > maxShow && (
          <div className="mt-8 text-center">
            <Link href={viewAllHref}
              className="btn-ghost text-sm">
              See all {products.length} products
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
