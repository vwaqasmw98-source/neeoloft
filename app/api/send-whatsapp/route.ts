import { NextResponse } from 'next/server';
import { z } from 'zod';
import { sendWhatsApp, isWhatsAppEnabled } from '@/lib/whatsapp';

export const runtime = 'nodejs';

const Body = z.object({
  to: z.string().min(7),
  body: z.string().min(1).max(1500),
});

export async function POST(req: Request) {
  if (!isWhatsAppEnabled()) {
    return NextResponse.json({ error: 'WhatsApp not configured' }, { status: 503 });
  }
  let parsed;
  try {
    parsed = Body.parse(await req.json());
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 400 });
  }
  const res = await sendWhatsApp(parsed);
  if (!res.ok) return NextResponse.json({ error: res.error }, { status: 500 });
  return NextResponse.json({ ok: true });
}
