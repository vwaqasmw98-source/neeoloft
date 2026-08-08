'use client';

import { useState } from 'react';
import type { LucideIcon } from 'lucide-react';
import {
  ShoppingBag,
  Clock3,
  Smile,
  ShieldCheck,
  TrendingUp,
  Zap,
  CalendarCheck,
  Languages,
  Search,
  Users,
  GraduationCap,
  RefreshCw,
  Bot,
  Workflow,
  Globe,
  ArrowUpRight,
} from 'lucide-react';

type Metric = {
  icon: LucideIcon;
  label: string;
};

type Project = {
  name: string;
  category: string;
  image: string;
  description: string;
  metrics: Metric[];
  stack: string[];
  filters: string[];
};

const FILTERS = [
  'All work',
  'AI & Automation',
  'Websites',
  'eCommerce',
  'Web Apps',
];

const PROJECTS: Project[] = [
  {
    name: 'Bloom Skincare',
    category: 'AI Chatbot + eCommerce',
    image:
      'https://images.unsplash.com/photo-1556229010-6c3f2c9ca5f8?auto=format&fit=crop&w=1200&q=85',
    description:
      'Shopify store with a custom-trained AI beauty advisor built to improve product discovery and sales.',
    metrics: [
      { icon: ShoppingBag, label: '+38% conversion' },
      { icon: Clock3, label: '24/7 sales' },
      { icon: Smile, label: '4.9★ CSAT' },
    ],
    stack: ['Shopify', 'OpenAI', 'n8n', 'WhatsApp'],
    filters: ['AI & Automation', 'eCommerce'],
  },

  {
    name: 'LogiChain',
    category: 'Workflow Automation',
    image:
      'https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=1200&q=85',
    description:
      'n8n automation connecting Salesforce, Slack, Sheets, and email to remove repetitive operational work.',
    metrics: [
      { icon: Clock3, label: '30h/week saved' },
      { icon: ShieldCheck, label: 'Zero errors' },
    ],
    stack: ['n8n', 'Salesforce', 'Slack', 'Postgres'],
    filters: ['AI & Automation'],
  },

  {
    name: 'HealthBridge Clinic',
    category: 'Website + Booking',
    image:
      'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1200&q=85',
    description:
      'Modern healthcare website with AI triage, online booking, and a conversion-focused patient journey.',
    metrics: [
      { icon: TrendingUp, label: '2× leads' },
      { icon: Zap, label: '1.2s load' },
    ],
    stack: ['Next.js', 'Cal.com', 'Tailwind', 'Vercel'],
    filters: ['Websites', 'AI & Automation'],
  },

  {
    name: 'FinPulse',
    category: 'AI Voice Agent',
    image:
      'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=1200&q=85',
    description:
      'AI voice agent that qualifies fintech leads, answers questions, and books sales demos automatically.',
    metrics: [
      { icon: CalendarCheck, label: '65% booking' },
      { icon: Languages, label: '3 languages' },
    ],
    stack: ['Vapi', 'ElevenLabs', 'n8n', 'Postgres'],
    filters: ['AI & Automation', 'Web Apps'],
  },

  {
    name: 'Casa Verde',
    category: 'Website + SEO',
    image:
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=85',
    description:
      'Premium real-estate website with custom CMS, SEO structure, and lead-generation focused pages.',
    metrics: [
      { icon: Search, label: '4× organic' },
      { icon: Users, label: '120+ leads/mo' },
    ],
    stack: ['Laravel', 'MySQL', 'SEO', 'Tailwind'],
    filters: ['Websites'],
  },

  {
    name: 'EduForge',
    category: 'Web App + AI Tutor',
    image:
      'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1200&q=85',
    description:
      'Interactive LMS with an AI tutor trained around course content, student progress, and learning workflows.',
    metrics: [
      { icon: GraduationCap, label: '92% completion' },
      { icon: RefreshCw, label: '+60% retention' },
    ],
    stack: ['Next.js', 'OpenAI', 'Postgres', 'Stripe'],
    filters: ['Web Apps', 'AI & Automation'],
  },
];

function ProjectImage({
  project,
}: {
  project: Project;
}) {
  return (
    <div className="relative aspect-[16/9] overflow-hidden rounded-2xl border border-slate-200/70 bg-slate-100 dark:border-white/10 dark:bg-slate-900">
      <img
        src={project.image}
        alt={project.name}
        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
        loading="lazy"
        onError={(event) => {
          const img = event.currentTarget;
          img.style.display = 'none';

          const fallback = img.parentElement?.querySelector(
            '[data-image-fallback]'
          ) as HTMLElement | null;

          if (fallback) {
            fallback.style.display = 'flex';
          }
        }}
      />

      {/* Fallback */}
      <div
        data-image-fallback
        className="absolute inset-0 hidden items-center justify-center bg-gradient-to-br from-slate-100 via-white to-slate-200 dark:from-slate-900 dark:via-slate-950 dark:to-slate-800"
      >
        <div className="text-center">
          <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-white shadow-lg dark:bg-white/10">
            {project.filters.includes('AI & Automation') ? (
              <Bot className="h-7 w-7 text-[#3a5cff]" />
            ) : project.filters.includes('Web Apps') ? (
              <Workflow className="h-7 w-7 text-[#3a5cff]" />
            ) : (
              <Globe className="h-7 w-7 text-[#3a5cff]" />
            )}
          </div>

          <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
            {project.name}
          </p>

          <p className="mt-1 text-xs text-slate-500 dark:text-slate-500">
            Portfolio preview
          </p>
        </div>
      </div>

      {/* Hover overlay */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
    </div>
  );
}

export default function PortfolioPage() {
  const [activeFilter, setActiveFilter] = useState('All work');

  const filteredProjects =
    activeFilter === 'All work'
      ? PROJECTS
      : PROJECTS.filter((project) =>
          project.filters.includes(activeFilter)
        );

  return (
    <main className="min-h-screen bg-white text-slate-900 dark:bg-slate-950 dark:text-white">
      {/* Hero */}
      <section className="relative overflow-hidden px-6 pb-14 pt-28 md:px-10 md:pb-20 md:pt-36">
        <div className="pointer-events-none absolute left-1/2 top-0 h-[420px] w-[700px] -translate-x-1/2 rounded-full bg-[#3a5cff]/10 blur-3xl" />

        <div className="relative mx-auto max-w-6xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-slate-600 shadow-sm dark:border-white/10 dark:bg-white/5 dark:text-slate-300">
            <span className="h-1.5 w-1.5 rounded-full bg-[#3a5cff]" />
            Selected work
          </span>

          <h1 className="mx-auto mt-6 max-w-4xl font-display text-4xl font-bold tracking-tight md:text-6xl">
            Digital products built to
            <span className="text-[#3a5cff]"> perform.</span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-slate-600 dark:text-slate-400 md:text-lg">
            Websites, AI systems, automations, and web applications designed
            around real business outcomes — not just beautiful interfaces.
          </p>
        </div>
      </section>

      {/* Filters */}
      <section className="px-6 pb-10 md:px-10">
        <div className="mx-auto flex max-w-6xl justify-center">
          <div className="flex max-w-full flex-wrap justify-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 p-2 dark:border-white/10 dark:bg-white/[0.03]">
            {FILTERS.map((filter) => {
              const isActive = activeFilter === filter;

              return (
                <button
                  key={filter}
                  type="button"
                  onClick={() => setActiveFilter(filter)}
                  className={`rounded-xl px-4 py-2.5 text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-slate-900 text-white shadow-sm dark:bg-white dark:text-slate-900'
                      : 'text-slate-600 hover:bg-white hover:text-slate-900 dark:text-slate-400 dark:hover:bg-white/10 dark:hover:text-white'
                  }`}
                >
                  {filter}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Projects */}
      <section className="px-6 pb-24 md:px-10">
        <div className="mx-auto max-w-6xl">
          {filteredProjects.length > 0 ? (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {filteredProjects.map((project) => (
                <article
                  key={project.name}
                  className="group rounded-3xl border border-slate-200/80 bg-white p-3 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl dark:border-white/10 dark:bg-white/[0.03]"
                >
                  {/* Image */}
                  <ProjectImage project={project} />

                  {/* Content */}
                  <div className="px-2 pb-3 pt-5">
                    <span className="inline-flex rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-slate-600 dark:border-white/10 dark:bg-white/5 dark:text-slate-400">
                      {project.category}
                    </span>

                    <div className="mt-4 flex items-start justify-between gap-4">
                      <h2 className="font-display text-xl font-bold tracking-tight">
                        {project.name}
                      </h2>

                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-slate-200 text-slate-500 transition-all group-hover:border-[#3a5cff] group-hover:bg-[#3a5cff] group-hover:text-white dark:border-white/10">
                        <ArrowUpRight className="h-4 w-4" />
                      </div>
                    </div>

                    <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-400">
                      {project.description}
                    </p>

                    {/* Metrics */}
                    <div className="mt-5 flex flex-wrap gap-1.5">
                      {project.metrics.map((metric) => {
                        const Icon = metric.icon;

                        return (
                          <span
                            key={metric.label}
                            className="inline-flex items-center gap-1.5 rounded-full bg-[#3a5cff]/10 px-2.5 py-1.5 text-[11px] font-medium text-emerald-600 dark:text-emerald-400"
                          >
                            <Icon
                              size={12}
                              strokeWidth={2}
                              aria-hidden="true"
                            />
                            {metric.label}
                          </span>
                        );
                      })}
                    </div>

                    {/* Stack */}
                    <div className="mt-5 flex flex-wrap gap-1.5">
                      {project.stack.map((technology) => (
                        <span
                          key={technology}
                          className="rounded-md border border-slate-200 bg-slate-50 px-2 py-1 text-[10px] font-medium text-slate-600 dark:border-white/10 dark:bg-white/5 dark:text-slate-400"
                        >
                          {technology}
                        </span>
                      ))}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="rounded-3xl border border-dashed border-slate-300 py-20 text-center dark:border-white/10">
              <p className="text-slate-500">
                No projects found in this category.
              </p>

              <button
                type="button"
                onClick={() => setActiveFilter('All work')}
                className="mt-4 rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-medium text-white dark:bg-white dark:text-slate-900"
              >
                View all work
              </button>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
