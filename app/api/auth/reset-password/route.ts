import bcrypt from 'bcrypt';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { resetPasswordSchema } from '@/lib/validators/auth';

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as unknown;
    const parsed = resetPasswordSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ message: 'Data tidak valid' }, { status: 400 });
    }

    const resetToken = await prisma.passwordResetToken.findUnique({
      where: { token: parsed.data.token },
      select: { id: true, userId: true, expiresAt: true },
    });

    if (!resetToken || resetToken.expiresAt < new Date()) {
      return NextResponse.json({ message: 'Token reset tidak valid atau sudah kedaluwarsa' }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(parsed.data.password, 10);

    await prisma.$transaction([
      prisma.user.update({
        where: { id: resetToken.userId },
        data: { password: hashedPassword },
      }),
      prisma.passwordResetToken.deleteMany({
        where: { userId: resetToken.userId },
      }),
    ]);

    return NextResponse.json({ message: 'Kata sandi berhasil diperbarui' });
  } catch {
    return NextResponse.json({ message: 'Kesalahan server internal' }, { status: 500 });
  }
}
