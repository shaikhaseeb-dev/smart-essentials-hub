import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function NotFound() {
  return (
    <>
      <Navbar />
      <main className="min-h-[70vh] flex items-center justify-center">
        <div className="text-center px-4 max-w-md mx-auto">
          <div className="text-6xl mb-5">🛒</div>
          <h1 className="font-display font-extrabold text-5xl text-ink mb-3">404</h1>
          <h2 className="font-display font-bold text-xl text-ink mb-3">This deal has expired</h2>
          <p className="text-ink-muted text-sm mb-8 leading-relaxed">
            The page you're looking for has moved, been removed, or was snatched up before you could get here.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/" className="btn-primary text-sm">
              Back to Fresh Deals →
            </Link>
            <Link href="/categories/trending" className="btn-ghost text-sm">
              🔥 Trending Products
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
