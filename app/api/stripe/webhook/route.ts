import { NextResponse } from 'next/server';
import type Stripe from 'stripe';
import { getStripe, isStripeEnabled } from '@/lib/stripe';
import { connectDB, isDBEnabled } from '@/lib/mongodb';
import Subscription from '@/models/Subscription';
import User from '@/models/User';

export const runtime = 'nodejs';

export async function POST(req: Request) {
  if (!isStripeEnabled()) {
    return NextResponse.json({ error: 'Stripe not configured' }, { status: 503 });
  }
  const sig = req.headers.get('stripe-signature');
  const whSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!sig || !whSecret) {
    return NextResponse.json({ error: 'Missing signature' }, { status: 400 });
  }
  const raw = await req.text();
  let event: Stripe.Event;
  try {
    event = getStripe()!.webhooks.constructEvent(raw, sig, whSecret);
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 400 });
  }

  if (!isDBEnabled()) {
    return NextResponse.json({ ok: true, ignored: 'no-db' });
  }
  await connectDB();

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        const userId = session.metadata?.userId;
        const planId = session.metadata?.planId;
        const cycle = session.metadata?.cycle;
        if (userId && planId && cycle && session.subscription) {
          const subId =
            typeof session.subscription === 'string'
              ? session.subscription
              : session.subscription.id;
          const sub = await getStripe()!.subscriptions.retrieve(subId);
          await Subscription.findOneAndUpdate(
            { stripeSubscriptionId: subId },
            {
              userId,
              plan: planId,
              cycle,
              stripeCustomerId:
                typeof sub.customer === 'string' ? sub.customer : sub.customer.id,
              stripeSubscriptionId: subId,
              stripePriceId: sub.items.data[0]?.price.id,
              status: sub.status as 'active',
              currentPeriodStart: new Date(sub.current_period_start * 1000),
              currentPeriodEnd: new Date(sub.current_period_end * 1000),
              cancelAtPeriodEnd: sub.cancel_at_period_end,
            },
            { upsert: true, new: true }
          );
          if (typeof sub.customer === 'string') {
            await User.findByIdAndUpdate(userId, { stripeCustomerId: sub.customer });
          }
        }
        break;
      }
      case 'customer.subscription.updated':
      case 'customer.subscription.deleted': {
        const sub = event.data.object as Stripe.Subscription;
        await Subscription.findOneAndUpdate(
          { stripeSubscriptionId: sub.id },
          {
            status: sub.status,
            currentPeriodStart: new Date(sub.current_period_start * 1000),
            currentPeriodEnd: new Date(sub.current_period_end * 1000),
            cancelAtPeriodEnd: sub.cancel_at_period_end,
            canceledAt: sub.canceled_at ? new Date(sub.canceled_at * 1000) : null,
          }
        );
        break;
      }
      case 'invoice.payment_failed': {
        const inv = event.data.object as Stripe.Invoice;
        if (inv.subscription) {
          const subId = typeof inv.subscription === 'string' ? inv.subscription : inv.subscription.id;
          await Subscription.findOneAndUpdate(
            { stripeSubscriptionId: subId },
            { status: 'past_due' }
          );
        }
        break;
      }
      default:
        // unhandled events are ok
        break;
    }
    return NextResponse.json({ received: true });
  } catch (err) {
    console.error('[stripe/webhook]', (err as Error).message);
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
