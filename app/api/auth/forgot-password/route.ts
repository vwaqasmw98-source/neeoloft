import { NextResponse } from 'next/server';
import { z } from 'zod';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import { connectDB, isDBEnabled } from '@/lib/mongodb';
import User from '@/models/User';
import PasswordResetToken from '@/models/PasswordResetToken';
import { isEmailEnabled, sendEmail, passwordResetEmailTemplate } from '@/lib/email';

export const runtime = 'nodejs';

const Body = z.object({
  email: z.string().email(),
});

export async function POST(req: Request) {
  let parsed;
  try {
    parsed = Body.parse(await req.json());
  } catch (err) {
    // Even on parse failure, return ok to avoid leaking which input was wrong.
    return NextResponse.json({ ok: true });
  }

  const email = parsed.email.toLowerCase();

  // Always respond ok, regardless of outcome.
  const ok = () => NextResponse.json({ ok: true });

  if (!isDBEnabled()) {
    // Graceful no-DB mode — match the rest of the app.
    return ok();
  }

  try {
    await connectDB();
    const user = await User.findOne({ email });
    if (!user) return ok();

    const rawToken = crypto.randomBytes(32).toString('hex');
    const tokenHash = await bcrypt.hash(rawToken, 10);
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    await PasswordResetToken.create({
      userId: user._id,
      tokenHash,
      expiresAt,
    });

    if (isEmailEnabled()) {
      const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.APP_URL || 'http://localhost:3000';
      const resetUrl = `${siteUrl.replace(/\/$/, '')}/reset-password?token=${rawToken}`;
      const tpl = passwordResetEmailTemplate({
        name: user.name,
        resetUrl,
      });
      // Fire-and-forget; do not block the response on email send.
      sendEmail({
        to: user.email,
        subject: tpl.subject,
        html: tpl.html,
      }).catch((err) => console.error('[forgot-password] email send failed:', err?.message || err));
    } else {
      // Dev convenience: log the link so it can be used when SMTP is not configured.
      const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.APP_URL || 'http://localhost:3000';
      const resetUrl = `${siteUrl.replace(/\/$/, '')}/reset-password?token=${rawToken}`;
      console.info(
        `[forgot-password] SMTP not configured — reset link for ${user.email}: ${resetUrl}`
      );
    }

    return ok();
  } catch (err) {
    console.error('[forgot-password] error:', (err as Error).message);
    return ok();
  }
}
