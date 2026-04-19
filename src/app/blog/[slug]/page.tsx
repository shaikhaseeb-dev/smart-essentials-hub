import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import Link from "next/link";
import { ArrowLeft, Clock, Calendar, Tag } from "lucide-react";
import blogData from "@/data/blog.json";
import type { Product } from "@/types";
import { getProducts } from "@/lib/getProducts";

export function generateStaticParams() {
  return blogData.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const post = blogData.find((p) => p.slug === params.slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: [{ url: post.coverImage }],
      type: "article",
      publishedTime: post.publishedAt,
    },
  };
}

function renderContent(raw: string) {
  return raw.split("\n\n").map((block, i) => {
    if (block.startsWith("## ")) {
      return (
        <h2
          key={i}
          className="font-display font-extrabold text-xl sm:text-2xl text-ink mt-10 mb-4 section-title-underline"
        >
          {block.replace("## ", "")}
        </h2>
      );
    }
    const parts = block.split(/(\*\*[^*]+\*\*)/g);
    return (
      <p key={i} className="text-ink-soft leading-relaxed mb-5 text-base">
        {parts.map((part, j) =>
          part.startsWith("**") ? (
            <strong key={j} className="font-bold text-ink">
              {part.replace(/\*\*/g, "")}
            </strong>
          ) : (
            part
          ),
        )}
      </p>
    );
  });
}

export default async function BlogPostPage({
  params,
}: {
  params: { slug: string };
}) {
  const post = blogData.find((p) => p.slug === params.slug);
  if (!post) notFound();

  const allProducts = await getProducts();

  const related = allProducts
    .filter((p) => p.category === (post.relatedCategory || "trending"))
    .slice(0, 4);

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt,
    image: post.coverImage,
    datePublished: post.publishedAt,
    author: { "@type": "Organization", name: "SmartEssentials Hub" },
    publisher: { "@type": "Organization", name: "SmartEssentials Hub" },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <Navbar />
      <main>
        {/* Article container */}
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
          <Link
            href="/blog"
            className="inline-flex items-center gap-1.5 text-sm text-ink-muted hover:text-accent-600 transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" /> All Guides
          </Link>

          {/* Cover */}
          <div className="rounded-2xl overflow-hidden aspect-[2/1] mb-8">
            <img
              src={post.coverImage}
              alt={post.title}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Meta */}
          <div className="flex flex-wrap items-center gap-3 mb-6">
            <span className="text-xs font-semibold bg-accent-50 text-accent-700 border border-accent-200 px-2.5 py-1 rounded-full">
              {post.category}
            </span>
            <span className="flex items-center gap-1 text-xs text-ink-muted">
              <Clock className="w-3.5 h-3.5" /> {post.readTime}
            </span>
            <span className="flex items-center gap-1 text-xs text-ink-muted">
              <Calendar className="w-3.5 h-3.5" />
              {new Date(post.publishedAt).toLocaleDateString("en-IN", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </span>
          </div>

          {/* Title */}
          <h1 className="font-display font-extrabold text-2xl sm:text-3xl md:text-4xl text-ink leading-tight mb-5">
            {post.title}
          </h1>

          {/* Excerpt callout */}
          <p className="text-base text-ink-soft leading-relaxed border-l-4 border-accent-400 pl-5 mb-10 italic bg-accent-50/50 py-3 pr-4 rounded-r-xl">
            {post.excerpt}
          </p>

          {/* Body */}
          <article>{renderContent(post.content)}</article>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mt-10 pt-8 border-t border-ink-ghost/60">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="flex items-center gap-1 text-xs text-ink-muted bg-surface-2 border border-ink-ghost px-3 py-1 rounded-full"
              >
                <Tag className="w-3 h-3" /> {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Related products */}
        {related.length > 0 && (
          <div className="border-t border-ink-ghost/60 bg-surface-1">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
              <h2 className="font-display font-extrabold text-xl text-ink mb-1">
                🛒 Products From This Guide
              </h2>
              <p className="text-sm text-ink-muted mb-8">
                Available on Amazon.in — click to check current price.
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {related.map((p, i) => (
                  <ProductCard key={p.id} product={p} priority={i < 2} />
                ))}
              </div>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}
