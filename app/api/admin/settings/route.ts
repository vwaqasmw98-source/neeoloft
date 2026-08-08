import { NextResponse } from 'next/server';
import { z } from 'zod';
import { connectDB, isDBEnabled } from '@/lib/mongodb';
import ActivityLog from '@/models/ActivityLog';
import { requireAdmin } from '@/lib/apiGuards';

/**
 * Website Settings API.
 *
 * The SiteSetting model is intentionally simple — a single document keyed
 * by `key` so admins can update pieces of the public site from the dashboard
 * without re-deploying. The frontend reads these via /api/site/settings
 * (cached, public) and renders them on the marketing pages.
 */
import mongoose, { Schema, models } from 'mongoose';

const SiteSettingSchema = new Schema(
  {
    key: { type: String, required: true, unique: true, index: true },
    value: { type: Schema.Types.Mixed, default: null },
  },
  { timestamps: true }
);

const SiteSetting = (models.SiteSetting as mongoose.Model<{ key: string; value: unknown }>) ||
  mongoose.model('SiteSetting', SiteSettingSchema);

export const runtime = 'nodejs';

export async function GET() {
  const { error } = await requireAdmin();
  if (error) return error;
  if (!isDBEnabled()) return NextResponse.json({ settings: defaults() });
  try {
    await connectDB();
    const docs = await SiteSetting.find({}).lean();
    const map: Record<string, unknown> = {};
    for (const d of docs) map[d.key] = d.value;
    return NextResponse.json({ settings: { ...defaults(), ...map } });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}

const Body = z.object({
  key: z.string().min(1).max(80),
  value: z.unknown(),
});

export async function PUT(req: Request) {
  const { session, error } = await requireAdmin();
  if (error) return error;
  let parsed;
  try {
    parsed = Body.parse(await req.json());
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 400 });
  }
  if (!isDBEnabled()) {
    return NextResponse.json({ error: 'Database not configured' }, { status: 503 });
  }
  try {
    await connectDB();
    await SiteSetting.findOneAndUpdate(
      { key: parsed.key },
      { $set: { value: parsed.value } },
      { upsert: true, new: true },
    );
    await ActivityLog.create({
      actor: session?.user?.email,
      actorId: session?.user?.id,
      action: 'settings.updated',
      target: `setting:${parsed.key}`,
      description: `Updated site setting ${parsed.key}`,
    });
    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}

function defaults() {
  return {
    siteName: 'Neeoloft',
    siteTagline: 'AI-first web & automation agency',
    contactEmail: 'hello@neeoloft.com',
    contactPhone: '',
    socialTwitter: 'https://twitter.com/neeoloft',
    socialLinkedin: 'https://linkedin.com/company/neeoloft',
    socialInstagram: '',
    enableChatbot: true,
    enableBookings: true,
    maintenanceMode: false,
  };
}
