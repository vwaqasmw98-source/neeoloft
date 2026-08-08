import { NextResponse } from 'next/server';
import { z } from 'zod';
import { connectDB, isDBEnabled } from '@/lib/mongodb';
import Notification from '@/models/Notification';
import { requireSession } from '@/lib/apiGuards';

export const runtime = 'nodejs';

export async function GET() {
  const { session, error } = await requireSession();
  if (error) return error;
  if (!isDBEnabled()) return NextResponse.json({ notifications: [] });
  try {
    await connectDB();
    const items = await Notification.find({ userId: session?.user?.id })
      .sort({ createdAt: -1 })
      .limit(200)
      .lean();
    return NextResponse.json({
      notifications: items.map((n) => ({
        _id: String(n._id),
        type: n.type,
        title: n.title,
        body: n.body,
        link: n.link,
        read: n.read,
        readAt: n.readAt,
        createdAt: n.createdAt,
      })),
    });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}

const PatchBody = z.object({
  ids: z.array(z.string().min(1)).optional(),
  markAllRead: z.boolean().optional(),
});

export async function PATCH(req: Request) {
  const { session, error } = await requireSession();
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
    const filter: Record<string, unknown> = { userId: session?.user?.id };
    if (parsed.markAllRead) {
      filter.read = false;
    } else if (parsed.ids && parsed.ids.length > 0) {
      filter._id = { $in: parsed.ids };
    } else {
      return NextResponse.json({ error: 'Nothing to update' }, { status: 400 });
    }
    const r = await Notification.updateMany(filter, { $set: { read: true, readAt: new Date() } });
    return NextResponse.json({ ok: true, updated: r.modifiedCount });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
