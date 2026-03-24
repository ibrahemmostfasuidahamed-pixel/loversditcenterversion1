import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  const testimonials = await prisma.testimonial.findMany({ orderBy: { createdAt: 'desc' } });
  return NextResponse.json({ testimonials });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const testimonial = await prisma.testimonial.create({ data: body });
  return NextResponse.json({ testimonial });
}
