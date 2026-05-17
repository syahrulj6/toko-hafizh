import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ message: 'Tidak berwenang' }, { status: 401 });
  }

  const user = await prisma.user.findUnique({ where: { id: session.user.id }, select: { name: true, phone: true, address: true, email: true } });

  if (!user) return NextResponse.json({ message: 'User tidak ditemukan' }, { status: 404 });

  return NextResponse.json(user);
}
