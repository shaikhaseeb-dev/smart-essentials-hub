'use client';

import { useState, useEffect, useCallback } from 'react';

/**
 * useLocalStorage<T>
 * A React hook that syncs state with localStorage.
 * SSR-safe — returns the initial value on the server.
 *
 * @param key        localStorage key
 * @param initial    Default value if key doesn't exist
 */
export function useLocalStorage<T>(key: string, initial: T) {
  const [value, setValue] = useState<T>(() => {
    if (typeof window === 'undefined') return initial;
    try {
      const item = localStorage.getItem(key);
      return item ? (JSON.parse(item) as T) : initial;
    } catch {
      return initial;
    }
  });

  // Persist to localStorage on change
  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {}
  }, [key, value]);

  // Listen to changes from other tabs
  useEffect(() => {
    const handler = (e: StorageEvent) => {
      if (e.key !== key) return;
      try {
        setValue(e.newValue ? (JSON.parse(e.newValue) as T) : initial);
      } catch {}
    };
    window.addEventListener('storage', handler);
    return () => window.removeEventListener('storage', handler);
  }, [key, initial]);

  const remove = useCallback(() => {
    try { localStorage.removeItem(key); } catch {}
    setValue(initial);
  }, [key, initial]);

  return [value, setValue, remove] as const;
}
