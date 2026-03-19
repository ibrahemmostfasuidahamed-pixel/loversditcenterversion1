import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const body = await req.json();
  const message = await prisma.message.update({ where: { id: params.id }, data: body });
  return NextResponse.json({ message });
}

export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
  await prisma.message.delete({ where: { id: params.id } });
  return NextResponse.json({ success: true });
}
