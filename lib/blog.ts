/**
 * Blog / Resources — single source of truth.
 *
 * Posts live here as MDX-ready records. To publish a post:
 *   1. Add an entry to BLOG_POSTS below
 *   2. (Optional) Drop a .mdx file in /content/blog/<slug>.mdx with full body
 *   3. Done. Sitemap + blog index pick it up.
 *
 * Schema fields follow BlogPosting JSON-LD spec.
 */

export type BlogPost = {
  slug: string;
  title: string;
  description: string;
  category: 'AI' | 'Automation' | 'Web Dev' | 'eCommerce' | 'Case Study' | 'Guide';
  tags: string[];
  author: string;
  publishedAt: string; // ISO
  updatedAt: string; // ISO
  readingMinutes: number;
  cover?: string; // public path to cover image
  featured?: boolean;
};

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: 'ai-chatbot-vs-manychat-2026',
    title: 'AI Chatbot vs ManyChat in 2026: which actually converts?',
    description:
      'We compared rule-based flow chatbots (ManyChat) with LLM-powered agents on real ecommerce data. Here is the data, the cost, and when to use each.',
    category: 'AI',
    tags: ['AI chatbot', 'ManyChat', 'conversion', 'eCommerce'],
    author: 'Aria · Neeoloft',
    publishedAt: '2026-01-15',
    updatedAt: '2026-02-10',
    readingMinutes: 8,
    cover: '/blog/ai-vs-manychat.png',
    featured: true,
  },
  {
    slug: 'n8n-vs-zapier-pakistani-businesses',
    title: 'n8n vs Zapier for Pakistani businesses: cost, sovereignty, and uptime',
    description:
      'A practical comparison of n8n (self-hosted) and Zapier (SaaS) for businesses in Pakistan — including FX costs, WhatsApp/SMS integrations, and the break-even point.',
    category: 'Automation',
    tags: ['n8n', 'Zapier', 'automation', 'Pakistan'],
    author: 'Neeoloft Team',
    publishedAt: '2026-02-02',
    updatedAt: '2026-02-02',
    readingMinutes: 6,
    featured: true,
  },
  {
    slug: 'voice-ai-agents-2026-guide',
    title: 'Voice AI agents in 2026: the complete buyer guide for SMBs',
    description:
      'Voice agents are no longer enterprise-only. Here is what they cost, what they can handle, and a 5-step plan to launch one in under 2 weeks.',
    category: 'Guide',
    tags: ['voice AI', 'Vapi', 'Retell', 'call center'],
    author: 'Neeoloft Team',
    publishedAt: '2026-03-04',
    updatedAt: '2026-03-04',
    readingMinutes: 10,
    featured: true,
  },
  {
    slug: 'case-study-bloom-skincare-38-percent-conversion',
    title: 'Case study: how Bloom Skincare lifted conversion 38% with an AI beauty advisor',
    description:
      'A custom AI advisor trained on 600 SKUs, deployed in 11 days. Real numbers, real screenshots, and the exact prompts we used.',
    category: 'Case Study',
    tags: ['case study', 'eCommerce', 'Shopify', 'beauty'],
    author: 'Neeoloft Team',
    publishedAt: '2026-03-22',
    updatedAt: '2026-03-22',
    readingMinutes: 7,
  },
  {
    slug: 'how-we-cut-30-hours-a-week-with-n8n',
    title: 'How we cut 30 hours/week of manual ops with one n8n workflow',
    description:
      'A behind-the-scenes look at the workflow we use to qualify leads, sync them to HubSpot, and notify the team in Slack — fully hands-off.',
    category: 'Automation',
    tags: ['n8n', 'workflow', 'lead ops'],
    author: 'Neeoloft Team',
    publishedAt: '2026-04-08',
    updatedAt: '2026-04-08',
    readingMinutes: 5,
  },
  {
    slug: 'nextjs-vs-laravel-when-to-pick',
    title: 'Next.js vs Laravel in 2026: a decision framework (no fanboying)',
    description:
      'Both are great. Both are wrong for some projects. Here is a 6-question framework to pick the right one for your team and timeline.',
    category: 'Web Dev',
    tags: ['Next.js', 'Laravel', 'web dev', 'stack'],
    author: 'Neeoloft Team',
    publishedAt: '2026-04-25',
    updatedAt: '2026-04-25',
    readingMinutes: 9,
  },
];

export function getPostBySlug(slug: string): BlogPost | undefined {
  return BLOG_POSTS.find((p) => p.slug === slug);
}

export function getRelatedPosts(post: BlogPost, limit = 3): BlogPost[] {
  return BLOG_POSTS.filter((p) => p.slug !== post.slug)
    .sort((a, b) => {
      const aScore = a.tags.filter((t) => post.tags.includes(t)).length;
      const bScore = b.tags.filter((t) => post.tags.includes(t)).length;
      return bScore - aScore;
    })
    .slice(0, limit);
}

export function getFeaturedPosts(limit = 3): BlogPost[] {
  return BLOG_POSTS.filter((p) => p.featured).slice(0, limit);
}
