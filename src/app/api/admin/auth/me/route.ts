import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const user = await prisma.adminUser.findUnique({ where: { email: session.user.email } });
  if (!user) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json({ isFirstLogin: user.isFirstLogin, role: user.role, name: user.name });
}

export async function POST() {
  const existing = await prisma.adminUser.count();
  if (existing > 0) return NextResponse.json({ error: 'Already seeded' }, { status: 400 });

  const bcryptjs = await import('bcryptjs');
  const hash = await bcryptjs.hash('admin', 12);
  await prisma.adminUser.create({
    data: { name: 'Admin', email: 'admin', passwordHash: hash, role: 'super_admin', isFirstLogin: true },
  });
  return NextResponse.json({ success: true });
}
