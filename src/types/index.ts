// ─── Supabase row shape (snake_case, as stored in DB) ────
// This is what Supabase returns. Fields are snake_case and
// some types differ from the frontend Product interface.
export interface SupabaseProductRow {
  id:             string;
  title:          string;
  description:    string | null;
  benefit1:       string | null;
  benefit2:       string | null;
  price:          string | null;
  original_price: string | null;    // snake_case in DB
  image:          string | null;
  affiliate_link: string | null;    // snake_case in DB
  category:       string | null;
  badge:          string | null;
  badge_type:     string | null;    // snake_case in DB
  rating:         number | null;    // numeric in DB
  reviews:        string | null;
  bought:         string | null;
  tags:           string[] | null;
  featured:       boolean | null;
  created_at:     string | null;
}

// ─── Product ─────────────────────────────────────────────
export type BadgeType =
  | 'trending'
  | 'bestseller'
  | 'budget'
  | 'new'
  | 'ai'
  | 'deal'
  | 'hot';

export type Category =
  | 'trending'
  | 'student'
  | 'budget'
  | 'ai-tools'
  | 'seasonal'
  | 'all';

export interface Product {
  id:            string;
  title:         string;
  description:   string;
  benefit1:      string;
  benefit2:      string;
  price:         string;
  originalPrice: string;
  image:         string;
  affiliateLink: string;
  category:      Category;
  badge:         string;
  badgeType:     BadgeType | '';
  rating:        number;
  reviews:       string;
  bought:        string;
  tags:          string[];
  featured:      boolean;
  createdAt:     string;
}

// ─── Admin form shape ────────────────────────────────────
export interface ProductFormData {
  id:            string;
  title:         string;
  description:   string;
  benefit1:      string;
  benefit2:      string;
  price:         string;
  originalPrice: string;
  image:         string;
  affiliateLink: string;
  category:      Category;
  badge:         string;
  badgeType:     BadgeType | '';
  rating:        string;   // string in <input> — converted to number on save
  reviews:       string;
  bought:        string;
  tags:          string;   // comma-separated — split to array on save
  featured:      boolean;
}

// ─── Blog ────────────────────────────────────────────────
export interface BlogPost {
  slug:        string;
  title:       string;
  excerpt:     string;
  category:    string;
  readTime:    string;
  publishedAt: string;
  coverImage:  string;
  tags:        string[];
  content:     string;
}

// ─── Analytics ───────────────────────────────────────────
export interface ClickEvent {
  ts:     number;
  id:     string;
  title:  string;
  price?: string;
  badge?: string;
  url:    string;
}

// ─── Admin ───────────────────────────────────────────────
export interface AdminUser {
  email: string;
  role:  'admin';
}

// ─── API responses ───────────────────────────────────────
export interface ApiResponse<T = void> {
  ok:       boolean;
  data?:    T;
  error?:   string;
  message?: string;
}
