"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  Menu,
  X,
  Search,
  TrendingUp,
  BookOpen,
  Cpu,
  Tag,
  Home,
  ChevronDown,
  Zap,
  Heart,
} from "lucide-react";
import type { Product } from "@/types";
import { searchProducts } from "@/lib/utils";
import { trackClick } from "@/lib/utils";

const NAV_LINKS = [
  { label: "Home", href: "/", icon: Home },
  { label: "Trending", href: "/categories/trending", icon: TrendingUp },
  { label: "Student Picks", href: "/categories/student", icon: BookOpen },
  { label: "AI Tools", href: "/categories/ai-tools", icon: Cpu },
  { label: "Under ₹999", href: "/categories/budget", icon: Tag },
  { label: "🔥 Deals", href: "/deals", icon: Zap },
];

function WishlistNavIcon() {
  // Dynamic import to avoid SSR mismatch
  const [count, setCount] = React.useState(0);
  React.useEffect(() => {
    try {
      const raw = localStorage.getItem("seh_wishlist");
      if (raw) {
        const parsed = JSON.parse(raw);
        setCount((parsed?.state?.items || []).length);
      }
    } catch {}
  }, []);

  return (
    <Link
      href="/wishlist"
      className="relative flex items-center justify-center w-9 h-9 rounded-xl hover:bg-surface-2 transition-colors"
      aria-label="Wishlist"
    >
      <Heart className="w-4.5 h-4.5 text-ink-muted" />
      {count > 0 && (
        <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
          {count > 9 ? "9+" : count}
        </span>
      )}
    </Link>
  );
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Product[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const [all, setAll] = React.useState<Product[]>([]);
  React.useEffect(() => {
    fetch("/api/products")
      .then((r) => r.json())
      .then(setAll)
      .catch(() => {});
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        openSearch();
      }
      if (e.key === "Escape") closeSearch();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  useEffect(() => {
    setResults(searchProducts(all, query));
  }, [query, all]);

  const openSearch = () => {
    setSearchOpen(true);
    setTimeout(() => inputRef.current?.focus(), 50);
  };
  const closeSearch = () => {
    setSearchOpen(false);
    setQuery("");
    setResults([]);
  };

  return (
    <>
      {/* ── Sticky bar ── */}
      <header
        className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-white/95 backdrop-blur-md shadow-soft border-b border-ink-ghost/60"
            : "bg-white"
        }`}
      >
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          {/* Logo */}
          <Link href="/" className="shrink-0 flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-ink flex items-center justify-center">
              <span className="text-white text-sm font-bold leading-none">
                SE
              </span>
            </div>
            <span className="font-display font-extrabold text-lg text-ink tracking-tight hidden sm:block">
              Smart<span className="text-gradient">Essentials</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden lg:flex items-center gap-1">
            {NAV_LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-ink-soft rounded-lg hover:bg-surface-2 hover:text-ink transition-all duration-150"
              >
                <l.icon className="w-3.5 h-3.5" />
                {l.label}
              </Link>
            ))}
          </div>

          {/* Right: search + cta */}
          <div className="flex items-center gap-2">
            {/* Search trigger */}
            <button
              onClick={openSearch}
              className="flex items-center gap-2 bg-surface-2 hover:bg-surface-3 text-ink-muted hover:text-ink px-3 py-2 rounded-xl text-sm transition-all border border-ink-ghost/50"
            >
              <Search className="w-4 h-4" />
              <span className="hidden sm:inline text-xs">Search</span>
              <kbd className="hidden sm:inline text-[10px] bg-surface-3 px-1.5 py-0.5 rounded font-mono">
                ⌘K
              </kbd>
            </button>

            {/* Wishlist */}
            <WishlistNavIcon />

            {/* Deals CTA */}
            <Link
              href="/deals"
              className="btn-accent text-xs sm:text-sm px-3 sm:px-4 py-2 sm:py-2.5 hidden sm:flex"
            >
              🔥 Today's Deals
            </Link>

            {/* Mobile hamburger */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="lg:hidden p-2 rounded-xl hover:bg-surface-2 transition-colors"
              aria-label="Menu"
            >
              {menuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </nav>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="lg:hidden border-t border-ink-ghost/60 bg-white animate-fade-in">
            <div className="max-w-7xl mx-auto px-4 py-3 space-y-1">
              {NAV_LINKS.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-ink-soft hover:bg-surface-2 hover:text-ink transition-all"
                >
                  <l.icon className="w-4 h-4" />
                  {l.label}
                </Link>
              ))}
              <div className="pt-2 pb-1">
                <Link
                  href="/categories/budget"
                  onClick={() => setMenuOpen(false)}
                  className="btn-accent w-full text-sm"
                >
                  🔥 Today's Deals
                </Link>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* ── Search modal ── */}
      {searchOpen && (
        <>
          <div
            className="fixed inset-0 z-[70] bg-ink/30 backdrop-blur-sm"
            onClick={closeSearch}
          />
          <div className="fixed top-20 inset-x-4 sm:inset-x-auto sm:left-1/2 sm:-translate-x-1/2 sm:w-full sm:max-w-lg z-[71] animate-fade-up">
            <div className="bg-white rounded-2xl shadow-card-hover border border-ink-ghost/60 overflow-hidden">
              <div className="flex items-center gap-3 px-4 py-3.5 border-b border-ink-ghost/60">
                <Search className="w-4 h-4 text-ink-muted shrink-0" />
                <input
                  ref={inputRef}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search products, gadgets, deals…"
                  className="flex-1 text-sm text-ink placeholder-ink-faint focus:outline-none"
                />
                {query && (
                  <button
                    onClick={() => setQuery("")}
                    className="text-ink-faint hover:text-ink transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              <div className="max-h-72 overflow-y-auto">
                {query.length >= 2 && results.length === 0 && (
                  <p className="py-10 text-center text-sm text-ink-muted">
                    No products found for "{query}"
                  </p>
                )}
                {results.map((p) => (
                  <a
                    key={p.id}
                    href={p.affiliateLink}
                    target="_blank"
                    rel="noopener noreferrer sponsored"
                    onClick={() => {
                      trackClick(p);
                      closeSearch();
                    }}
                    className="flex items-center gap-3 px-4 py-3 hover:bg-surface-1 transition-colors group"
                  >
                    <div className="w-10 h-10 rounded-lg bg-surface-2 shrink-0 overflow-hidden flex items-center justify-center text-ink-ghost text-xs">
                      <img
                        src={p.image}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-ink truncate group-hover:text-accent-600">
                        {p.title}
                      </p>
                      <p className="text-xs text-ink-muted">
                        {p.price} · {p.category}
                      </p>
                    </div>
                    <span className="text-xs text-ink-ghost group-hover:text-accent-500">
                      →
                    </span>
                  </a>
                ))}
                {!query && (
                  <p className="py-8 text-center text-xs text-ink-ghost">
                    Start typing to search across all products
                  </p>
                )}
              </div>
              <div className="px-4 py-2 border-t border-ink-ghost/40 flex justify-between text-[10px] text-ink-ghost">
                <span>
                  {results.length > 0
                    ? `${results.length} results`
                    : "SmartEssentials Search"}
                </span>
                <span>ESC to close</span>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Spacer */}
      <div className="h-16" />
    </>
  );
}
