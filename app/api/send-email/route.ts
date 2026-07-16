import { NextResponse } from 'next/server';
import { z } from 'zod';
import { sendEmail, isEmailEnabled } from '@/lib/email';

export const runtime = 'nodejs';

const Body = z.object({
  to: z.string().email(),
  subject: z.string().min(1).max(200),
  html: z.string().min(1),
  replyTo: z.string().email().optional(),
});

export async function POST(req: Request) {
  if (!isEmailEnabled()) {
    return NextResponse.json({ error: 'Email not configured' }, { status: 503 });
  }
  let parsed;
  try {
    parsed = Body.parse(await req.json());
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 400 });
  }
  const res = await sendEmail(parsed);
  if (!res.ok) return NextResponse.json({ error: res.error }, { status: 500 });
  return NextResponse.json({ ok: true });
}
