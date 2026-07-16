import { SectionHeader } from '@/components/SectionHeader';
import { CTA } from '@/components/Hero';
import { ExternalLink, TrendingUp, Clock, Users } from 'lucide-react';
import { BreadcrumbJsonLd } from '@/components/JsonLd';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://neeoloft.com';

export const metadata = {
  title: 'Portfolio · case studies & real outcomes',
  description:
    'Real case studies from Neeoloft clients: AI chatbots, eCommerce launches, workflow automation, and websites that actually convert.',
  alternates: { canonical: '/portfolio' },
  openGraph: {
    title: 'Portfolio · Neeoloft',
    description: 'Real case studies, real outcomes from Neeoloft clients.',
    url: '/portfolio',
    type: 'website',
  },
};

const PROJECTS = [
  {
    name: 'Bloom Skincare',
    category: 'AI Chatbot + eCommerce',
    emoji: '🌸',
    description: 'Shopify store with custom-trained AI beauty advisor. Recovered 23 carts in week 1.',
    metrics: [
      { icon: <TrendingUp className="h-3.5 w-3.5" />, label: '+38% conversion' },
      { icon: <Clock className="h-3.5 w-3.5" />, label: '24/7 sales' },
      { icon: <Users className="h-3.5 w-3.5" />, label: '4.9★ CSAT' },
    ],
    stack: ['Shopify', 'OpenAI', 'n8n', 'WhatsApp'],
  },
  {
    name: 'LogiChain',
    category: 'Workflow Automation',
    emoji: '📦',
    description: 'n8n automation connecting Salesforce, Slack, Sheets, and email. 30+ hours/week saved.',
    metrics: [
      { icon: <Clock className="h-3.5 w-3.5" />, label: '30h/week saved' },
      { icon: <TrendingUp className="h-3.5 w-3.5" />, label: 'Zero errors' },
    ],
    stack: ['n8n', 'Salesforce', 'Slack', 'Postgres'],
  },
  {
    name: 'HealthBridge Clinic',
    category: 'Website + Booking',
    emoji: '🏥',
    description: 'Next.js site with AI triage chatbot + Cal.com booking. Lead conversion doubled.',
    metrics: [
      { icon: <TrendingUp className="h-3.5 w-3.5" />, label: '2× leads' },
      { icon: <Clock className="h-3.5 w-3.5" />, label: '1.2s load' },
    ],
    stack: ['Next.js', 'Cal.com', 'Tailwind', 'Vercel'],
  },
  {
    name: 'FinPulse',
    category: 'AI Voice Agent',
    emoji: '💸',
    description: 'Vapi-powered voice agent that qualifies fintech leads and books demos. 65% booking rate.',
    metrics: [
      { icon: <TrendingUp className="h-3.5 w-3.5" />, label: '65% booking' },
      { icon: <Users className="h-3.5 w-3.5" />, label: '3 languages' },
    ],
    stack: ['Vapi', 'ElevenLabs', 'n8n', 'Postgres'],
  },
  {
    name: 'Casa Verde',
    category: 'Website + SEO',
    emoji: '🌿',
    description: 'Laravel + custom CMS for a real-estate agency. 4× organic traffic in 6 months.',
    metrics: [
      { icon: <TrendingUp className="h-3.5 w-3.5" />, label: '4× organic' },
      { icon: <Users className="h-3.5 w-3.5" />, label: '120+ leads/mo' },
    ],
    stack: ['Laravel', 'MySQL', 'SEO', 'Tailwind'],
  },
  {
    name: 'EduForge',
    category: 'Web App + AI Tutor',
    emoji: '📚',
    description: 'React + Next.js LMS with an AI tutor trained on course content. 92% completion rate.',
    metrics: [
      { icon: <Users className="h-3.5 w-3.5" />, label: '92% completion' },
      { icon: <TrendingUp className="h-3.5 w-3.5" />, label: '+60% retention' },
    ],
    stack: ['Next.js', 'OpenAI', 'Postgres', 'Stripe'],
  },
];

export default function PortfolioPage() {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', url: SITE_URL },
          { name: 'Portfolio', url: `${SITE_URL}/portfolio` },
        ]}
      />
      <section className="section pt-32">
        <div className="container-x">
          <SectionHeader
            eyebrow="Selected work"
            title="Outcomes, not deliverables."
            subtitle="A few of the projects we're proud of. Every one of these shipped with measurable business impact."
          />

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {PROJECTS.map((p) => (
              <div key={p.name} className="card group">
                <div className="flex items-center justify-between">
                  <div className="text-4xl">{p.emoji}</div>
                  <span className="chip text-[10px]">{p.category}</span>
                </div>
                <h3 className="mt-3 font-display text-xl font-bold">{p.name}</h3>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  {p.description}
                </p>
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {p.metrics.map((m, i) => (
                    <span
                      key={i}
                      className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full"
                    >
                      {m.icon} {m.label}
                    </span>
                  ))}
                </div>
                <div className="mt-4 flex flex-wrap gap-1">
                  {p.stack.map((s) => (
                    <span key={s} className="chip text-[10px] !py-0.5">{s}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container-x text-center">
          <h2 className="font-display text-2xl sm:text-3xl font-bold">Want results like these?</h2>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400 max-w-xl mx-auto">
            Every project starts with a free 20-min strategy call. We'll audit your situation and
            recommend the highest-ROI next step.
          </p>
        </div>
      </section>

      <CTA />
    </>
  );
}
