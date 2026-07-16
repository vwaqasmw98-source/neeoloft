import { SERVICES } from './services';

export type LeadScore = 'hot' | 'warm' | 'cold';

const HOT_SIGNALS = [
  'ready to start', 'this week', 'this month', 'asap', 'urgent', 'budget approved',
  'sign contract', 'send proposal', 'need this by', 'hire you', 'start project',
];

const WARM_SIGNALS = [
  'pricing', 'quote', 'cost', 'how much', 'timeline', 'estimate', 'interested',
  'want to know more', 'available', 'next month', 'considering', 'evaluating',
];

const COLD_SIGNALS = [
  'just looking', 'maybe later', 'not sure', 'no budget', 'researching',
  'comparing options', 'just curious',
];

const BUDGET_PATTERNS = [
  /budget.{0,20}(\$|usd|us\$|pkr|rs|inr|aed|sar|gbp)[\s]*(\d{2,7})/i,
  /(\$|usd|aed|sar|gbp|pkr|inr)[\s]*(\d{2,7})/i,
];

const INTENT_SERVICES: Array<{ keywords: string[]; service: string }> = SERVICES.flatMap(
  (s) => s.keywords.map((k) => ({ keywords: [k.toLowerCase()], service: s.name }))
);

export function scoreLead(input: {
  message: string;
  messageCount?: number;
  hasEmail?: boolean;
  hasPhone?: boolean;
}): { score: LeadScore; reasons: string[]; matchedService?: string; budgetMentioned?: number } {
  const text = (input.message || '').toLowerCase();
  const reasons: string[] = [];
  let points = 0;

  // Match service intent
  let matchedService: string | undefined;
  for (const intent of INTENT_SERVICES) {
    if (intent.keywords.some((k) => text.includes(k))) {
      matchedService = intent.service;
      points += 2;
      reasons.push(`Mentioned service: ${intent.service}`);
      break;
    }
  }

  // Hot / warm / cold signals
  if (HOT_SIGNALS.some((s) => text.includes(s))) {
    points += 5;
    reasons.push('High-intent language');
  } else if (WARM_SIGNALS.some((s) => text.includes(s))) {
    points += 3;
    reasons.push('Exploring options');
  } else if (COLD_SIGNALS.some((s) => text.includes(s))) {
    points -= 2;
    reasons.push('Low intent signals');
  }

  // Budget mention
  let budgetMentioned: number | undefined;
  for (const re of BUDGET_PATTERNS) {
    const m = text.match(re);
    if (m) {
      budgetMentioned = Number(m[2]);
      points += 4;
      reasons.push(`Budget mentioned: ${budgetMentioned}`);
      break;
    }
  }

  // Contact details
  if (input.hasEmail) {
    points += 2;
    reasons.push('Provided email');
  }
  if (input.hasPhone) {
    points += 3;
    reasons.push('Provided phone');
  }

  // Engagement (number of messages in the conversation)
  const mc = input.messageCount ?? 1;
  if (mc >= 5) {
    points += 2;
    reasons.push('Engaged for 5+ messages');
  } else if (mc >= 3) {
    points += 1;
    reasons.push('Engaged for 3+ messages');
  }

  let score: LeadScore = 'cold';
  if (points >= 8) score = 'hot';
  else if (points >= 4) score = 'warm';

  return { score, reasons, matchedService, budgetMentioned };
}
