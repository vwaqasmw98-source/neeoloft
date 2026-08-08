import { NextResponse } from 'next/server';
import { z } from 'zod';
import crypto from 'crypto';
import { connectDB, isDBEnabled } from '@/lib/mongodb';
import Lead from '@/models/Lead';
import Booking from '@/models/Booking';
import { notifyLead, notifyBooking } from '@/lib/notify';
import { sendEmail, leadEmailTemplate, isEmailEnabled } from '@/lib/email';
import { isEmail, isPhone } from '@/lib/utils';
import { scoreLead } from '@/lib/leadScore';

export const runtime = 'nodejs';

const Body = z
  .object({
    event: z.string().optional(),
    type: z.string().optional(),
    message: z.unknown().optional(),
    call: z.unknown().optional(),
    extracted: z
      .object({
        name: z.string().optional(),
        email: z.string().optional(),
        phone: z.string().optional(),
        requirement: z.string().optional(),
        budget: z.union([z.string(), z.number()]).optional(),
        scheduledAt: z.string().optional(),
        durationMinutes: z.number().optional(),
      })
      .optional(),
  })
  .passthrough();

function verifySignature(raw: string, sig: string | null, secret: string) {
  if (!sig) return false;
  const expected = crypto.createHmac('sha256', secret).update(raw).digest('hex');
  try {
    return crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expected));
  } catch {
    return false;
  }
}

export async function POST(req: Request) {
  const raw = await req.text();
  const secret = process.env.VAPI_WEBHOOK_SECRET;
  if (secret) {
    const sig =
      req.headers.get('x-vapi-signature') || req.headers.get('vapi-signature');
    if (!verifySignature(raw, sig, secret)) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    }
  }
  let parsed;
  try {
    parsed = Body.parse(JSON.parse(raw || '{}'));
  } catch {
    return NextResponse.json({ error: 'Invalid body' }, { status: 400 });
  }

  const eventType = (parsed.event || parsed.type || '').toLowerCase();
  const isCallEnd =
    eventType.includes('call.ended') ||
    eventType.includes('call.completed') ||
    eventType.includes('transcript');
  const isAppointment = eventType.includes('appointment') || eventType.includes('book');
  const extracted = parsed.extracted || {};
  const name = extracted.name || 'Voice lead';
  const email = extracted.email;
  const phone = extracted.phone;
  const requirement = extracted.requirement;

  if (!isCallEnd && !isAppointment) {
    return NextResponse.json({ ok: true, ignored: eventType });
  }
  if (!isEmail(email || '') && !isPhone(phone || '')) {
    return NextResponse.json({ error: 'No contact info' }, { status: 400 });
  }

  const score = scoreLead({
    message: requirement || '',
    messageCount: 1,
    hasEmail: isEmail(email || ''),
    hasPhone: isPhone(phone || ''),
  });

  if (isAppointment && extracted.scheduledAt) {
    const data = {
      name,
      email: email!,
      phone,
      scheduledAt: new Date(extracted.scheduledAt),
      durationMinutes: extracted.durationMinutes || 30,
      topic: requirement,
      source: 'vapi',
    };
    if (isDBEnabled()) {
      await connectDB();
      await Booking.create(data);
    }
    await notifyBooking({
      name: data.name,
      email: data.email,
      scheduledAt: data.scheduledAt.toISOString(),
      durationMinutes: data.durationMinutes,
      source: 'vapi',
    });
    return NextResponse.json({ ok: true, kind: 'booking' });
  }

  // Treat as lead
  if (isDBEnabled()) {
    await connectDB();
    await Lead.create({
      name,
      email,
      phone,
      requirement,
      message: requirement,
      source: 'vapi',
      score: score.score,
      scoreReasons: [...score.reasons, 'captured via voice agent'],
      budget: extracted.budget ? Number(extracted.budget) : undefined,
    });
  }
  await Promise.all([
    notifyLead({ name, email, phone, service: score.matchedService, message: requirement, source: 'vapi' }),
    isEmailEnabled() && process.env.ADMIN_EMAIL
      ? sendEmail({
          to: process.env.ADMIN_EMAIL,
          ...leadEmailTemplate({ name, service: score.matchedService, message: requirement }),
        })
      : Promise.resolve({ ok: false }),
  ]);
  return NextResponse.json({ ok: true, kind: 'lead', score: score.score });
}
