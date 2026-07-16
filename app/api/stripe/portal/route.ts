import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getStripe, isStripeEnabled } from '@/lib/stripe';
import { connectDB, isDBEnabled } from '@/lib/mongodb';
import User from '@/models/User';

export const runtime = 'nodejs';

export async function POST() {
  if (!isStripeEnabled()) {
    return NextResponse.json({ error: 'Stripe not configured' }, { status: 503 });
  }
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  if (!isDBEnabled()) {
    return NextResponse.json({ error: 'Database not configured' }, { status: 503 });
  }
  await connectDB();
  const user = (await User.findById(session.user.id).lean()) as { stripeCustomerId?: string } | null;
  const customerId = user?.stripeCustomerId;
  if (!customerId) {
    return NextResponse.json({ error: 'No Stripe customer found' }, { status: 400 });
  }
  const appUrl = process.env.APP_URL || process.env.NEXTAUTH_URL || 'http://localhost:3000';
  const portal = await getStripe()!.billingPortal.sessions.create({
    customer: customerId,
    return_url: `${appUrl}/billing`,
  });
  return NextResponse.redirect(portal.url, 303);
}
