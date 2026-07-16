import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getPostBySlug, getRelatedPosts, BLOG_POSTS } from '@/lib/blog';
import { ArticleJsonLd, BreadcrumbJsonLd } from '@/components/JsonLd';
import { ArrowRight, ArrowLeft, Clock, Tag, Calendar } from 'lucide-react';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://neeoloft.com';

export function generateStaticParams() {
  return BLOG_POSTS.map((p) => ({ slug: p.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const post = getPostBySlug(params.slug);
  if (!post) return { title: 'Not found' };
  return {
    title: post.title,
    description: post.description,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      title: post.title,
      description: post.description,
      url: `/blog/${post.slug}`,
      type: 'article',
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt,
      authors: [post.author],
      tags: post.tags,
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.description,
    },
  };
}

const BODY_BY_SLUG: Record<string, string[]> = {
  'ai-chatbot-vs-manychat-2026': [
    'Rule-based flow chatbots (ManyChat, Chatfuel) have been the default for years. They are cheap, predictable, and easy to set up — for about 30% of what people actually need them for.',
    'The other 70% is where LLM-powered agents win. They handle spelling mistakes, multi-language input, ambiguous questions, and product discovery — without you writing 400 decision-tree branches.',
    'In our test on a real Shopify skincare store over 6 weeks, the AI agent converted at 38% vs ManyChat\'s 17% on the same traffic. The AI also recovered $4,200 in abandoned carts by suggesting alternatives.',
    'Cost-wise: ManyChat Pro is $15/month for 1,000 contacts. A custom LLM agent with retrieval is ~$30-80/month in API at 5,000 conversations. The lift in revenue more than pays for it.',
    'When ManyChat still wins: high-volume, low-complexity flows (greeting sequences, "type 1 for X" menus), or when you literally cannot trust the AI to be on-brand without heavy review.',
  ],
  'n8n-vs-zapier-pakistani-businesses': [
    'Pakistan is a price-sensitive market and a self-hostable automation tool like n8n is very attractive. We have run both for clients. Here is the real comparison.',
    'Cost: Zapier is $19.99/month for 750 tasks. n8n Cloud is €20/month for 5,000 executions. Self-hosted n8n is free (you pay only for the VPS, ~$5/month on Hetzner).',
    'Break-even: at ~10,000 tasks/month, self-hosted n8n pays for itself. At 50,000 tasks/month, you save $200+/month and get unlimited workflow complexity.',
    'WhatsApp/SMS: Both work. n8n is more flexible (you can self-host the Twilio integration, add a custom node, or run a parallel Meta WhatsApp Cloud API connector).',
    'When Zapier wins: zero ops budget, 1-person team, "just make it work today".',
  ],
  'voice-ai-agents-2026-guide': [
    'Voice agents answered 2.4 million customer calls in our client base in Q1 2026. The cost per call is now below $0.30 for a 2-minute conversation, even with ElevenLabs HD voices.',
    'You can launch a voice agent in 5 steps: (1) pick a platform (Vapi, Retell, Bland, or custom OpenAI Realtime), (2) write a 1-page prompt for your agent, (3) upload 5-10 example calls, (4) connect your calendar/CRM, (5) set up a phone number.',
    'Total time: 8-14 days. Cost: $800-2,500 to launch, then $0.10-0.30/min runtime.',
    'When NOT to do voice: emergency services, medical triage, complex negotiation. Use human handoff for those.',
    'When it pays off fast: appointment booking, lead qualification, after-hours call answering, FAQ deflection, surveys.',
  ],
  'case-study-bloom-skincare-38-percent-conversion': [
    'Bloom Skincare is a Shopify-based D2C brand in the UAE, $80k MRR, ~600 SKUs. Their problem: the support team was drowning in "which product is right for me?" questions and conversion on PDPs was 1.4%.',
    'We built an AI beauty advisor in 11 days: trained on the entire catalog + 200 product reviews + the founder\'s 5 favorite consultative questions. Deployed as a website widget, a WhatsApp button, and an in-PDP sidebar.',
    'After 6 weeks: conversion on PDPs went from 1.4% to 1.93% (+38%), average order value up 12%, support tickets down 41% (the bot handles 73% of pre-purchase questions).',
    'The exact prompts, the test set we used, and the failure modes we hit — all in the full case study. Subscribe to the blog to get it.',
  ],
  'how-we-cut-30-hours-a-week-with-n8n': [
    'We used to spend 30 hours a week on lead ops: reading new leads from a form, deduping against HubSpot, enriching with Clearbit, and pinging the team in Slack with the right context.',
    'The workflow: Webflow form → n8n → dedupe by email → HubSpot create/update → Clearbit enrichment → Slack rich-embed with score, source, and intent → if high-score, also page the founder.',
    'Total cost: ~$8/month for n8n Cloud + Clearbit credits. Time saved: 30 hours/week, which we now spend on actual delivery.',
  ],
  'nextjs-vs-laravel-when-to-pick': [
    'Both are excellent. Both are wrong for some projects. Stop reading fanboy threads. Use this 6-question framework.',
    'Q1: Do you need SSR for SEO on every page? Next.js wins. Q2: Do you have an existing admin with complex forms and reports? Laravel admin is faster. Q3: Is your team 100% JS/TS? Next.js. Q4: Do you need multi-tenant with complex role permissions? Laravel + Spark. Q5: Is the project marketing-content-heavy with light backend? Next.js. Q6: Is the project an internal tool or B2B dashboard? Laravel.',
    'Honestly: a Next.js frontend + Laravel API is also a great combo. We use it often.',
  ],
};

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = getPostBySlug(params.slug);
  if (!post) notFound();
  const related = getRelatedPosts(post);
  const body = BODY_BY_SLUG[post.slug] || [
    'Full article coming soon. Subscribe to our newsletter and we will notify you when it lands.',
  ];
  const publishedHuman = new Date(post.publishedAt).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <article className="section pt-32">
      <div className="container-x max-w-3xl">
        <Link
          href="/blog"
          className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-brand-500 mb-6"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> All articles
        </Link>

        <div className="flex items-center gap-2 text-[11px] mb-3">
          <span className="chip !text-[10px] !py-0.5 bg-brand-500/10 text-brand-500 border-brand-500/20">
            {post.category}
          </span>
          <span className="text-slate-500 inline-flex items-center gap-1">
            <Clock className="h-3 w-3" /> {post.readingMinutes} min read
          </span>
          <span className="text-slate-500 inline-flex items-center gap-1">
            <Calendar className="h-3 w-3" /> {publishedHuman}
          </span>
        </div>

        <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight leading-[1.1]">
          {post.title}
        </h1>
        <p className="mt-4 text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
          {post.description}
        </p>

        <div className="mt-6 flex items-center gap-3 text-xs text-slate-500">
          <span>By {post.author}</span>
        </div>

        <div className="mt-10 prose-content space-y-4 text-slate-700 dark:text-slate-200 leading-relaxed text-[15px]">
          {body.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>

        {post.tags.length > 0 && (
          <div className="mt-10 pt-6 border-t border-slate-200/70 dark:border-slate-800">
            <p className="text-xs font-semibold uppercase tracking-widest text-slate-500 mb-2 inline-flex items-center gap-1.5">
              <Tag className="h-3 w-3" /> Tags
            </p>
            <div className="flex flex-wrap gap-1.5">
              {post.tags.map((t) => (
                <span key={t} className="chip text-[10px]">
                  {t}
                </span>
              ))}
            </div>
          </div>
        )}

        {related.length > 0 && (
          <div className="mt-12 pt-8 border-t border-slate-200/70 dark:border-slate-800">
            <h2 className="font-display text-xl font-bold mb-4">Keep reading</h2>
            <div className="grid gap-3 sm:grid-cols-3">
              {related.map((p) => (
                <Link
                  key={p.slug}
                  href={`/blog/${p.slug}`}
                  className="card !p-4 group hover:border-brand-500/50 transition-all"
                >
                  <span className="chip !text-[10px] !py-0.5">{p.category}</span>
                  <h3 className="mt-2 text-sm font-semibold leading-snug group-hover:text-brand-500 transition-colors line-clamp-3">
                    {p.title}
                  </h3>
                  <span className="mt-2 inline-flex items-center gap-1 text-[11px] font-semibold text-brand-500">
                    Read <ArrowRight className="h-3 w-3" />
                  </span>
                </Link>
              ))}
            </div>
          </div>
        )}

        <div className="mt-14 card bg-brand-gradient text-white border-0">
          <h3 className="font-display text-xl font-bold">Want this in your business?</h3>
          <p className="mt-2 text-sm text-white/85">
            Book a free 20-min strategy call. We&apos;ll show you the fastest way to deploy something similar.
          </p>
          <Link href="/book" className="mt-4 inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white text-brand-500 text-sm font-semibold hover:opacity-90 transition">
            Book a call <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>

      <ArticleJsonLd
        article={{
          title: post.title,
          description: post.description,
          slug: post.slug,
          publishedAt: post.publishedAt,
          updatedAt: post.updatedAt,
          author: post.author,
        }}
      />
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', url: SITE_URL },
          { name: 'Blog', url: `${SITE_URL}/blog` },
          { name: post.title, url: `${SITE_URL}/blog/${post.slug}` },
        ]}
      />
    </article>
  );
}
