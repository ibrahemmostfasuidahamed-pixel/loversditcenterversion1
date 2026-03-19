import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const body = await req.json();
  const user = await prisma.adminUser.update({ where: { id: params.id }, data: body });
  return NextResponse.json({ user });
}

export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
  await prisma.adminUser.delete({ where: { id: params.id } });
  return NextResponse.json({ success: true });
}
