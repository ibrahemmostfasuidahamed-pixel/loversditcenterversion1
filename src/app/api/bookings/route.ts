import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (!body.fullName || !body.phone || !body.serviceId || !body.date || !body.time) {
      return NextResponse.json({ error: 'بيانات ناقصة' }, { status: 400 });
    }

    const { createBooking } = await import('@/lib/booking-service');
    const result = await createBooking(body);

    if (result.error) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json({ success: true, bookingRef: result.bookingRef });
  } catch {
    return NextResponse.json({ error: 'حدث خطأ. حاول مرة أخرى' }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  const date = req.nextUrl.searchParams.get('date');
  if (!date) return NextResponse.json({ slots: [] });

  const { getAvailableSlots } = await import('@/lib/booking-service');
  const slots = await getAvailableSlots(date);
  return NextResponse.json({ slots });
}
