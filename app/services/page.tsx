import { SectionHeader } from '@/components/SectionHeader';
import { CTA } from '@/components/Hero';
import Link from 'next/link';
import { ArrowRight, Check } from 'lucide-react';
import { SERVICES, SERVICE_CATEGORIES } from '@/lib/services';
import { ServiceJsonLd, BreadcrumbJsonLd } from '@/components/JsonLd';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://neeoloft.com';

export const metadata = {
  title: 'Services',
  description: `${SERVICES.length} services across web, eCommerce, AI, and automation. Pick one, mix many, or let us design a custom package.`,
  alternates: { canonical: '/services' },
  openGraph: {
    title: 'Services · Neeoloft',
    description: `${SERVICES.length} services across web, eCommerce, AI, and automation.`,
    url: '/services',
    type: 'website',
  },
};

const CATEGORY_LABELS: Record<string, string> = Object.fromEntries(
  SERVICE_CATEGORIES.filter((c) => c.id !== 'all').map((c) => [c.id, c.label])
);

export default function ServicesPage() {
  return (
    <>
      {SERVICES.map((s) => (
        <ServiceJsonLd
          key={`schema-${s.id}`}
          service={{
            name: s.name,
            description: s.description,
            startingPrice: s.startingPrice,
          }}
        />
      ))}
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', url: SITE_URL },
          { name: 'Services', url: `${SITE_URL}/services` },
        ]}
      />
      <section className="section pt-32">
        <div className="container-x">
          <SectionHeader
            eyebrow="Our services"
            title={
              <>
                {SERVICES.length} ways to <span className="gradient-text">grow with AI</span>
              </>
            }
            subtitle="Pick one service, mix several, or let us design a custom package. Every engagement starts with a free strategy call."
          />

          <div className="mt-12 space-y-12">
            {Object.entries(CATEGORY_LABELS).map(([cat, label]) => {
              const items = SERVICES.filter((s) => s.category === cat);
              if (!items.length) return null;
              return (
                <div key={cat}>
                  <h3 className="text-xs font-semibold uppercase tracking-widest text-slate-500 mb-4">
                    {label}
                  </h3>
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {items.map((s) => (
                      <div key={s.id} id={s.id} className="card flex flex-col">
                        <div className="flex items-start justify-between">
                          <div className="text-3xl">{s.emoji}</div>
                          <span className="text-[11px] text-slate-500">
                            from <span className="font-semibold text-slate-700 dark:text-slate-200">${s.startingPrice}</span>
                          </span>
                        </div>
                        <h4 className="mt-3 font-display text-lg font-bold">{s.name}</h4>
                        <p className="mt-1 text-sm font-medium text-slate-600 dark:text-slate-300">
                          {s.short}
                        </p>
                        <p className="mt-3 text-sm text-slate-500 dark:text-slate-400 leading-relaxed flex-1">
                          {s.description}
                        </p>
                        <div className="mt-4 flex flex-wrap gap-1">
                          {s.keywords.slice(0, 3).map((k) => (
                            <span key={k} className="chip text-[10px] !py-0.5">{k}</span>
                          ))}
                        </div>
                        <Link
                          href={`/book?service=${s.id}`}
                          className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-500 hover:text-brand-600"
                        >
                          Get started <ArrowRight className="h-3.5 w-3.5" />
                        </Link>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container-x">
          <div className="card p-8 sm:p-12 bg-brand-gradient text-white">
            <div className="grid gap-6 lg:grid-cols-2 items-center">
              <div>
                <h3 className="font-display text-2xl sm:text-3xl font-bold">
                  Not sure which service fits?
                </h3>
                <p className="mt-2 text-white/85">
                  Book a free 20-min strategy call. We'll diagnose, recommend, and scope — no
                  sales pitch.
                </p>
              </div>
              <ul className="space-y-2 text-sm">
                {[
                  'Free, no obligation',
                  '20-minute video call',
                  'Custom recommendations',
                  'Optional written proposal within 48h',
                ].map((b) => (
                  <li key={b} className="flex items-center gap-2">
                    <Check className="h-4 w-4" /> {b}
                  </li>
                ))}
              </ul>
            </div>
            <div className="mt-6">
              <Link
                href="/book"
                className="inline-flex items-center gap-2 rounded-full bg-white text-brand-700 px-5 py-3 text-sm font-semibold hover:bg-slate-100 transition"
              >
                Book your call <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <CTA />
    </>
  );
}
