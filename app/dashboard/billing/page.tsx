import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { connectDB } from '@/lib/mongodb';
import Subscription from '@/models/Subscription';
import { PLANS } from '@/lib/stripe';
import Link from 'next/link';
import { Check, ExternalLink, Loader2 } from 'lucide-react';
import { PageHeader, EmptyState } from '@/components/PageHeader';
import { formatCurrency, formatDate } from '@/lib/utils';

export const dynamic = 'force-dynamic';

export default async function DashboardBillingPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect('/login?callbackUrl=/dashboard/billing');

  let sub: { plan: string; cycle: 'monthly' | 'yearly'; status: string; currentPeriodStart?: Date; currentPeriodEnd?: Date; cancelAtPeriodEnd?: boolean } | null = null;
  try {
    await connectDB();
    const raw = (await Subscription.findOne({ userId: session.user?.id })
      .sort({ createdAt: -1 })
      .lean()) as
      | { plan: string; cycle: 'monthly' | 'yearly'; status: string; currentPeriodStart?: Date; currentPeriodEnd?: Date; cancelAtPeriodEnd?: boolean }
      | null;
    if (raw) {
      sub = {
        plan: raw.plan,
        cycle: raw.cycle,
        status: raw.status,
        currentPeriodStart: raw.currentPeriodStart,
        currentPeriodEnd: raw.currentPeriodEnd,
        cancelAtPeriodEnd: raw.cancelAtPeriodEnd,
      };
    }
  } catch {
    // ignore
  }
  const plan = sub ? PLANS.find((p) => p.id === sub!.plan) : null;

  return (
    <div>
      <PageHeader
        title="Billing"
        description="Manage your subscription, invoices, and payment method."
      />

      {sub && plan ? (
        <div className="card">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="label">Current plan</p>
              <h2 className="mt-1 font-display text-2xl font-bold">{plan.name}</h2>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                {sub.cycle === 'monthly' ? 'Monthly' : 'Yearly'} ·{' '}
                {formatCurrency(sub.cycle === 'monthly' ? plan.monthlyPrice : plan.yearlyPrice)}
                {sub.cycle === 'monthly' ? '/mo' : '/yr'}
              </p>
            </div>
            <span
              className={`chip text-xs ${
                sub.status === 'active'
                  ? 'text-emerald-600'
                  : sub.status === 'trialing'
                    ? 'text-blue-600'
                    : 'text-amber-600'
              }`}
            >
              {sub.status}
            </span>
          </div>

          <div className="mt-5 grid sm:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-xs text-slate-500">Current period</p>
              <p className="font-medium">
                {sub.currentPeriodStart ? formatDate(sub.currentPeriodStart) : '—'} →{' '}
                {sub.currentPeriodEnd ? formatDate(sub.currentPeriodEnd) : '—'}
              </p>
            </div>
            <div>
              <p className="text-xs text-slate-500">Auto-renew</p>
              <p className="font-medium">
                {sub.cancelAtPeriodEnd ? 'Cancels at period end' : 'Enabled'}
              </p>
            </div>
          </div>

          <ul className="mt-5 grid sm:grid-cols-2 gap-1.5 text-sm">
            {plan.features.map((f) => (
              <li key={f} className="flex items-start gap-2">
                <Check className="h-4 w-4 text-brand-500 mt-0.5 shrink-0" />
                <span className="text-slate-600 dark:text-slate-300">{f}</span>
              </li>
            ))}
          </ul>

          <div className="mt-6 flex flex-wrap gap-2">
            <form action="/api/stripe/portal" method="POST">
              <button type="submit" className="btn-primary !py-2.5 !text-sm">
                <ExternalLink className="h-4 w-4" /> Open customer portal
              </button>
            </form>
            <Link href="/pricing" className="btn-ghost !py-2.5 !text-sm">
              Change plan
            </Link>
          </div>
        </div>
      ) : (
        <EmptyState
          icon={<Loader2 className="h-5 w-5" />}
          title="No active subscription"
          description="Pick a plan to unlock all features."
          action={
            <Link href="/pricing" className="btn-primary !py-2.5 !text-sm">
              Choose a plan
            </Link>
          }
        />
      )}
    </div>
  );
}
