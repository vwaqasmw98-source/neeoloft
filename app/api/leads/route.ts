import { NextResponse } from 'next/server';
import { z } from 'zod';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { connectDB, isDBEnabled } from '@/lib/mongodb';
import Lead from '@/models/Lead';
import { scoreLead } from '@/lib/leadScore';
import { notifyLead } from '@/lib/notify';
import { sendEmail, leadEmailTemplate, isEmailEnabled } from '@/lib/email';
import { isEmail, isPhone } from '@/lib/utils';

export const runtime = 'nodejs';

const Body = z.object({
  name: z.string().min(1).max(120),
  email: z.string().email().optional().or(z.literal('')),
  phone: z.string().optional(),
  service: z.string().optional(),
  requirement: z.string().max(2000).optional(),
  message: z.string().max(2000).optional(),
  budget: z.number().optional(),
  timeline: z.string().optional(),
  source: z.string().default('contact_form'),
  metadata: z.record(z.string(), z.unknown()).optional(),
});

export async function POST(req: Request) {
  let parsed;
  try {
    parsed = Body.parse(await req.json());
  } catch (err) {
    return NextResponse.json({ error: 'Invalid body', details: (err as Error).message }, { status: 400 });
  }

  if (!isEmail(parsed.email || '') && !isPhone(parsed.phone || '')) {
    return NextResponse.json({ error: 'Provide a valid email or phone' }, { status: 400 });
  }

  const score = scoreLead({
    message: `${parsed.requirement || ''} ${parsed.message || ''}`,
    messageCount: 1,
    hasEmail: isEmail(parsed.email || ''),
    hasPhone: isPhone(parsed.phone || ''),
  });

  if (!isDBEnabled()) {
    // Graceful no-DB mode: just notify
    await notifyLead({
      name: parsed.name,
      email: parsed.email,
      phone: parsed.phone,
      service: parsed.service,
      message: parsed.message || parsed.requirement,
      source: parsed.source,
    });
    return NextResponse.json({ ok: true, leadCaptured: true, score: score.score });
  }

  try {
    await connectDB();
    const lead = await Lead.create({
      name: parsed.name,
      email: parsed.email || undefined,
      phone: parsed.phone || undefined,
      service: parsed.service,
      requirement: parsed.requirement,
      message: parsed.message || parsed.requirement,
      budget: parsed.budget,
      timeline: parsed.timeline,
      source: parsed.source,
      score: score.score,
      scoreReasons: score.reasons,
      metadata: parsed.metadata,
    });

    await Promise.all([
      notifyLead({
        name: parsed.name,
        email: parsed.email,
        phone: parsed.phone,
        service: parsed.service,
        message: parsed.message || parsed.requirement,
        source: parsed.source,
      }),
      isEmailEnabled() && process.env.ADMIN_EMAIL
        ? sendEmail({
            to: process.env.ADMIN_EMAIL,
            ...leadEmailTemplate({
              name: parsed.name,
              service: parsed.service,
              message: parsed.message || parsed.requirement,
            }),
          })
        : Promise.resolve({ ok: false }),
    ]);

    return NextResponse.json({ ok: true, leadId: lead._id, score: score.score });
  } catch (err) {
    console.error('[leads] save failed:', (err as Error).message);
    return NextResponse.json({ error: 'Failed to save' }, { status: 500 });
  }
}

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  if (!isDBEnabled()) {
    return NextResponse.json({ leads: [] });
  }
  try {
    await connectDB();
    const leads = await Lead.find({}).sort({ createdAt: -1 }).limit(500).lean();
    return NextResponse.json({ leads });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
