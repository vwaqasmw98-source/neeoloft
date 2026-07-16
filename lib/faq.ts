/**
 * FAQ data — single source of truth for both the UI section on the homepage
 * and the FAQPage JSON-LD schema.
 */

export const FAQ_ITEMS = [
  {
    q: 'How long does a typical project take?',
    a: 'Most websites ship in 2–4 weeks. AI chatbots and automations can go live in 1–2 weeks. Complex platforms (multi-vendor marketplace, custom CRM) take 6–10 weeks. We share a clear timeline on the strategy call before any commitment.',
  },
  {
    q: 'Do you work with clients outside Pakistan?',
    a: 'Yes — we serve clients in the UAE, Saudi Arabia, UK, US, Canada, and Pakistan. Our team operates remotely across PKT and GST, and we have async-friendly processes. Most calls are 20 minutes and we share weekly Loom updates.',
  },
  {
    q: 'What is the cost of an AI chatbot for my business?',
    a: 'A basic website chatbot starts at $400. A custom-trained sales agent on your products/services (with WhatsApp + CRM integration) starts at $1,200. Voice agents with Vapi start at $800. Pricing depends on integrations, training data, and traffic — we send a fixed quote after the strategy call.',
  },
  {
    q: 'Can I edit the website content myself after launch?',
    a: 'Yes. We build with a headless CMS (Sanity or Payload) for content-driven sites, so you can update text, images, and pages without touching code. For static marketing sites we use MDX so your team can edit with a simple Git workflow.',
  },
  {
    q: 'Do you offer ongoing support after launch?',
    a: 'Yes. We have a monthly care plan that covers hosting, security patches, content updates, and chatbot retraining. Plans start at $99/month. Without a plan, you can buy hourly support blocks as needed.',
  },
  {
    q: 'Will my chatbot actually understand my business?',
    a: 'Yes — we train Aria (or your custom bot) on your website, PDFs, FAQs, and product catalog. It uses retrieval-augmented generation (RAG) so answers come from your data, not generic AI guesses. You can review and refine answers weekly.',
  },
  {
    q: 'What technologies do you use?',
    a: 'Frontend: Next.js, React, Tailwind CSS. Backend: Node.js, Laravel, Python. Databases: MongoDB, PostgreSQL. AI: Groq (free), OpenAI, ElevenLabs, Whisper. Automation: n8n, Make, Zapier. Voice: Vapi, Retell, custom WebRTC. We pick the right tool per project, not the trendiest.',
  },
  {
    q: 'How do you measure success?',
    a: 'We agree on 2–3 KPIs up front — usually leads captured, conversion rate, or hours saved. Every project ships with analytics dashboards (Plausible or PostHog) so you can see exactly what the AI is doing. We review monthly and iterate.',
  },
];
