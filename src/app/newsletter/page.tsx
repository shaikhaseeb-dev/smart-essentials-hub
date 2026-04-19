import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import { CheckCircle, Mail, TrendingUp, BookOpen, Gift } from "lucide-react";

export const metadata: Metadata = {
  title: "You're Subscribed! | SmartEssentials Hub",
  description:
    "Thanks for subscribing to SmartEssentials Hub. Weekly deals incoming.",
  robots: { index: false, follow: false },
};

const NEXT_STEPS = [
  {
    icon: Mail,
    title: "Check your inbox",
    desc: "A confirmation email is on its way. Check spam if you don't see it.",
  },
  {
    icon: TrendingUp,
    title: "Monday drops",
    desc: "Your first weekly digest arrives this Monday at 9 AM IST.",
  },
  {
    icon: BookOpen,
    title: "Read our guides",
    desc: "While you wait — our buying guides help you shop smarter right now.",
  },
  {
    icon: Gift,
    title: "Share with a friend",
    desc: "Know a student who'd love this? Share the link and help them save.",
  },
];

export default function NewsletterThankYouPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-[80vh] flex items-center">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 py-16 text-center w-full">
          {/* Success icon */}
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>

          <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-ink mb-3">
            You're in! 🎉
          </h1>
          <p className="text-ink-muted text-lg leading-relaxed mb-12 max-w-md mx-auto">
            Welcome to 50,000+ smart shoppers getting India's best deals every
            Monday morning.
          </p>

          {/* Next steps */}
          <div className="grid sm:grid-cols-2 gap-4 mb-12 text-left">
            {NEXT_STEPS.map(({ icon: Icon, title, desc }) => (
              <div
                key={title}
                className="bg-surface-1 border border-ink-ghost/60 rounded-2xl p-5 flex items-start gap-4"
              >
                <div className="w-10 h-10 bg-accent-100 rounded-xl flex items-center justify-center shrink-0">
                  <Icon className="w-5 h-5 text-accent-600" />
                </div>
                <div>
                  <p className="font-semibold text-ink text-sm mb-1">{title}</p>
                  <p className="text-xs text-ink-muted leading-relaxed">
                    {desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/" className="btn-primary text-sm">
              Explore Today's Picks →
            </Link>
            <Link href="/blog" className="btn-ghost text-sm">
              Read Our Buying Guides
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
