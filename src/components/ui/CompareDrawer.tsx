"use client";

import Image from "next/image";
import {
  X,
  GitCompare,
  ShoppingCart,
  ChevronUp,
  ChevronDown,
  Star,
} from "lucide-react";
import { useCompare } from "@/store";
import { trackClick } from "@/lib/utils";

function MiniStars({ rating }: { rating: number }) {
  return (
    <div className="flex">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          className={`w-3 h-3 ${i <= Math.round(rating) ? "fill-amber-400 text-amber-400" : "text-ink-ghost fill-ink-ghost/20"}`}
        />
      ))}
    </div>
  );
}

export default function CompareDrawer() {
  const { items, remove, clear, open, setOpen } = useCompare();

  if (items.length === 0) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[55]">
      {/* Collapsed bar */}
      <div
        className="bg-ink text-white border-t border-white/10 px-4 sm:px-6 flex items-center justify-between h-12 cursor-pointer"
        onClick={() => setOpen(!open)}
      >
        <div className="flex items-center gap-2.5">
          <GitCompare className="w-4 h-4 text-accent-400" />
          <span className="text-sm font-semibold">
            Comparing {items.length} product{items.length > 1 ? "s" : ""}
          </span>
          <span className="text-xs text-white/40">
            {items.length < 3
              ? `(add ${3 - items.length} more to compare)`
              : "(max reached)"}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={(e) => {
              e.stopPropagation();
              clear();
            }}
            className="text-xs text-white/50 hover:text-white transition-colors"
          >
            Clear all
          </button>
          {open ? (
            <ChevronDown className="w-4 h-4 text-white/60" />
          ) : (
            <ChevronUp className="w-4 h-4 text-white/60" />
          )}
        </div>
      </div>

      {/* Expanded comparison panel */}
      {open && (
        <div className="bg-white border-t-2 border-accent-500 shadow-[0_-8px_40px_rgba(0,0,0,0.15)] overflow-x-auto">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 py-5">
            <div
              className="grid gap-4"
              style={{
                gridTemplateColumns: `160px repeat(${items.length}, 1fr)`,
              }}
            >
              {/* Row labels */}
              <div className="space-y-[52px] pt-12 text-xs font-semibold text-ink-muted uppercase tracking-wider">
                <div>Image</div>
                <div>Price</div>
                <div>Rating</div>
                <div>Key benefit</div>
                <div>Action</div>
              </div>

              {/* Product columns */}
              {items.map((p) => (
                <div key={p.id} className="relative min-w-[160px]">
                  {/* Remove */}
                  <button
                    onClick={() => remove(p.id)}
                    className="absolute -top-1 -right-1 z-10 w-5 h-5 bg-ink text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>

                  {/* Name */}
                  <p className="font-display font-bold text-sm text-ink leading-tight mb-3 pr-5 line-clamp-2">
                    {p.title}
                  </p>

                  {/* Image */}
                  <div className="w-full aspect-square bg-surface-1 rounded-xl overflow-hidden mb-3">
                    <Image
                      src={p.image}
                      alt={p.title}
                      width={160}
                      height={160}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Price */}
                  <div className="mb-3">
                    <span className="font-display font-extrabold text-lg text-ink">
                      {p.price}
                    </span>
                    {p.originalPrice && (
                      <span className="text-xs text-ink-ghost line-through ml-1.5">
                        {p.originalPrice}
                      </span>
                    )}
                  </div>

                  {/* Rating */}
                  <div className="flex items-center gap-1.5 mb-3">
                    <MiniStars rating={p.rating} />
                    <span className="text-xs text-ink-muted font-medium">
                      {p.rating}
                    </span>
                  </div>

                  {/* Benefit */}
                  <p className="text-xs text-ink-muted leading-relaxed mb-4 line-clamp-2">
                    {p.benefit1}
                  </p>

                  {/* CTA */}
                  <a
                    href={p.affiliateLink}
                    target="_blank"
                    rel="noopener noreferrer sponsored"
                    onClick={() => trackClick(p)}
                    className="btn-primary w-full text-xs py-2 gap-1.5"
                  >
                    <ShoppingCart className="w-3 h-3" />
                    Buy on Amazon
                  </a>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
