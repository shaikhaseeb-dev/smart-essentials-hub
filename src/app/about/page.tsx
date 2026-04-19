import type { Metadata } from 'next';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { CheckCircle, Star, Shield, RefreshCw } from 'lucide-react';

export const metadata: Metadata = {
  title: 'About SmartEssentials Hub',
  description: 'Learn how SmartEssentials Hub curates the best products for Indian students and young professionals.',
};

const VALUES = [
  { icon: Shield,     title: 'No Paid Rankings',   desc: 'Our affiliate income never influences which products we feature. We only recommend what we genuinely rate.' },
  { icon: RefreshCw,  title: 'Weekly Updates',      desc: 'Products are reviewed every Monday. We remove underperformers and add new picks based on fresh data.' },
  { icon: Star,       title: 'Real-World Testing',  desc: 'We test products in the actual conditions Indian students use them — hostels, commutes, cafes, and lecture halls.' },
  { icon: CheckCircle,title: 'Student Budget Focus', desc: 'Every pick is evaluated on value-for-money for Indian students, not just absolute quality.' },
];

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-14 sm:py-20">
          <h1 className="font-display font-extrabold text-3xl sm:text-4xl md:text-5xl text-ink leading-tight mb-6">
            We hunt deals so<br />
            <span className="text-gradient">you don't have to.</span>
          </h1>
          <p className="text-lg text-ink-soft leading-relaxed mb-12">
            SmartEssentials Hub is a product discovery platform built for Indian students and young professionals.
            Every week, we research, test, and curate the best products — from ₹149 gel pens to ₹12,000 Kindles — and tell you honestly what's worth buying.
          </p>

          <div className="grid sm:grid-cols-2 gap-5 mb-14">
            {VALUES.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="bg-surface-1 border border-ink-ghost/60 rounded-2xl p-5">
                <div className="w-10 h-10 rounded-xl bg-accent-100 flex items-center justify-center mb-4">
                  <Icon className="w-5 h-5 text-accent-600" />
                </div>
                <h3 className="font-display font-bold text-ink mb-2">{title}</h3>
                <p className="text-sm text-ink-muted leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>

          <div className="bg-ink rounded-2xl p-8 mb-10 text-white">
            <h2 className="font-display font-bold text-2xl mb-4">Our Story</h2>
            <p className="text-white/70 leading-relaxed mb-4">
              SmartEssentials started from a familiar frustration — hours lost reading conflicting Amazon reviews, 
              only to receive a product that didn't match the description. As college students ourselves, 
              we knew exactly what was missing: trustworthy, opinionated recommendations from someone who 
              actually understood the student budget and lifestyle.
            </p>
            <p className="text-white/70 leading-relaxed">
              We built SmartEssentials to solve this. Every product recommendation is backed by real testing, 
              honest writing, and a simple rule: we only recommend what we'd buy again with our own money.
            </p>
          </div>

          <div className="text-center">
            <Link href="/" className="btn-primary text-sm mr-3">
              Browse Products →
            </Link>
            <Link href="/contact" className="btn-ghost text-sm">
              Get in Touch
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
