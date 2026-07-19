import { Hero, Stats, FeatureGrid, LogoCloud, CTA } from '@/components/Hero';
import { SectionHeader } from '@/components/SectionHeader';
import { FaqSection } from '@/components/FaqSection';
import Link from 'next/link';
import { ArrowRight, Bot, MessageSquare, Zap, ShoppingCart, Sparkles } from 'lucide-react';
import { SERVICES } from '@/lib/services';

const FEATURED_IDS = [
  'ai-agents',
  'voice-agents',
  'workflow-automation',
  'ecommerce',
  'web-dev',
  'mobile-app',
];

export default function HomePage() {
  return (
    <>
      <Hero />
      <Stats />
      {/* <LogoCloudSection /> */}
      <ServicesPreview />
      <ProcessSection />
      <TestimonialsSection />
      <FaqSection />
      <CTA />
    </>
  );
}

// function LogoCloudSection() {
//   return (
//     <section className="py-10">
//       <div className="container-x">
//         <p className="text-center text-xs uppercase tracking-widest text-slate-500">
//           Trusted by ambitious teams
//         </p>
//         <div className="mt-6">
//           <LogoCloud />
//         </div>
//       </div>
//     </section>
//   );
// }

function ServicesPreview() {
  const featured = FEATURED_IDS.map((id) => SERVICES.find((s) => s.id === id)).filter(Boolean) as typeof SERVICES;
  return (
    <section className="section">
      <div className="container-x">
        <SectionHeader
          eyebrow="What we do"
          title={
            <>
              {SERVICES.length} services. <span className="gradient-text">One AI-first agency.</span>
            </>
          }
          subtitle="From a single landing page to a full AI-powered sales engine — we design, build, and automate so you can focus on running the business."
        />
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((s) => (
            <Link
              key={s.id}
              href={`/services#${s.id}`}
              className="card group hover:border-brand-500/50 transition-all hover:-translate-y-1"
            >
              <div className="text-3xl">{s.emoji}</div>
              <h3 className="mt-3 font-display text-lg font-bold">{s.name}</h3>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{s.short}</p>
              <p className="mt-3 text-xs text-slate-500">
                Starting at <span className="font-semibold text-slate-700 dark:text-slate-200">${s.startingPrice}</span>
              </p>
              <div className="mt-4 inline-flex items-center text-xs font-semibold text-brand-500 group-hover:translate-x-1 transition">
                Learn more <ArrowRight className="ml-1 h-3 w-3" />
              </div>
            </Link>
          ))}
        </div>
        <div className="mt-8 text-center">
          <Link href="/services" className="btn-ghost">
            See all {SERVICES.length} services <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}

function ProcessSection() {
  const steps = [
    { n: '01', t: 'Strategy call', d: '20-min discovery to understand your goals, audience, and what success looks like.' },
    { n: '02', t: 'Proposal & plan', d: 'You get a written scope, timeline, milestones, and clear pricing within 48h.' },
    { n: '03', t: 'Build & test', d: 'We build in 2-week sprints with weekly demos. You see progress, not promises.' },
    { n: '04', t: 'Launch & grow', d: 'We deploy, monitor, optimize. Optional retainers for ongoing growth.' },
  ];
  return (
    <section className="section bg-slate-50/50 dark:bg-slate-900/30">
      <div className="container-x">
        <SectionHeader
          eyebrow="How we work"
          title="Simple process. Premium results."
        />
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((s) => (
            <div key={s.n} className="card">
              <p className="font-display text-3xl font-bold gradient-text">{s.n}</p>
              <h3 className="mt-3 font-semibold">{s.t}</h3>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">{s.d}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function TestimonialsSection() {
  const items = [
    {
      name: 'Sara K.',
      role: 'Founder, Bloom Skincare',
      text: 'Aria (their AI agent) recovered 23 abandoned carts in our first month. Paid for itself 4× over.',
    },
    {
      name: 'Imran M.',
      role: 'CTO, LogiChain',
      text: 'The n8n automation they built saved our ops team 30+ hours a week. Worth every dollar.',
    },
    {
      name: 'James R.',
      role: 'CEO, HealthBridge',
      text: 'The new site loads in 1.2s and our lead form conversion doubled. Best agency I have worked with.',
    },
  ];
  return (
    <section className="section">
      <div className="container-x">
        <SectionHeader
          eyebrow="What clients say"
          title="Real outcomes, real clients."
        />
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((t) => (
            <figure key={t.name} className="card">
              <blockquote className="text-sm leading-relaxed">"{t.text}"</blockquote>
              <figcaption className="mt-4 text-xs text-slate-500 dark:text-slate-400">
                <span className="font-semibold text-slate-700 dark:text-slate-200">{t.name}</span> · {t.role}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
