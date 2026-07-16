import { NextResponse } from 'next/server';
import { z } from 'zod';
import bcrypt from 'bcryptjs';
import { connectDB, isDBEnabled } from '@/lib/mongodb';
import User from '@/models/User';

export const runtime = 'nodejs';

const Body = z.object({
  name: z.string().min(1).max(120),
  email: z.string().email(),
  password: z.string().min(8).max(200),
});

export async function POST(req: Request) {
  let parsed;
  try {
    parsed = Body.parse(await req.json());
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 400 });
  }
  if (!isDBEnabled()) {
    return NextResponse.json({ error: 'Database not configured' }, { status: 503 });
  }
  try {
    await connectDB();
    const exists = await User.findOne({ email: parsed.email.toLowerCase() });
    if (exists) {
      return NextResponse.json({ error: 'Email already in use' }, { status: 409 });
    }
    const count = await User.countDocuments();
    const passwordHash = await bcrypt.hash(parsed.password, 12);
    const user = await User.create({
      name: parsed.name,
      email: parsed.email.toLowerCase(),
      passwordHash,
      role: count === 0 ? 'admin' : 'member',
    });
    return NextResponse.json({ ok: true, userId: user._id });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
