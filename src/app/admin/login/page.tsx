'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Eye, EyeOff, Lock, Shield, AlertCircle, Loader2 } from 'lucide-react';
import { Suspense } from 'react';

function LoginForm() {
  const router      = useRouter();
  const params      = useSearchParams();
  const returnTo    = params.get('from') || '/admin';

  const [password,   setPassword]   = useState('');
  const [visible,    setVisible]    = useState(false);
  const [status,     setStatus]     = useState<'idle' | 'loading' | 'error'>('idle');
  const [errorMsg,   setErrorMsg]   = useState('');
  const [attempts,   setAttempts]   = useState(0);
  const [locked,     setLocked]     = useState(false);
  const [lockTimer,  setLockTimer]  = useState(0);

  // Check if already authenticated
  useEffect(() => {
    fetch('/api/admin-auth')
      .then(r => r.json())
      .then(d => { if (d.authenticated) router.replace(returnTo); })
      .catch(() => {});
  }, [returnTo, router]);

  // Lockout countdown
  useEffect(() => {
    if (!locked || lockTimer <= 0) return;
    const id = setInterval(() => {
      setLockTimer(t => {
        if (t <= 1) { setLocked(false); clearInterval(id); return 0; }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [locked]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (locked || status === 'loading' || !password) return;

    setStatus('loading');
    setErrorMsg('');

    try {
      const res = await fetch('/api/admin-auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      if (res.ok) {
        router.replace(returnTo);
        return;
      }

      const data = await res.json();
      const newAttempts = attempts + 1;
      setAttempts(newAttempts);
      setStatus('error');

      if (newAttempts >= 5) {
        setLocked(true);
        setLockTimer(60);
        setErrorMsg('Too many attempts. Locked out for 60 seconds.');
      } else {
        setErrorMsg(
          `${data.error || 'Incorrect password.'} ${5 - newAttempts} attempt${5 - newAttempts !== 1 ? 's' : ''} remaining.`
        );
      }
      setPassword('');
    } catch {
      setStatus('error');
      setErrorMsg('Network error. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-surface-1 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        {/* Card */}
        <div className="bg-white rounded-2xl border border-ink-ghost/60 shadow-card-hover p-8">
          {/* Logo + title */}
          <div className="text-center mb-8">
            <div className="w-14 h-14 bg-ink rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Shield className="w-7 h-7 text-white" />
            </div>
            <h1 className="font-display font-extrabold text-xl text-ink">Admin Access</h1>
            <p className="text-sm text-ink-muted mt-1">SmartEssentials Hub</p>
          </div>

          {/* Lockout banner */}
          {locked && (
            <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 mb-5 flex items-center gap-2">
              <Lock className="w-4 h-4 text-red-500 shrink-0" />
              <p className="text-xs text-red-700 font-medium">
                Account locked. Try again in {lockTimer}s.
              </p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-ink-muted uppercase tracking-wider mb-2">
                Admin Password
              </label>
              <div className="relative">
                <input
                  type={visible ? 'text' : 'password'}
                  value={password}
                  onChange={e => { setPassword(e.target.value); setStatus('idle'); setErrorMsg(''); }}
                  placeholder="Enter your admin password"
                  disabled={locked || status === 'loading'}
                  autoComplete="current-password"
                  className={`input-base pr-10 ${status === 'error' ? 'border-red-400 bg-red-50/30' : ''}`}
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => setVisible(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-muted hover:text-ink transition-colors"
                  tabIndex={-1}
                >
                  {visible ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {errorMsg && (
                <div className="flex items-start gap-1.5 mt-2">
                  <AlertCircle className="w-3.5 h-3.5 text-red-500 shrink-0 mt-0.5" />
                  <p className="text-xs text-red-600">{errorMsg}</p>
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={locked || status === 'loading' || !password}
              className="btn-primary w-full py-3 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {status === 'loading' ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Verifying…
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  Sign In
                </>
              )}
            </button>
          </form>

          {/* Security note */}
          <div className="mt-6 pt-5 border-t border-ink-ghost/60">
            <p className="text-[11px] text-ink-ghost text-center leading-relaxed">
              This panel is for site administrators only.
              Unauthorized access attempts are logged.
              <br />
              <a href="/" className="text-accent-600 hover:underline mt-1 inline-block">
                ← Return to site
              </a>
            </p>
          </div>
        </div>

        {/* Help text below card */}
        <div className="mt-4 text-center">
          <p className="text-xs text-ink-ghost">
            Password set via{' '}
            <code className="bg-surface-2 px-1 py-0.5 rounded text-ink-soft">ADMIN_SECRET</code>
            {' '}in{' '}
            <code className="bg-surface-2 px-1 py-0.5 rounded text-ink-soft">.env.local</code>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-surface-1 flex items-center justify-center">
        <Loader2 className="w-6 h-6 text-ink-muted animate-spin" />
      </div>
    }>
      <LoginForm />
    </Suspense>
  );
}
