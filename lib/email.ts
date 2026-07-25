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

export function passwordResetEmailTemplate(input: {
  name?: string;
  resetUrl: string;
}): { subject: string; html: string } {
  const greeting = input.name ? `Hi ${input.name},` : 'Hi there,';
  return {
    subject: 'Reset your Neeoloft password',
    html: `
      <div style="font-family:system-ui,sans-serif;max-width:600px;margin:auto;padding:24px;background:#f8fafc;border-radius:12px">
        <div style="background:linear-gradient(135deg,#3a5cff,#22d3ee);padding:24px;border-radius:8px;color:white">
          <h1 style="margin:0;font-size:22px">Reset your password 🔒</h1>
        </div>
        <div style="padding:24px;background:white;border-radius:8px;margin-top:16px;color:#0f172a">
          <p>${greeting}</p>
          <p>We received a request to reset your Neeoloft account password. Click the button below to choose a new one.</p>
          <p style="text-align:center;margin:28px 0">
            <a href="${input.resetUrl}" style="display:inline-block;background:linear-gradient(135deg,#3a5cff,#22d3ee);color:white;text-decoration:none;padding:12px 28px;border-radius:999px;font-weight:600;font-size:14px">Reset password</a>
          </p>
          <p style="color:#475569;font-size:13px">Or paste this link into your browser:</p>
          <p style="word-break:break-all;background:#f1f5f9;padding:12px;border-radius:8px;font-size:12px;color:#334155">${input.resetUrl}</p>
          <p style="color:#64748b;font-size:12px;margin-top:24px">
            <strong>This link expires in 1 hour.</strong><br>
            If you didn't request a password reset, you can safely ignore this email — your password will remain unchanged.
          </p>
        </div>
      </div>`,
  };
}
