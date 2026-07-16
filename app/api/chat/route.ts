import { NextResponse } from 'next/server';
import { z } from 'zod';
import { chatCompletion, isLLMEnabled } from '@/lib/llm';
import { retrieveContext } from '@/lib/kb';
import { SYSTEM_PROMPT } from '@/lib/systemPrompt';
import { scoreLead } from '@/lib/leadScore';
import { notifyLead } from '@/lib/notify';
import { sendEmail, leadEmailTemplate, isEmailEnabled } from '@/lib/email';
import { connectDB, isDBEnabled } from '@/lib/mongodb';
import ChatLog from '@/models/ChatLog';
import Lead from '@/models/Lead';
import { SERVICES } from '@/lib/services';

export const runtime = 'nodejs';
export const maxDuration = 30;

const Body = z.object({
  sessionId: z.string().min(1).max(100),
  messages: z
    .array(
      z.object({
        role: z.enum(['user', 'assistant']),
        content: z.string().min(1).max(4000),
      })
    )
    .min(1)
    .max(40),
});

const EMAIL_RE = /[\w.+-]+@[\w-]+\.[\w.-]+/;
const PHONE_RE = /(?:\+?\d[\s-]?){7,15}/;
const NAME_RE = /(?:my name is|i am|i'm|call me)\s+([A-Z][a-zA-Z]+(?:\s+[A-Z][a-zA-Z]+)?)/i;

export async function POST(req: Request) {
  let parsed;
  try {
    parsed = Body.parse(await req.json());
  } catch (err) {
    return NextResponse.json({ error: 'Invalid body' }, { status: 400 });
  }

  if (!isLLMEnabled()) {
    return NextResponse.json(
      {
        reply:
          "I'm not fully online yet — the team is wiring up the AI brain. In the meantime, email hello@neeoloft.com or use the contact form and we'll get back fast.",
        leadCaptured: false,
      },
      { status: 200 }
    );
  }

  const { sessionId, messages } = parsed;

  // Build history for LLM (cap to last 20 turns)
  const recent = messages.slice(-20);

  // Try to extract lead info from recent user messages
  const lastUserMsgs = recent.filter((m) => m.role === 'user').map((m) => m.content);
  const joined = lastUserMsgs.join('\n');
  const emailMatch = joined.match(EMAIL_RE);
  const phoneMatch = joined.match(PHONE_RE);
  const nameMatch = joined.match(NAME_RE);
  const hasName = Boolean(nameMatch);
  const hasEmail = Boolean(emailMatch);
  const hasPhone = Boolean(phoneMatch);

  // KB retrieval on the most recent user query
  const lastUser = lastUserMsgs[lastUserMsgs.length - 1] || '';
  const kbContext = await retrieveContext(lastUser);
  const contextSnippets = kbContext.map((c) => c.content);

  // Build the messages for the LLM
  const llmMessages = [
    { role: 'system' as const, content: SYSTEM_PROMPT },
    ...recent.map((m) => ({ role: m.role as 'user' | 'assistant', content: m.content })),
  ];

  let reply: string;
  try {
    reply = await chatCompletion(llmMessages, {
      temperature: 0.75,
      maxTokens: 600,
    });
  } catch (err) {
    console.error('[chat] LLM error:', (err as Error).message);
    return NextResponse.json(
      {
        reply:
          "Sorry, I'm having a small hiccup. Mind trying again in a moment? Or email us at hello@neeoloft.com.",
        leadCaptured: false,
      },
      { status: 200 }
    );
  }

  // Score + persist (best-effort; never block the reply)
  let leadCaptured = false;
  try {
    const score = scoreLead({
      message: joined,
      messageCount: lastUserMsgs.length,
      hasEmail,
      hasPhone,
    });

    if (isDBEnabled()) {
      await connectDB();
      await ChatLog.findOneAndUpdate(
        { sessionId },
        {
          $setOnInsert: { sessionId, createdAt: new Date() },
          $set: { updatedAt: new Date() },
          $push: { messages: { $each: recent.slice(-2) } },
        },
        { upsert: true, new: true }
      );

      // Capture lead if we have name + (email or phone) and a service/need detected
      if (hasName && (hasEmail || hasPhone) && (score.matchedService || hasEmail)) {
        const existing = await Lead.findOne({ sessionId });
        if (!existing) {
          await Lead.create({
            name: nameMatch?.[1] || 'Anonymous',
            email: emailMatch?.[0],
            phone: phoneMatch?.[0],
            service: score.matchedService,
            requirement: joined.slice(0, 500),
            message: joined,
            source: 'chatbot',
            score: score.score,
            scoreReasons: score.reasons,
            budget: score.budgetMentioned,
            sessionId,
          });
          leadCaptured = true;

          // Side-effects: notify, email admin
          await Promise.all([
            notifyLead({
              name: nameMatch![1],
              email: emailMatch?.[0],
              phone: phoneMatch?.[0],
              service: score.matchedService,
              message: joined.slice(0, 300),
              source: 'chatbot',
            }),
            isEmailEnabled() && process.env.ADMIN_EMAIL
              ? sendEmail({
                  to: process.env.ADMIN_EMAIL,
                  ...leadEmailTemplate({
                    name: nameMatch![1],
                    service: score.matchedService,
                    message: joined.slice(0, 400),
                  }),
                })
              : Promise.resolve({ ok: false }),
          ]);
        }
      }
    }
  } catch (err) {
    console.error('[chat] persistence error:', (err as Error).message);
  }

  return NextResponse.json({ reply, leadCaptured });
}

export async function GET() {
  return NextResponse.json({
    ok: true,
    llm: isLLMEnabled() ? 'ready' : 'not_configured',
    db: isDBEnabled() ? 'ready' : 'not_configured',
    services: SERVICES.length,
  });
}
