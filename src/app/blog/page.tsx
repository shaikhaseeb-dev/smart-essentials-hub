import type { Metadata } from 'next';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import blogData from '@/data/blog.json';
import { Clock, ArrowRight } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Buying Guides & Reviews',
  description: 'Expert buying guides, product reviews, and money-saving tips for Indian students and young professionals.',
};

const CATEGORY_COLORS: Record<string, string> = {
  Gadgets:   'bg-orange-100 text-orange-700 border-orange-200',
  Student:   'bg-blue-100 text-blue-700 border-blue-200',
  'AI Tools':'bg-violet-100 text-violet-700 border-violet-200',
};

export default function BlogPage() {
  const [featured, ...rest] = blogData;
  return (
    <>
      <Navbar />
      <main className="min-h-screen">
        {/* Header */}
        <div className="bg-surface-1 border-b border-ink-ghost/60 py-10 sm:py-14">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-ink mb-2">
              📰 Buying Guides
            </h1>
            <p className="text-ink-muted max-w-lg">
              Honest, research-backed guides for Indian students and professionals. We buy and test before we recommend.
            </p>
          </div>
        </div>

        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
          {/* Featured */}
          <Link href={`/blog/${featured.slug}`}
            className="group card flex flex-col sm:flex-row overflow-hidden mb-8 gap-0">
            <div className="sm:w-2/5 aspect-video sm:aspect-auto overflow-hidden bg-surface-2">
              <img src={featured.coverImage} alt={featured.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                loading="eager" />
            </div>
            <div className="flex-1 p-6 sm:p-8">
              <div className="flex items-center gap-3 mb-3">
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${CATEGORY_COLORS[featured.category] || 'bg-surface-2 text-ink-muted border-ink-ghost'}`}>
                  {featured.category}
                </span>
                <span className="flex items-center gap-1 text-xs text-ink-muted">
                  <Clock className="w-3 h-3" /> {featured.readTime}
                </span>
                <span className="text-xs text-ink-ghost ml-auto">
                  {new Date(featured.publishedAt).toLocaleDateString('en-IN', { day:'numeric', month:'short', year:'numeric' })}
                </span>
              </div>
              <h2 className="font-display font-extrabold text-xl sm:text-2xl text-ink leading-snug mb-3 group-hover:text-accent-600 transition-colors">
                {featured.title}
              </h2>
              <p className="text-sm text-ink-muted leading-relaxed mb-4 line-clamp-3">{featured.excerpt}</p>
              <span className="text-sm font-semibold text-accent-600 flex items-center gap-1 group-hover:gap-2 transition-all">
                Read Article <ArrowRight className="w-4 h-4" />
              </span>
            </div>
          </Link>

          {/* Rest */}
          <div className="grid sm:grid-cols-2 gap-5">
            {rest.map(post => (
              <Link key={post.slug} href={`/blog/${post.slug}`}
                className="group card flex flex-col overflow-hidden">
                <div className="aspect-video overflow-hidden bg-surface-2">
                  <img src={post.coverImage} alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy" />
                </div>
                <div className="flex-1 p-5">
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border ${CATEGORY_COLORS[post.category] || 'bg-surface-2 text-ink-muted border-ink-ghost'}`}>
                      {post.category}
                    </span>
                    <span className="text-xs text-ink-muted flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {post.readTime}
                    </span>
                  </div>
                  <h2 className="font-display font-bold text-base text-ink leading-snug mb-2 line-clamp-2 group-hover:text-accent-600 transition-colors">
                    {post.title}
                  </h2>
                  <p className="text-xs text-ink-muted line-clamp-3 leading-relaxed mb-3">{post.excerpt}</p>
                  <span className="text-xs font-semibold text-accent-600 flex items-center gap-1">
                    Read →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
