'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  ArrowUpRight,
  Check,
  Sparkles,
} from 'lucide-react';

import { SERVICES, SERVICE_CATEGORIES } from '@/lib/services';

type Service = (typeof SERVICES)[number];

const SERVICE_IMAGES: Record<string, string> = {
  'ai-website-landing-pages':
    'https://images.unsplash.com/photo-1558655146-9f40138edfeb?auto=format&fit=crop&w=1200&q=85',

  'web-development':
    'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=1200&q=85',

  'website-development':
    'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=85',

  'ecommerce':
    'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=1200&q=85',

  'shopify-development':
    'https://images.unsplash.com/photo-1556742111-a301076d9d18?auto=format&fit=crop&w=1200&q=85',

  'ai-sales-lead-automation':
    'https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=1200&q=85',

  'ai-chatbot':
    'https://images.unsplash.com/photo-1535378917042-10a22c95931a?auto=format&fit=crop&w=1200&q=85',

  'ai-automation':
    'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=85',

  'whatsapp-crm-integrations':
    'https://images.unsplash.com/photo-1611605698335-8b1569810432?auto=format&fit=crop&w=1200&q=85',

  'crm-automation':
    'https://images.unsplash.com/photo-1553877522-43269d4ea984?auto=format&fit=crop&w=1200&q=85',

  'voice-ai':
    'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&w=1200&q=85',

  'seo':
    'https://images.unsplash.com/photo-1432888622747-4eb9a8efeb07?auto=format&fit=crop&w=1200&q=85',

  'custom-software':
    'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=85',

  'web-app-development':
    'https://images.unsplash.com/photo-1551650975-87deedd944c3?auto=format&fit=crop&w=1200&q=85',
};

const FALLBACK_IMAGES = [
  'https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=1200&q=85',
  'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1200&q=85',
  'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1200&q=85',
  'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1200&q=85',
];

function getServiceImage(service: Service, index: number) {
  const id = service.id.toLowerCase();

  if (SERVICE_IMAGES[id]) {
    return SERVICE_IMAGES[id];
  }

  if (id.includes('shopify') || id.includes('ecommerce')) {
    return SERVICE_IMAGES.ecommerce;
  }

  if (
    id.includes('ai') ||
    id.includes('automation') ||
    id.includes('chatbot')
  ) {
    return SERVICE_IMAGES['ai-automation'];
  }

  if (
    id.includes('website') ||
    id.includes('web')
  ) {
    return SERVICE_IMAGES['web-development'];
  }

  if (
    id.includes('seo') ||
    id.includes('marketing')
  ) {
    return SERVICE_IMAGES.seo;
  }

  return FALLBACK_IMAGES[index % FALLBACK_IMAGES.length];
}

export default function ServicesClient() {
  const [activeFilter, setActiveFilter] = useState('All services');

  const filters = useMemo(() => {
    const categories = SERVICE_CATEGORIES.filter(
      (category) => category.id !== 'all'
    );

    return [
      'All services',
      ...categories.map((category) => category.label),
    ];
  }, []);

  const categoryLabelMap = useMemo(() => {
    return Object.fromEntries(
      SERVICE_CATEGORIES.map((category) => [
        category.id,
        category.label,
      ])
    );
  }, []);

  const filteredServices = useMemo(() => {
    if (activeFilter === 'All services') {
      return SERVICES;
    }

    const selectedCategory = SERVICE_CATEGORIES.find(
      (category) => category.label === activeFilter
    );

    if (!selectedCategory) {
      return SERVICES;
    }

    return SERVICES.filter(
      (service) => service.category === selectedCategory.id
    );
  }, [activeFilter]);

  return (
    <main className="min-h-screen bg-white text-slate-900 dark:bg-slate-950 dark:text-white">

      {/* ================= HERO ================= */}

      <section className="relative overflow-hidden px-6 pb-12 pt-28 md:px-10 md:pb-16 md:pt-36">
        <div className="pointer-events-none absolute left-1/2 top-0 h-[430px] w-[760px] -translate-x-1/2 rounded-full bg-[#3a5cff]/10 blur-3xl" />

        <div className="relative mx-auto max-w-6xl text-center">

          <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-slate-600 shadow-sm dark:border-white/10 dark:bg-white/5 dark:text-slate-300">
            <span className="h-1.5 w-1.5 rounded-full bg-[#3a5cff]" />
            What we build
          </span>

          <h1 className="mx-auto mt-6 max-w-4xl font-display text-4xl font-bold tracking-tight md:text-6xl">
            Digital solutions built
            <span className="text-[#3a5cff]"> for growth.</span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-slate-600 dark:text-slate-400 md:text-lg">
            From high-converting websites to AI agents and business
            automation — we design, build, and connect the systems
            your business needs to grow.
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              href="/book"
              className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200"
            >
              Start a project
              <ArrowRight className="h-4 w-4" />
            </Link>

            <Link
              href="/portfolio"
              className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-white/10 dark:bg-white/5 dark:text-slate-200 dark:hover:bg-white/10"
            >
              View our work
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>

        </div>
      </section>


      {/* ================= FILTERS ================= */}

<section className="px-6 pb-10 md:px-10">
  <div className="mx-auto max-w-6xl">

    <div className="relative rounded-2xl border border-slate-200 bg-slate-50 p-2 dark:border-white/10 dark:bg-white/[0.03]">

  {/* Left fade */} {/* Tabs */} <div className="relative w-full min-w-0 overflow-x-auto" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none', }} > <div className="flex w-max min-w-max gap-2 pr-4"> {filters.map((filter) => { const isActive = activeFilter === filter; return ( <button key={filter} type="button" onClick={() => setActiveFilter(filter)} className={` shrink-0 whitespace-nowrap rounded-xl px-5 py-3 text-sm font-medium transition-all duration-200 ${ isActive ? 'bg-[#3a5cff] text-white shadow-lg shadow-[#3a5cff]/20' : 'text-slate-500 hover:bg-white hover:text-slate-900 dark:text-slate-400 dark:hover:bg-white/10 dark:hover:text-white' } `} > {filter} </button> ); })} </div> </div>
      {/* Right fade */}
      <div className="pointer-events-none absolute bottom-0 right-0 top-0 z-10 w-10 rounded-r-2xl bg-gradient-to-l from-slate-50 to-transparent dark:from-slate-950/80" />

    </div>

  </div>
</section>

      {/* ================= SERVICES ================= */}

      <section className="px-6 pb-24 md:px-10">
        <div className="mx-auto max-w-6xl">

          {/* Result count */}

          <div className="mb-6 flex items-center justify-between">
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Showing{' '}
              <span className="font-semibold text-slate-900 dark:text-white">
                {filteredServices.length}
              </span>{' '}
              services
            </p>

            <div className="hidden items-center gap-2 text-xs text-slate-400 sm:flex">
              <Sparkles className="h-3.5 w-3.5 text-[#3a5cff]" />
              AI-first solutions
            </div>
          </div>


          {/* Cards */}

          <div className="grid gap-7 md:grid-cols-2 lg:grid-cols-3">

            {filteredServices.map((service, index) => {

              const image = getServiceImage(service, index);

              return (
                <article
                  key={service.id}
                  id={service.id}
                  className="group flex flex-col overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl dark:border-white/10 dark:bg-white/[0.03]"
                >

                  {/* Image */}

                  <div className="relative aspect-[16/9] overflow-hidden">

                    <img
                      src={image}
                      alt={service.name}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />

                    {/* Gradient */}

                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/5 to-transparent" />

                    {/* Category */}

                    <div className="absolute left-4 top-4">
                      <span className="rounded-full border border-white/20 bg-black/30 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-white backdrop-blur-md">
                        {categoryLabelMap[service.category] ||
                          service.category}
                      </span>
                    </div>

                    {/* Emoji */}

                    <div className="absolute bottom-4 left-4 flex h-11 w-11 items-center justify-center rounded-xl border border-white/20 bg-black/25 text-xl backdrop-blur-md">
                      {service.emoji}
                    </div>

                  </div>


                  {/* Content */}

                  <div className="flex flex-1 flex-col p-6">

                    <div className="flex items-start justify-between gap-4">

                      <div>
                        <h2 className="font-display text-xl font-bold tracking-tight">
                          {service.name}
                        </h2>

                        <p className="mt-2 text-sm font-medium leading-6 text-slate-600 dark:text-slate-300">
                          {service.short}
                        </p>
                      </div>

                      <div className="shrink-0 rounded-full border border-slate-200 px-3 py-1 text-[10px] font-semibold text-slate-500 dark:border-white/10 dark:text-slate-400">
                        From ${service.startingPrice}
                      </div>

                    </div>


                    <p className="mt-4 flex-1 text-sm leading-6 text-slate-500 dark:text-slate-400">
                      {service.description}
                    </p>


                    {/* Keywords */}

                    <div className="mt-5 flex flex-wrap gap-1.5">
                      {service.keywords
                        .slice(0, 4)
                        .map((keyword) => (
                          <span
                            key={keyword}
                            className="rounded-md border border-slate-200 bg-slate-50 px-2 py-1 text-[10px] font-medium text-slate-600 dark:border-white/10 dark:bg-white/5 dark:text-slate-400"
                          >
                            {keyword}
                          </span>
                        ))}
                    </div>


                    {/* CTA */}

                    <Link
                      href={`/book?service=${service.id}`}
                      className="mt-6 inline-flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-800 transition-all hover:border-[#3a5cff] hover:bg-[#3a5cff] hover:text-white dark:border-white/10 dark:bg-white/5 dark:text-slate-200 dark:hover:border-[#3a5cff] dark:hover:bg-[#3a5cff] dark:hover:text-white"
                    >
                      Get started

                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Link>

                  </div>

                </article>
              );
            })}

          </div>


          {/* Empty state */}

          {filteredServices.length === 0 && (
            <div className="rounded-3xl border border-dashed border-slate-300 py-20 text-center dark:border-white/10">

              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#3a5cff]/10">
                <Sparkles className="h-6 w-6 text-[#3a5cff]" />
              </div>

              <h3 className="mt-5 font-display text-xl font-bold">
                No services found
              </h3>

              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                Try another category.
              </p>

              <button
                type="button"
                onClick={() => setActiveFilter('All services')}
                className="mt-5 rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white dark:bg-white dark:text-slate-900"
              >
                View all services
              </button>

            </div>
          )}

        </div>
      </section>


      {/* ================= BOTTOM CTA ================= */}

      {/* <section className="px-6 pb-24 md:px-10">
        <div className="mx-auto max-w-6xl">

          <div className="relative overflow-hidden rounded-3xl bg-slate-900 p-8 text-white md:p-12 dark:bg-white/[0.06] dark:ring-1 dark:ring-white/10">

            <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-[#3a5cff]/20 blur-3xl" />

            <div className="relative grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">

              <div>
                <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-emerald-400">
                  <Check className="h-4 w-4" />
                  Custom solutions
                </span>

                <h2 className="mt-4 max-w-2xl font-display text-3xl font-bold tracking-tight md:text-4xl">
                  Not sure which service your business needs?
                </h2>

                <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-300">
                  Tell us what you are trying to achieve. We can recommend
                  the right combination of website, AI, automation, and
                  digital solutions for your business.
                </p>
              </div>

              <Link
                href="/book"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-100"
              >
                Book a strategy call
                <ArrowRight className="h-4 w-4" />
              </Link>

            </div>

          </div>

        </div>
      </section> */}

    </main>
  );
}
