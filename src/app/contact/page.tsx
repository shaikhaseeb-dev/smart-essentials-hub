'use client';

import { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Mail, Twitter, Instagram, Send, CheckCircle } from 'lucide-react';

const CONTACTS = [
  { icon: Mail,      label: 'Email',     value: 'hello@smartessentials.in',    href: 'mailto:hello@smartessentials.in',  desc: 'Partnerships, product submissions, general queries' },
  { icon: Twitter,   label: 'Twitter',   value: '@SmartEssIn',                 href: 'https://twitter.com',              desc: 'Quickest response for feedback' },
  { icon: Instagram, label: 'Instagram', value: '@smartessentials.in',         href: 'https://instagram.com',            desc: 'Weekly deal highlights and reels' },
];

export default function ContactPage() {
  const [name,    setName]    = useState('');
  const [email,   setEmail]   = useState('');
  const [message, setMessage] = useState('');
  const [sent,    setSent]    = useState(false);

  const handleSend = () => {
    if (!name || !email || !message) return;
    // In production: POST to /api/contact → send via Resend/SendGrid
    setSent(true);
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 py-14 sm:py-20">
          <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-ink mb-2">
            Get in Touch
          </h1>
          <p className="text-ink-muted mb-10">
            Questions, product suggestions, or partnership enquiries — we read and respond to everything.
          </p>

          {/* Contact options */}
          <div className="space-y-3 mb-10">
            {CONTACTS.map(({ icon: Icon, label, value, href, desc }) => (
              <a key={label} href={href} target={href.startsWith('http') ? '_blank' : undefined}
                rel="noopener noreferrer"
                className="group flex items-start gap-4 bg-surface-1 border border-ink-ghost/60 rounded-2xl p-5 hover:border-accent-300 hover:bg-accent-50/30 transition-all">
                <div className="w-10 h-10 rounded-xl bg-accent-100 flex items-center justify-center shrink-0">
                  <Icon className="w-5 h-5 text-accent-600" />
                </div>
                <div>
                  <div className="text-xs text-ink-muted uppercase tracking-wider mb-0.5">{label}</div>
                  <div className="font-semibold text-ink text-sm group-hover:text-accent-600 transition-colors">{value}</div>
                  <div className="text-xs text-ink-ghost mt-0.5">{desc}</div>
                </div>
              </a>
            ))}
          </div>

          {/* Message form */}
          <div className="bg-surface-1 border border-ink-ghost/60 rounded-2xl p-6">
            <h2 className="font-display font-bold text-lg text-ink mb-5">Send a Message</h2>
            {sent ? (
              <div className="flex items-center gap-3 bg-green-50 border border-green-200 rounded-xl px-4 py-4">
                <CheckCircle className="w-5 h-5 text-green-600 shrink-0" />
                <p className="text-sm text-green-800 font-medium">
                  Message sent! We typically respond within 24 hours.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-ink-muted uppercase tracking-wider mb-1.5">Name</label>
                    <input value={name} onChange={e => setName(e.target.value)}
                      placeholder="Your name" className="input-base" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-ink-muted uppercase tracking-wider mb-1.5">Email</label>
                    <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                      placeholder="your@email.com" className="input-base" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-ink-muted uppercase tracking-wider mb-1.5">Message</label>
                  <textarea value={message} onChange={e => setMessage(e.target.value)}
                    rows={4} placeholder="What's on your mind?"
                    className="input-base resize-none" />
                </div>
                <button onClick={handleSend} className="btn-primary w-full">
                  <Send className="w-4 h-4" /> Send Message
                </button>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
