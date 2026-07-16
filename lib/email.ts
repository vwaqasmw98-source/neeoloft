import nodemailer, { Transporter } from 'nodemailer';

let transporter: Transporter | null = null;

function getTransporter(): Transporter | null {
  if (transporter) return transporter;
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT || 465);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  if (!host || !user || !pass) return null;
  transporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
  });
  return transporter;
}

export function isEmailEnabled() {
  return Boolean(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS);
}

export async function sendEmail(opts: {
  to: string;
  subject: string;
  html: string;
  replyTo?: string;
  from?: string;
}): Promise<{ ok: boolean; error?: string }> {
  const t = getTransporter();
  if (!t) {
    console.warn('[email] SMTP not configured — skipping send to', opts.to);
    return { ok: false, error: 'SMTP not configured' };
  }
  try {
    await t.sendMail({
      from: opts.from || process.env.SMTP_USER,
      to: opts.to,
      subject: opts.subject,
      html: opts.html,
      replyTo: opts.replyTo,
    });
    return { ok: true };
  } catch (err) {
    const e = err as Error;
    console.error('[email] send failed:', e.message);
    return { ok: false, error: e.message };
  }
}

export function leadEmailTemplate(input: {
  name: string;
  service?: string;
  message?: string;
}): { subject: string; html: string } {
  return {
    subject: `New lead from ${input.name} — Neeoloft`,
    html: `
      <div style="font-family:system-ui,sans-serif;max-width:600px;margin:auto;padding:24px;background:#f8fafc;border-radius:12px">
        <div style="background:linear-gradient(135deg,#3a5cff,#22d3ee);padding:24px;border-radius:8px;color:white">
          <h1 style="margin:0;font-size:22px">New lead captured 🎉</h1>
        </div>
        <div style="padding:24px;background:white;border-radius:8px;margin-top:16px">
          <p><strong>Name:</strong> ${input.name}</p>
          ${input.service ? `<p><strong>Service interested in:</strong> ${input.service}</p>` : ''}
          ${input.message ? `<p><strong>Message:</strong><br>${input.message.replace(/\n/g, '<br>')}</p>` : ''}
          <p style="color:#64748b;font-size:12px;margin-top:24px">Reply directly to this email to reach the lead.</p>
        </div>
      </div>`,
  };
}
