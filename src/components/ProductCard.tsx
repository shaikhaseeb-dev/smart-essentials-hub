"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Star,
  ShoppingCart,
  ExternalLink,
  CheckCircle,
  TrendingUp,
  Eye,
  GitCompare,
} from "lucide-react";
import { calcDiscount, badgeCssMap, trackClick } from "@/lib/utils";
import { useQuickView, useCompare, useRecentlyViewed } from "@/store";
import WishlistButton from "./ui/WishlistButton";
import ShareButton from "./ui/ShareButton";
import type { Product } from "@/types";

interface Props {
  product: Product;
  priority?: boolean;
  variant?: "default" | "compact";
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-1">
      <div className="flex">
        {[1, 2, 3, 4, 5].map((i) => {
          const filled = rating >= i;
          const partial = !filled && rating > i - 1;
          return (
            <span key={i} className="relative w-3.5 h-3.5">
              <Star className="w-3.5 h-3.5 text-ink-ghost/40 fill-ink-ghost/20 absolute" />
              {(filled || partial) && (
                <span
                  className="absolute inset-0 overflow-hidden"
                  style={{
                    width: filled
                      ? "100%"
                      : `${(rating - Math.floor(rating)) * 100}%`,
                  }}
                >
                  <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                </span>
              )}
            </span>
          );
        })}
      </div>
      <span className="text-xs font-semibold text-ink-soft ml-0.5">
        {rating}
      </span>
    </div>
  );
}

export default function ProductCard({
  product,
  priority = false,
  variant = "default",
}: Props) {
  const { open: openQuickView } = useQuickView();
  const { toggle: compareToggle, has: compareHas } = useCompare();
  const { record } = useRecentlyViewed();

  const {
    title,
    description,
    benefit1,
    benefit2,
    price,
    originalPrice,
    image,
    affiliateLink,
    badge,
    badgeType,
    rating,
    reviews,
    bought,
  } = product;

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const discount = originalPrice ? calcDiscount(price, originalPrice) : 0;
  const inCompare = mounted && compareHas(product.id);

  const handleBuy = () => {
    record(product);
    trackClick({ ...product, source: "card" });
    fetch("/api/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId: product.id, title, price }),
    }).catch(() => {});
  };

  // ── Compact variant ─────────────────────────────────────
  if (variant === "compact") {
    return (
      <div className="card flex gap-3 p-3">
        <div className="w-16 h-16 rounded-xl bg-surface-2 shrink-0 overflow-hidden">
          <Image
            src={image || "/fallback.png"}
            alt={title}
            width={64}
            height={64}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-ink line-clamp-1">{title}</p>
          <p className="text-xs text-ink-muted line-clamp-1 mt-0.5">
            {description}
          </p>
          <div className="flex items-center gap-2 mt-1.5">
            <span className="text-sm font-bold text-ink">{price}</span>
            {originalPrice && (
              <span className="text-xs text-ink-muted line-through">
                {originalPrice}
              </span>
            )}
          </div>
        </div>
        <a
          href={affiliateLink}
          target="_blank"
          rel="noopener noreferrer sponsored"
          onClick={handleBuy}
          className="btn-primary text-xs px-3 py-2 self-center shrink-0"
        >
          Buy
        </a>
      </div>
    );
  }

  // ── Default card ────────────────────────────────────────
  return (
    <article className="group card flex flex-col relative">
      {/* ── Image ── */}
      <div className="relative aspect-square bg-surface-1 overflow-hidden">
        <Image
          src={image || "/fallback.png"}
          alt={title}
          fill
          sizes="(max-width:640px) 50vw,(max-width:1024px) 33vw, 25vw"
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          priority={priority}
          loading={priority ? "eager" : "lazy"}
        />

        {/* Badge */}
        {badge && badgeType && (
          <div className="absolute top-2.5 left-2.5 z-10">
            <span
              className={`text-[11px] font-semibold px-2 py-0.5 rounded-full shadow-soft ${badgeCssMap[badgeType] || "badge-trending"}`}
            >
              {badge}
            </span>
          </div>
        )}

        {/* Discount */}
        {discount > 0 && (
          <div className="absolute top-2.5 right-2.5 z-10 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
            -{discount}%
          </div>
        )}

        {/* Hover overlay with actions */}
        <div className="absolute inset-0 bg-ink/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-2">
          {/* Quick View */}
          <button
            onClick={(e) => {
              e.preventDefault();
              openQuickView(product);
              record(product);
            }}
            className="flex items-center gap-1.5 bg-white text-ink text-xs font-semibold px-3 py-2 rounded-xl shadow-soft hover:bg-surface-2 transition-colors"
          >
            <Eye className="w-3.5 h-3.5" />
            Quick View
          </button>
        </div>

        {/* Action buttons (always visible) */}
        <div className="absolute bottom-2.5 right-2.5 flex flex-col gap-1.5 z-10">
          <WishlistButton product={product} className="shadow-soft" />
          <ShareButton product={product} className="shadow-soft" />
        </div>
      </div>

      {/* ── Body ── */}
      <div className="flex flex-col flex-1 p-4">
        <Link href={`/product/${product.id}`} className="block">
          <h3 className="font-display font-bold text-sm sm:text-base text-ink leading-snug mb-2 line-clamp-2 group-hover:text-accent-600 transition-colors">
            {title}
          </h3>
        </Link>

        <p className="text-xs text-ink-muted line-clamp-2 leading-relaxed mb-3">
          {description}
        </p>

        {/* Benefits */}
        <ul className="space-y-1 mb-3">
          <li className="flex items-start gap-1.5 text-xs text-ink-soft">
            <CheckCircle className="w-3.5 h-3.5 text-green-500 mt-0.5 shrink-0" />
            <span className="line-clamp-1">
              {benefit1 || "High quality & reliable"}
            </span>
          </li>
          {benefit2 && (
            <li className="flex items-start gap-1.5 text-xs text-ink-soft">
              <CheckCircle className="w-3.5 h-3.5 text-green-500 mt-0.5 shrink-0" />
              <span className="line-clamp-1">{benefit2}</span>
            </li>
          )}
        </ul>

        {/* Rating */}
        <div className="flex items-center gap-2 mb-2">
          <StarRating rating={rating} />
          <span className="text-xs text-ink-ghost">({reviews})</span>
        </div>

        {/* Social proof */}
        {bought && (
          <p className="text-[11px] text-green-700 bg-green-50 border border-green-100 px-2 py-1 rounded-lg flex items-center gap-1 mb-3">
            <TrendingUp className="w-3 h-3 shrink-0" />
            {bought}
          </p>
        )}

        {/* Price + CTA */}
        <div className="mt-auto pt-3 border-t border-ink-ghost/60 space-y-2.5">
          <div className="flex items-baseline gap-2">
            <span className="font-display font-extrabold text-xl text-ink">
              {price}
            </span>
            {originalPrice && (
              <span className="text-sm text-ink-ghost line-through">
                {originalPrice}
              </span>
            )}
          </div>

          <p className="text-[11px] text-red-500 font-semibold">
            ⚡ Price may increase soon
          </p>
          <p className="text-[11px] text-green-600 font-medium">
            🔥 100+ bought recently
          </p>

          {/* Buy button */}
          <a
            href={affiliateLink}
            target="_blank"
            rel="noopener noreferrer sponsored"
            onClick={handleBuy}
            className="btn-primary w-full text-sm py-2.5 flex items-center justify-between"
            aria-label={`View deal for ${title} on Amazon`}
          >
            <ShoppingCart className="w-4 h-4" />
            <span className="flex items-center gap-2">
              👉 Check Price
              <span className="text-xs opacity-80">Best Deal</span>
            </span>
            <ExternalLink className="w-3 h-3 opacity-60 ml-auto" />
          </a>

          {/* Compare */}
          <button
            onClick={() => compareToggle(product)}
            className={`w-full text-xs font-medium flex items-center justify-center gap-1.5 py-1.5 rounded-lg border transition-all duration-200 ${
              inCompare
                ? "border-accent-400 text-accent-600 bg-accent-50"
                : "border-ink-ghost/60 text-ink-ghost hover:text-ink-muted hover:border-ink-soft"
            }`}
          >
            <GitCompare className="w-3 h-3" />
            {mounted && inCompare ? "In Compare ✓" : "Add to Compare"}
          </button>
        </div>
      </div>
    </article>
  );
}
