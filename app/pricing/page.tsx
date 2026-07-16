import { SectionHeader } from '@/components/SectionHeader';
import { CTA } from '@/components/Hero';
import { Check, Sparkles } from 'lucide-react';
import { PLANS } from '@/lib/stripe';
import CheckoutButton from './CheckoutButton';
import Link from 'next/link';
import { formatCurrency } from '@/lib/utils';
import { BreadcrumbJsonLd } from '@/components/JsonLd';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://neeoloft.com';

export const metadata = {
  title: 'Pricing',
  description:
    'Three simple plans for three stages of growth. Cancel anytime, annual = 2 months free. Built for businesses that want AI to work for them.',
  alternates: { canonical: '/pricing' },
  openGraph: {
    title: 'Pricing · Neeoloft',
    description: 'Simple plans. Real outcomes. Cancel anytime.',
    url: '/pricing',
    type: 'website',
  },
};

export default function PricingPage() {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', url: SITE_URL },
          { name: 'Pricing', url: `${SITE_URL}/pricing` },
        ]}
      />
      <section className="section pt-32">
        <div className="container-x">
          <SectionHeader
            eyebrow="Pricing"
            title="Simple plans. Real outcomes."
            subtitle="Three tiers for three stages of growth. Cancel anytime. Annual = 2 months free."
          />

          <div className="mt-12 grid gap-6 lg:grid-cols-3">
            {PLANS.map((p) => (
              <div
                key={p.id}
                className={`card relative flex flex-col ${
                  p.popular ? 'border-brand-500/50 ring-1 ring-brand-500/30' : ''
                }`}
              >
                {p.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 chip bg-brand-gradient text-white border-0 !text-[10px]">
                    <Sparkles className="h-3 w-3" /> Most popular
                  </div>
                )}
                <h3 className="font-display text-2xl font-bold">{p.name}</h3>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{p.description}</p>
                <div className="mt-5 flex items-baseline gap-1">
                  <span className="font-display text-4xl font-bold">
                    {formatCurrency(p.monthlyPrice)}
                  </span>
                  <span className="text-sm text-slate-500">/mo</span>
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  or {formatCurrency(p.yearlyPrice)}/year (save {formatCurrency(p.monthlyPrice * 12 - p.yearlyPrice)})
                </p>

                <ul className="mt-6 space-y-2.5 text-sm flex-1">
                  {p.features.map((f) => (
                    <li key={f} className="flex items-start gap-2">
                      <Check className="h-4 w-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-6 space-y-2">
                  <CheckoutButton planId={p.id} cycle="monthly" variant={p.popular ? 'primary' : 'ghost'}>
                    Start monthly
                  </CheckoutButton>
                  <CheckoutButton planId={p.id} cycle="yearly" variant="ghost">
                    Start yearly (save 17%)
                  </CheckoutButton>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <p className="text-sm text-slate-500">
              Need something custom? <Link href="/contact" className="text-brand-500 font-semibold">Tell us what you need →</Link>
            </p>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container-x">
          <SectionHeader
            eyebrow="FAQ"
            title="Pricing questions, answered."
          />
          <div className="mt-10 grid gap-4 lg:grid-cols-2 max-w-4xl mx-auto">
            {FAQ.map((f) => (
              <div key={f.q} className="card">
                <h4 className="font-semibold">{f.q}</h4>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  {f.a}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CTA />
    </>
  );
}

const FAQ = [
  {
    q: 'Do you offer custom packages?',
    a: 'Yes — most clients start with a free strategy call and we scope a package around their goals. Pricing for custom work depends on scope, not hours.',
  },
  {
    q: "What's included in support?",
    a: 'Starter includes 1 month of email support. Growth and Agency include priority support with response SLAs and weekly reports.',
  },
  {
    q: 'Can I upgrade or cancel anytime?',
    a: 'Yes — upgrade, downgrade, or cancel from the customer portal at any time. No lock-in.',
  },
  {
    q: 'Do you work with non-profits or startups?',
    a: 'Yes, with a discounted rate. We love ambitious missions — talk to us about it on the call.',
  },
  {
    q: 'What if I just need one project, not a plan?',
    a: 'That is what we do most. Most engagements are one-off projects (web build, AI agent, automation) — plans are for clients who want ongoing support.',
  },
  {
    q: 'Do you offer payment plans?',
    a: 'Yes — for projects over $2,000 we split into 3 milestones: 30% upfront, 40% mid-project, 30% on delivery.',
  },
];
