import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { connectDB, isDBEnabled } from '@/lib/mongodb';
import Subscription from '@/models/Subscription';

export const runtime = 'nodejs';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  if (!isDBEnabled()) {
    return NextResponse.json({ subscription: null });
  }
  await connectDB();
  const sub = await Subscription.findOne({ userId: session.user?.id }).lean() as { plan?: string; status?: string; cycle?: string; currentPeriodEnd?: Date; currentPeriodStart?: Date; cancelAtPeriodEnd?: boolean } | null;
  return NextResponse.json({ subscription: sub });
}
