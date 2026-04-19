'use client';

import { useState, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import type { Product, Category } from '@/types';
import { getProducts } from '@/lib/getProducts';
import { searchProducts } from '@/lib/utils';

const ALL_CATS: Category[] = ['trending', 'student', 'budget', 'ai-tools'];

const CAT_LABELS: Record<string, string> = {
  trending: '🔥 Trending',
  student:  '🎓 Student',
  budget:   '💸 Under ₹999',
  'ai-tools':'🤖 AI Tools',
};

const SORT_OPTIONS = [
  { value: 'relevance', label: 'Most Relevant' },
  { value: 'rating',    label: 'Highest Rated' },
  { value: 'price-asc', label: 'Price: Low → High' },
  { value: 'price-desc',label: 'Price: High → Low' },
];

function parsePrice(s: string) {
  return parseInt(s.replace(/[^0-9]/g, ''), 10) || 0;
}

function SearchInner() {
  const params      = useSearchParams();
  const initQ       = params.get('q') || '';
  const [query,     setQuery]   = useState(initQ);
  const [cats,      setCats]    = useState<Category[]>([]);
  const [sort,      setSort]    = useState('relevance');
  const [filtersOn, setFiltersOn] = useState(false);

  const [allProducts, setAllProducts] = React.useState<Product[]>([]);
  useEffect(() => {
    getProducts().then(setAllProducts).catch(() => {});
  }, []);
  const all = allProducts;

  const results = useMemo(() => {
    let base = query.length >= 2 ? searchProducts(all, query) : all;
    if (cats.length > 0) base = base.filter(p => cats.includes(p.category));
    switch (sort) {
      case 'rating':     return [...base].sort((a, b) => b.rating - a.rating);
      case 'price-asc':  return [...base].sort((a, b) => parsePrice(a.price) - parsePrice(b.price));
      case 'price-desc': return [...base].sort((a, b) => parsePrice(b.price) - parsePrice(a.price));
      default:           return base;
    }
  }, [query, cats, sort]);

  const toggleCat = (c: Category) =>
    setCats(prev => prev.includes(c) ? prev.filter(x => x !== c) : [...prev, c]);

  return (
    <>
      <Navbar />
      <main className="min-h-screen">
        {/* Search header */}
        <div className="bg-surface-1 border-b border-ink-ghost/60 py-8 sm:py-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-ink mb-5">
              Search Products
            </h1>
            {/* Search input */}
            <div className="relative max-w-xl">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-muted" />
              <input
                type="search"
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Search earbuds, keyboards, lamps…"
                className="input-base pl-10 pr-10 text-base h-12"
                autoFocus
              />
              {query && (
                <button onClick={() => setQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-muted hover:text-ink">
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
            <p className="text-xs text-ink-muted mt-3">
              {results.length} product{results.length !== 1 ? 's' : ''} found
              {query && <span className="ml-1">for "<strong>{query}</strong>"</span>}
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
          {/* Filter + sort bar */}
          <div className="flex items-center gap-3 mb-6 flex-wrap">
            <button
              onClick={() => setFiltersOn(!filtersOn)}
              className={`flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-xl border transition-all ${
                filtersOn ? 'bg-ink text-white border-ink' : 'border-ink-ghost text-ink-soft hover:border-ink-soft'
              }`}
            >
              <SlidersHorizontal className="w-4 h-4" />
              Filters
              {cats.length > 0 && (
                <span className="w-4 h-4 rounded-full bg-accent-500 text-white text-[10px] flex items-center justify-center">
                  {cats.length}
                </span>
              )}
            </button>

            {/* Category pills */}
            {filtersOn && ALL_CATS.map(c => (
              <button key={c} onClick={() => toggleCat(c)}
                className={`text-xs font-semibold px-3 py-2 rounded-xl border transition-all ${
                  cats.includes(c)
                    ? 'bg-accent-600 text-white border-accent-600'
                    : 'border-ink-ghost text-ink-muted hover:text-ink hover:border-ink-soft'
                }`}>
                {CAT_LABELS[c]}
              </button>
            ))}

            {/* Sort */}
            <div className="ml-auto">
              <select value={sort} onChange={e => setSort(e.target.value)}
                className="input-base text-xs py-2 pr-8 w-auto min-w-[160px]">
                {SORT_OPTIONS.map(o => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Results */}
          {results.length === 0 ? (
            <div className="py-20 text-center">
              <p className="text-4xl mb-4">🔍</p>
              <p className="font-display font-bold text-xl text-ink mb-2">No products found</p>
              <p className="text-ink-muted text-sm">Try a different keyword or clear the filters.</p>
              <button onClick={() => { setQuery(''); setCats([]); }}
                className="btn-ghost text-sm mt-5">
                Clear all filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5 stagger">
              {results.map((p, i) => (
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

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-ink-muted">Loading…</div>}>
      <SearchInner />
    </Suspense>
  );
}
