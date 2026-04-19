'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Cookie } from 'lucide-react';

const KEY = 'seh_cookie_consent';

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      if (!localStorage.getItem(KEY)) setVisible(true);
    } catch { setVisible(true); }
  }, []);

  const accept = () => {
    try { localStorage.setItem(KEY, 'accepted'); } catch {}
    setVisible(false);
  };

  const decline = () => {
    try { localStorage.setItem(KEY, 'declined'); } catch {}
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 inset-x-0 z-[80] p-4 sm:p-5">
      <div className="max-w-3xl mx-auto bg-white border border-ink-ghost/60 rounded-2xl shadow-card-hover px-5 py-4 flex flex-col sm:flex-row items-start sm:items-center gap-4 animate-fade-up">
        <div className="w-9 h-9 rounded-xl bg-accent-100 flex items-center justify-center shrink-0">
          <Cookie className="w-4.5 h-4.5 text-accent-600" />
        </div>

        <p className="text-xs text-ink-muted flex-1 leading-relaxed">
          We use cookies to improve your experience and track affiliate link clicks.
          Affiliate links earn us a small commission at{' '}
          <span className="text-ink font-medium">no extra cost to you</span>.{' '}
          <Link href="/privacy" className="text-accent-600 hover:underline">Privacy Policy</Link>
          {' · '}
          <Link href="/disclaimer" className="text-accent-600 hover:underline">Disclaimer</Link>
        </p>

        <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto">
          <button onClick={decline}
            className="flex-1 sm:flex-none px-4 py-2 text-xs font-semibold text-ink-muted hover:text-ink rounded-lg hover:bg-surface-2 transition-colors">
            Decline
          </button>
          <button onClick={accept}
            className="flex-1 sm:flex-none btn-primary text-xs px-4 py-2">
            Accept All
          </button>
        </div>
      </div>
    </div>
  );
}
