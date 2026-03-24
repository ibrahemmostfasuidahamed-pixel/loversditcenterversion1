import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  const settings = await prisma.siteSettings.findMany();
  return NextResponse.json({ settings });
}

export async function PUT(req: NextRequest) {
  const { settings } = await req.json() as { settings: Record<string, string> };

  await Promise.all(
    Object.entries(settings).map(([key, value]) =>
      prisma.siteSettings.upsert({
        where: { key },
        update: { value: String(value) },
        create: { key, value: String(value) },
      })
    )
  );

  return NextResponse.json({ success: true });
}
