'use client';

import { createContext, useContext, useState, useCallback, useRef, ReactNode } from 'react';
import { CheckCircle, X, AlertCircle, Info } from 'lucide-react';

// ── Types ─────────────────────────────────────────────────
type ToastVariant = 'success' | 'error' | 'info';

interface ToastItem {
  id: number;
  message: string;
  sub?: string;
  variant: ToastVariant;
}

interface ToastOptions {
  message: string;
  sub?: string;
  variant?: ToastVariant;
  duration?: number;
}

// ── Context ───────────────────────────────────────────────
const ToastCtx = createContext<((opts: ToastOptions) => void) | null>(null);

export function useToast() {
  return useContext(ToastCtx);
}

// ── Single Toast ──────────────────────────────────────────
const ICONS = { success: CheckCircle, error: AlertCircle, info: Info };
const STYLES: Record<ToastVariant, string> = {
  success: 'border-green-200 bg-white',
  error:   'border-red-200   bg-white',
  info:    'border-ink-ghost bg-white',
};
const ICON_STYLES: Record<ToastVariant, string> = {
  success: 'text-green-500',
  error:   'text-red-500',
  info:    'text-ink-muted',
};

function Toast({ item, onDismiss }: { item: ToastItem; onDismiss: (id: number) => void }) {
  const Icon = ICONS[item.variant];
  return (
    <div className={`flex items-start gap-3 border rounded-xl px-4 py-3 shadow-card-hover min-w-[260px] max-w-xs animate-fade-up ${STYLES[item.variant]}`}>
      <Icon className={`w-4 h-4 mt-0.5 shrink-0 ${ICON_STYLES[item.variant]}`} />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-ink leading-snug">{item.message}</p>
        {item.sub && <p className="text-xs text-ink-muted mt-0.5 truncate">{item.sub}</p>}
      </div>
      <button onClick={() => onDismiss(item.id)} className="text-ink-ghost hover:text-ink transition-colors mt-0.5 shrink-0">
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}

// ── Provider ──────────────────────────────────────────────
export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const ref = useRef(0);

  const dismiss = useCallback((id: number) => setToasts(t => t.filter(x => x.id !== id)), []);

  const toast = useCallback(({ message, sub, variant = 'success', duration = 3000 }: ToastOptions) => {
    const id = ++ref.current;
    setToasts(t => [...t, { id, message, sub, variant }]);
    setTimeout(() => dismiss(id), duration);
  }, [dismiss]);

  return (
    <ToastCtx.Provider value={toast}>
      {children}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] flex flex-col gap-2 items-center pointer-events-none">
        {toasts.map(t => (
          <div key={t.id} className="pointer-events-auto">
            <Toast item={t} onDismiss={dismiss} />
          </div>
        ))}
      </div>
    </ToastCtx.Provider>
  );
}
