import { NextRequest, NextResponse } from 'next/server';

// =============================================================
//  Next.js Proxy → PHP get_products.php on Hostinger
//  GET /api/products             → all active products
//  GET /api/products?category=X  → filtered by category
//  GET /api/products?featured=1  → featured only
//  GET /api/products?locale=en   → English name/description
// =============================================================

const PHP_API_BASE = process.env.PHP_API_URL ?? 'https://yourdomain.com/api';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    const url = new URL(`${PHP_API_BASE}/get_products.php`);

    // Forward all supported query params
    const category = searchParams.get('category');
    const featured  = searchParams.get('featured');
    const locale    = searchParams.get('locale');

    if (category) url.searchParams.set('category', category);
    if (featured)  url.searchParams.set('featured',  featured);
    if (locale)    url.searchParams.set('locale',     locale);

    const res = await fetch(url.toString(), {
      headers: { 'Accept': 'application/json' },
      next: { revalidate: 0 },
    });

    if (!res.ok) {
      return NextResponse.json({ error: 'Failed to fetch products', products: [] }, { status: res.status });
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (err) {
    console.error('[products/route] GET error:', err);
    return NextResponse.json({ error: 'Internal server error', products: [] }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    // Forward FormData (with file uploads) directly to PHP
    const formData = await req.formData();

    const res = await fetch(`${PHP_API_BASE}/add_product.php`, {
      method: 'POST',
      body: formData,
    });

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (err) {
    console.error('[products/route] POST error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
