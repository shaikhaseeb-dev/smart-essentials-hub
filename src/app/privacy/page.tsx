import type { Metadata } from 'next';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'Privacy Policy | SmartEssentials Hub',
};

const SECTIONS = [
  { title: '1. Information We Collect', body: 'We collect your email address only if you subscribe to our newsletter. We also collect anonymised usage analytics (page views, clicks) via Vercel Analytics and Google Analytics. We do not collect your name, phone number, or payment information.' },
  { title: '2. How We Use It', body: 'Your email is used exclusively to send our weekly product digest newsletter. Analytics data helps us understand which products and guides are most useful. We never sell your data to third parties.' },
  { title: '3. Cookies & Third-Party Services', body: 'We use cookies for essential site functionality. Amazon affiliate links use their own tracking cookies (active for 24 hours after clicking). Google Analytics uses cookies to track anonymised user behaviour. You can disable cookies in your browser settings.' },
  { title: '4. Your Rights', body: 'You may unsubscribe from our newsletter at any time via the unsubscribe link in any email. You may request deletion of your data by emailing privacy@smartessentials.in. We will respond within 7 business days.' },
  { title: '5. Data Security', body: 'Your data is stored securely. We use Firebase/Supabase with industry-standard encryption. We do not store payment information — all purchases are handled directly by Amazon.' },
  { title: '6. Changes', body: 'We may update this policy periodically. Significant changes will be communicated via our newsletter. Continued use of the site after changes constitutes acceptance.' },
];

export default function PrivacyPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-14 sm:py-20">
          <h1 className="font-display font-extrabold text-3xl text-ink mb-2">Privacy Policy</h1>
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
        </div>
      </main>
      <Footer />
    </>
  );
}
