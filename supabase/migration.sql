-- ════════════════════════════════════════════════════════════════════
-- SmartEssentials Hub — Supabase Migration
-- Run this entire file in: Supabase Dashboard → SQL Editor → New Query
-- ════════════════════════════════════════════════════════════════════

-- ── 1. Create products table ──────────────────────────────────────
create table if not exists public.products (
  id              text        primary key,
  title           text        not null,
  description     text,
  benefit1        text,
  benefit2        text,
  price           text,
  original_price  text,          -- camelCase = originalPrice in frontend
  image           text,
  affiliate_link  text,          -- camelCase = affiliateLink in frontend
  category        text        not null default 'trending',
  badge           text,
  badge_type      text,          -- camelCase = badgeType in frontend
  rating          numeric(3,1),  -- e.g. 4.3  (not a string)
  reviews         text,
  bought          text,
  tags            text[],        -- PostgreSQL text array
  featured        boolean     not null default false,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

-- ── 2. Auto-update updated_at on every row change ─────────────────
create or replace function public.handle_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_updated_at on public.products;
create trigger set_updated_at
  before update on public.products
  for each row execute procedure public.handle_updated_at();

-- ── 3. Row Level Security ─────────────────────────────────────────
alter table public.products enable row level security;

-- Public can SELECT (read products on the site)
drop policy if exists "Public read access" on public.products;
create policy "Public read access"
  on public.products
  for select
  using (true);

-- Only service role can INSERT / UPDATE / DELETE
-- (Admin panel uses the anon key via the admin page;
--  for production, use the service role key in API routes only)
-- If you want admin panel writes to work with anon key during dev,
-- add this policy temporarily and remove it before going live:
drop policy if exists "Admin full access" on public.products;
create policy "Admin full access"
  on public.products
  for all
  using (true)
  with check (true);
-- ⚠️  Remove the "Admin full access" policy once you add proper
--     auth token verification in /api/admin/* routes.

-- ── 4. Seed data — 20 products from products.json ────────────────
-- Delete any existing rows so we can re-run this migration cleanly
truncate table public.products restart identity cascade;

insert into public.products
  (id, title, description, benefit1, benefit2, price, original_price,
   image, affiliate_link, category, badge, badge_type, rating, reviews,
   bought, tags, featured)
values
  ('p001',
   'boAt Airdopes 141 TWS Earbuds',
   '42Hr battery, ENx noise cancellation, IPX4 water resistance',
   'Crystal-clear calls even in noisy classrooms & commutes',
   '42-hour total battery — never run out during a long day',
   '₹1,299', '₹4,990',
   'https://placehold.co/400x400/f8f8f8/d946ef?text=boAt+141',
   'https://www.amazon.in/s?k=boat+airdopes+141&tag=YOURTAG-21',
   'trending', '🔥 Trending', 'trending',
   4.3, '1.2L+', '12,000+ bought this week',
   ARRAY['earbuds','audio','wireless','tws'], true),

  ('p002',
   'Xiaomi 33W Fast Charger Combo',
   'GaN charger with USB-A + USB-C, charges phone to 50% in 25 min',
   '50% charge in 25 minutes — no more low-battery panic',
   'Dual-port charges phone + earbuds simultaneously',
   '₹699', '₹1,499',
   'https://placehold.co/400x400/f8f8f8/d946ef?text=33W+Charger',
   'https://www.amazon.in/s?k=33w+fast+charger&tag=YOURTAG-21',
   'trending', 'Best Seller', 'bestseller',
   4.5, '80K+', '8,500+ bought this week',
   ARRAY['charger','fast charging','accessories'], true),

  ('p003',
   'Mi 10000mAh Pocket Pro Power Bank',
   '18W fast charge, dual USB + Type-C, compact pocket size',
   'Charges your phone 2.5× from flat — survive a full day out',
   'Ultra-compact: fits in any pocket or pencil case',
   '₹999', '₹1,999',
   'https://placehold.co/400x400/f8f8f8/d946ef?text=Power+Bank',
   'https://www.amazon.in/s?k=mi+10000mah+power+bank&tag=YOURTAG-21',
   'student', '🔥 Trending', 'trending',
   4.3, '2L+', '15,000+ bought this week',
   ARRAY['powerbank','charging','portable','student'], true),

  ('p004',
   'Classmate Pulse Gel Pen Pack (20)',
   'Smooth 0.5mm gel writing, vibrant blue ink, exam-grade quality',
   'Smooth writing reduces hand fatigue during long exams',
   '20 pens — enough for a full semester without restocking',
   '₹149', '₹249',
   'https://placehold.co/400x400/f8f8f8/d946ef?text=Gel+Pens',
   'https://www.amazon.in/s?k=classmate+gel+pen+pack&tag=YOURTAG-21',
   'budget', '💸 Budget Pick', 'budget',
   4.4, '50K+', '20,000+ bought this week',
   ARRAY['pen','stationery','exam','budget'], false),

  ('p005',
   'Philips LED Eye Care Desk Lamp',
   'Eye-care tech, 5 colour modes, USB charging port, touch dimmer',
   'Eye-Care technology reduces strain during 8-hour study sessions',
   'Built-in USB port charges your phone while you study',
   '₹1,499', '₹2,499',
   'https://placehold.co/400x400/f8f8f8/d946ef?text=Desk+Lamp',
   'https://www.amazon.in/s?k=philips+led+desk+lamp+eye+care&tag=YOURTAG-21',
   'student', 'Best Seller', 'bestseller',
   4.4, '35K+', '4,200+ bought this week',
   ARRAY['lamp','study','eye care','desk'], false),

  ('p006',
   'Kindle Paperwhite 8GB (2023)',
   '6.8" display, 300 PPI, adjustable warm light, 3-month Unlimited trial',
   'Read 1,000s of books without eye strain — better than a phone screen',
   'Weeks of battery — read daily without worrying about charging',
   '₹11,999', '₹16,999',
   'https://placehold.co/400x400/f8f8f8/d946ef?text=Kindle',
   'https://www.amazon.in/s?k=kindle+paperwhite+2023&tag=YOURTAG-21',
   'student', 'Best Seller', 'bestseller',
   4.6, '1.5L+', '3,800+ bought this week',
   ARRAY['kindle','ebook','reading','student'], true),

  ('p007',
   'Logitech M331 Silent Wireless Mouse',
   '90% quieter clicks, 1000 DPI, 24-month battery, plug-and-play',
   'Silent clicks — work in libraries without disturbing anyone',
   '2-year battery life: no battery anxiety during deadlines',
   '₹1,195', '₹1,895',
   'https://placehold.co/400x400/f8f8f8/d946ef?text=Silent+Mouse',
   'https://www.amazon.in/s?k=logitech+m331+silent+mouse&tag=YOURTAG-21',
   'student', '🔥 Trending', 'trending',
   4.5, '60K+', '5,500+ bought this week',
   ARRAY['mouse','wireless','logitech','productivity'], false),

  ('p008',
   'Portronics Hydra 10 USB-C Hub',
   '10-in-1: HDMI, 3×USB-A, USB-C PD 100W, SD card, audio, LAN',
   'Turn your single USB-C port into a complete workstation',
   '4K HDMI out for presentations — no adapter hunting',
   '₹1,799', '₹3,499',
   'https://placehold.co/400x400/f8f8f8/d946ef?text=USB+Hub',
   'https://www.amazon.in/s?k=portronics+usb+c+hub+10+in+1&tag=YOURTAG-21',
   'student', '💡 New', 'new',
   4.2, '15K+', '2,100+ bought this week',
   ARRAY['usb hub','productivity','laptop','accessories'], false),

  ('p009',
   'Samsung 970 EVO Plus 500GB NVMe',
   '3500MB/s sequential read, M.2 2280 form factor, 5-year warranty',
   'Boot in 8 seconds, open 50 browser tabs without lag',
   'Run AI tools, VMs, and local LLMs at full speed',
   '₹4,999', '₹8,999',
   'https://placehold.co/400x400/f8f8f8/d946ef?text=NVMe+SSD',
   'https://www.amazon.in/s?k=samsung+970+evo+plus+500gb&tag=YOURTAG-21',
   'ai-tools', '🤖 AI Pick', 'ai',
   4.7, '50K+', '1,800+ bought this week',
   ARRAY['ssd','storage','ai','developer','performance'], true),

  ('p010',
   'Logitech MX Master 3S Mouse',
   '8000 DPI, MagSpeed scroll, silent clicks, Bluetooth + USB',
   'Precision that matches your prompt-writing speed',
   'Works across 3 devices with one button — Mac, PC, iPad',
   '₹7,995', '₹10,995',
   'https://placehold.co/400x400/f8f8f8/d946ef?text=MX+Master+3S',
   'https://www.amazon.in/s?k=logitech+mx+master+3s&tag=YOURTAG-21',
   'ai-tools', '🤖 AI Pick', 'ai',
   4.7, '20K+', '950+ bought this week',
   ARRAY['mouse','productivity','ai','developer'], false),

  ('p011',
   'Ant Esports KM540 Mechanical Keyboard',
   'Outemu Blue switches, full RGB, TKL compact, USB-C cable',
   'Tactile feedback improves typing accuracy — fewer prompt typos',
   'TKL compact layout saves desk space for your notebook',
   '₹2,499', '₹4,999',
   'https://placehold.co/400x400/f8f8f8/d946ef?text=Mechanical+KB',
   'https://www.amazon.in/s?k=ant+esports+km540+mechanical+keyboard&tag=YOURTAG-21',
   'ai-tools', '🔥 Trending', 'trending',
   4.3, '18K+', '2,300+ bought this week',
   ARRAY['keyboard','mechanical','gaming','productivity'], false),

  ('p012',
   'Elecrow 13.3" USB-C Portable Monitor',
   '1080P IPS, USB-C single cable, 60Hz, 10-point touch optional',
   'Dual-screen setup anywhere — AI tool + code side by side',
   'Single USB-C cable: power + video, no adapters',
   '₹9,999', '₹14,999',
   'https://placehold.co/400x400/f8f8f8/d946ef?text=Portable+Monitor',
   'https://www.amazon.in/s?k=13+inch+portable+usb+c+monitor&tag=YOURTAG-21',
   'ai-tools', '🤖 AI Pick', 'ai',
   4.3, '5K+', '780+ bought this week',
   ARRAY['monitor','portable','ai','developer','dual screen'], true),

  ('p013',
   'Prestige IRIS 750W Mixer Grinder',
   '3 jars, 5-year motor warranty, anti-corrosive blades',
   'Protein shakes, smoothies, and juices in under 60 seconds',
   '5-year motor warranty — buy once, use for college + beyond',
   '₹2,299', '₹3,995',
   'https://placehold.co/400x400/f8f8f8/d946ef?text=Mixer+Grinder',
   'https://www.amazon.in/s?k=prestige+iris+mixer+grinder&tag=YOURTAG-21',
   'trending', 'Best Seller', 'bestseller',
   4.4, '2L+', '6,200+ bought this week',
   ARRAY['kitchen','mixer','hostel','trending'], false),

  ('p014',
   'Milton Thermosteel Flip Lid Bottle 1L',
   'Keeps cold 24hr / hot 12hr, food-grade stainless steel, leak-proof',
   'Ice-cold water all day — no canteen water bottles needed',
   'BPA-free, food-grade — safe for daily use',
   '₹699', '₹1,295',
   'https://placehold.co/400x400/f8f8f8/d946ef?text=Milton+Bottle',
   'https://www.amazon.in/s?k=milton+thermosteel+flip+lid+bottle+1l&tag=YOURTAG-21',
   'budget', '💸 Budget Pick', 'budget',
   4.4, '3L+', '25,000+ bought this week',
   ARRAY['bottle','hostel','budget'], false),

  ('p015',
   'Ambrane 10000mAh Power Bank',
   '15W fast charge, dual input, USB-A + USB-C output',
   'Never miss a lecture because your phone died',
   'Compact enough to carry every day — 180g weight',
   '₹799', '₹1,499',
   'https://placehold.co/400x400/f8f8f8/d946ef?text=Ambrane+PB',
   'https://www.amazon.in/s?k=ambrane+10000mah+power+bank&tag=YOURTAG-21',
   'budget', '💸 Budget Pick', 'budget',
   4.2, '1L+', '18,000+ bought this week',
   ARRAY['powerbank','budget','charging'], false),

  ('p016',
   'Ant Esports MI920 Gaming Mouse',
   '7200 DPI, 7-button programmable, RGB, braided cable',
   '7200 DPI precision for competitive gaming and fast navigation',
   'Braided cable outlasts rubber — survives years of daily use',
   '₹549', '₹1,299',
   'https://placehold.co/400x400/f8f8f8/d946ef?text=Gaming+Mouse',
   'https://www.amazon.in/s?k=ant+esports+mi920&tag=YOURTAG-21',
   'budget', '💸 Budget Pick', 'budget',
   4.1, '45K+', '9,500+ bought this week',
   ARRAY['mouse','gaming','budget'], false),

  ('p017',
   'Wacom Intuos Small Drawing Tablet',
   '4096 pressure levels, 4 express keys, 4 free software bundles',
   'Industry-standard tool for design students — used by 10M+ artists',
   '4 free software worth ₹15,000 included in the box',
   '₹5,999', '₹9,499',
   'https://placehold.co/400x400/f8f8f8/d946ef?text=Wacom+Tablet',
   'https://www.amazon.in/s?k=wacom+intuos+small+ctl4100&tag=YOURTAG-21',
   'student', 'Best Seller', 'bestseller',
   4.5, '18K+', '1,200+ bought this week',
   ARRAY['drawing tablet','design','student','art'], false),

  ('p018',
   'Flipkart SmartBuy 5m Extension Board',
   '5 sockets + 3 USB ports, 4A surge protection, 5m braided cable',
   'Charge laptop + monitor + phone + lamp from one wall socket',
   'Surge protection saves your devices from voltage spikes',
   '₹699', '₹1,299',
   'https://placehold.co/400x400/f8f8f8/d946ef?text=Extension+Board',
   'https://www.amazon.in/s?k=extension+board+5+socket+usb&tag=YOURTAG-21',
   'budget', '💸 Budget Pick', 'budget',
   4.3, '2.5L+', '30,000+ bought this week',
   ARRAY['extension board','hostel','room setup','budget'], false),

  ('p019',
   'Nova NHP 8200 Hair Dryer 1800W',
   '1800W ionic technology, 2 speed + 3 heat settings, cool shot',
   '60% faster drying vs normal — more time for study',
   'Ionic tech reduces frizz — college-ready in minutes',
   '₹449', '₹999',
   'https://placehold.co/400x400/f8f8f8/d946ef?text=Hair+Dryer',
   'https://www.amazon.in/s?k=nova+nhp+8200+hair+dryer&tag=YOURTAG-21',
   'trending', '🔥 Trending', 'trending',
   4.2, '1.8L+', '22,000+ bought this week',
   ARRAY['hair dryer','grooming','hostel','trending'], false),

  ('p020',
   'Zebronics Bluetooth Speaker ZEB-Bellow 40',
   '40W RMS, IPX5 waterproof, 10hr battery, TWS pairing',
   '40W fills a hostel room — clear audio without distortion',
   'IPX5 waterproof — safe for bathroom jams and outdoor use',
   '₹2,999', '₹5,999',
   'https://placehold.co/400x400/f8f8f8/d946ef?text=BT+Speaker',
   'https://www.amazon.in/s?k=zebronics+bluetooth+speaker+40w&tag=YOURTAG-21',
   'trending', '🔥 Trending', 'trending',
   4.3, '25K+', '4,800+ bought this week',
   ARRAY['speaker','bluetooth','hostel','trending','audio'], false);

-- ── 5. Verify ────────────────────────────────────────────────────
select count(*) as total_products from public.products;
select id, title, category, rating, featured from public.products order by created_at;
