'use client';

import { Check, Package as PackageIcon } from 'lucide-react';
import { PageHeader } from '@/components/PageHeader';
import { PLANS, isStripeEnabled } from '@/lib/stripe';
import { formatCurrency } from '@/lib/utils';

export function PackagesClient() {
  const stripeOn = isStripeEnabled();
  return (
    <div>
      <PageHeader
        title="Packages"
        description="The plans customers can purchase. Prices, features, and Stripe price IDs are defined in code (lib/stripe.ts)."
      />

      <div className="mb-4 card !py-3 text-xs text-slate-500 dark:text-slate-400 flex items-center gap-2">
        <span
          className={`inline-block h-2 w-2 rounded-full ${stripeOn ? 'bg-emerald-500' : 'bg-slate-300'}`}
        />
        Stripe integration: {stripeOn ? 'active' : 'not configured'}. Customers can check out only when Stripe price IDs are set.
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {PLANS.map((p) => (
          <div key={p.id} className="card relative">
            {p.popular && (
              <span className="absolute -top-2 right-4 chip text-[10px] text-brand-600 border-brand-500/40 bg-brand-500/10">
                Most popular
              </span>
            )}
            <div className="flex items-start gap-2 mb-2">
              <div className="h-9 w-9 rounded-lg bg-brand-500/10 text-brand-500 flex items-center justify-center">
                <PackageIcon className="h-4 w-4" />
              </div>
              <div>
                <h3 className="font-display text-lg font-bold">{p.name}</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">{p.description}</p>
              </div>
            </div>
            <div className="mt-3">
              <p className="font-display text-2xl font-bold">
                {formatCurrency(p.monthlyPrice)}
                <span className="text-sm font-medium text-slate-500">/mo</span>
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                or {formatCurrency(p.yearlyPrice)}/yr
              </p>
            </div>
            <ul className="mt-4 space-y-2 text-sm">
              {p.features.map((f) => (
                <li key={f} className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-brand-500 mt-0.5 shrink-0" />
                  <span className="text-slate-600 dark:text-slate-300">{f}</span>
                </li>
              ))}
            </ul>
            <div className="mt-5 pt-4 border-t border-slate-200/70 dark:border-slate-800 text-xs text-slate-500 space-y-1">
              <p>
                Monthly price ID:{' '}
                <code className="text-[11px] bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded">
                  {p.monthlyPriceId || '—'}
                </code>
              </p>
              <p>
                Yearly price ID:{' '}
                <code className="text-[11px] bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded">
                  {p.yearlyPriceId || '—'}
                </code>
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 card text-sm text-slate-500 dark:text-slate-400">
        <p>
          <strong className="text-slate-800 dark:text-slate-100">Need to edit a plan?</strong>{' '}
          Update <code className="text-[11px] bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded">lib/stripe.ts</code>{' '}
          and the matching env vars (<code className="text-[11px] bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded">STRIPE_PRICE_*</code>).
          The pricing page, checkout, and this dashboard all read from the same source.
        </p>
      </div>
    </div>
  );
}
