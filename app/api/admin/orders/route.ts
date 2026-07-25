import { NextResponse } from 'next/server';
import { connectDB, isDBEnabled } from '@/lib/mongodb';
import Subscription from '@/models/Subscription';
import { requireAdmin } from '@/lib/apiGuards';

export const runtime = 'nodejs';

export async function GET() {
  const { error } = await requireAdmin();
  if (error) return error;
  if (!isDBEnabled()) return NextResponse.json({ orders: [] });
  try {
    await connectDB();
    const subs = await Subscription.find({}).sort({ createdAt: -1 }).limit(500).lean();
    return NextResponse.json({
      orders: subs.map((s) => ({
        _id: String(s._id),
        plan: s.plan,
        cycle: s.cycle,
        status: s.status,
        currentPeriodStart: s.currentPeriodStart,
        currentPeriodEnd: s.currentPeriodEnd,
        cancelAtPeriodEnd: s.cancelAtPeriodEnd,
        createdAt: s.createdAt,
      })),
    });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
