import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import RecentlyViewed from '@/components/RecentlyViewed';
import type { Product } from '@/types';
import { getProducts, getProductById } from '@/lib/getProducts';
import {
  ShoppingCart, ExternalLink, CheckCircle, Star,
  TrendingUp, ArrowLeft, GitCompare, Share2, Shield,
  Truck, RefreshCw, Tag
} from 'lucide-react';
import { calcDiscount, badgeCssMap } from '@/lib/utils';
import WishlistButtonServer from './WishlistButtonServer';
import PriceAlertForm from '@/components/ui/PriceAlertForm';
import BuyButtonClient from './BuyButtonClient';

// ─── Static params ────────────────────────────────────────
export async function generateStaticParams() {
  const products = await getProducts();
  return products.map(p => ({ id: p.id }));
}

// ─── Metadata ─────────────────────────────────────────────
export async function generateMetadata(
  { params }: { params: { id: string } }
): Promise<Metadata> {
  const product = await getProductById(params.id);
  if (!product) return {};

  const price = parseInt(product.price.replace(/[^0-9]/g, ''), 10);

  return {
    title: `${product.title} — Best Price India 2026`,
    description: `${product.benefit1}. ${product.description}. Buy for ${product.price} on Amazon India.`,
    openGraph: {
      title: product.title,
      description: product.benefit1,
      images: [{ url: product.image, width: 400, height: 400 }],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: product.title,
      description: product.benefit1,
      images: [product.image],
    },
  };
}

// ─── Helpers ──────────────────────────────────────────────
function StarRow({ rating, reviews }: { rating: number; reviews: string }) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex">
        {[1, 2, 3, 4, 5].map(i => (
          <Star
            key={i}
            className={`w-4 h-4 ${
              i <= Math.round(rating)
                ? 'fill-amber-400 text-amber-400'
                : 'text-ink-ghost fill-ink-ghost/20'
            }`}
          />
        ))}
      </div>
      <span className="font-semibold text-sm text-ink">{rating}</span>
      <span className="text-sm text-ink-ghost">({reviews} reviews)</span>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────
export default function ProductPage({ params }: { params: { id: string } }) {
  const product = await getProductById(params.id);
  if (!product) notFound();

  const related = await getProducts(product.category).then(ps => ps.filter(p => p.id !== product.id).slice(0, 4));

  const discount = product.originalPrice
    ? calcDiscount(product.price, product.originalPrice)
    : 0;

  const priceNum = parseInt(product.price.replace(/[^0-9]/g, ''), 10);
  const origNum  = product.originalPrice
    ? parseInt(product.originalPrice.replace(/[^0-9]/g, ''), 10)
    : null;
  const saving   = origNum ? origNum - priceNum : 0;

  // JSON-LD Product schema
  const productSchema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.title,
    description: product.description,
    image: product.image,
    brand: { '@type': 'Brand', name: 'SmartEssentials Hub' },
    offers: {
      '@type': 'Offer',
      url: product.affiliateLink,
      priceCurrency: 'INR',
      price: priceNum,
      availability: 'https://schema.org/InStock',
      seller: { '@type': 'Organization', name: 'Amazon.in' },
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: product.rating,
      bestRating: 5,
      reviewCount: parseInt((product.reviews || '100').replace(/[^0-9]/g, ''), 10) || 100,
    },
  };

  // Breadcrumb schema
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://smartessentials.vercel.app' },
      { '@type': 'ListItem', position: 2, name: product.category.replace('-', ' '), item: `https://smartessentials.vercel.app/categories/${product.category}` },
      { '@type': 'ListItem', position: 3, name: product.title },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      <Navbar />
      <main>
        {/* ── Breadcrumb ── */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <nav className="flex items-center gap-1.5 text-xs text-ink-muted flex-wrap">
            <Link href="/" className="hover:text-accent-600 transition-colors">Home</Link>
            <span>/</span>
            <Link href={`/categories/${product.category}`} className="hover:text-accent-600 transition-colors capitalize">
              {product.category.replace('-', ' ')}
            </Link>
            <span>/</span>
            <span className="text-ink line-clamp-1 max-w-[200px] sm:max-w-none">{product.title}</span>
          </nav>
        </div>

        {/* ── Product hero ── */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">

            {/* Left — Image */}
            <div className="relative">
              <div className="sticky top-24 bg-surface-1 rounded-3xl overflow-hidden aspect-square flex items-center justify-center p-10">
                <Image
                  src={product.image}
                  alt={product.title}
                  width={480}
                  height={480}
                  className="object-contain max-h-[400px] w-full"
                  priority
                />

                {/* Discount badge */}
                {discount > 0 && (
                  <div className="absolute top-5 left-5 bg-red-500 text-white font-bold text-sm px-3 py-1.5 rounded-xl">
                    -{discount}% OFF
                  </div>
                )}

                {/* Badge */}
                {product.badge && product.badgeType && (
                  <div className="absolute top-5 right-5">
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${badgeCssMap[product.badgeType]}`}>
                      {product.badge}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Right — Info */}
            <div className="flex flex-col">
              {/* Category */}
              <Link
                href={`/categories/${product.category}`}
                className="text-xs font-semibold text-accent-600 uppercase tracking-wider hover:underline mb-2 w-fit"
              >
                {product.category.replace('-', ' ')}
              </Link>

              {/* Title */}
              <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-ink leading-tight mb-4">
                {product.title}
              </h1>

              {/* Rating */}
              <div className="mb-4">
                <StarRow rating={product.rating} reviews={product.reviews} />
              </div>

              {/* Social proof */}
              {product.bought && (
                <div className="flex items-center gap-2 mb-5">
                  <span className="flex items-center gap-1.5 text-xs text-green-700 bg-green-50 border border-green-200 px-3 py-1.5 rounded-full font-medium">
                    <TrendingUp className="w-3.5 h-3.5" />
                    {product.bought}
                  </span>
                </div>
              )}

              {/* Description */}
              <p className="text-ink-soft leading-relaxed mb-6">{product.description}</p>

              {/* Benefits */}
              <ul className="space-y-3 mb-8">
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                  <span className="text-ink-soft">{product.benefit1}</span>
                </li>
                {product.benefit2 && (
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                    <span className="text-ink-soft">{product.benefit2}</span>
                  </li>
                )}
              </ul>

              {/* Tags */}
              {product.tags?.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-8">
                  {product.tags.map(tag => (
                    <span key={tag} className="flex items-center gap-1 text-xs text-ink-muted bg-surface-2 border border-ink-ghost/60 px-2.5 py-1 rounded-full">
                      <Tag className="w-3 h-3" />
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Price block */}
              <div className="bg-surface-1 rounded-2xl p-5 mb-6 border border-ink-ghost/60">
                <div className="flex items-baseline gap-3 mb-1">
                  <span className="font-display font-extrabold text-4xl text-ink">{product.price}</span>
                  {product.originalPrice && (
                    <span className="text-lg text-ink-ghost line-through">{product.originalPrice}</span>
                  )}
                </div>
                {saving > 0 && (
                  <p className="text-sm text-green-700 font-semibold">
                    You save ₹{saving.toLocaleString('en-IN')} ({discount}% off)
                  </p>
                )}
                <p className="text-xs text-ink-ghost mt-2">
                  Price verified on Amazon.in · May change without notice
                </p>
              </div>

              {/* CTA buttons */}
              <div className="flex flex-col gap-3 mb-6">
                <BuyButtonClient product={product} />

                <div className="grid grid-cols-2 gap-3">
                  <WishlistButtonServer product={product} />

                  {/* Share */}
                  <a
                    href={`https://wa.me/?text=${encodeURIComponent(`${product.title} — ${product.price} on Amazon India: ${product.affiliateLink}`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-ghost text-sm"
                  >
                    <Share2 className="w-4 h-4" />
                    Share on WhatsApp
                  </a>
                </div>
              </div>

              {/* Trust signals */}
              <div className="grid grid-cols-3 gap-3 mb-6">
                {[
                  { icon: Truck,     label: 'Fast Delivery',   sub: 'Via Amazon Prime' },
                  { icon: Shield,    label: 'Secure Payment',  sub: 'On Amazon' },
                  { icon: RefreshCw, label: 'Easy Returns',    sub: 'Amazon policy' },
                ].map(({ icon: Icon, label, sub }) => (
                  <div key={label} className="flex flex-col items-center text-center gap-1 p-3 bg-surface-1 rounded-xl border border-ink-ghost/60">
                    <Icon className="w-4 h-4 text-accent-600" />
                    <p className="text-xs font-semibold text-ink">{label}</p>
                    <p className="text-[10px] text-ink-ghost">{sub}</p>
                  </div>
                ))}
              </div>

              {/* Price alert */}
              <PriceAlertForm
                productId={product.id}
                productTitle={product.title}
                currentPrice={product.price}
              />

              {/* Affiliate disclosure */}
              <p className="text-xs text-ink-ghost bg-amber-50 border border-amber-200 rounded-xl p-3 leading-relaxed">
                <strong className="text-amber-800">Affiliate disclosure:</strong> We earn a small commission when you purchase through our links — at no extra cost to you.{' '}
                <Link href="/disclaimer" className="text-amber-700 underline hover:no-underline">Learn more</Link>
              </p>
            </div>
          </div>
        </div>

        {/* ── Related Products ── */}
        {related.length > 0 && (
          <div className="border-t border-ink-ghost/40 bg-surface-1">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
              <h2 className="font-display font-extrabold text-2xl text-ink mb-2">
                You might also like
              </h2>
              <p className="text-sm text-ink-muted mb-8">
                More from <span className="capitalize font-medium">{product.category.replace('-', ' ')}</span>
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-5 stagger">
                {related.map((p, i) => (
                  <ProductCard key={p.id} product={p} priority={i < 2} />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── Recently Viewed ── */}
        <RecentlyViewed excludeId={product.id} />
      </main>
      <Footer />
    </>
  );
}
