import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcryptjs from 'bcryptjs';

export async function GET() {
  const users = await prisma.adminUser.findMany({ select: { id: true, name: true, email: true, role: true, isActive: true, lastLoginAt: true }, orderBy: { createdAt: 'asc' } });
  return NextResponse.json({ users });
}

export async function POST(req: NextRequest) {
  const { name, email, role } = await req.json();
  const tempPassword = Math.random().toString(36).slice(-10);
  const hash = await bcryptjs.hash(tempPassword, 12);
  const user = await prisma.adminUser.create({ data: { name, email, passwordHash: hash, role, isFirstLogin: true } });
  // In production: send tempPassword via email
  return NextResponse.json({ user, tempPassword });
}
