import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const body = await req.json();
  const { id, createdAt, ...data } = body;
  void id; void createdAt;
  const testimonial = await prisma.testimonial.update({ where: { id: params.id }, data });
  return NextResponse.json({ testimonial });
}

export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
  await prisma.testimonial.delete({ where: { id: params.id } });
  return NextResponse.json({ success: true });
}
