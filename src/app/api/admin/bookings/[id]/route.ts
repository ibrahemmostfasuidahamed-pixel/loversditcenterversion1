import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(_: NextRequest, { params }: { params: { id: string } }) {
  const booking = await prisma.booking.findUnique({ where: { id: params.id } });
  if (!booking) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json({ booking });
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const body = await req.json();
  const booking = await prisma.booking.update({ where: { id: params.id }, data: body });
  return NextResponse.json({ booking });
}

export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
  await prisma.booking.delete({ where: { id: params.id } });
  return NextResponse.json({ success: true });
}
