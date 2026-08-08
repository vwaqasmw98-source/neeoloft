'use client';

import Link from 'next/link';
import {
  ArrowUpRight,
  Package as PackageIcon,
  Receipt,
  CreditCard,
  Sparkles,
  User as UserIcon,
} from 'lucide-react';
import { PageHeader, EmptyState, StatCard } from '@/components/PageHeader';
import { PLANS, getPlan } from '@/lib/stripe';
import { formatCurrency, formatDate } from '@/lib/utils';

type Sub = {
  plan: string;
  cycle: 'monthly' | 'yearly';
  status: string;
  currentPeriodEnd?: Date | string;
  cancelAtPeriodEnd?: boolean;
} | null;

export function UserOverviewClient({
  user,
  subscription,
}: {
  user: { name: string; email: string };
  subscription: Sub;
}) {
  const plan = subscription ? getPlan(subscription.plan) : null;
  const firstName = user.name.split(' ')[0] || user.name;

  return (
    <div>
      <PageHeader
        title={`Welcome, ${firstName} 👋`}
        description="Here's a quick look at your account, plan, and what's coming up."
        actions={
          <Link href="/dashboard/billing" className="btn-ghost !py-2 !text-xs">
            Manage billing <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard
          label="Account"
          value={user.name}
          hint={user.email}
          icon={<UserIcon className="h-5 w-5" />}
        />
        <StatCard
          label="Plan"
          value={plan ? plan.name : 'No plan'}
          hint={subscription ? `${subscription.cycle} · ${subscription.status}` : 'Choose a plan to get started'}
          icon={<PackageIcon className="h-5 w-5" />}
        />
        <StatCard
          label="Renews"
          value={
            subscription?.currentPeriodEnd
              ? formatDate(subscription.currentPeriodEnd as string)
              : '—'
          }
          hint={subscription?.cancelAtPeriodEnd ? 'Cancels at period end' : 'Auto-renews'}
          icon={<CreditCard className="h-5 w-5" />}
        />
        <StatCard
          label="Spent"
          value={
            plan
              ? formatCurrency(subscription?.cycle === 'yearly' ? plan.yearlyPrice : plan.monthlyPrice)
              : formatCurrency(0)
          }
          hint={subscription ? `per ${subscription.cycle === 'yearly' ? 'year' : 'month'}` : '—'}
          icon={<Receipt className="h-5 w-5" />}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        <div className="card lg:col-span-2">
          <div className="flex items-start justify-between gap-3 mb-3">
            <div>
              <h2 className="font-display text-lg font-semibold">Your plan</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {plan ? 'You have an active subscription.' : 'Pick a plan to unlock all features.'}
              </p>
            </div>
            {plan && (
              <span
                className={`chip text-[10px] ${
                  subscription?.status === 'active'
                    ? 'text-emerald-600'
                    : subscription?.status === 'trialing'
                      ? 'text-blue-600'
                      : 'text-amber-600'
                }`}
              >
                {subscription?.status}
              </span>
            )}
          </div>
          {plan ? (
            <div className="space-y-3">
              <div className="flex flex-wrap items-baseline gap-2">
                <span className="font-display text-3xl font-bold">{plan.name}</span>
                <span className="text-sm text-slate-500">
                  {formatCurrency(subscription?.cycle === 'yearly' ? plan.yearlyPrice : plan.monthlyPrice)}
                  <span className="text-xs">/{subscription?.cycle === 'yearly' ? 'yr' : 'mo'}</span>
                </span>
              </div>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-sm">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2">
                    <Sparkles className="h-3.5 w-3.5 text-brand-500 mt-1 shrink-0" />
                    <span className="text-slate-600 dark:text-slate-300">{f}</span>
                  </li>
                ))}
              </ul>
              <div className="flex flex-wrap gap-2 pt-2">
                <Link href="/dashboard/billing" className="btn-primary !py-2 !text-xs">
                  Manage subscription
                </Link>
                <Link href="/pricing" className="btn-ghost !py-2 !text-xs">
                  Change plan
                </Link>
              </div>
            </div>
          ) : (
            <div>
              <EmptyState
                title="No active plan"
                description="Choose a plan to get access to all of Neeoloft's services."
                action={
                  <Link href="/pricing" className="btn-primary !py-2 !text-xs">
                    View pricing
                  </Link>
                }
              />
            </div>
          )}
        </div>

        <div className="card">
          <h2 className="font-display text-lg font-semibold mb-1">Active services</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">
            Bundled with your plan.
          </p>
          <ul className="space-y-2 text-sm">
            {plan?.features.slice(0, 4).map((f) => (
              <li key={f} className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                <span className="h-1.5 w-1.5 rounded-full bg-brand-500" />
                {f}
              </li>
            ))}
          </ul>
          <Link href="/contact" className="mt-4 inline-flex items-center gap-1 text-xs text-brand-500 hover:underline">
            Need a custom service? Contact us <ArrowUpRight className="h-3 w-3" />
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="card">
          <h2 className="font-display text-lg font-semibold mb-1">Quick actions</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">Jump to the things you do most.</p>
          <div className="grid grid-cols-2 gap-2">
            <Link href="/dashboard/profile" className="rounded-xl border border-slate-200/70 dark:border-slate-800 p-3 hover:border-brand-500/40 hover:bg-brand-500/5 transition-colors">
              <UserIcon className="h-4 w-4 text-brand-500" />
              <p className="mt-2 text-sm font-medium">Edit profile</p>
              <p className="text-xs text-slate-500">Name, email, address</p>
            </Link>
            <Link href="/dashboard/security" className="rounded-xl border border-slate-200/70 dark:border-slate-800 p-3 hover:border-brand-500/40 hover:bg-brand-500/5 transition-colors">
              <CreditCard className="h-4 w-4 text-brand-500" />
              <p className="mt-2 text-sm font-medium">Change password</p>
              <p className="text-xs text-slate-500">Update your credentials</p>
            </Link>
            <Link href="/dashboard/orders" className="rounded-xl border border-slate-200/70 dark:border-slate-800 p-3 hover:border-brand-500/40 hover:bg-brand-500/5 transition-colors">
              <Receipt className="h-4 w-4 text-brand-500" />
              <p className="mt-2 text-sm font-medium">View orders</p>
              <p className="text-xs text-slate-500">History and invoices</p>
            </Link>
            <Link href="/dashboard/support" className="rounded-xl border border-slate-200/70 dark:border-slate-800 p-3 hover:border-brand-500/40 hover:bg-brand-500/5 transition-colors">
              <Sparkles className="h-4 w-4 text-brand-500" />
              <p className="mt-2 text-sm font-medium">Get support</p>
              <p className="text-xs text-slate-500">Talk to our team</p>
            </Link>
          </div>
        </div>

        <div className="card">
          <h2 className="font-display text-lg font-semibold mb-1">Other plans</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">
            Upgrade, downgrade, or compare features.
          </p>
          <div className="space-y-2">
            {PLANS.filter((p) => p.id !== subscription?.plan).map((p) => (
              <div
                key={p.id}
                className="flex items-center justify-between gap-3 rounded-xl border border-slate-200/70 dark:border-slate-800 p-3"
              >
                <div className="min-w-0">
                  <p className="text-sm font-semibold">{p.name}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{p.description}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-sm font-semibold">{formatCurrency(p.monthlyPrice)}/mo</p>
                  <Link href="/pricing" className="text-[11px] text-brand-500 hover:underline">
                    Compare
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
