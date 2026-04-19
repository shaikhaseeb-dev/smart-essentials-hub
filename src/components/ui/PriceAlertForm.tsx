'use client';

import { useState } from 'react';
import { Bell, CheckCircle, X } from 'lucide-react';

interface Props {
  productId: string;
  productTitle: string;
  currentPrice: string;
}

export default function PriceAlertForm({ productId, productTitle, currentPrice }: Props) {
  const [open,    setOpen]    = useState(false);
  const [email,   setEmail]   = useState('');
  const [status,  setStatus]  = useState<'idle' | 'loading' | 'ok' | 'err'>('idle');
  const [msg,     setMsg]     = useState('');

  const submit = async () => {
    if (!email) return;
    setStatus('loading');
    try {
      const r = await fetch('/api/price-alert', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, productId, productTitle }),
      });
      const d = await r.json();
      if (r.ok || r.status === 200) {
        setStatus('ok');
        setMsg(d.message);
      } else {
        setStatus('err');
        setMsg(d.error);
      }
    } catch {
      setStatus('err');
      setMsg('Network error. Try again.');
    }
  };

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 text-xs font-medium text-ink-muted hover:text-accent-600 transition-colors"
      >
        <Bell className="w-3.5 h-3.5" />
        Get notified if price drops
      </button>
    );
  }

  return (
    <div className="bg-accent-50 border border-accent-200 rounded-xl p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Bell className="w-4 h-4 text-accent-600" />
          <span className="text-sm font-semibold text-ink">Price Drop Alert</span>
        </div>
        <button onClick={() => setOpen(false)} className="text-ink-ghost hover:text-ink transition-colors">
          <X className="w-4 h-4" />
        </button>
      </div>

      <p className="text-xs text-ink-muted mb-3">
        We'll email you when this drops below its current price of <strong className="text-ink">{currentPrice}</strong>.
      </p>

      {status === 'ok' ? (
        <div className="flex items-center gap-2 text-sm text-green-700">
          <CheckCircle className="w-4 h-4 shrink-0" />
          {msg}
        </div>
      ) : (
        <div className="flex gap-2">
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && submit()}
            placeholder="your@email.com"
            className="input-base flex-1 text-xs py-2"
          />
          <button
            onClick={submit}
            disabled={status === 'loading' || !email}
            className="btn-accent text-xs px-4 py-2 disabled:opacity-60"
          >
            {status === 'loading' ? '…' : 'Alert Me'}
          </button>
        </div>
      )}
      {status === 'err' && <p className="text-xs text-red-600 mt-2">{msg}</p>}
    </div>
  );
}
