import { NextRequest, NextResponse } from 'next/server';

// =============================================================
//  Next.js Proxy → PHP endpoints for Update / Delete
// =============================================================

const PHP_API_BASE = process.env.PHP_API_URL ?? 'https://yourdomain.com/api';

export const dynamic = 'force-dynamic';

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = params.id;
    const res = await fetch(`${PHP_API_BASE}/delete_product.php`, {
      method: 'POST', // The PHP script accepts POST for DELETE too
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: `id=${id}`,
    });

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (err) {
    console.error('[products/[id]/route] DELETE error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const formData = await req.formData();
    formData.append('id', params.id); // Add id to form data

    const res = await fetch(`${PHP_API_BASE}/update_product.php`, {
      method: 'POST',
      body: formData,
    });

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (err) {
    console.error('[products/[id]/route] PUT error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
