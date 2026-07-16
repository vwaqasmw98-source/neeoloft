import { NextResponse } from 'next/server';
import { z } from 'zod';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getStripe, getPlan, priceIdForPlan, isStripeEnabled } from '@/lib/stripe';
import { connectDB, isDBEnabled } from '@/lib/mongodb';
import Subscription from '@/models/Subscription';
import User from '@/models/User';

export const runtime = 'nodejs';

const Body = z.object({
  planId: z.enum(['starter', 'growth', 'agency']),
  cycle: z.enum(['monthly', 'yearly']),
});

export async function POST(req: Request) {
  if (!isStripeEnabled()) {
    return NextResponse.json({ error: 'Stripe not configured' }, { status: 503 });
  }
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  let parsed;
  try {
    parsed = Body.parse(await req.json());
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 400 });
  }

  const plan = getPlan(parsed.planId);
  if (!plan) return NextResponse.json({ error: 'Unknown plan' }, { status: 400 });
  const priceId = priceIdForPlan(parsed.planId, parsed.cycle);
  if (!priceId) {
    return NextResponse.json(
      { error: `Price ID missing for ${parsed.planId} ${parsed.cycle}. Set STRIPE_PRICE_${parsed.planId.toUpperCase()}_${parsed.cycle.toUpperCase()}` },
      { status: 500 }
    );
  }

  const stripe = getStripe()!;
  const appUrl = process.env.APP_URL || process.env.NEXTAUTH_URL || 'http://localhost:3000';

  let customerId: string | undefined;
  if (isDBEnabled()) {
    await connectDB();
    const user = (await User.findById(session.user.id).lean()) as { stripeCustomerId?: string } | null;
    customerId = user?.stripeCustomerId;
  }

  try {
    const checkout = await stripe.checkout.sessions.create({
      mode: 'subscription',
      line_items: [{ price: priceId, quantity: 1 }],
      customer: customerId,
      customer_email: customerId ? undefined : session.user.email || undefined,
      success_url: `${appUrl}/billing?status=success&sid={CHECKOUT_SESSION_ID}`,
      cancel_url: `${appUrl}/pricing?status=cancelled`,
      metadata: {
        planId: parsed.planId,
        cycle: parsed.cycle,
        userId: String(session.user.id),
      },
      allow_promotion_codes: true,
    });

    if (isDBEnabled() && customerId && session.user.id) {
      await connectDB();
      await User.findByIdAndUpdate(session.user.id, { stripeCustomerId: customerId });
    }

    return NextResponse.json({ url: checkout.url });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
