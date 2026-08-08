import { SectionHeader } from '@/components/SectionHeader';
import { CTA } from '@/components/Hero';
import { Sparkles, Target, Heart, Zap } from 'lucide-react';
import { BreadcrumbJsonLd } from '@/components/JsonLd';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://neeoloft.com';

export const metadata = {
  title: 'About',
  description:
    'Why Neeoloft exists: an AI-first agency for ambitious businesses. Meet the team, our values, and how we work.',
  alternates: { canonical: '/about' },
  openGraph: {
    title: 'About · Neeoloft',
    description: 'Meet the team behind Neeoloft — an AI-first web & automation agency.',
    url: '/about',
    type: 'website',
  },
};

export default function AboutPage() {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', url: SITE_URL },
          { name: 'About', url: `${SITE_URL}/about` },
        ]}
      />
      <section className="section pt-32">
        <div className="container-x">
          <SectionHeader
            eyebrow="About Neeoloft"
            title={
              <>
                We're building the agency <span className="gradient-text">we wished existed</span> when we were clients.
              </>
            }
            subtitle="Neeoloft started with one belief: most agencies are stuck in 2015. We combine modern web stacks with AI + automation to ship businesses that actually grow."
          />

          <div className="mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {VALUES.map((v) => (
              <div key={v.title} className="card">
                <div className="h-10 w-10 grid place-items-center rounded-lg bg-brand-500/10 text-brand-500">
                  {v.icon}
                </div>
                <h3 className="mt-4 font-semibold">{v.title}</h3>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">{v.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container-x grid gap-8 lg:grid-cols-2">
          <div>
            <h2 className="font-display text-3xl font-bold">Our story</h2>
            <div className="mt-4 space-y-3 text-slate-600 dark:text-slate-300 leading-relaxed">
              <p>
                Neeoloft was born out of frustration. We saw too many businesses paying agencies
                for slow, expensive, outdated websites — and getting nothing that actually grew
                their revenue.
              </p>
              <p>
                We flipped the model. We build with the modern stack (Next.js, serverless, edge
                functions) and pair every project with AI + automation. The result: businesses
                that don't just look good — they sell, support, and qualify leads 24/7.
              </p>
              <p>
                Today we work with founders, marketing teams, and growth-stage companies across
                the US, UK, UAE, and South Asia. We don't do commoditized work. We do
                outcome-driven builds.
              </p>
            </div>
          </div>
          <div className="card">
            <h3 className="font-display text-xl font-bold">By the numbers</h3>
            <div className="mt-5 grid grid-cols-2 gap-4 text-center">
              {[
                { v: '120+', l: 'Projects shipped' },
                { v: '40+', l: 'AI agents deployed' },
                { v: '15', l: 'Countries served' },
                { v: '4.9/5', l: 'Avg. client rating' },
              ].map((s) => (
                <div key={s.l}>
                  <p className="font-display text-3xl font-bold gradient-text">{s.v}</p>
                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{s.l}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <CTA />
    </>
  );
}

const VALUES = [
  { icon: <Sparkles className="h-5 w-5" />, title: 'Outcome first', body: 'We measure success by your KPIs — traffic, leads, sales. Not by "lines of code."' },
  { icon: <Target className="h-5 w-5" />, title: 'Sharp focus', body: 'We pick a few projects, do them brilliantly, and skip the rest. Quality over volume.' },
  { icon: <Zap className="h-5 w-5" />, title: 'Speed wins', body: 'We ship in 2-week sprints. You see progress every week, not surprises at the end.' },
  { icon: <Heart className="h-5 w-5" />, title: 'Real partnership', body: 'No black boxes, no jargon. You talk to the people doing the work. Always.' },
];
