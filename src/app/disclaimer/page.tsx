import type { Metadata } from 'next';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'Affiliate Disclaimer | SmartEssentials Hub',
  description: 'Amazon Associates affiliate disclosure and disclaimer for SmartEssentials Hub.',
};

const SECTIONS = [
  {
    title: 'Amazon Associate Disclosure',
    body: 'SmartEssentials Hub is a participant in the Amazon Associates Programme, an affiliate advertising programme designed to provide a means for sites to earn advertising fees by advertising and linking to Amazon.in. As an Amazon Associate, we earn from qualifying purchases.',
  },
  {
    title: 'No Extra Cost to You',
    body: 'When you click affiliate links on this site and make a purchase, we may receive a small commission. This comes at absolutely no extra cost to you. In many cases, our curated links lead to products on sale or with special pricing.',
  },
  {
    title: 'Editorial Independence',
    body: 'Our product recommendations are based on genuine research, testing, and editorial judgment. Affiliate relationships never influence which products we recommend or how we rank them. We only recommend products we believe in.',
  },
  {
    title: 'Price & Availability Accuracy',
    body: 'Prices and availability shown on SmartEssentials Hub are accurate at time of publication but may change at any time. Always verify the current price on Amazon before purchasing.',
  },
  {
    title: 'No Warranties',
    body: 'SmartEssentials Hub provides product information "as is." We are not responsible for product quality, delivery, or post-purchase issues — those are governed by Amazon\'s and the respective seller\'s policies.',
  },
];

export default function DisclaimerPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-14 sm:py-20">
          <h1 className="font-display font-extrabold text-3xl text-ink mb-2">Affiliate Disclaimer</h1>
          <p className="text-sm text-ink-muted mb-10">
            Last updated: {new Date().toLocaleDateString('en-IN', { year:'numeric', month:'long', day:'numeric' })}
          </p>
          <div className="space-y-5">
            {SECTIONS.map(s => (
              <div key={s.title} className="bg-surface-1 border border-ink-ghost/60 rounded-2xl p-6">
                <h2 className="font-display font-bold text-base text-ink mb-2">{s.title}</h2>
                <p className="text-sm text-ink-muted leading-relaxed">{s.body}</p>
              </div>
            ))}
          </div>
          <div className="mt-10 bg-amber-50 border border-amber-200 rounded-2xl p-6 text-center">
            <p className="text-sm text-amber-900 font-medium">
              <strong>TL;DR:</strong> We earn a small commission on purchases through our links — at zero cost to you.
              We only recommend products we genuinely believe are worth buying. Thank you for supporting SmartEssentials! 🙏
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
