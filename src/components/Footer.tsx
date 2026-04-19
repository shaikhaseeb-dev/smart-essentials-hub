"use client";

import { useState } from "react";
import Link from "next/link";
import { CheckCircle, Send } from "lucide-react";

const LINKS = {
  Categories: [
    { label: "🔥 Trending", href: "/categories/trending" },
    { label: "🎓 Student Picks", href: "/categories/student" },
    { label: "💸 Under ₹999", href: "/categories/budget" },
    { label: "🤖 AI Tools", href: "/categories/ai-tools" },
  ],
  Company: [
    { label: "About", href: "/about" },
    { label: "Blog", href: "/blog" },
    { label: "Contact", href: "/contact" },
    { label: "Admin", href: "/admin" },
  ],
  Legal: [
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Disclaimer", href: "/disclaimer" },
  ],
};

function Newsletter() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "ok" | "err">(
    "idle",
  );
  const [msg, setMsg] = useState("");

  const submit = async () => {
    if (!email) return;
    setStatus("loading");
    try {
      const r = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const d = await r.json();
      if (r.ok) {
        setStatus("ok");
        setMsg(d.message);
        setEmail("");
      } else {
        setStatus("err");
        setMsg(d.error || "Error");
      }
    } catch {
      setStatus("err");
      setMsg("Network error.");
    }
  };

  if (status === "ok")
    return (
      <div className="flex items-center gap-2 bg-green-50 border border-green-200 rounded-xl px-4 py-3 text-sm text-green-700">
        <CheckCircle className="w-4 h-4 shrink-0" /> {msg}
      </div>
    );

  return (
    <div className="flex flex-col gap-2">
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && submit()}
        placeholder="your@email.com"
        className="input-base text-xs"
      />
      {status === "err" && <p className="text-xs text-red-600">{msg}</p>}
      <button
        onClick={submit}
        disabled={status === "loading"}
        className="btn-primary text-xs disabled:opacity-60"
      >
        <Send className="w-3.5 h-3.5" />
        {status === "loading" ? "Subscribing…" : "Get Weekly Deals →"}
      </button>
    </div>
  );
}

export default function Footer() {
  return (
    <footer className="border-t border-ink-ghost/60 bg-surface-1 mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-8 mb-12">
          {/* Brand */}
          <div className="col-span-2 sm:col-span-4 lg:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-ink flex items-center justify-center shrink-0">
                <span className="text-white text-sm font-bold">SE</span>
              </div>
              <span className="font-display font-extrabold text-ink">
                Smart<span className="text-gradient">Essentials</span>
              </span>
            </Link>
            <p className="text-xs text-ink-muted leading-relaxed max-w-xs">
              India's weekly curated product discovery platform for students and
              young professionals.
            </p>
          </div>

          {/* Links */}
          {Object.entries(LINKS).map(([group, links]) => (
            <div key={group}>
              <h4 className="text-xs font-bold text-ink uppercase tracking-widest mb-3">
                {group}
              </h4>
              <ul className="space-y-2">
                {links.map((l) => (
                  <li key={l.href}>
                    <Link
                      href={l.href}
                      className="text-xs text-ink-muted hover:text-accent-600 transition-colors"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Newsletter */}
          <div className="col-span-2 sm:col-span-2 lg:col-span-1">
            <h4 className="text-xs font-bold text-ink uppercase tracking-widest mb-3">
              Weekly Picks
            </h4>
            <p className="text-xs text-ink-muted mb-3">
              Fresh deals every Monday. 50K+ subscribers.
            </p>
            <Newsletter />
          </div>
        </div>

        <div className="border-t border-ink-ghost/60 pt-8">
          {/* Disclaimer */}
          <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 mb-6">
            <p className="text-xs text-amber-800 text-center leading-relaxed">
              <strong>Affiliate Disclosure:</strong> As an Amazon Associate, I
              earn from qualifying purchases. Product prices and availability
              are accurate at time of publication and are subject to change.
              Clicking our links may earn us a small commission at no extra cost
              to you.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-ink-ghost">
            <p>
              © {new Date().getFullYear()} SmartEssentials Hub. All rights
              reserved. Made in India 🇮🇳
            </p>
            <p>Built for Indian students & young professionals</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
