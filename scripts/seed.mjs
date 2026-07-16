/* Seed MongoDB with initial KB content for the Neeoloft AI agent.
 * Run: MONGODB_URI=... npm run seed
 */
import mongoose from 'mongoose';
import { chunkText } from '../lib/kb.ts';

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  console.error('❌ MONGODB_URI not set');
  process.exit(1);
}

const SOURCES = [
  {
    title: 'Neeoloft company overview',
    source: 'text',
    content: `Neeoloft is an AI-first web and automation agency. We help businesses build websites, AI chatbots, and workflow automations that drive real growth. We work with founders, marketing teams, and growth-stage companies across the US, UK, UAE, and South Asia. Our edge: we don't just build websites, we build businesses that sell 24/7 using AI and automation. Most clients see 2-3x conversion lift and save 20-40 hours per week after working with us.`,
    tags: ['about', 'company'],
  },
  {
    title: 'Pricing FAQ',
    source: 'faq',
    content: `Q: How much does a website cost?
A: Marketing websites start at $800. Custom web apps start at $2,500. Most projects fall in the $1,500-$5,000 range.

Q: How much does an AI chatbot cost?
A: A custom AI chatbot trained on your business starts at $1,500 for setup, plus a $200-$500/month retainer for hosting, monitoring, and ongoing improvements.

Q: Do you offer payment plans?
A: Yes. For projects over $2,000 we split into 3 milestones: 30% upfront, 40% mid-project, 30% on delivery.

Q: What's your typical timeline?
A: Landing pages: 7-10 days. Marketing sites: 14-21 days. Custom web apps: 4-8 weeks. AI chatbot setup: 1-2 weeks.

Q: Do you offer ongoing support?
A: Yes. Starter includes 1 month. Growth and Agency plans include priority support with response SLAs.`,
    tags: ['pricing', 'faq'],
  },
  {
    title: 'AI chatbot capabilities',
    source: 'text',
    content: `Our AI chatbots are trained on your business: your products, services, FAQs, pricing, policies, and tone. They work on your website, WhatsApp, and Instagram. Capabilities include: 24/7 customer support, lead qualification, product recommendations, booking assistance, abandoned cart recovery, multilingual support (English, Spanish, French, Arabic, Hindi/Urdu), and escalation to human agents when needed. Most clients see 30-50% reduction in support tickets within the first month.`,
    tags: ['ai', 'chatbot', 'capabilities'],
  },
  {
    title: 'Workflow automation (n8n) overview',
    source: 'text',
    content: `We build n8n automations that connect your CRM, email, Slack, Google Sheets, WhatsApp, Stripe, and 200+ other apps. Common use cases: lead routing (form -> CRM -> Slack notification), invoice processing (Stripe -> QuickBooks -> email), content distribution (blog post -> social media -> email list), customer onboarding (signup -> welcome email -> CRM tag -> Slack channel), and abandoned cart recovery (Shopify -> 3-step WhatsApp sequence). Average client saves 20-40 hours per week.`,
    tags: ['automation', 'n8n', 'workflows'],
  },
];

const KB = mongoose.model(
  'KnowledgeBase',
  new mongoose.Schema(
    {
      title: String,
      source: String,
      content: String,
      chunks: [String],
      tags: [String],
      active: { type: Boolean, default: true },
    },
    { timestamps: true }
  )
);

async function main() {
  await mongoose.connect(MONGODB_URI);
  console.log('✓ Connected');
  for (const s of SOURCES) {
    const chunks = chunkText(s.content);
    await KB.findOneAndUpdate(
      { title: s.title },
      { ...s, chunks },
      { upsert: true, new: true }
    );
    console.log(`✓ Seeded "${s.title}" (${chunks.length} chunks)`);
  }
  await mongoose.disconnect();
  console.log('✓ Done');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
