'use client';

import { useEffect, useRef, useState } from 'react';
import { ShoppingBag, TrendingUp } from 'lucide-react';

const EVENTS = [
  { name: 'Arjun from Pune', action: 'just bought', product: 'boAt Airdopes 141', time: '2 mins ago' },
  { name: 'Priya from Chennai', action: 'viewed', product: 'Kindle Paperwhite 8GB', time: '4 mins ago' },
  { name: 'Rahul from Delhi', action: 'just bought', product: 'Mi 10000mAh Power Bank', time: '5 mins ago' },
  { name: 'Sneha from Bengaluru', action: 'saved to wishlist', product: 'Philips LED Desk Lamp', time: '7 mins ago' },
  { name: 'Karan from Mumbai', action: 'just bought', product: 'Logitech M331 Silent Mouse', time: '9 mins ago' },
  { name: 'Ananya from Hyderabad', action: 'just bought', product: 'Samsung 970 EVO Plus SSD', time: '11 mins ago' },
  { name: 'Dev from Jaipur', action: 'viewed', product: 'Ant Esports KM540 Keyboard', time: '13 mins ago' },
  { name: 'Meera from Kolkata', action: 'saved to wishlist', product: 'Wacom Intuos Small Tablet', time: '15 mins ago' },
  { name: 'Vikram from Ahmedabad', action: 'just bought', product: 'Milton Thermosteel Bottle', time: '17 mins ago' },
  { name: 'Riya from Chandigarh', action: 'just bought', product: 'Zebronics BT Speaker', time: '20 mins ago' },
];

export default function SocialProofTicker() {
  const [current, setCurrent] = useState(0);
  const [visible, setVisible]  = useState(true);
  const intervalRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setCurrent(i => (i + 1) % EVENTS.length);
        setVisible(true);
      }, 400);
    }, 4500);

    return () => clearInterval(intervalRef.current);
  }, []);

  const ev = EVENTS[current];
  const isBuy = ev.action === 'just bought';

  return (
    <div
      className={`flex items-center gap-3 bg-white border border-ink-ghost/60 rounded-xl px-4 py-2.5 shadow-soft transition-all duration-400 ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-1'
      }`}
      aria-live="polite"
      aria-atomic="true"
    >
      {/* Icon */}
      <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
        isBuy ? 'bg-green-100' : 'bg-accent-100'
      }`}>
        {isBuy
          ? <ShoppingBag className="w-4 h-4 text-green-600" />
          : <TrendingUp className="w-4 h-4 text-accent-600" />
        }
      </div>

      {/* Text */}
      <div className="min-w-0 flex-1">
        <p className="text-xs text-ink leading-snug">
          <span className="font-semibold">{ev.name}</span>
          {' '}{ev.action}{' '}
          <span className="font-semibold text-accent-600">{ev.product}</span>
        </p>
        <p className="text-[10px] text-ink-ghost mt-0.5">{ev.time}</p>
      </div>
    </div>
  );
}
