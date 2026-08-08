import { NextResponse } from 'next/server';
import { z } from 'zod';
import bcrypt from 'bcryptjs';
import { connectDB, isDBEnabled } from '@/lib/mongodb';
import User from '@/models/User';
import { requireSession } from '@/lib/apiGuards';

export const runtime = 'nodejs';

const Body = z.object({
  currentPassword: z.string().min(1).max(200),
  newPassword: z.string().min(8).max(200),
});

export async function POST(req: Request) {
  const { session, error } = await requireSession();
  if (error) return error;
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
    const u = await User.findById(session?.user?.id);
    if (!u) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    const ok = await bcrypt.compare(parsed.currentPassword, u.passwordHash);
    if (!ok) return NextResponse.json({ error: 'Current password is incorrect' }, { status: 400 });
    if (parsed.currentPassword === parsed.newPassword) {
      return NextResponse.json({ error: 'New password must differ from current' }, { status: 400 });
    }
    u.passwordHash = await bcrypt.hash(parsed.newPassword, 12);
    await u.save();
    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
