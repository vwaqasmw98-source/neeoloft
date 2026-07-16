/**
 * Neeoloft service catalog — SINGLE SOURCE OF TRUTH.
 *
 * ✅ Aria (the AI bot) reads this file on every deploy.
 * ✅ Pricing page reads it via lib/stripe.ts PLANS.
 * ✅ Services page reads it.
 * ✅ Lead scoring uses the keywords.
 *
 * To add a new service:
 *   1. Add a new object to SERVICES below.
 *   2. Done. No other file changes needed.
 *   3. Re-deploy (or restart `npm run dev`).
 *   4. Aria will know about it immediately and recommend it.
 *
 * To remove a service: just delete its object.
 * To change prices: edit `startingPrice`.
 *
 * Each service needs:
 *   - id:           unique kebab-case slug
 *   - emoji:        for visual flair
 *   - name:         display name (used in bot replies, pricing, services page)
 *   - short:        1-line punchy description
 *   - description:  2-3 line detailed description
 *   - startingPrice: USD starting price (no decimals; e.g. 500 means $500)
 *   - category:     'web' | 'commerce' | 'design' | 'ai' | 'automation' | 'support' | 'mobile' | 'marketing' | 'data'
 *   - keywords:     array of lowercase keywords the lead-scorer matches
 */

export type Service = {
  id: string;
  emoji: string;
  name: string;
  short: string;
  description: string;
  startingPrice: number; // USD
  category:
    | 'web'
    | 'commerce'
    | 'design'
    | 'ai'
    | 'automation'
    | 'support'
    | 'mobile'
    | 'marketing'
    | 'data'
    | 'branding';
  keywords: string[]; // matched against user messages for lead scoring
};

export const SERVICES: Service[] = [
  // ── WEB DEVELOPMENT ───────────────────────────────────────────────
  {
    id: 'web-dev',
    emoji: '🌐',
    name: 'Website Development',
    short: 'Custom websites built to convert',
    description:
      'Lightning-fast, SEO-ready marketing sites and landing pages engineered for conversions — not just looks.',
    startingPrice: 800,
    category: 'web',
    keywords: ['website', 'web development', 'landing page', 'site', 'webdev', 'homepage'],
  },
  {
    id: 'react-next',
    emoji: '⚛️',
    name: 'React.js & Next.js Development',
    short: 'Modern web apps, built right',
    description:
      'Production-grade React/Next.js apps with TypeScript, server components, edge functions, and beautiful UI.',
    startingPrice: 2500,
    category: 'web',
    keywords: ['react', 'next.js', 'nextjs', 'typescript', 'spa', 'webapp', 'reactjs'],
  },
  {
    id: 'laravel-php',
    emoji: '🐘',
    name: 'Laravel & PHP Development',
    short: 'Robust backend systems, the Laravel way',
    description:
      'Custom Laravel APIs, admin panels, and PHP backends — secure, scalable, and well-documented.',
    startingPrice: 1800,
    category: 'web',
    keywords: ['laravel', 'php', 'backend', 'api', 'mysql', 'admin panel', 'symfony'],
  },
  {
    id: 'wordpress',
    emoji: '📝',
    name: 'WordPress & Elementor Development',
    short: 'CMS sites you can edit yourself',
    description:
      'Custom WordPress themes and Elementor templates — fully editable by your team, no developer needed for edits.',
    startingPrice: 600,
    category: 'web',
    keywords: ['wordpress', 'elementor', 'wp', 'cms', 'blog', 'woocommerce', 'gutenberg'],
  },
  {
    id: 'api-dev',
    emoji: '🔌',
    name: 'Custom API Development',
    short: 'REST, GraphQL, and webhook backends',
    description:
      'Production-ready APIs with auth, rate-limiting, docs, and third-party integrations. Built to scale.',
    startingPrice: 1500,
    category: 'web',
    keywords: ['api', 'rest', 'graphql', 'webhook', 'backend', 'endpoint', 'integration'],
  },

  // ── ECOMMERCE ─────────────────────────────────────────────────────
  {
    id: 'ecommerce',
    emoji: '🛒',
    name: 'eCommerce Development',
    short: 'Stores that sell while you sleep',
    description:
      'Shopify, WooCommerce, and headless commerce setups with payment, inventory, and conversion optimization baked in.',
    startingPrice: 1500,
    category: 'commerce',
    keywords: ['ecommerce', 'e-commerce', 'shopify', 'woocommerce', 'store', 'shop', 'online store'],
  },
  {
    id: 'shopify-apps',
    emoji: '🧩',
    name: 'Shopify App Development',
    short: 'Custom Shopify apps & private integrations',
    description:
      'Public Shopify apps or private integrations for your store. Built with the latest Shopify CLI and Remix.',
    startingPrice: 3000,
    category: 'commerce',
    keywords: ['shopify app', 'shopify plus', 'shopify cli', 'polaris', 'remix', 'app bridge'],
  },

  // ── DESIGN ────────────────────────────────────────────────────────
  {
    id: 'uiux',
    emoji: '🎨',
    name: 'UI/UX Design',
    short: 'Designs users actually love',
    description:
      'Wireframes to high-fidelity Figma mockups, designed around your users, your brand, and your conversion goals.',
    startingPrice: 600,
    category: 'design',
    keywords: ['ui', 'ux', 'design', 'figma', 'mockup', 'wireframe', 'prototype'],
  },
  {
    id: 'responsive',
    emoji: '📱',
    name: 'Responsive Web Design',
    short: 'Pixel-perfect on every device',
    description:
      'Mobile-first, fluid layouts that look stunning from 4" phones to 32" monitors. No pinch-zoom. No broken layouts.',
    startingPrice: 400,
    category: 'design',
    keywords: ['responsive', 'mobile', 'tablet', 'mobile-friendly', 'adaptive'],
  },
  {
    id: 'branding',
    emoji: '🏷️',
    name: 'Branding & Logo Design',
    short: 'A brand identity that sticks',
    description:
      'Logo, color palette, typography, brand guidelines, and asset library. Memorable, scalable, on-trend.',
    startingPrice: 500,
    category: 'branding',
    keywords: ['branding', 'logo', 'brand identity', 'visual identity', 'brand guidelines', 'color palette'],
  },

  // ── AI & AUTOMATION ───────────────────────────────────────────────
  {
    id: 'ai-agents',
    emoji: '🤖',
    name: 'AI Agents & Chatbots',
    short: 'AI that sells, supports, qualifies 24/7',
    description:
      'Custom-trained AI agents for sales, support, and lead qualification. Trained on YOUR data. Deployed on YOUR site.',
    startingPrice: 1500,
    category: 'ai',
    keywords: [
      'ai',
      'chatbot',
      'chat bot',
      'agent',
      'gpt',
      'llm',
      'automation',
      'ai agent',
      'claude',
      'groq',
    ],
  },
  {
    id: 'voice-agents',
    emoji: '📞',
    name: 'AI Voice Agents (Inbound & Outbound)',
    short: 'AI that talks to your customers',
    description:
      'Vapi / Retell / Bland voice agents that answer calls, qualify leads, book appointments, and follow up — 24/7.',
    startingPrice: 2500,
    category: 'ai',
    keywords: ['voice', 'voice agent', 'vapi', 'retell', 'bland', 'phone', 'call', 'inbound', 'outbound', 'ivr'],
  },
  {
    id: 'workflow-automation',
    emoji: '⚡',
    name: 'Workflow Automation',
    short: 'n8n workflows that run your ops',
    description:
      'n8n / Make / Zapier automations connecting your CRM, email, sheets, WhatsApp, and 200+ apps — zero manual work.',
    startingPrice: 800,
    category: 'automation',
    keywords: ['n8n', 'workflow', 'automation', 'zapier', 'make.com', 'integration', 'automate'],
  },
  {
    id: 'whatsapp-email',
    emoji: '💬',
    name: 'WhatsApp & Email Automation',
    short: 'Reach customers on the apps they live on',
    description:
      'Automated WhatsApp + email sequences for lead nurturing, abandoned carts, booking confirmations, and support.',
    startingPrice: 600,
    category: 'automation',
    keywords: ['whatsapp', 'email', 'sms', 'broadcast', 'sequence', 'drip campaign'],
  },

  // ── MOBILE ────────────────────────────────────────────────────────
  {
    id: 'mobile-app',
    emoji: '📱',
    name: 'Mobile App Development',
    short: 'iOS & Android apps, cross-platform',
    description:
      'React Native & Flutter apps that ship to both stores. Native feel, single codebase, faster time-to-market.',
    startingPrice: 4000,
    category: 'mobile',
    keywords: ['mobile', 'app', 'ios', 'android', 'react native', 'flutter', 'expo', 'mobile app'],
  },

  // ── MARKETING ─────────────────────────────────────────────────────
  {
    id: 'seo',
    emoji: '🚀',
    name: 'SEO Services',
    short: 'Get found on Google, not buried',
    description:
      'Technical SEO, on-page optimization, content strategy, and link building — measured by traffic and rankings.',
    startingPrice: 500,
    category: 'marketing',
    keywords: ['seo', 'search', 'google', 'ranking', 'traffic', 'keywords', 'serp'],
  },
  {
    id: 'paid-ads',
    emoji: '📣',
    name: 'Paid Ads Management',
    short: 'Google, Meta, LinkedIn — profitable spend',
    description:
      'Campaign strategy, creative, targeting, and ongoing optimization. We optimize for ROAS, not vanity metrics.',
    startingPrice: 800,
    category: 'marketing',
    keywords: ['ads', 'google ads', 'meta ads', 'facebook ads', 'linkedin ads', 'ppc', 'paid media', 'roas'],
  },
  {
    id: 'content-writing',
    emoji: '✍️',
    name: 'Content Writing & Copywriting',
    short: 'Words that convert, not just fill pages',
    description:
      'SEO blog posts, landing page copy, email sequences, ad copy, and product descriptions. By humans, for humans.',
    startingPrice: 300,
    category: 'marketing',
    keywords: ['content', 'writing', 'copywriting', 'copy', 'blog', 'article', 'blog post'],
  },
  {
    id: 'video-reels',
    emoji: '🎬',
    name: 'Video & Reels Editing',
    short: 'Short-form video that stops the scroll',
    description:
      'Reels, TikToks, YouTube Shorts — edited with hooks, captions, and motion graphics. Includes thumbnail design.',
    startingPrice: 200,
    category: 'marketing',
    keywords: ['video', 'reels', 'tiktok', 'shorts', 'youtube', 'editing', 'motion graphics'],
  },
  {
    id: 'cro',
    emoji: '🎯',
    name: 'Conversion Rate Optimization',
    short: 'Get more from the traffic you already have',
    description:
      'Heatmaps, A/B tests, funnel analysis, and UX improvements. We find leaks in your conversion and plug them.',
    startingPrice: 1000,
    category: 'marketing',
    keywords: ['cro', 'conversion', 'optimization', 'a/b test', 'ab test', 'funnel', 'rate'],
  },

  // ── DATA ──────────────────────────────────────────────────────────
  {
    id: 'dashboards',
    emoji: '📊',
    name: 'Custom Dashboards & Analytics',
    short: 'See your business clearly',
    description:
      'Beautiful, real-time dashboards pulling from your CRM, ads, analytics, and DBs. Built in Metabase, Looker, or custom.',
    startingPrice: 1500,
    category: 'data',
    keywords: ['dashboard', 'analytics', 'metabase', 'looker', 'tableau', 'bi', 'reporting', 'kpi'],
  },

  // ── SECURITY & DEVOPS ─────────────────────────────────────────────
  {
    id: 'security-audit',
    emoji: '🛡️',
    name: 'Security & Performance Audit',
    short: 'Find and fix the holes before attackers do',
    description:
      'Full OWASP top-10 audit, dependency check, penetration testing, and performance profiling. Actionable report.',
    startingPrice: 1200,
    category: 'data',
    keywords: ['security', 'audit', 'pentest', 'penetration', 'vulnerability', 'owasp', 'performance'],
  },

  // ── SUPPORT ───────────────────────────────────────────────────────
  {
    id: 'hosting',
    emoji: '☁️',
    name: 'Hosting & Website Migration',
    short: 'Zero-downtime moves to better infrastructure',
    description:
      'Vercel, AWS, DigitalOcean, or shared hosting — we move your site safely, set up DNS, SSL, backups, and monitoring.',
    startingPrice: 300,
    category: 'support',
    keywords: ['hosting', 'migration', 'vercel', 'aws', 'cpanel', 'ssl', 'dns'],
  },
  {
    id: 'maintenance',
    emoji: '🔧',
    name: 'Website Maintenance & Support',
    short: 'We keep it running, you keep growing',
    description:
      'Monthly retainer for updates, backups, security patches, uptime monitoring, and priority bug fixes.',
    startingPrice: 200,
    category: 'support',
    keywords: ['maintenance', 'support', 'retainer', 'bug fix', 'updates', 'monitoring'],
  },
];

export const SERVICE_CATEGORIES = [
  { id: 'all', label: 'All services' },
  { id: 'web', label: 'Web Development' },
  { id: 'commerce', label: 'eCommerce' },
  { id: 'design', label: 'Design' },
  { id: 'ai', label: 'AI & Automation' },
  { id: 'automation', label: 'Automation' },
  { id: 'mobile', label: 'Mobile Apps' },
  { id: 'marketing', label: 'Marketing' },
  { id: 'branding', label: 'Branding' },
  { id: 'data', label: 'Data & Security' },
  { id: 'support', label: 'Hosting & Support' },
] as const;

export function getService(id: string) {
  return SERVICES.find((s) => s.id === id);
}

export function servicesByCategory(cat: Service['category'] | 'all') {
  if (cat === 'all') return SERVICES;
  return SERVICES.filter((s) => s.category === cat);
}
