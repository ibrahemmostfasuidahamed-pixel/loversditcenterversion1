import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  const status = req.nextUrl.searchParams.get('status');
  const where = status && status !== 'all' ? { status } : {};
  const bookings = await prisma.booking.findMany({ where, orderBy: { createdAt: 'desc' } });
  return NextResponse.json({ bookings });
}
