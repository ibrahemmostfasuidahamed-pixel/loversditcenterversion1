import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import bcryptjs from 'bcryptjs';

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { newPassword, email, name } = await req.json();
  if (!newPassword || newPassword.length < 8) return NextResponse.json({ error: 'كلمة المرور قصيرة جداً' }, { status: 400 });

  const hash = await bcryptjs.hash(newPassword, 12);
  await prisma.adminUser.update({
    where: { email: session.user.email },
    data: { passwordHash: hash, email: email || session.user.email, name: name || session.user.name || 'Admin', isFirstLogin: false },
  });

  return NextResponse.json({ success: true });
}
