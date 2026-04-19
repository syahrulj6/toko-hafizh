import bcrypt from 'bcrypt';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { registerSchema } from '@/lib/validators/auth';

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as unknown;
    const parsed = registerSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ message: 'Data tidak valid' }, { status: 400 });
    }

    const existed = await prisma.user.findUnique({
      where: { email: parsed.data.email },
    });

    if (existed) {
      return NextResponse.json({ message: 'Email sudah terdaftar' }, { status: 409 });
    }

    const hashedPassword = await bcrypt.hash(parsed.data.password, 10);

    const user = await prisma.user.create({
      data: {
        name: parsed.data.name,
        email: parsed.data.email,
        password: hashedPassword,
        phone: parsed.data.phone,
        address: parsed.data.address,
      },
    });

    return NextResponse.json({ id: user.id, email: user.email, name: user.name }, { status: 201 });
  } catch {
    return NextResponse.json({ message: 'Kesalahan server internal' }, { status: 500 });
  }
}
