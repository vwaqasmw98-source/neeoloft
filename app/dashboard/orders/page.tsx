import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { connectDB, isDBEnabled } from '@/lib/mongodb';
import Subscription from '@/models/Subscription';
import { PageHeader, EmptyState } from '@/components/PageHeader';
import { formatCurrency, formatDate } from '@/lib/utils';
import { Receipt, ExternalLink } from 'lucide-react';
import Link from 'next/link';

const PLAN_AMOUNT: Record<string, { monthly: number; yearly: number }> = {
  starter: { monthly: 49, yearly: 490 },
  growth: { monthly: 149, yearly: 1490 },
  agency: { monthly: 499, yearly: 4990 },
};

export const dynamic = 'force-dynamic';

export default async function DashboardOrdersPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect('/login?callbackUrl=/dashboard/orders');

  let subs: Array<{
    _id: string;
    plan: string;
    cycle: 'monthly' | 'yearly';
    status: string;
    currentPeriodStart?: Date;
    currentPeriodEnd?: Date;
    cancelAtPeriodEnd?: boolean;
    createdAt: Date;
  }> = [];

  if (isDBEnabled()) {
    try {
      await connectDB();
      const raw = await Subscription.find({ userId: session.user?.id })
        .sort({ createdAt: -1 })
        .lean();
      subs = raw.map((s) => ({
        _id: String(s._id),
        plan: s.plan,
        cycle: s.cycle,
        status: s.status,
        currentPeriodStart: s.currentPeriodStart,
        currentPeriodEnd: s.currentPeriodEnd,
        cancelAtPeriodEnd: s.cancelAtPeriodEnd,
        createdAt: s.createdAt,
      }));
    } catch {
      // ignore
    }
  }

  return (
    <div>
      <PageHeader
        title="Order history"
        description="Every package you've purchased, with status and renewal info."
        actions={
          <form action="/api/stripe/portal" method="POST">
            <button type="submit" className="btn-ghost !py-2 !text-xs">
              <ExternalLink className="h-3.5 w-3.5" /> Open customer portal
            </button>
          </form>
        }
      />

      {subs.length === 0 ? (
        <EmptyState
          icon={<Receipt className="h-5 w-5" />}
          title="No orders yet"
          description="When you purchase a plan, it'll show up here."
          action={
            <Link href="/pricing" className="btn-primary !py-2 !text-xs">
              Browse plans
            </Link>
          }
        />
      ) : (
        <div className="card !p-0 overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-slate-200/70 dark:border-slate-800 text-left text-xs uppercase text-slate-500">
              <tr>
                <th className="px-4 py-3">Plan</th>
                <th className="px-4 py-3">Cycle</th>
                <th className="px-4 py-3">Amount</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Renews</th>
                <th className="px-4 py-3">Created</th>
              </tr>
            </thead>
            <tbody>
              {subs.map((s) => {
                const amt = PLAN_AMOUNT[s.plan];
                const value = amt ? (s.cycle === 'yearly' ? amt.yearly : amt.monthly) : 0;
                return (
                  <tr key={s._id} className="border-b border-slate-100 dark:border-slate-800/50">
                    <td className="px-4 py-3 font-medium capitalize">{s.plan}</td>
                    <td className="px-4 py-3 text-slate-500 capitalize">{s.cycle}</td>
                    <td className="px-4 py-3 font-semibold">{formatCurrency(value)}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`chip text-[10px] ${
                          s.status === 'active'
                            ? 'text-emerald-600'
                            : s.status === 'trialing'
                              ? 'text-blue-600'
                              : s.status === 'canceled'
                                ? 'text-rose-600'
                                : 'text-amber-600'
                        }`}
                      >
                        {s.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-500">
                      {s.currentPeriodEnd ? formatDate(s.currentPeriodEnd) : '—'}
                    </td>
                    <td className="px-4 py-3 text-slate-500">{formatDate(s.createdAt)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
