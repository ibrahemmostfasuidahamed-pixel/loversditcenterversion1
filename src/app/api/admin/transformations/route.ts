import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  const transformations = await prisma.transformation.findMany({ orderBy: { createdAt: 'desc' } });
  return NextResponse.json({ transformations });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const transformation = await prisma.transformation.create({ data: body });
  return NextResponse.json({ transformation });
}
