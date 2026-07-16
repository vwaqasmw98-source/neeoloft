import { SectionHeader } from '@/components/SectionHeader';
import { QuoteCalculator } from '@/components/QuoteCalculator';
import { CTA } from '@/components/Hero';
import { Calculator, Clock, Shield, Sparkles, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export const metadata = {
  title: 'Get a quote',
  description:
    'Get an instant estimate for your project. Pick services, scope, timeline — see your price range in 30 seconds.',
};

export default function QuotePage() {
  return (
    <>
      <section className="section pt-32">
        <div className="container-x">
          <SectionHeader
            eyebrow="Get a quote"
            title={
              <>
                Estimate in <span className="gradient-text">30 seconds</span>
              </>
            }
subtitle="Pick the services you need, tell us the scope, see your price range. No email required to start."
          />

          <div className="mt-12 grid gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <QuoteCalculator />
            </div>
            <div className="space-y-4">
              <div className="card">
                <div className="h-10 w-10 rounded-lg bg-brand-500/10 text-brand-500 grid place-items-center">
                  <Clock className="h-5 w-5" />
                </div>
                <h3 className="mt-3 font-semibold">Saves 30 minutes</h3>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  No more back-and-forth emails just to get a price. See it instantly.
                </p>
              </div>
              <div className="card">
                <div className="h-10 w-10 rounded-lg bg-brand-500/10 text-brand-500 grid place-items-center">
                  <Shield className="h-5 w-5" />
                </div>
                <h3 className="mt-3 font-semibold">No commitment</h3>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  The estimate is just a starting point. The real quote comes after a 20-min call.
                </p>
              </div>
              <div className="card">
                <div className="h-10 w-10 rounded-lg bg-brand-500/10 text-brand-500 grid place-items-center">
                  <Sparkles className="h-5 w-5" />
                </div>
                <h3 className="mt-3 font-semibold">Personalized proposal</h3>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  Submit your details and we send a custom proposal with timeline & milestones.
                </p>
              </div>
              <div className="card bg-slate-900 text-slate-100">
                <Calculator className="h-6 w-6 text-brand-400" />
                <h3 className="mt-3 font-semibold text-sm">Prefer to talk?</h3>
                <p className="mt-1 text-xs text-slate-400">
                  Skip the calculator — book a 20-min call and we'll scope it together.
                </p>
                <Link
                  href="/book"
                  className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-brand-400 hover:text-brand-300"
                >
                  Book a call <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
      <CTA />
    </>
  );
}
