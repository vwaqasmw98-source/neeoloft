import twilio from 'twilio';

let client: ReturnType<typeof twilio> | null = null;

function getClient() {
  if (client) return client;
  const sid = process.env.TWILIO_ACCOUNT_SID;
  const token = process.env.TWILIO_AUTH_TOKEN;
  if (!sid || !token) return null;
  client = twilio(sid, token);
  return client;
}

export function isWhatsAppEnabled() {
  return Boolean(
    process.env.TWILIO_ACCOUNT_SID &&
      process.env.TWILIO_AUTH_TOKEN &&
      process.env.TWILIO_WHATSAPP_NUMBER &&
      process.env.ADMIN_WHATSAPP_NUMBER
  );
}

export async function sendWhatsApp(opts: {
  to: string;
  body: string;
}): Promise<{ ok: boolean; error?: string }> {
  const c = getClient();
  if (!c) {
    console.warn('[whatsapp] Twilio not configured — skipping');
    return { ok: false, error: 'Twilio not configured' };
  }
  try {
    await c.messages.create({
      from: process.env.TWILIO_WHATSAPP_NUMBER!,
      to: opts.to.startsWith('whatsapp:') ? opts.to : `whatsapp:${opts.to}`,
      body: opts.body,
    });
    return { ok: true };
  } catch (err) {
    const e = err as Error;
    console.error('[whatsapp] send failed:', e.message);
    return { ok: false, error: e.message };
  }
}

export function leadWhatsAppTemplate(input: { name: string; service?: string }): string {
  return `🆕 New Neeoloft lead\n\nName: ${input.name}${input.service ? `\nService: ${input.service}` : ''}\n\nReply to engage.`;
}
