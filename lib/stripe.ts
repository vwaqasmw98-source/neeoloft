import Stripe from 'stripe';

const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;

let stripe: Stripe | null = null;

export function getStripe(): Stripe | null {
  if (stripe) return stripe;
  if (!STRIPE_SECRET_KEY) return null;
  stripe = new Stripe(STRIPE_SECRET_KEY, { apiVersion: '2024-06-20' });
  return stripe;
}

export function isStripeEnabled() {
  return Boolean(STRIPE_SECRET_KEY);
}

export const PLANS = [
  {
    id: 'starter',
    name: 'Starter',
    description: 'Perfect for small sites & new businesses',
    monthlyPrice: 49,
    yearlyPrice: 490,
    features: [
      '1 landing page or 5-page site',
      'Mobile responsive',
      'Basic SEO setup',
      '1 month support',
      'Email + WhatsApp contact form',
    ],
    monthlyPriceId: process.env.STRIPE_PRICE_STARTER_MONTHLY,
    yearlyPriceId: process.env.STRIPE_PRICE_STARTER_YEARLY,
    cta: 'Choose Starter',
    popular: false,
  },
  {
    id: 'growth',
    name: 'Growth',
    description: 'For businesses ready to scale',
    monthlyPrice: 149,
    yearlyPrice: 1490,
    features: [
      'Custom web app (React/Next.js)',
      'AI chatbot setup & training',
      'CRM + email automation',
      '3 months priority support',
      'Weekly performance reports',
    ],
    monthlyPriceId: process.env.STRIPE_PRICE_GROWTH_MONTHLY,
    yearlyPriceId: process.env.STRIPE_PRICE_GROWTH_YEARLY,
    cta: 'Choose Growth',
    popular: true,
  },
  {
    id: 'agency',
    name: 'Agency',
    description: 'White-glove for ambitious teams',
    monthlyPrice: 499,
    yearlyPrice: 4990,
    features: [
      'Everything in Growth',
      'Multi-channel automation (n8n)',
      'Custom AI agents (voice + chat)',
      'Dedicated account manager',
      'Quarterly business reviews',
      'SLA: 4-hour response',
    ],
    monthlyPriceId: process.env.STRIPE_PRICE_AGENCY_MONTHLY,
    yearlyPriceId: process.env.STRIPE_PRICE_AGENCY_YEARLY,
    cta: 'Choose Agency',
    popular: false,
  },
] as const;

export function getPlan(id: string) {
  return PLANS.find((p) => p.id === id);
}

export function priceIdForPlan(planId: string, cycle: 'monthly' | 'yearly') {
  const plan = getPlan(planId);
  if (!plan) return undefined;
  return cycle === 'monthly' ? plan.monthlyPriceId : plan.yearlyPriceId;
}
