import { randomBytes } from 'crypto';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { forgotPasswordSchema } from '@/lib/validators/auth';

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as unknown;
    const parsed = forgotPasswordSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ message: 'Data tidak valid' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { email: parsed.data.email },
      select: { id: true },
    });

    if (user) {
      await prisma.passwordResetToken.deleteMany({
        where: { userId: user.id },
      });

      const token = randomBytes(32).toString('hex');
      const expiresAt = new Date(Date.now() + 1000 * 60 * 30);

      await prisma.passwordResetToken.create({
        data: {
          token,
          userId: user.id,
          expiresAt,
        },
      });

      const baseUrl = process.env.NEXTAUTH_URL ?? 'http://localhost:3000';
      const resetUrl = `${baseUrl}/reset-password?token=${token}`;

      return NextResponse.json({
        message: 'Jika email terdaftar, tautan reset kata sandi telah dibuat.',
        ...(process.env.NODE_ENV !== 'production' ? { resetUrl } : {}),
      });
    }

    return NextResponse.json({
      message: 'Jika email terdaftar, tautan reset kata sandi telah dibuat.',
    });
  } catch {
    return NextResponse.json({ message: 'Kesalahan server internal' }, { status: 500 });
  }
}
