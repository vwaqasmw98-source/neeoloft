import { NextResponse } from 'next/server';
import { z } from 'zod';
import { connectDB, isDBEnabled } from '@/lib/mongodb';
import User from '@/models/User';
import { requireSession } from '@/lib/apiGuards';
import { isPhone } from '@/lib/utils';

export const runtime = 'nodejs';

export async function GET() {
  const { session, error } = await requireSession();
  if (error) return error;
  if (!isDBEnabled()) {
    return NextResponse.json({
      user: {
        id: session?.user?.id,
        name: session?.user?.name,
        email: session?.user?.email,
        role: session?.user?.role,
        phone: session?.user?.phone,
        address: undefined,
      },
    });
  }
  try {
    await connectDB();
    const u = (await User.findById(session?.user?.id).lean()) as
      | { _id: unknown; name: string; email: string; role: string; phone?: string; address?: string; image?: string; emailVerified?: boolean; lastLoginAt?: Date; createdAt: Date }
      | null;
    if (!u) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json({
      user: {
        id: String(u._id),
        name: u.name,
        email: u.email,
        role: u.role,
        phone: u.phone,
        address: u.address,
        image: u.image,
        emailVerified: u.emailVerified,
        lastLoginAt: u.lastLoginAt,
        createdAt: u.createdAt,
      },
    });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}

const Body = z.object({
  name: z.string().min(1).max(120).optional(),
  email: z.string().email().optional(),
  phone: z.string().max(40).nullable().optional(),
  address: z.string().max(500).nullable().optional(),
});

export async function PATCH(req: Request) {
  const { session, error } = await requireSession();
  if (error) return error;
  let parsed;
  try {
    parsed = Body.parse(await req.json());
  } catch (err) {
    return NextResponse.json({ error: 'Invalid body' }, { status: 400 });
  }
  if (parsed.phone && parsed.phone.trim() && !isPhone(parsed.phone.trim())) {
    return NextResponse.json({ error: 'Invalid phone number' }, { status: 400 });
  }
  if (!isDBEnabled()) {
    return NextResponse.json({ error: 'Database not configured' }, { status: 503 });
  }
  try {
    await connectDB();
    const u = await User.findById(session?.user?.id);
    if (!u) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    if (parsed.name) u.name = parsed.name;
    if (parsed.email) {
      const taken = await User.findOne({ email: parsed.email.toLowerCase(), _id: { $ne: u._id } });
      if (taken) return NextResponse.json({ error: 'Email already in use' }, { status: 409 });
      u.email = parsed.email.toLowerCase();
    }
    if (parsed.phone !== undefined) u.phone = parsed.phone || undefined;
    if (parsed.address !== undefined) u.address = parsed.address || undefined;
    await u.save();

    return NextResponse.json({
      ok: true,
      user: {
        id: String(u._id),
        name: u.name,
        email: u.email,
        role: u.role,
        phone: u.phone,
        address: u.address,
      },
    });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
