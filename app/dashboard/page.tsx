import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { connectDB, isDBEnabled } from '@/lib/mongodb';
import Subscription from '@/models/Subscription';
import { UserOverviewClient } from './UserOverviewClient';

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect('/login?callbackUrl=/dashboard');

  let subscription: { plan: string; cycle: 'monthly' | 'yearly'; status: string; currentPeriodEnd?: Date; cancelAtPeriodEnd?: boolean } | null = null;
  if (isDBEnabled()) {
    try {
      await connectDB();
      const sub = (await Subscription.findOne({ userId: session.user?.id })
        .sort({ createdAt: -1 })
        .lean()) as
        | { plan: string; cycle: 'monthly' | 'yearly'; status: string; currentPeriodEnd?: Date; cancelAtPeriodEnd?: boolean }
        | null;
      if (sub) {
        subscription = {
          plan: sub.plan,
          cycle: sub.cycle,
          status: sub.status,
          currentPeriodEnd: sub.currentPeriodEnd,
          cancelAtPeriodEnd: sub.cancelAtPeriodEnd,
        };
      }
    } catch {
      // ignore
    }
  }

  return (
    <UserOverviewClient
      user={{
        name: session.user?.name || 'there',
        email: session.user?.email || '',
      }}
      subscription={subscription}
    />
  );
}
