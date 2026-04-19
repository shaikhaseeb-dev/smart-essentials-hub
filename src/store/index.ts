/**
 * Global client-side stores using Zustand.
 * All state persists to localStorage automatically.
 */
'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Product } from '@/types';

// ─── Wishlist Store ────────────────────────────────────────
interface WishlistState {
  items: Product[];
  add:    (p: Product) => void;
  remove: (id: string) => void;
  toggle: (p: Product) => void;
  has:    (id: string) => boolean;
  clear:  () => void;
}

export const useWishlist = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],
      add:    (p) => set(s => ({ items: s.items.find(x => x.id === p.id) ? s.items : [p, ...s.items] })),
      remove: (id) => set(s => ({ items: s.items.filter(x => x.id !== id) })),
      toggle: (p)  => get().has(p.id) ? get().remove(p.id) : get().add(p),
      has:    (id) => get().items.some(x => x.id === id),
      clear:  ()   => set({ items: [] }),
    }),
    { name: 'seh_wishlist' }
  )
);

// ─── Compare Store (max 3 products) ───────────────────────
interface CompareState {
  items:      Product[];
  open:       boolean;
  add:        (p: Product) => void;
  remove:     (id: string) => void;
  toggle:     (p: Product) => void;
  has:        (id: string) => boolean;
  clear:      () => void;
  setOpen:    (v: boolean) => void;
}

export const useCompare = create<CompareState>()(
  persist(
    (set, get) => ({
      items: [],
      open:  false,
      add:    (p) => {
        const s = get();
        if (s.items.length >= 3 || s.has(p.id)) return;
        set({ items: [...s.items, p], open: true });
      },
      remove: (id) => set(s => ({
        items: s.items.filter(x => x.id !== id),
        open: s.items.filter(x => x.id !== id).length > 0 ? s.open : false,
      })),
      toggle: (p) => get().has(p.id) ? get().remove(p.id) : get().add(p),
      has:    (id) => get().items.some(x => x.id === id),
      clear:  () => set({ items: [], open: false }),
      setOpen:(v)  => set({ open: v }),
    }),
    { name: 'seh_compare' }
  )
);

// ─── Recently Viewed Store ─────────────────────────────────
interface RecentState {
  items: Product[];
  record: (p: Product) => void;
  clear:  () => void;
}

export const useRecentlyViewed = create<RecentState>()(
  persist(
    (set, get) => ({
      items: [],
      record: (p) => {
        const filtered = get().items.filter(x => x.id !== p.id);
        set({ items: [p, ...filtered].slice(0, 8) });
      },
      clear: () => set({ items: [] }),
    }),
    { name: 'seh_recent' }
  )
);

// ─── Quick View Store ──────────────────────────────────────
interface QuickViewState {
  product: Product | null;
  open:    (p: Product) => void;
  close:   () => void;
}

export const useQuickView = create<QuickViewState>()((set) => ({
  product: null,
  open:    (p) => set({ product: p }),
  close:   () => set({ product: null }),
}));
