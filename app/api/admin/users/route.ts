import { NextResponse } from 'next/server';
import { z } from 'zod';
import bcrypt from 'bcryptjs';
import { connectDB, isDBEnabled } from '@/lib/mongodb';
import User from '@/models/User';
import ActivityLog from '@/models/ActivityLog';
import { requireAdmin } from '@/lib/apiGuards';

export const runtime = 'nodejs';

export async function GET() {
  const { error } = await requireAdmin();
  if (error) return error;
  if (!isDBEnabled()) return NextResponse.json({ users: [] });
  try {
    await connectDB();
    const users = await User.find({}).sort({ createdAt: -1 }).limit(500).lean();
    return NextResponse.json({
      users: users.map((u) => ({
        _id: String(u._id),
        name: u.name,
        email: u.email,
        role: u.role,
        phone: u.phone,
        address: u.address,
        emailVerified: u.emailVerified,
        lastLoginAt: u.lastLoginAt,
        createdAt: u.createdAt,
      })),
    });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}

const PatchBody = z.object({
  id: z.string().min(1),
  name: z.string().min(1).max(120).optional(),
  email: z.string().email().optional(),
  role: z.enum(['admin', 'member']).optional(),
  phone: z.string().max(40).nullable().optional(),
  address: z.string().max(500).nullable().optional(),
  password: z.string().min(8).max(200).optional(),
});

export async function PATCH(req: Request) {
  const { session, error } = await requireAdmin();
  if (error) return error;
  let parsed;
  try {
    parsed = PatchBody.parse(await req.json());
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 400 });
  }
  if (!isDBEnabled()) {
    return NextResponse.json({ error: 'Database not configured' }, { status: 503 });
  }
  try {
    await connectDB();
    const target = await User.findById(parsed.id);
    if (!target) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    const update: Record<string, unknown> = {};
    if (parsed.name) update.name = parsed.name;
    if (parsed.email) update.email = parsed.email.toLowerCase();
    if (parsed.role) update.role = parsed.role;
    if (parsed.phone !== undefined) update.phone = parsed.phone;
    if (parsed.address !== undefined) update.address = parsed.address;
    if (parsed.password) update.passwordHash = await bcrypt.hash(parsed.password, 12);

    // Prevent demoting the last admin
    if (parsed.role === 'member' && target.role === 'admin') {
      const otherAdmins = await User.countDocuments({ role: 'admin', _id: { $ne: target._id } });
      if (otherAdmins === 0) {
        return NextResponse.json({ error: 'Cannot demote the last admin' }, { status: 400 });
      }
    }

    Object.assign(target, update);
    await target.save();

    await ActivityLog.create({
      actor: session?.user?.email,
      actorId: session?.user?.id,
      action: 'user.updated',
      target: `user:${target._id}`,
      description: `Updated ${target.email}`,
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}

const DeleteBody = z.object({ id: z.string().min(1) });

export async function DELETE(req: Request) {
  const { session, error } = await requireAdmin();
  if (error) return error;
  let parsed;
  try {
    parsed = DeleteBody.parse(await req.json());
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 400 });
  }
  if (!isDBEnabled()) {
    return NextResponse.json({ error: 'Database not configured' }, { status: 503 });
  }
  try {
    await connectDB();
    const target = await User.findById(parsed.id);
    if (!target) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    if (target.role === 'admin') {
      const otherAdmins = await User.countDocuments({ role: 'admin', _id: { $ne: target._id } });
      if (otherAdmins === 0) {
        return NextResponse.json({ error: 'Cannot delete the last admin' }, { status: 400 });
      }
    }
    if (String(target._id) === String(session?.user?.id)) {
      return NextResponse.json({ error: 'You cannot delete your own account' }, { status: 400 });
    }
    await target.deleteOne();
    await ActivityLog.create({
      actor: session?.user?.email,
      actorId: session?.user?.id,
      action: 'user.deleted',
      target: `user:${parsed.id}`,
      description: `Deleted ${target.email}`,
    });
    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
