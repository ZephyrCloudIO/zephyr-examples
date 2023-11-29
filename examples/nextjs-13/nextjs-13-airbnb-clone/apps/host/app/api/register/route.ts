import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';

import { usersMock } from '@/app/mocks';
import { randomUUID } from 'crypto';

export async function POST(request: Request) {
  const body = await request.json();
  const { email, name, password } = body;

  const hashedPassword = await bcrypt.hash(password, 12);

  const user = usersMock.push({
    id: randomUUID(),
    email,
    name,
    hashedPassword,
    createdAt: new Date(),
    updatedAt: new Date(),
    favoriteIds: [],
  });

  return NextResponse.json(user);
}
