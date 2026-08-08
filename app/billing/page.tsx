import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { connectDB } from '@/lib/mongodb';
import Subscription from '@/models/Subscription';
import { PLANS } from '@/lib/stripe';
import Link from 'next/link';
import { Check, ExternalLink, Loader2 } from 'lucide-react';
import { formatCurrency, formatDate } from '@/lib/utils';

export const metadata = { title: 'Billing', robots: { index: false, follow: false } };

export default async function BillingPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect('/login?callbackUrl=/billing');

  await connectDB();
  const sub = (await Subscription.findOne({ userId: session.user?.id }).lean()) as
    | {
        plan: string;
        cycle: 'monthly' | 'yearly';
        status: string;
        currentPeriodStart?: Date;
        currentPeriodEnd?: Date;
        cancelAtPeriodEnd?: boolean;
      }
    | null;
  const plan = sub ? PLANS.find((p) => p.id === sub.plan) : null;

  return (
    <section className="section pt-24">
      <div className="container-x max-w-3xl">
        <h1 className="font-display text-3xl font-bold">Billing</h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Manage your subscription, invoices, and payment method.
        </p>

        <div className="mt-8 card">
          {sub && plan ? (
            <>
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Current plan
                  </p>
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
            </>
          ) : (
            <div className="text-center py-8">
              <Loader2 className="h-8 w-8 mx-auto text-slate-300" />
              <p className="mt-3 text-sm text-slate-500">No active subscription.</p>
              <Link href="/pricing" className="mt-4 inline-block btn-primary">
                Choose a plan
              </Link>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
