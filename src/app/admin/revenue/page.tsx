'use client';

import { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { ArrowLeft, Calculator, TrendingUp, IndianRupee, Users, MousePointerClick } from 'lucide-react';

const CATEGORIES = [
  { label: 'Electronics (4%)',     rate: 0.04 },
  { label: 'Mobile Accessories (5%)', rate: 0.05 },
  { label: 'Laptop Accessories (6%)', rate: 0.06 },
  { label: 'Books (5.5%)',         rate: 0.055 },
  { label: 'Home & Kitchen (7%)',   rate: 0.07 },
  { label: 'Beauty & Personal (9%)',rate: 0.09 },
  { label: 'Apparel (9%)',          rate: 0.09 },
];

const STRATEGIES = [
  { label: 'SEO Blog Only',      multiplier: 1.0 },
  { label: '+ Instagram Reels',  multiplier: 1.8 },
  { label: '+ YouTube Shorts',   multiplier: 2.5 },
  { label: '+ Telegram Channel', multiplier: 3.2 },
  { label: 'All Channels',       multiplier: 5.0 },
];

function fmt(n: number) {
  if (n >= 100000) return `₹${(n / 100000).toFixed(1)}L`;
  if (n >= 1000)   return `₹${Math.round(n / 1000)}K`;
  return `₹${Math.round(n)}`;
}

function ProgressBar({ value, max }: { value: number; max: number }) {
  const pct = Math.min(100, Math.round((value / max) * 100));
  return (
    <div className="h-2 bg-surface-2 rounded-full overflow-hidden">
      <div
        className="h-full bg-accent-gradient rounded-full transition-all duration-500"
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}

export default function RevenueCalculatorPage() {
  const [clicks,      setClicks]      = useState(100);
  const [conversion,  setConversion]  = useState(4);
  const [avgOrder,    setAvgOrder]    = useState(1500);
  const [catIdx,      setCatIdx]      = useState(2);
  const [stratIdx,    setStratIdx]    = useState(0);

  const cat      = CATEGORIES[catIdx];
  const strat    = STRATEGIES[stratIdx];
  const rate     = cat.rate;

  const dailySales     = (clicks * (conversion / 100));
  const dailyRevenue   = dailySales * avgOrder * rate * strat.multiplier;
  const monthlyRevenue = dailyRevenue * 30;
  const yearlyRevenue  = dailyRevenue * 365;
  const totalClicks    = clicks * strat.multiplier;

  const months = [1, 3, 6, 9, 12];
  const projections = months.map(m => ({
    month: m,
    clicks: Math.round(totalClicks * (1 + (m - 1) * 0.3)),
    revenue: dailyRevenue * 30 * (1 + (m - 1) * 0.25) * m,
  }));
  const maxRevenue = projections[projections.length - 1].revenue;

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-surface-1">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
          {/* Header */}
          <Link href="/admin" className="inline-flex items-center gap-1.5 text-sm text-ink-muted hover:text-accent-600 transition-colors mb-6">
            <ArrowLeft className="w-4 h-4" /> Back to Admin
          </Link>

          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-accent-100 rounded-xl flex items-center justify-center">
              <Calculator className="w-5 h-5 text-accent-600" />
            </div>
            <div>
              <h1 className="font-display font-extrabold text-2xl text-ink">Revenue Calculator</h1>
              <p className="text-sm text-ink-muted">See your realistic earning potential from affiliate marketing</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
            {/* ── Inputs ── */}
            <div className="bg-white rounded-2xl border border-ink-ghost/60 shadow-card p-6 space-y-5">
              <h2 className="font-display font-bold text-lg text-ink">Your Numbers</h2>

              {/* Daily clicks */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-semibold text-ink-muted uppercase tracking-wider text-xs">Daily Clicks</label>
                  <span className="font-display font-bold text-accent-600">{Math.round(totalClicks).toLocaleString()}</span>
                </div>
                <input type="range" min={10} max={5000} step={10} value={clicks}
                  onChange={e => setClicks(+e.target.value)}
                  className="w-full accent-accent-600" />
                <div className="flex justify-between text-[10px] text-ink-ghost mt-1">
                  <span>10</span><span>5,000</span>
                </div>
              </div>

              {/* Conversion rate */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-semibold text-ink-muted uppercase tracking-wider">Conversion Rate</label>
                  <span className="font-display font-bold text-accent-600">{conversion}%</span>
                </div>
                <input type="range" min={1} max={15} step={0.5} value={conversion}
                  onChange={e => setConversion(+e.target.value)}
                  className="w-full accent-accent-600" />
                <p className="text-[10px] text-ink-ghost mt-1">Industry avg: 3–5% · India avg: 4–6%</p>
              </div>

              {/* Avg order value */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-semibold text-ink-muted uppercase tracking-wider">Avg Order Value</label>
                  <span className="font-display font-bold text-accent-600">₹{avgOrder.toLocaleString()}</span>
                </div>
                <input type="range" min={500} max={15000} step={100} value={avgOrder}
                  onChange={e => setAvgOrder(+e.target.value)}
                  className="w-full accent-accent-600" />
              </div>

              {/* Category */}
              <div>
                <label className="text-xs font-semibold text-ink-muted uppercase tracking-wider block mb-2">Product Category</label>
                <select value={catIdx} onChange={e => setCatIdx(+e.target.value)} className="input-base text-sm">
                  {CATEGORIES.map((c, i) => <option key={i} value={i}>{c.label}</option>)}
                </select>
              </div>

              {/* Strategy */}
              <div>
                <label className="text-xs font-semibold text-ink-muted uppercase tracking-wider block mb-2">Traffic Strategy</label>
                <div className="space-y-2">
                  {STRATEGIES.map((s, i) => (
                    <label key={i} className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                      stratIdx === i ? 'border-accent-400 bg-accent-50' : 'border-ink-ghost/60 hover:border-ink-soft'
                    }`}>
                      <input type="radio" checked={stratIdx === i} onChange={() => setStratIdx(i)} className="accent-accent-600" />
                      <div className="flex-1 flex items-center justify-between">
                        <span className="text-sm font-medium text-ink">{s.label}</span>
                        <span className="text-xs font-bold text-accent-600">{s.multiplier}× traffic</span>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* ── Results ── */}
            <div className="space-y-5">
              {/* Main numbers */}
              <div className="bg-ink text-white rounded-2xl p-6">
                <p className="text-white/50 text-xs font-semibold uppercase tracking-wider mb-5">Estimated Monthly Earnings</p>
                <div className="font-display font-extrabold text-5xl text-white mb-2">
                  {fmt(monthlyRevenue)}
                </div>
                <p className="text-white/60 text-sm">
                  {fmt(dailyRevenue)}/day · {fmt(yearlyRevenue)}/year
                </p>

                <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-white/10">
                  <div>
                    <div className="flex items-center gap-1 mb-1">
                      <MousePointerClick className="w-3.5 h-3.5 text-accent-400" />
                      <span className="text-white/50 text-[10px] uppercase">Total Clicks</span>
                    </div>
                    <p className="font-display font-bold text-lg text-white">{Math.round(totalClicks * 30).toLocaleString()}</p>
                    <p className="text-white/40 text-[10px]">per month</p>
                  </div>
                  <div>
                    <div className="flex items-center gap-1 mb-1">
                      <Users className="w-3.5 h-3.5 text-accent-400" />
                      <span className="text-white/50 text-[10px] uppercase">Sales</span>
                    </div>
                    <p className="font-display font-bold text-lg text-white">{Math.round(dailySales * strat.multiplier * 30)}</p>
                    <p className="text-white/40 text-[10px]">per month</p>
                  </div>
                  <div>
                    <div className="flex items-center gap-1 mb-1">
                      <IndianRupee className="w-3.5 h-3.5 text-accent-400" />
                      <span className="text-white/50 text-[10px] uppercase">Commission</span>
                    </div>
                    <p className="font-display font-bold text-lg text-white">{(cat.rate * 100).toFixed(1)}%</p>
                    <p className="text-white/40 text-[10px]">per sale</p>
                  </div>
                </div>
              </div>

              {/* Growth projections */}
              <div className="bg-white rounded-2xl border border-ink-ghost/60 shadow-card p-6">
                <div className="flex items-center gap-2 mb-5">
                  <TrendingUp className="w-4 h-4 text-accent-600" />
                  <h3 className="font-display font-bold text-ink">12-Month Projection</h3>
                </div>
                <div className="space-y-4">
                  {projections.map(({ month, clicks: c, revenue: r }) => (
                    <div key={month}>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-xs font-semibold text-ink-soft">Month {month}</span>
                        <span className="text-xs font-bold text-accent-600">{fmt(r)}/mo</span>
                      </div>
                      <ProgressBar value={r} max={maxRevenue} />
                    </div>
                  ))}
                </div>
              </div>

              {/* Tips */}
              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5">
                <h3 className="font-semibold text-amber-900 mb-3 text-sm">💡 Increase Your Revenue</h3>
                <ul className="space-y-2">
                  {[
                    'Write one SEO article per week targeting "best [product] under ₹X"',
                    'Post 3 Instagram Reels weekly — biggest traffic multiplier for India',
                    'Build a Telegram channel for daily deals — very high intent audience',
                    'Target categories with 8–9% commission (apparel, beauty)',
                    'Promote products ₹2,000–10,000 for best commission-per-click',
                  ].map(tip => (
                    <li key={tip} className="flex items-start gap-2 text-xs text-amber-800">
                      <span className="text-amber-500 mt-0.5 shrink-0">→</span>
                      {tip}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
