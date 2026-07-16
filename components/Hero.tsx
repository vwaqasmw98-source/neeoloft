'use client';

import Link from 'next/link';
import { motion } from '@/components/MotionWrapper';
import {
  ArrowRight,
  Sparkles,
  Bot,
  Zap,
  MessageSquare,
  BarChart3,
  CheckCircle2,
} from 'lucide-react';

export function Hero() {
  return (
    <section className="relative overflow-hidden pt-24 pb-20 lg:pt-32 lg:pb-32">
      <div className="absolute inset-0 bg-hero-gradient pointer-events-none" />
      <div className="container-x relative">
        <div className="grid gap-16 lg:grid-cols-2 lg:items-center">
          <div>
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="chip"
            >
              <Sparkles className="h-3.5 w-3.5 text-brand-500" />
              AI-first web & automation agency
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.05 }}
              className="mt-5 font-display text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.05]"
            >
              We build businesses that <span className="gradient-text">sell 24/7</span> with AI.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="mt-5 text-lg text-slate-600 dark:text-slate-300 max-w-xl leading-relaxed"
            >
              Custom websites, AI chatbots, and n8n automation that turn visitors into customers —
              even when you're sleeping.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="mt-7 flex flex-wrap gap-3"
            >
              <Link href="/book" className="btn-primary">
                Book a free strategy call
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/services" className="btn-ghost">
                See our services
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.25 }}
              className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-xs text-slate-500 dark:text-slate-400"
            >
              <span className="inline-flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" /> No-code AI trained on your data
              </span>
              <span className="inline-flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" /> 14-day delivery on most projects
              </span>
              <span className="inline-flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" /> Pay in milestones
              </span>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="relative"
          >
            <HeroDemo />
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function HeroDemo() {
  return (
    <div className="relative mx-auto max-w-md">
      <div className="absolute -inset-4 bg-brand-gradient opacity-20 blur-3xl rounded-full" />
      <div className="card relative">
        <div className="flex items-center gap-2 border-b border-slate-200/70 dark:border-slate-800 pb-3">
          <div className="h-8 w-8 grid place-items-center rounded-full bg-brand-gradient text-white">
            <Bot className="h-4 w-4" />
          </div>
          <div>
            <p className="text-sm font-semibold">Aria · Neeoloft AI</p>
            <p className="text-xs text-emerald-500 inline-flex items-center gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse-slow" />
              Live • replies in seconds
            </p>
          </div>
        </div>

        <div className="mt-4 space-y-3 text-sm">
          <div className="rounded-2xl rounded-tl-sm bg-slate-100 dark:bg-slate-800 px-4 py-2.5 max-w-[85%]">
            Hi! I'm looking for an AI chatbot for my e-commerce store.
          </div>
          <div className="ml-auto rounded-2xl rounded-tr-sm bg-brand-500 text-white px-4 py-2.5 max-w-[85%]">
            Got it — what platform are you on? Shopify, WooCommerce, or something else?
          </div>
          <div className="rounded-2xl rounded-tl-sm bg-slate-100 dark:bg-slate-800 px-4 py-2.5 max-w-[85%]">
            Shopify. We sell skincare. Need it to answer FAQs and recover carts.
          </div>
          <div className="ml-auto rounded-2xl rounded-tr-sm bg-brand-500 text-white px-4 py-2.5 max-w-[85%]">
            Perfect — we'd train Aria on your product catalog, FAQs, and policies. Want a 20-min walkthrough?
          </div>
        </div>

        <div className="mt-4 grid grid-cols-3 gap-2 text-xs">
          <Pill icon={<Zap className="h-3 w-3" />} label="Replies 24/7" />
          <Pill icon={<MessageSquare className="h-3 w-3" />} label="WhatsApp ready" />
          <Pill icon={<BarChart3 className="h-3 w-3" />} label="Lead capture" />
        </div>
      </div>
    </div>
  );
}

function Pill({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className="rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700/70 px-2 py-1.5 text-center text-[11px] text-slate-600 dark:text-slate-300 inline-flex items-center justify-center gap-1">
      {icon}
      {label}
    </div>
  );
}

export function Stats() {
  const items = [
    { value: '120+', label: 'Projects shipped' },
    { value: '24/7', label: 'AI agents deployed' },
    { value: '3.2×', label: 'Avg. conversion lift' },
    { value: '<48h', label: 'Response time' },
  ];
  return (
    <section className="border-y border-slate-200/70 dark:border-slate-800/70 bg-slate-50/50 dark:bg-slate-900/30">
      <div className="container-x py-10 grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
        {items.map((i) => (
          <div key={i.label}>
            <p className="font-display text-3xl font-bold gradient-text">{i.value}</p>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{i.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export function FeatureGrid() {
  const features = [
    {
      icon: <Bot className="h-5 w-5" />,
      title: 'AI that sells for you',
      body: 'Trained on your products, FAQs, and tone. Replies on your site, WhatsApp, and Instagram.',
    },
    {
      icon: <Zap className="h-5 w-5" />,
      title: 'Automations that save hours',
      body: 'n8n workflows that connect CRM, email, sheets, WhatsApp. Zero copy-paste, zero manual work.',
    },
    {
      icon: <MessageSquare className="h-5 w-5" />,
      title: 'Websites built to convert',
      body: 'Next.js speed, SEO baked in, mobile-first. Not pretty — profitable.',
    },
    {
      icon: <BarChart3 className="h-5 w-5" />,
      title: 'Lead capture that works',
      body: 'Forms, chatbots, voice agents — every visitor becomes a trackable, scored lead.',
    },
  ];
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {features.map((f) => (
        <div key={f.title} className="card">
          <div className="h-10 w-10 grid place-items-center rounded-lg bg-brand-500/10 text-brand-500">
            {f.icon}
          </div>
          <h3 className="mt-4 font-semibold">{f.title}</h3>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">{f.body}</p>
        </div>
      ))}
    </div>
  );
}

export function LogoCloud() {
  const logos = ['Acme', 'Globex', 'Hooli', 'Initech', 'Massive', 'Pied Piper'];
  return (
    <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-4 text-slate-400">
      {logos.map((l) => (
        <span key={l} className="font-display text-lg font-semibold tracking-wide opacity-70">
          {l}
        </span>
      ))}
    </div>
  );
}

export function CTA() {
  return (
    <section className="section">
      <div className="container-x">
        <div className="relative overflow-hidden rounded-3xl bg-brand-gradient p-10 sm:p-14 text-white">
          <div className="absolute inset-0 opacity-20 [background-image:radial-gradient(circle_at_30%_20%,white,transparent_40%)]" />
          <div className="relative max-w-2xl">
            <h2 className="font-display text-3xl sm:text-4xl font-bold">
              Ready to put your business on autopilot?
            </h2>
            <p className="mt-3 text-white/85 text-lg">
              Book a free 20-min strategy call. We'll audit your current setup and show you
              exactly where AI + automation can save you time and money.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/book"
                className="inline-flex items-center gap-2 rounded-full bg-white text-brand-700 px-5 py-3 text-sm font-semibold hover:bg-slate-100 transition"
              >
                Book your call <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/services"
                className="inline-flex items-center gap-2 rounded-full border border-white/30 px-5 py-3 text-sm font-semibold hover:bg-white/10 transition"
              >
                Browse services
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
