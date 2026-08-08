import { NextResponse } from 'next/server';
import { z } from 'zod';
import bcrypt from 'bcryptjs';
import { connectDB, isDBEnabled } from '@/lib/mongodb';
import User from '@/models/User';
import PasswordResetToken from '@/models/PasswordResetToken';

export const runtime = 'nodejs';

const Body = z.object({
  token: z.string().min(32).max(200),
  password: z.string().min(8).max(200),
});

export async function POST(req: Request) {
  let parsed;
  try {
    parsed = Body.parse(await req.json());
  } catch (err) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }

  if (!isDBEnabled()) {
    return NextResponse.json({ error: 'Database not configured' }, { status: 503 });
  }

  try {
    await connectDB();

    // Find a candidate non-expired, unused token. We can't query by raw token,
    // so we fetch all candidates (small set per user thanks to TTL) and compare
    // with bcrypt.
    const candidates = await PasswordResetToken.find({
      expiresAt: { $gt: new Date() },
      usedAt: null,
    }).lean();

    let matched: { _id: unknown; userId: unknown } | null = null;
    for (const t of candidates) {
      // eslint-disable-next-line no-await-in-loop
      const ok = await bcrypt.compare(parsed.token, t.tokenHash);
      if (ok) {
        matched = t as { _id: unknown; userId: unknown };
        break;
      }
    }

    if (!matched) {
      return NextResponse.json({ error: 'Invalid or expired token' }, { status: 400 });
    }

    const user = await User.findById(matched.userId);
    if (!user) {
      return NextResponse.json({ error: 'Invalid or expired token' }, { status: 400 });
    }

    const passwordHash = await bcrypt.hash(parsed.password, 12);
    user.passwordHash = passwordHash;
    await user.save();

    // Mark this token used and invalidate ALL other reset tokens for this user.
    await Promise.all([
      PasswordResetToken.updateOne({ _id: matched._id }, { $set: { usedAt: new Date() } }),
      PasswordResetToken.deleteMany({ userId: matched.userId, _id: { $ne: matched._id } }),
    ]);

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('[reset-password] error:', (err as Error).message);
    return NextResponse.json({ error: 'Failed to reset password' }, { status: 500 });
  }
}
