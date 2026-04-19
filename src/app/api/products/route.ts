/**
 * GET  /api/products?category=trending  — public read (used by Navbar search)
 * POST /api/products                    — admin create (server-side, checks ADMIN_SECRET)
 */
import { getProducts, getProductById, toDbRow } from '@/lib/getProducts';
import { supabase } from '@/lib/supabase';
import type { Category, Product } from '@/types';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const category = searchParams.get('category') as Category | null;

  const products = await getProducts(category ?? undefined);
  return Response.json(products);
}

export async function POST(req: Request) {
  const authHeader = req.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.ADMIN_SECRET}`) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json() as Product;
    const dbRow = toDbRow(body);

    const { data, error } = await supabase
      .from('products')
      .insert(dbRow)
      .select()
      .single();

    if (error) throw error;
    return Response.json({ ok: true, id: data.id }, { status: 201 });
  } catch (err: any) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}
