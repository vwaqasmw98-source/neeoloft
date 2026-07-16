import { NextResponse } from 'next/server';
import { z } from 'zod';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { connectDB, isDBEnabled } from '@/lib/mongodb';
import Booking from '@/models/Booking';
import { notifyBooking } from '@/lib/notify';

export const runtime = 'nodejs';

const Body = z.object({
  name: z.string().min(1).max(120),
  email: z.string().email(),
  phone: z.string().optional(),
  scheduledAt: z.string().refine((v) => !Number.isNaN(Date.parse(v)), 'Invalid date'),
  durationMinutes: z.number().int().min(5).max(480).optional(),
  topic: z.string().max(500).optional(),
  service: z.string().optional(),
  notes: z.string().max(2000).optional(),
  source: z.string().default('manual'),
  externalId: z.string().optional(),
});

export async function POST(req: Request) {
  let parsed;
  try {
    parsed = Body.parse(await req.json());
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 400 });
  }
  const data = {
    ...parsed,
    scheduledAt: new Date(parsed.scheduledAt),
  };
  if (!isDBEnabled()) {
    await notifyBooking({
      name: data.name,
      email: data.email,
      scheduledAt: data.scheduledAt.toISOString(),
      durationMinutes: data.durationMinutes,
      source: data.source,
    });
    return NextResponse.json({ ok: true });
  }
  try {
    await connectDB();
    const booking = await Booking.create(data);
    await notifyBooking({
      name: data.name,
      email: data.email,
      scheduledAt: data.scheduledAt.toISOString(),
      durationMinutes: data.durationMinutes,
      source: data.source,
    });
    return NextResponse.json({ ok: true, bookingId: booking._id });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  if (!isDBEnabled()) return NextResponse.json({ bookings: [] });
  await connectDB();
  const bookings = await Booking.find({}).sort({ scheduledAt: -1 }).limit(500).lean();
  return NextResponse.json({ bookings });
}
